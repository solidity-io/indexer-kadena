/**
 * Transaction Database Repository Implementation
 *
 * This module provides the concrete PostgreSQL implementation of the TransactionRepository interface.
 * It handles all database operations related to blockchain transactions, including complex queries,
 * pagination, filtering, and relationships with other entities.
 *
 * Key features:
 * 1. Dynamic SQL query construction based on filtering parameters
 * 2. Optimized query strategies for different access patterns
 * 3. Implementation of cursor-based pagination
 * 4. Data validation against schema validators
 * 5. Caching integration for performance optimization
 * 6. Support for complex transaction relationships (events, transfers, signers)
 *
 * This implementation uses raw SQL queries for maximum performance and flexibility,
 * particularly when dealing with complex joins and conditions across multiple tables.
 */

import { rootPgPool } from '../../../../config/database';
import TransactionRepository, {
  GetTransactionsByPublicKeyParams,
  GetTransactionsByRequestKey,
  GetTransactionsCountParams,
  GetTransactionsParams,
  TransactionOutput,
} from '../../application/transaction-repository';
import { getPageInfo, getPaginationParams } from '../../pagination';
import { transactionMetaValidator } from '../schema-validator/transaction-meta-schema-validator';
import { transactionValidator } from '../schema-validator/transaction-schema-validator';
import { signerMetaValidator } from '../schema-validator/signer-schema-validator';
import { MEMORY_CACHE } from '../../../../cache/init';
import { NETWORK_STATISTICS_KEY } from '../../../../cache/keys';
import { NetworkStatistics } from '../../application/network-repository';

/**
 * Helper function to determine the appropriate SQL operator based on parameter position.
 * For the first condition in a query, we use 'WHERE', for subsequent conditions, we use 'AND'.
 *
 * @param paramsLength - The current number of parameters in the query
 * @returns The appropriate SQL operator ('WHERE' or 'AND')
 */
const operator = (paramsLength: number) => (paramsLength > 2 ? `\nAND` : 'WHERE');

/**
 * Database-specific implementation of the TransactionRepository interface.
 * This class handles all transaction-related database operations using PostgreSQL.
 */
export default class TransactionDbRepository implements TransactionRepository {
  /**
   * Creates SQL conditions for filtering transactions by block-related attributes.
   * This handles conditions like block hash, chain ID, height range, and confirmation depth.
   *
   * @param params - Transaction query parameters containing block filter conditions
   * @param queryParams - Current array of query parameters (for parameter indexing)
   * @returns Object containing the generated SQL conditions and updated parameter array
   */
  private createBlockConditions(
    params: GetTransactionsParams,
    queryParams: Array<string | number>,
  ) {
    const { blockHash, chainId, maxHeight, minHeight, minimumDepth } = params;
    let blocksConditions = '';
    const blockParams: (string | number)[] = [...queryParams];

    // Add block hash condition if specified
    if (blockHash) {
      blockParams.push(blockHash);
      const op = operator(blockParams.length);
      blocksConditions += `${op} b.hash = $${blockParams.length}`;
    }

    // Add chain ID condition if specified
    if (chainId) {
      blockParams.push(chainId);
      const op = operator(blockParams.length);
      blocksConditions += `${op} b."chainId" = $${blockParams.length}`;
    }

    // Add maximum height condition if specified
    if (maxHeight) {
      blockParams.push(maxHeight);
      const op = operator(blockParams.length);
      blocksConditions += `${op} b."height" <= $${blockParams.length}`;
    }

    // Add minimum height condition if specified
    if (minHeight) {
      blockParams.push(minHeight);
      const op = operator(blockParams.length);
      blocksConditions += `${op} b."height" >= $${blockParams.length}`;
    }

    // Add minimum confirmation depth condition if specified
    if (minimumDepth) {
      blockParams.push(minimumDepth);
      const op = operator(blockParams.length);
      blocksConditions += `${op} b."minimumDepth" >= $${blockParams.length}`;
    }

    return { blocksConditions, blockParams };
  }

  /**
   * Creates SQL conditions for filtering transactions by transaction-specific attributes.
   * This handles conditions like account name, cursor-based pagination, request key,
   * fungible token name, and NFT token ownership.
   *
   * @param params - Transaction query parameters containing transaction filter conditions
   * @param queryParams - Current array of query parameters (for parameter indexing)
   * @returns Object containing the generated SQL conditions and updated parameter array
   */
  private createTransactionConditions(
    params: GetTransactionsParams,
    queryParams: Array<string | number>,
  ) {
    const { accountName, after, before, requestKey, fungibleName, hasTokenId = false } = params;
    let conditions = '';
    const transactionParams: (string | number)[] = [...queryParams];

    // Add sender account condition for regular (non-NFT) transactions
    if (accountName && !hasTokenId) {
      transactionParams.push(accountName);
      const op = operator(transactionParams.length);
      conditions += `${op} t.sender = $${transactionParams.length}`;
    }

    // Add 'after' cursor condition for pagination
    if (after) {
      transactionParams.push(after);
      const op = operator(transactionParams.length);
      conditions += `${op} t.id < $${transactionParams.length}`;
    }

    // Add 'before' cursor condition for pagination
    if (before) {
      transactionParams.push(before);
      const op = operator(transactionParams.length);
      conditions += `${op} t.id > $${transactionParams.length}`;
    }

    // Add request key condition for exact transaction lookup
    if (requestKey) {
      transactionParams.push(requestKey);
      const op = operator(transactionParams.length);
      conditions += `${op} t."requestkey" = $${transactionParams.length}`;
    }

    // Add fungible token name condition using a subquery on Events table
    if (fungibleName) {
      transactionParams.push(fungibleName);
      const op = operator(transactionParams.length);
      conditions += `
        ${op} EXISTS
        (
          SELECT 1
          FROM "Events" e
          WHERE e."transactionId" = t.id
          AND e."module" = $${transactionParams.length}
        )`;
    }

    // Add NFT ownership condition using a subquery on Transfers table
    if (accountName && hasTokenId) {
      transactionParams.push(accountName);
      const op = operator(transactionParams.length);
      conditions += `
        ${op} EXISTS
        (
          SELECT 1
          FROM "Transfers" t
          WHERE (t."from_acct" = $${transactionParams.length} OR t."to_acct" = $${transactionParams.length})
          AND t."modulename" = 'marmalade-v2.ledger'
        )`;
    }

    return { conditions, params: transactionParams };
  }

  /**
   * Retrieves transactions based on specified parameters with pagination.
   * This method dynamically constructs SQL queries based on the provided filters,
   * optimizing the query strategy based on whether block or transaction conditions are primary.
   *
   * @param params - Transaction query parameters with filtering and pagination options
   * @returns Promise resolving to paginated transaction results
   */
  async getTransactions(params: GetTransactionsParams) {
    const {
      blockHash,
      after: afterEncoded,
      before: beforeEncoded,
      chainId,
      first,
      last,
      maxHeight,
      minHeight,
      minimumDepth,
    } = params;

    // Process pagination parameters
    const { limit, order, after, before } = getPaginationParams({
      after: afterEncoded,
      before: beforeEncoded,
      first,
      last,
    });

    // Determine if block-based filtering is the primary access pattern
    // This affects the query strategy for optimal performance
    const isBlockQueryFirst = blockHash || minHeight || maxHeight || minimumDepth || chainId;

    // Initialize query parameters and condition strings
    const queryParams: (string | number)[] = [];
    let blocksConditions = '';
    let transactionsConditions = '';

    // Build query conditions based on the primary access pattern
    if (isBlockQueryFirst) {
      // Start with block conditions when block filtering is primary
      const { blockParams, blocksConditions: bConditions } = this.createBlockConditions(params, [
        limit,
      ]);

      const { params: txParams, conditions: txConditions } = this.createTransactionConditions(
        { ...params, after, before },
        blockParams,
      );

      queryParams.push(...txParams);
      transactionsConditions = txConditions;
      blocksConditions = bConditions;
    } else {
      // Start with transaction conditions when transaction filtering is primary
      const { conditions, params: txParams } = this.createTransactionConditions(
        { ...params, after, before },
        [limit],
      );
      const { blocksConditions: bConditions, blockParams } = this.createBlockConditions(
        params,
        txParams,
      );

      queryParams.push(...blockParams);
      transactionsConditions = conditions;
      blocksConditions = bConditions;
    }

    // Construct the appropriate SQL query based on the primary access pattern
    let query = '';
    if (isBlockQueryFirst) {
      // Block-first query strategy: filter blocks first, then join to transactions
      query = `
        WITH filtered_block AS (
          SELECT b.id, b.hash, b."chainId", b.height
          FROM "Blocks" b
          ${blocksConditions}
        )
        SELECT
          t.id AS id,
          t.hash AS "hashTransaction",
          td.nonce AS "nonceTransaction",
          td.sigs AS sigs,
          td.continuation AS continuation,
          t.num_events AS "eventCount",
          td.pactid AS "pactId",
          td.proof AS proof,
          td.rollback AS rollback,
          t.txid AS txid,
          b.height AS "height",
          b."hash" AS "blockHash",
          b."chainId" AS "chainId",
          td.gas AS "gas",
          td.step AS step,
          td.data AS data,
          td.code AS code,
          t.logs AS "logs",
          t.result AS "result",
          t.requestkey AS "requestKey"
        FROM filtered_block b
        JOIN "Transactions" t ON b.id = t."blockId"
        LEFT JOIN "TransactionDetails" td ON t.id = td."transactionId"
        ${transactionsConditions}
        ORDER BY t.creationtime ${order}
        LIMIT $1
      `;
    } else {
      // Transaction-first query strategy: filter transactions first, then join to blocks
      query = `
        WITH filtered_transactions AS (
          SELECT t.id, t."blockId", t.hash, t.num_events, t.txid, t.logs, t.result, t.requestkey, t."chainId"
          FROM "Transactions" t
          ${transactionsConditions}
          ORDER BY t.creationtime ${order}
          LIMIT $1
        )
        SELECT
          t.id AS id,
          t.hash AS "hashTransaction",
          td.nonce AS "nonceTransaction",
          td.sigs AS sigs,
          td.continuation AS continuation,
          t.num_events AS "eventCount",
          td.pactid AS "pactId",
          td.proof AS proof,
          td.rollback AS rollback,
          t.txid AS txid,
          b.height AS "height",
          b."hash" AS "blockHash",
          b."chainId" AS "chainId",
          td.gas AS "gas",
          td.step AS step,
          td.data AS data,
          td.code AS code,
          td.nonce,
          td.sigs,
          t.logs AS "logs",
          t.result AS "result",
          t.requestkey AS "requestKey"
        FROM filtered_transactions t
        JOIN "Blocks" b ON b.id = t."blockId"
        LEFT JOIN "TransactionDetails" td ON t.id = td."transactionId"
        ${blocksConditions}
      `;
    }

    // Execute the query with the constructed parameters
    const { rows } = await rootPgPool.query(query, queryParams);

    // Transform database rows into GraphQL-compatible edges with cursors
    const edges = rows.map(row => ({
      cursor: row.id.toString(),
      node: transactionValidator.validate(row),
    }));

    const pageInfo = getPageInfo({ edges, order, limit, after, before });
    return pageInfo;
  }

  /**
   * Retrieves a transaction associated with a specific transfer.
   * This method finds the transaction that contains a specific transfer by ID.
   *
   * @param transferId - ID of the transfer
   * @returns Promise resolving to the associated transaction
   */
  async getTransactionByTransferId(transferId: string) {
    const query = `
      SELECT t.id as id,
      t.hash as "hashTransaction",
      td.nonce as "nonceTransaction",
      td.sigs as sigs,
      td.continuation as continuation,
      t.num_events as "eventCount",
      td.pactid as "pactId",
      td.proof as proof,
      td.rollback as rollback,
      t.txid AS txid,
      b.height as "height",
      b."hash" as "blockHash",
      b."chainId" as "chainId",
      td.gas as "gas",
      td.step as step,
      td.data as data,
      td.code as code,
      t.logs as "logs",
      t.result as "result",
      t.requestkey as "requestKey"
      FROM "Transactions" t
      JOIN "Blocks" b on t."blockId" = b.id
      JOIN "Transfers" tr on tr."transactionId" = t.id
      LEFT JOIN "TransactionDetails" td on t.id = td."transactionId"
      WHERE tr.id = $1
    `;

    const { rows } = await rootPgPool.query(query, [transferId]);

    if (!rows?.length) {
      throw new Error(`[ERROR][DB][DATA_MISSING] Transfer with id ${transferId} not found`);
    }

    const [row] = rows;
    const output = transactionValidator.validate(row);
    return output;
  }

  /**
   * Retrieves metadata for a transaction by its ID.
   * This method handles the specific case of transaction metadata retrieval,
   * validating the result against the expected schema.
   *
   * @param transactionId - ID of the transaction
   * @returns Promise resolving to the transaction metadata
   */
  async getTransactionMetaInfoById(transactionId: string) {
    const query = `
      SELECT t.id as id,
      t."chainId" as "chainId",
      t.creationtime as "creationTime",
      td.gaslimit as "gasLimit",
      td.gasprice as "gasPrice",
      t.sender as sender,
      td.ttl as ttl
      FROM "Transactions" t
      LEFT JOIN "TransactionDetails" td on t.id = td."transactionId"
      WHERE t.id = $1
    `;

    const { rows } = await rootPgPool.query(query, [transactionId]);

    const [row] = rows;
    const output = transactionMetaValidator.validate(row);
    return output;
  }

  /**
   * Retrieves transactions by their request key.
   * This is a specialized lookup method for finding transactions by their
   * unique request key identifier, with optional block filtering.
   *
   * @param params - Request key search parameters
   * @returns Promise resolving to matching transactions
   */
  async getTransactionsByRequestKey(params: GetTransactionsByRequestKey) {
    const { requestKey, blockHash, minimumDepth } = params;
    const queryParams: (string | number)[] = [requestKey];
    let conditions = '';

    if (blockHash) {
      queryParams.push(blockHash);
      conditions += `\nAND b."hash" = $${queryParams.length}`;
    }

    if (minimumDepth !== undefined && minimumDepth !== null) {
      queryParams.push(minimumDepth);
      conditions += `\nAND b.height >= $${queryParams.length}`;
    }

    const query = `
      SELECT t.id as id,
      t.hash as "hashTransaction",
      td.nonce as "nonceTransaction",
      td.sigs as sigs,
      td.continuation as continuation,
      t.num_events as "eventCount",
      td.pactid as "pactId",
      td.proof as proof,
      td.rollback as rollback,
      t.txid AS txid,
      b.height as "height",
      b."hash" as "blockHash",
      b."chainId" as "chainId",
      t.result as "result",
      td.gas as "gas",
      td.step as step,
      td.data as data,
      td.code as code,
      t.logs as "logs",
      t.requestkey as "requestKey"
      FROM "Transactions" t
      JOIN "Blocks" b on t."blockId" = b.id 
      LEFT JOIN "TransactionDetails" td on t.id = td."transactionId"
      WHERE t.requestkey = $1
      ${conditions}
    `;

    const { rows } = await rootPgPool.query(query, queryParams);

    const output = rows.map(row => transactionValidator.validate(row));

    return output;
  }

  /**
   * Retrieves transactions associated with a specific public key with pagination.
   * This method finds transactions where the specified public key is a signer,
   * supporting cursor-based pagination.
   *
   * @param params - Public key and pagination parameters
   * @returns Promise resolving to paginated transaction results
   */
  async getTransactionsByPublicKey({
    publicKey,
    first,
    before: beforeEncoded,
    after: afterEncoded,
    last,
  }: GetTransactionsByPublicKeyParams) {
    const { limit, order, after, before } = getPaginationParams({
      after: afterEncoded,
      before: beforeEncoded,
      first,
      last,
    });
    const queryParams: (string | number)[] = [limit, publicKey];

    let cursorCondition = '';

    if (after) {
      cursorCondition = `\nAND t.id < $3`;
      queryParams.push(after);
    }

    if (before) {
      cursorCondition = `\nAND t.id > $3`;
      queryParams.push(before);
    }

    const query = `
      SELECT
        t.id as id,
        t.hash as "hashTransaction",
        td.nonce as "nonceTransaction",
        td.sigs as sigs,
        td.continuation as continuation,
        t.num_events as "eventCount",
        td.pactid as "pactId",
        td.proof as proof,
        td.rollback as rollback,
        t.txid AS txid,
        b.height as "height",
        b."hash" as "blockHash",
        b."chainId" as "chainId",
        td.gas as "gas",
        td.step as step,
        td.data as data,
        td.code as code,
        t.logs as "logs",
        t.result as "result",
        t.requestkey as "requestKey"
      FROM "Transactions" t
      JOIN "Blocks" b ON t."blockId" = b.id
      JOIN (
        SELECT DISTINCT s."transactionId"
        FROM "Signers" s
        WHERE s."pubkey" = $2
      ) filtered_signers ON t.id = filtered_signers."transactionId"
      LEFT JOIN "TransactionDetails" td on t.id = td."transactionId"
      ${cursorCondition}
      ORDER BY t.creationtime ${order}
      LIMIT $1;
    `;

    const { rows } = await rootPgPool.query(query, queryParams);

    const edges = rows.map(row => ({
      cursor: row.id.toString(),
      node: transactionValidator.validate(row),
    }));

    const pageInfo = getPageInfo({ edges, order, limit, after, before });
    return pageInfo;
  }

  /**
   * Counts transactions associated with a specific public key.
   * This provides an efficient count for transactions signed by a specific key.
   *
   * @param publicKey - The public key to count transactions for
   * @returns Promise resolving to the count of matching transactions
   */
  async getTransactionsByPublicKeyCount(publicKey: string) {
    const query = `
      SELECT COUNT(*) as count
        FROM (
        SELECT DISTINCT s."transactionId"
        FROM "Signers" s
        WHERE s.pubkey = $1
      ) subquery;
    `;

    const { rows } = await rootPgPool.query(query, [publicKey]);
    const totalCount = parseInt(rows?.[0]?.count ?? '0', 10);
    return totalCount;
  }

  /**
   * Counts transactions matching the specified filter parameters.
   * This method efficiently counts matching transactions without retrieving full data.
   *
   * @param params - Filtering parameters
   * @returns Promise resolving to the count of matching transactions
   */
  async getTransactionsCount(params: GetTransactionsCountParams): Promise<number> {
    const hasNoParams = Object.values(params).every(v => !v);

    if (hasNoParams) {
      const cachedData = MEMORY_CACHE.get<NetworkStatistics>(NETWORK_STATISTICS_KEY);
      return cachedData?.transactionCount ?? 0;
    }

    const {
      blockHash,
      accountName,
      chainId,
      requestKey,
      fungibleName,
      minHeight,
      maxHeight,
      minimumDepth,
      hasTokenId,
    } = params;

    const transactionsParams: (string | number)[] = [];
    const blockParams: (string | number)[] = [];
    let transactionsConditions = '';
    let blocksConditions = '';

    const localOperator = (paramsLength: number) => (paramsLength > 1 ? `\nAND` : 'WHERE');

    if (accountName) {
      transactionsParams.push(accountName);
      const op = localOperator(transactionsParams.length);
      transactionsConditions += `${op} t.sender = $${transactionsParams.length}`;
    }

    if (requestKey) {
      transactionsParams.push(requestKey);
      const op = localOperator(transactionsParams.length);
      transactionsConditions += `${op} t."requestkey" = $${transactionsParams.length}`;
    }

    if (fungibleName) {
      transactionsParams.push(fungibleName);
      const op = localOperator(transactionsParams.length);
      transactionsConditions += `
        ${op} EXISTS
        (
          SELECT 1
          FROM "Events" e
          WHERE e."transactionId" = t.id
          AND e."module" = $${transactionsParams.length}
        )`;
    }

    if (accountName && hasTokenId) {
      transactionsParams.push(accountName);
      const op = localOperator(transactionsParams.length);
      transactionsConditions += `
        ${op} EXISTS
        (
          SELECT 1
          FROM "Transfers" t
          WHERE t."from_acct" = $${transactionsParams.length}
          AND t."hasTokenId" = true
        )`;
    }

    const paramsOffset = transactionsParams.length;
    if (blockHash) {
      blockParams.push(blockHash);
      const op = localOperator(blockParams.length);
      blocksConditions += `${op} b.hash = $${paramsOffset + blockParams.length}`;
    }

    if (chainId) {
      blockParams.push(chainId);
      const op = localOperator(blockParams.length);
      blocksConditions += `${op} b."chainId" = $${paramsOffset + blockParams.length}`;
    }

    if (maxHeight) {
      blockParams.push(maxHeight);
      const op = localOperator(blockParams.length);
      blocksConditions += `${op} b."height" <= $${paramsOffset + blockParams.length}`;
    }

    if (minHeight) {
      blockParams.push(minHeight);
      const op = localOperator(blockParams.length);
      blocksConditions += `${op} b."height" >= $${paramsOffset + blockParams.length}`;
    }

    if (minimumDepth) {
      blockParams.push(minimumDepth);
      const op = localOperator(blockParams.length);
      blocksConditions += `${op} b."minimumDepth" >= $${paramsOffset + blockParams.length}`;
    }

    const totalCountQuery = `
      WITH filtered_transactions AS (
        SELECT id, "blockId"
        FROM "Transactions" t
        ${transactionsConditions}
      )
      SELECT COUNT(*) as count
      FROM filtered_transactions t
      ${blocksConditions ? `JOIN "Blocks" b ON b.id = t."blockId"` : ''}
      ${blocksConditions}
    `;

    const { rows: countResult } = await rootPgPool.query(totalCountQuery, [
      ...transactionsParams,
      ...blockParams,
    ]);

    const totalCount = parseInt(countResult[0].count, 10);
    return totalCount;
  }

  /**
   * Retrieves transactions associated with specific events.
   * This method finds transactions that contain any of the specified event IDs.
   *
   * @param eventIds - Array of event IDs
   * @returns Promise resolving to matching transactions
   */
  async getTransactionsByEventIds(eventIds: readonly string[]): Promise<TransactionOutput[]> {
    console.info('[INFO][INFRA][INFRA_CONFIG] Batching for event IDs:', eventIds);

    const { rows } = await rootPgPool.query(
      `SELECT t.id as id,
      t.hash as "hashTransaction",
      td.nonce as "nonceTransaction",
      td.sigs as sigs,
      td.continuation as continuation,
      t.num_events as "eventCount",
      td.pactid as "pactId",
      td.proof as proof,
      td.rollback as rollback,
      t.txid AS txid,
      b.height as "height",
      b."hash" as "blockHash",
      b."chainId" as "chainId",
      td.gas as "gas",
      td.step as step,
      td.data as data,
      td.code as code,
      t.logs as "logs",
      t.result as "result",
      e.id as "eventId",
      t.requestkey as "requestKey"
      FROM "Transactions" t
      JOIN "Blocks" b on t."blockId" = b.id
      JOIN "Events" e on e."transactionId" = t."id"
      LEFT JOIN "TransactionDetails" td on t.id = td."transactionId"
      WHERE e.id = ANY($1::int[])`,
      [eventIds],
    );

    if (rows.length !== eventIds.length) {
      throw new Error('There was an issue fetching blocks for event IDs.');
    }

    const transactionMap = rows.reduce(
      (acum, row) => ({
        ...acum,
        [row.eventId]: transactionValidator.validate(row),
      }),
      {},
    );

    return eventIds.map(eventId => transactionMap[eventId]) as TransactionOutput[];
  }

  /**
   * Retrieves signers for a specific transaction.
   * This method gets the cryptographic signers associated with a transaction,
   * optionally filtered by order index for multi-signature transactions.
   *
   * @param transactionId - ID of the transaction
   * @param orderIndex - Optional order index for multi-signature transactions
   * @returns Promise resolving to an array of signers
   */
  async getSigners(transactionId: string, orderIndex?: number) {
    const queryParams: Array<string | number> = [transactionId];
    let query = `
      SELECT s.pubkey as "publicKey",
        s.address as "address",
        s."orderIndex" as "signerOrderIndex",
        s.clist as "clist",
        t.requestkey as "requestKey"
      FROM "Signers" s
      JOIN "Transactions" t on s."transactionId" = t.id
      WHERE t.id = $1
    `;

    if (orderIndex) {
      query += `\nAND s."orderIndex" = $2`;
      queryParams.push(orderIndex);
    }

    const { rows } = await rootPgPool.query(query, queryParams);

    const output = rows.map(row => signerMetaValidator.validate(row));

    return output;
  }
}
