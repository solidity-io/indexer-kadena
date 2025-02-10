import { ApolloServer, ApolloServerPlugin } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express, { NextFunction, Request, Response } from "express";
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
import { ArgumentNode, ASTNode, GraphQLError, Kind, ValueNode } from "graphql";
import {
  EVENTS_EVENT,
  NEW_BLOCKS_EVENT,
  NEW_BLOCKS_FROM_DEPTH_EVENT,
  TRANSACTION_EVENT,
} from "./resolvers/subscription/consts";
import { dispatchInfoSchema } from "../jobs/publisher-job";
import initCache from "../cache/init";
import { getRequiredEnvString } from "../utils/helpers";
import ipRangeCheck from "ip-range-check";

const typeDefs = readFileSync(
  join(__dirname, "./config/schema.graphql"),
  "utf-8",
);

const KADENA_GRAPHQL_API_PORT = getRequiredEnvString("KADENA_GRAPHQL_API_PORT");

const validatePaginationParamsPlugin: ApolloServerPlugin = {
  requestDidStart: async () => ({
    didResolveOperation: async ({ request, document }) => {
      const variables = { ...request.variables }; // External variables
      const inlineArguments: Record<string, any> = {};

      // Helper function to extract inline arguments
      const extractArguments = (node: ASTNode) => {
        if (node.kind === Kind.FIELD && node.arguments) {
          node.arguments.forEach((arg: ArgumentNode) => {
            if (arg.value.kind === Kind.STRING) {
              inlineArguments[arg.name.value] = arg.value.value;
            } else if (arg.value.kind === Kind.INT) {
              inlineArguments[arg.name.value] = parseInt(arg.value.value, 10);
            } else if (arg.value.kind === Kind.FLOAT) {
              inlineArguments[arg.name.value] = parseFloat(arg.value.value);
            } else if (arg.value.kind === Kind.BOOLEAN) {
              inlineArguments[arg.name.value] = arg.value.value === true;
            }
          });
        }
        if (node.kind === Kind.SELECTION_SET) {
          node.selections.forEach((selection) => extractArguments(selection));
        }
      };

      // Traverse the query AST to extract inline arguments
      if (document) {
        document.definitions.forEach((definition) => {
          if (
            definition.kind === Kind.OPERATION_DEFINITION &&
            definition.selectionSet
          ) {
            extractArguments(definition.selectionSet);
          }
        });
      }

      // Combine variables and inline arguments
      const combinedVariables = { ...inlineArguments, ...variables };
      const { after, before, first, last } = combinedVariables;

      // Validation logic
      if (after && before) {
        throw new GraphQLError(
          'You cannot use both "after" and "before" at the same time. Please use only one or none.',
        );
      }

      if (first && last) {
        throw new GraphQLError(
          'You cannot use both "first" and "last" at the same time. Please use only one or none.',
        );
      }

      if (before && first) {
        throw new GraphQLError(
          'You cannot use both "before" and "first" at the same time. Use before with last or after with first instead.',
        );
      }

      if (after && last) {
        throw new GraphQLError(
          'You cannot use both "after" and "last" at the same time. Use before with last or after with first instead.',
        );
      }
    },
  }),
};
const allowedCIDRs = ["10.0.2.0/24", "10.0.3.0/24"];

const ipFilterMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.ip && ipRangeCheck(req.ip, allowedCIDRs)) {
    next(); // Allow access
  } else {
    res.status(403).json({ message: "Access denied: IP not allowed" });
  }
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

  app.post("/new-block", ipFilterMiddleware, async (req, res) => {
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

  await initCache(context);
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: KADENA_GRAPHQL_API_PORT }, resolve),
  );
  console.log(`Server running on port ${KADENA_GRAPHQL_API_PORT}.`);
}
