/**
 * Utility functions for formatting and normalizing Kadena blockchain node responses
 *
 * This file provides helper functions for processing raw data retrieved from Kadena
 * blockchain nodes, particularly focusing on formatting balance values and security
 * guard predicates into standardized application formats.
 *
 * These utilities handle the various response formats that can be returned from Pact queries
 * and transform them into consistent structures used throughout the indexer application.
 */

import { PactQueryResponse } from '../kadena-server/config/graphql-types';

/**
 * Formats a balance value from a Pact query response
 *
 * This function extracts and normalizes token balance values from Pact query responses,
 * handling different possible formats including decimal objects and direct numeric values.
 * It gracefully handles missing or malformed values by defaulting to zero.
 *
 * @param queryResult - The raw Pact query response containing balance information
 * @returns A normalized numeric balance value or 0 if no valid balance is found
 */
export const formatBalance_NODE = (queryResult: PactQueryResponse) => {
  let resultParsed;
  try {
    resultParsed = JSON.parse(queryResult.result ?? '{}');
  } catch (error) {
    return 0;
  }

  if (resultParsed?.balance?.decimal) {
    return Number(resultParsed.balance.decimal);
  } else if (resultParsed?.balance) {
    return resultParsed.balance;
  } else {
    return 0;
  }
};

/**
 * Formats a guard (security predicate) from a Pact query response
 *
 * This function normalizes the different formats of Kadena guard predicates returned
 * from blockchain queries. Guards can be in various formats:
 * 1. Function-based guards with arguments ("fun" format)
 * 2. Predicate-based guards with keys ("pred" format)
 * 3. Other custom formats
 *
 * The function transforms all formats into a standardized structure with consistent
 * properties, preserving the raw guard data while extracting key components.
 *
 * @param queryResult - The raw Pact query response containing guard information
 * @returns A normalized guard object with standardized properties including the raw representation
 */
export const formatGuard_NODE = (queryResult: PactQueryResponse) => {
  let resultParsed;
  try {
    resultParsed = JSON.parse(queryResult.result ?? '{}');
  } catch (error) {
    return { raw: 'null', keys: [], predicate: '' };
  }

  // Handle function-based guards (fun format)
  if (resultParsed.guard?.fun) {
    return {
      args: resultParsed.guard.args.map((arg: any) => JSON.stringify(arg)),
      fun: resultParsed.guard.fun,
      raw: JSON.stringify(resultParsed.guard),
      keys: [],
      predicate: '',
    };
  }

  // Handle predicate-based guards (pred format)
  if (resultParsed.guard?.pred) {
    return {
      keys: resultParsed.guard.keys,
      predicate: resultParsed.guard.pred,
      raw: JSON.stringify(resultParsed.guard),
    };
  }

  // Default case for other guard formats
  return {
    raw: resultParsed.guard ? JSON.stringify(resultParsed.guard) : 'null',
    keys: [],
    predicate: '',
  };
};
