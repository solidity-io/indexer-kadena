import { PactQueryResponse } from "../kadena-server/config/graphql-types";

export const formatBalance_NODE = (queryResult: PactQueryResponse) => {
  const resultParsed = JSON.parse(queryResult.result ?? "{}");
  if (resultParsed?.balance?.decimal) {
    return Number(resultParsed.balance.decimal);
  } else if (resultParsed?.balance) {
    return resultParsed.balance;
  } else {
    return 0;
  }
};

export const formatGuard_NODE = (queryResult: PactQueryResponse) => {
  const resultParsed = JSON.parse(queryResult.result ?? "{}");
  return {
    keys: resultParsed.guard.keys,
    predicate: resultParsed.guard.pred,
    raw: JSON.stringify(resultParsed.guard),
  };
};
