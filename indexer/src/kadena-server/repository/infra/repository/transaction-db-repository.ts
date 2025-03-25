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

const operator = (paramsLength: number) => (paramsLength > 2 ? `\nAND` : 'WHERE');

export default class TransactionDbRepository implements TransactionRepository {
  private createBlockConditions(
    params: GetTransactionsParams,
    queryParams: Array<string | number>,
  ) {
    const { blockHash, chainId, maxHeight, minHeight, minimumDepth } = params;
    let blocksConditions = '';
    const blockParams: (string | number)[] = [...queryParams];

    if (blockHash) {
      blockParams.push(blockHash);
      const op = operator(blockParams.length);
      blocksConditions += `${op} b.hash = $${blockParams.length}`;
    }

    if (chainId) {
      blockParams.push(chainId);
      const op = operator(blockParams.length);
      blocksConditions += `${op} b."chainId" = $${blockParams.length}`;
    }

    if (maxHeight) {
      blockParams.push(maxHeight);
      const op = operator(blockParams.length);
      blocksConditions += `${op} b."height" <= $${blockParams.length}`;
    }

    if (minHeight) {
      blockParams.push(minHeight);
      const op = operator(blockParams.length);
      blocksConditions += `${op} b."height" >= $${blockParams.length}`;
    }

    if (minimumDepth) {
      blockParams.push(minimumDepth);
      const op = operator(blockParams.length);
      blocksConditions += `${op} b."minimumDepth" >= $${blockParams.length}`;
    }

    return { blocksConditions, blockParams };
  }

  private createTransactionConditions(
    params: GetTransactionsParams,
    queryParams: Array<string | number>,
  ) {
    const { accountName, after, before, requestKey, fungibleName, hasTokenId = false } = params;
    let conditions = '';
    const transactionParams: (string | number)[] = [...queryParams];
    if (accountName) {
      transactionParams.push(accountName);
      const op = operator(transactionParams.length);
      conditions += `${op} t.sender = $${transactionParams.length}`;
    }

    if (after) {
      transactionParams.push(after);
      const op = operator(transactionParams.length);
      conditions += `${op} t.id < $${transactionParams.length}`;
    }

    if (before) {
      transactionParams.push(before);
      const op = operator(transactionParams.length);
      conditions += `${op} t.id > $${transactionParams.length}`;
    }

    if (requestKey) {
      transactionParams.push(requestKey);
      const op = operator(transactionParams.length);
      conditions += `${op} t."requestkey" = $${transactionParams.length}`;
    }

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

    if (accountName && hasTokenId) {
      transactionParams.push(accountName);
      const op = operator(transactionParams.length + 1);
      conditions += `
        ${op} EXISTS
        (
          SELECT 1
          FROM "Transfers" t
          WHERE t."from_acct" = $${transactionParams.length}
          AND t."hasTokenId" = true
        )`;
    }

    return { conditions, params: transactionParams };
  }

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

    const { limit, order, after, before } = getPaginationParams({
      after: afterEncoded,
      before: beforeEncoded,
      first,
      last,
    });
    const isBlockQueryFirst = blockHash || minHeight || maxHeight || minimumDepth || chainId;

    const queryParams: (string | number)[] = [];
    let blocksConditions = '';
    let transactionsConditions = '';
    if (isBlockQueryFirst) {
      const { blockParams, blocksConditions: bConditions } = this.createBlockConditions(params, [
        limit,
      ]);

      const { params: txParams, conditions: txConditions } = this.createTransactionConditions(
        params,
        blockParams,
      );

      queryParams.push(...txParams);
      transactionsConditions = txConditions;
      blocksConditions = bConditions;
    } else {
      const { conditions, params: txParams } = this.createTransactionConditions(params, [limit]);
      const { blocksConditions: bConditions, blockParams } = this.createBlockConditions(
        params,
        txParams,
      );

      queryParams.push(...blockParams);
      transactionsConditions = conditions;
      blocksConditions = bConditions;
    }

    let query = '';
    if (isBlockQueryFirst) {
      query = `
        WITH filtered_block AS (
          SELECT b.id, b.hash, b."chainId", b.height
          FROM "Blocks" b
          ${blocksConditions}
        )
        SELECT
          t.id AS id,
          t.hash AS "hashTransaction",
          t.nonce AS "nonceTransaction",
          t.sigs AS sigs,
          t.continuation AS continuation,
          t.num_events AS "eventCount",
          t.pactid AS "pactId",
          t.proof AS proof,
          t.rollback AS rollback,
          t.txid AS txid,
          b.height AS "height",
          b."hash" AS "blockHash",
          b."chainId" AS "chainId",
          t.gas AS "gas",
          t.step AS step,
          t.data AS data,
          t.code AS code,
          t.logs AS "logs",
          t.result AS "result",
          t.requestkey AS "requestKey"
        FROM filtered_block b
        JOIN "Transactions" t ON b.id = t."blockId"
        ${transactionsConditions}
        ORDER BY t.id ${order}
        LIMIT $1
      `;
    } else {
      query = `
        WITH filtered_transactions AS (
          SELECT id, "blockId", hash, nonce, sigs, continuation, num_events, pactid, proof, rollback, gas, step, data, code, logs, result, requestkey, "chainId", txid
          FROM "Transactions" t
          ${transactionsConditions}
          ORDER BY t.id ${order}
          LIMIT $1
        )
        SELECT
          t.id AS id,
          t.hash AS "hashTransaction",
          t.nonce AS "nonceTransaction",
          t.sigs AS sigs,
          t.continuation AS continuation,
          t.num_events AS "eventCount",
          t.pactid AS "pactId",
          t.proof AS proof,
          t.rollback AS rollback,
          t.txid AS txid,
          b.height AS "height",
          b."hash" AS "blockHash",
          b."chainId" AS "chainId",
          t.gas AS "gas",
          t.step AS step,
          t.data AS data,
          t.code AS code,
          t.logs AS "logs",
          t.result AS "result",
          t.requestkey AS "requestKey"
        FROM filtered_transactions t
        JOIN "Blocks" b ON b.id = t."blockId"
        ${blocksConditions}
      `;
    }

    const { rows } = await rootPgPool.query(query, queryParams);

    const edges = rows.map(row => ({
      cursor: row.id.toString(),
      node: transactionValidator.validate(row),
    }));

    const pageInfo = getPageInfo({ edges, order, limit, after, before });
    return pageInfo;
  }

  async getTransactionByTransferId(transferId: string) {
    const query = `
      SELECT t.id as id,
      t.hash as "hashTransaction",
      t.nonce as "nonceTransaction",
      t.sigs as sigs,
      t.continuation as continuation,
      t.num_events as "eventCount",
      t.pactid as "pactId",
      t.proof as proof,
      t.rollback as rollback,
      t.txid AS txid,
      b.height as "height",
      b."hash" as "blockHash",
      b."chainId" as "chainId",
      t.gas as "gas",
      t.step as step,
      t.data as data,
      t.code as code,
      t.logs as "logs",
      t.result as "result",
      t.requestkey as "requestKey"
      FROM "Transactions" t
      JOIN "Blocks" b on t."blockId" = b.id
      JOIN "Transfers" tr on tr."transactionId" = t.id
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

  async getTransactionMetaInfoById(transactionId: string) {
    const query = `
      SELECT t.id as id,
      t."chainId" as "chainId",
      t.creationtime as "creationTime",
      t.gaslimit as "gasLimit",
      t.gasprice as "gasPrice",
      t.sender as sender,
      t.ttl as ttl
      FROM "Transactions" t
      WHERE t.id = $1
    `;

    const { rows } = await rootPgPool.query(query, [transactionId]);

    const [row] = rows;
    const output = transactionMetaValidator.validate(row);

    return output;
  }

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
      t.nonce as "nonceTransaction",
      t.sigs as sigs,
      t.continuation as continuation,
      t.num_events as "eventCount",
      t.pactid as "pactId",
      t.proof as proof,
      t.rollback as rollback,
      t.txid AS txid,
      b.height as "height",
      b."hash" as "blockHash",
      b."chainId" as "chainId",
      t.result as "result",
      t.gas as "gas",
      t.step as step,
      t.data as data,
      t.code as code,
      t.logs as "logs",
      t.requestkey as "requestKey"
      FROM "Transactions" t
      JOIN "Blocks" b on t."blockId" = b.id 
      WHERE t.requestkey = $1
      ${conditions}
    `;

    const { rows } = await rootPgPool.query(query, queryParams);

    const output = rows.map(row => transactionValidator.validate(row));

    return output;
  }

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
        t.nonce as "nonceTransaction",
        t.sigs as sigs,
        t.continuation as continuation,
        t.num_events as "eventCount",
        t.pactid as "pactId",
        t.proof as proof,
        t.rollback as rollback,
        t.txid AS txid,
        b.height as "height",
        b."hash" as "blockHash",
        b."chainId" as "chainId",
        t.gas as "gas",
        t.step as step,
        t.data as data,
        t.code as code,
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
      ${cursorCondition}
      ORDER BY t.id ${order}
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

  async getTransactionsByEventIds(eventIds: readonly string[]): Promise<TransactionOutput[]> {
    console.info('[INFO][INFRA][INFRA_CONFIG] Batching for event IDs:', eventIds);

    const { rows } = await rootPgPool.query(
      `SELECT t.id as id,
      t.hash as "hashTransaction",
      t.nonce as "nonceTransaction",
      t.sigs as sigs,
      t.continuation as continuation,
      t.num_events as "eventCount",
      t.pactid as "pactId",
      t.proof as proof,
      t.rollback as rollback,
      t.txid AS txid,
      b.height as "height",
      b."hash" as "blockHash",
      b."chainId" as "chainId",
      t.gas as "gas",
      t.step as step,
      t.data as data,
      t.code as code,
      t.logs as "logs",
      t.result as "result",
      e.id as "eventId",
      t.requestkey as "requestKey"
      FROM "Transactions" t
      JOIN "Blocks" b on t."blockId" = b.id
      JOIN "Events" e on e."transactionId" = t."id"
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
