import { ResolverContext } from '../../config/apollo-server-config';
import { QueryResolvers } from '../../config/graphql-types';
import { buildFungibleChainAccount } from '../output/build-fungible-chain-account-output';

export const fungibleChainAccountsQueryResolver: QueryResolvers<ResolverContext>['fungibleChainAccounts'] =
  async (_parent, args, context) => {
    const { accountName, chainIds, fungibleName } = args;
    console.log('fungibleChainAccountsQueryResolver');
    const accounts = await context.balanceRepository.getChainsAccountInfo_NODE(
      accountName,
      fungibleName,
      chainIds?.map(c => c.toString()),
    );

    const output = accounts.map(r => buildFungibleChainAccount(r));
    return output;
  };
