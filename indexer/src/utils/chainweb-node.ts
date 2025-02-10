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

  if (resultParsed.guard?.fun) {
    return {
      args: resultParsed.guard.args.map((arg: any) => JSON.stringify(arg)),
      fun: resultParsed.guard.fun,
      raw: JSON.stringify(resultParsed.guard),
      keys: [],
      predicate: "",
    };
  }

  if (resultParsed.guard?.pred) {
    return {
      keys: resultParsed.guard.keys,
      predicate: resultParsed.guard.pred,
      raw: JSON.stringify(resultParsed.guard),
    };
  }

  return { raw: JSON.stringify(resultParsed.guard), keys: [], predicate: "" };
};
