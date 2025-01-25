import { ResolverContext } from "../../../config/apollo-server-config";
import { TransactionCommandResolvers } from "../../../config/graphql-types";
import zod from "zod";

const schema = zod.object({ databaseTransactionId: zod.string() });

export const signersTransactionCommandResolver: TransactionCommandResolvers<ResolverContext>["signers"] =
  async (parent, _args, context) => {
    console.log("signersTransactionCommandResolver");

    const parentArgs = schema.parse(parent);

    const output = await context.transactionRepository.getSigners(
      parentArgs.databaseTransactionId,
    );
    return output;
  };
