import { InputMaybe, PageInfo } from '../config/graphql-types';
import { ConnectionEdge } from './types';

export interface PaginationsParams {
  after?: InputMaybe<string>;
  before?: InputMaybe<string>;
  first?: InputMaybe<number>;
  last?: InputMaybe<number>;
}

const DEFAULT_LIMIT = 20;
const LIMIT_NEXT_PAGE_CHECK = 1;

interface Params<T> {
  order: 'ASC' | 'DESC';
  limit: number;
  edges: ConnectionEdge<T>[];
  after?: string | null;
  before?: string | null;
}

export const encodeCursor = (cursor: string): string => Buffer.from(cursor).toString('base64');

export const decodeCursor = (cursor: string): string =>
  Buffer.from(cursor, 'base64').toString('utf8');

export const getPageInfo = <T>({
  order = 'DESC',
  limit: limitParam,
  edges,
  after,
  before,
}: Params<T>): { pageInfo: PageInfo; edges: ConnectionEdge<T>[] } => {
  const length = edges.length;

  const limit = (limitParam ?? DEFAULT_LIMIT) - LIMIT_NEXT_PAGE_CHECK;

  if (length === 0) {
    return {
      pageInfo: {
        startCursor: null,
        endCursor: null,
        hasNextPage: false,
        hasPreviousPage: false,
      },
      edges,
    };
  }

  if (length === 1) {
    return {
      pageInfo: {
        startCursor: encodeCursor(edges[0].cursor),
        endCursor: encodeCursor(edges[0].cursor),
        hasNextPage: !!before,
        hasPreviousPage: !!after,
      },
      edges,
    };
  }

  let hasNextPage = false;
  let hasPreviousPage = false;
  let startCursor = null;
  let endCursor = null;
  let newEdges = null;
  const idx = Math.min(length, limit);
  if (order === 'DESC') {
    hasNextPage = length > limit;
    hasPreviousPage = !!after;
    startCursor = encodeCursor(edges[0].cursor);
    endCursor = encodeCursor(edges[idx - 1].cursor);
    newEdges = edges.slice(0, idx);
  } else {
    hasNextPage = !!before;
    hasPreviousPage = length > limit;
    const reversed = edges.slice(0, idx).reverse();
    startCursor = encodeCursor(reversed[0].cursor);
    endCursor = encodeCursor(reversed[reversed.length - 1].cursor);
    newEdges = [...reversed];
  }

  const edgesWithCursorEncoded = newEdges.map(e => ({
    cursor: encodeCursor(e.cursor),
    node: e.node,
  }));

  const pageInfo = {
    startCursor,
    endCursor,
    hasNextPage,
    hasPreviousPage,
  };

  return { pageInfo, edges: edgesWithCursorEncoded };
};

type PaginationInput = {
  after?: InputMaybe<string>;
  before?: InputMaybe<string>;
  first?: InputMaybe<number>;
  last?: InputMaybe<number>;
};

type PaginationOutput = {
  limit: number;
  order: 'ASC' | 'DESC';
  after: string | null;
  before: string | null;
};

export function getPaginationParams({
  after,
  before,
  first,
  last,
}: PaginationInput): PaginationOutput {
  if (after) {
    return {
      limit: (first ?? DEFAULT_LIMIT) + LIMIT_NEXT_PAGE_CHECK,
      order: 'DESC',
      after: decodeCursor(after),
      before: null,
    };
  }

  if (before) {
    return {
      limit: (last ?? DEFAULT_LIMIT) + LIMIT_NEXT_PAGE_CHECK,
      order: 'ASC',
      after: null,
      before: decodeCursor(before),
    };
  }

  if (first) {
    return {
      limit: first + LIMIT_NEXT_PAGE_CHECK,
      order: 'DESC',
      after: null,
      before: null,
    };
  }
  if (last) {
    return {
      limit: last + LIMIT_NEXT_PAGE_CHECK,
      order: 'ASC',
      after: null,
      before: null,
    };
  }

  return {
    limit: DEFAULT_LIMIT + LIMIT_NEXT_PAGE_CHECK,
    order: 'DESC',
    after: null,
    before: null,
  };
}
