import { ApolloServer, ApolloServerPlugin } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import { resolvers } from "./resolvers";
import { readFileSync } from "fs";
import { join } from "path";
import {
  createGraphqlContext,
  publishSubscribe,
  ResolverContext,
} from "./config/apollo-server-config";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { GraphQLError } from "graphql";
import {
  EVENTS_EVENT,
  NEW_BLOCKS_EVENT,
  NEW_BLOCKS_FROM_DEPTH_EVENT,
  TRANSACTION_EVENT,
} from "./resolvers/subscription/consts";
import { dispatchInfoSchema } from "../jobs/publisher-job";
import initCache from "../cache/init";
import { getRequiredEnvString } from "../utils/helpers";

const typeDefs = readFileSync(
  join(__dirname, "./config/schema.graphql"),
  "utf-8",
);

const KADENA_GRAPHQL_API_PORT = getRequiredEnvString("KADENA_GRAPHQL_API_PORT");

const validatePaginationParamsPlugin: ApolloServerPlugin = {
  requestDidStart: async () => ({
    didResolveOperation: async ({ request }) => {
      const variables = request.variables || {}; // Provide a default empty object if undefined
      const { after, before } = variables;

      // Check if both after and before are passed
      if (after && before) {
        throw new GraphQLError(
          'You cannot use both "after" and "before" at the same time. Please use only one or none.',
        );
      }
    },
  }),
};

export async function useKadenaGraphqlServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer<ResolverContext>({
    typeDefs,
    resolvers,
    plugins: [
      validatePaginationParamsPlugin,
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });
  await server.start();

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const context = await createGraphqlContext();

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  const serverCleanup = useServer(
    {
      schema,
      context,
    },
    wsServer,
  );
  app.use(express.json());

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    expressMiddleware(server, {
      context: createGraphqlContext,
    }),
  );

  app.post("/new-block", async (req, res) => {
    const payload = await dispatchInfoSchema.safeParseAsync(req.body);
    if (!payload.success) {
      return res.status(400).json({ message: "Invalid input" });
    }
    const { hash, chainId, height, requestKeys, qualifiedEventNames } =
      payload.data;

    publishSubscribe.publish(NEW_BLOCKS_EVENT, {
      hash,
      chainId,
    });

    publishSubscribe.publish(NEW_BLOCKS_FROM_DEPTH_EVENT, {
      height,
      chainId,
      hash,
    });

    const eventPromises = qualifiedEventNames.map((qualifiedEventName) => {
      return publishSubscribe.publish(EVENTS_EVENT, {
        qualifiedEventName,
        height,
        chainId,
        hash,
      });
    });

    const transactionPromises = requestKeys.map((requestKey) => {
      return publishSubscribe.publish(TRANSACTION_EVENT, {
        chainId,
        requestKey,
      });
    });

    await Promise.all([...eventPromises, ...transactionPromises]);

    res.json({
      message: "New block published.",
    });
  });

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: KADENA_GRAPHQL_API_PORT }, resolve),
  );
  initCache(context);
  console.log(`Server running on port ${KADENA_GRAPHQL_API_PORT}.`);
}
