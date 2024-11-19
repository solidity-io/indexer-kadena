import { InputMaybe, PageInfo } from "../config/graphql-types";
import { ConnectionEdge } from "./types";

export interface PaginationsParams {
  after?: InputMaybe<string>;
  before?: InputMaybe<string>;
  first: number;
  last: number;
}

interface Params {
  rows: ConnectionEdge<any>[];
  first: number;
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

export const addPagination = (
  query: string,
  queryParams: Array<any>,
  after?: InputMaybe<string>,
) => {
  let cursorCondition = "";
  if (after) {
    const decodedAfter = after; // This could just decode to a simple event ID
    cursorCondition = `AND t.id > ${after}`;
    queryParams.push(decodedAfter);
  }

  return { query, queryParams };
};
