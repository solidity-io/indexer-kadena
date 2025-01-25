import { InputMaybe, PageInfo } from "../config/graphql-types";
import { ConnectionEdge } from "./types";

export interface PaginationsParams {
  after?: InputMaybe<string>;
  before?: InputMaybe<string>;
  first?: InputMaybe<number>;
  last?: InputMaybe<number>;
}

interface Params {
  rows: ConnectionEdge<any>[];
  first?: number | null;
  last?: number | null;
}

export const getPageInfo = ({ first, last, rows }: Params): PageInfo => {
  const length = rows.length;
  const hasNextPage: boolean = Boolean(first && length === first);
  const hasPreviousPage: boolean = Boolean(last && length === last);

  const startCursor = !!length ? rows[0].cursor.toString() : null;
  const endCursor = !!length ? rows[rows.length - 1].cursor.toString() : null;

  const pageInfo = {
    startCursor,
    endCursor,
    hasNextPage,
    hasPreviousPage,
  };

  return pageInfo;
};

const DEFAULT_LIMIT = 20;

type PaginationInput = {
  after?: InputMaybe<string>;
  before?: InputMaybe<string>;
  first?: InputMaybe<number>;
  last?: InputMaybe<number>;
};

type PaginationOutput = {
  limit: number;
  order: "ASC" | "DESC";
};

export function getPaginationParams({
  after,
  before,
  first,
  last,
}: PaginationInput): PaginationOutput {
  if (after) {
    return {
      limit: first ?? DEFAULT_LIMIT,
      order: "ASC",
    };
  }

  if (before) {
    return {
      limit: last ?? DEFAULT_LIMIT,
      order: "DESC",
    };
  }

  if (first) {
    return {
      limit: first,
      order: "ASC",
    };
  }
  if (last) {
    return {
      limit: last,
      order: "DESC",
    };
  }

  return {
    limit: DEFAULT_LIMIT,
    order: "ASC",
  };
}
