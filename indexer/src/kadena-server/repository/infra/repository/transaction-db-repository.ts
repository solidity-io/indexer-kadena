import { rootPgPool } from "../../../../config/database";
import TransactionRepository, {
  GetTransactionsByPublicKeyParams,
  GetTransactionsByRequestKey,
  GetTransactionsCountParams,
  GetTransactionsParams,
  SignerOutput,
  TransactionOutput,
} from "../../application/transaction-repository";
import { getPageInfo } from "../../pagination";
import { transactionMetaValidator } from "../schema-validator/transaction-meta-schema-validator";
import { transactionValidator } from "../schema-validator/transaction-schema-validator";
import { signerMetaValidator } from "../schema-validator/signer-schema-validator";
import { MEMORY_CACHE } from "../../../../cache/init";
import { NETWORK_STATISTICS_KEY } from "../../../../cache/keys";
import { NetworkStatistics } from "../../application/network-repository";

const operator = (paramsLength: number) =>
  paramsLength > 2 ? `\nAND` : "WHERE";

export default class TransactionDbRepository implements TransactionRepository {
  async getTransactions(params: GetTransactionsParams) {
    const {
      blockHash,
      after,
      before,
      accountName,
      chainId,
      first,
      last,
      fungibleName,
      requestKey,
      maxHeight,
      minHeight,
      minimumDepth,
      hasTokenId = false,
    } = params;

    const queryParams: (string | number)[] = [before ? last : first];
    let conditions = "";

    if (accountName) {
      queryParams.push(accountName);
      const op = operator(queryParams.length);
      conditions += `${op} t.sender = $${queryParams.length}`;
    }

    if (blockHash) {
      queryParams.push(blockHash);
      const op = operator(queryParams.length);
      conditions += `${op} b.hash = $${queryParams.length}`;
    }

    if (after) {
      queryParams.push(after);
      const op = operator(queryParams.length);
      conditions += `${op} t.id > $${queryParams.length}`;
    }

    if (before) {
      queryParams.push(before);
      const op = operator(queryParams.length);
      conditions += `${op} t.id < $${queryParams.length}`;
    }

    if (chainId) {
      queryParams.push(chainId);
      const op = operator(queryParams.length);
      conditions += `${op} b."chainId" = $${queryParams.length}`;
    }

    if (requestKey) {
      queryParams.push(requestKey);
      const op = operator(queryParams.length);
      conditions += `${op} t."requestkey" = $${queryParams.length}`;
    }

    if (maxHeight) {
      queryParams.push(maxHeight);
      const op = operator(queryParams.length);
      conditions += `${op} b."height" <= $${queryParams.length}`;
    }

    if (minHeight) {
      queryParams.push(minHeight);
      const op = operator(queryParams.length);
      conditions += `${op} b."height" >= $${queryParams.length}`;
    }

    if (minimumDepth) {
      queryParams.push(minimumDepth);
      const op = operator(queryParams.length);
      conditions += `${op} b."minimumDepth" >= $${queryParams.length}`;
    }

    if (fungibleName) {
      queryParams.push(fungibleName);
      const op = operator(queryParams.length);
      conditions += `
        ${op} EXISTS
        (
          SELECT 1
          FROM "Events" e
          WHERE e."transactionId" = t.id
          AND e."module" = $${queryParams.length}
        )`;
    }

    if (accountName && hasTokenId) {
      queryParams.push(accountName);
      const op = operator(queryParams.length + 1);
      conditions += `
        ${op} EXISTS
        (
          SELECT 1
          FROM "Transfers" t
          WHERE t."from_acct" = $${queryParams.length}
          AND t."hasTokenId" = true
        )`;
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
      b.height as "height",
      b."hash" as "blockHash",
      b."chainId" as "chainId",
      t.gas as "gas",
      t.step as step,
      t.data as data,
      t.code as code,
      t.logs as "logs",
      t.result as "result",
      t.metadata as "metadata",
      t.requestkey as "requestKey"
      FROM "Blocks" b
      JOIN "Transactions" t on b.id = t."blockId"
      ${conditions}
      ORDER BY t.id ${before ? "DESC" : "ASC"}
      LIMIT $1;
    `;

    const { rows } = await rootPgPool.query(query, queryParams);

    const edges = rows.map((row) => ({
      cursor: row.id.toString(),
      node: transactionValidator.validate(row),
    }));

    const pageInfo = getPageInfo({ rows: edges, first, last });

    return {
      edges,
      pageInfo,
    };
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
      b.height as "height",
      b."hash" as "blockHash",
      b."chainId" as "chainId",
      t.gas as "gas",
      t.step as step,
      t.data as data,
      t.code as code,
      t.logs as "logs",
      t.result as "result",
      t.metadata as "metadata",
      t.requestkey as "requestKey"
      FROM "Transactions" t
      JOIN "Blocks" b on t."blockId" = b.id
      JOIN "Transfers" tr on tr."transactionId" = t.id
      WHERE tr.id = $1
    `;

    const { rows } = await rootPgPool.query(query, [transferId]);

    if (!rows?.length) {
      throw new Error(`Transfer with id ${transferId} not found`);
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
    let conditions = "";

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
      b.height as "height",
      b."hash" as "blockHash",
      b."chainId" as "chainId",
      t.result as "result",
      t.gas as "gas",
      t.step as step,
      t.data as data,
      t.code as code,
      t.logs as "logs",
      t.metadata as "metadata",
      t.requestkey as "requestKey"
      FROM "Transactions" t
      JOIN "Blocks" b on t."blockId" = b.id 
      WHERE t.requestkey = $1
      ${conditions}
      `;

    const { rows } = await rootPgPool.query(query, queryParams);

    const output = rows.map((row) => transactionValidator.validate(row));

    return output;
  }

  async getTransactionsByPublicKey({
    publicKey,
    first,
    before,
    after,
    last,
  }: GetTransactionsByPublicKeyParams) {
    const queryParams: (string | number)[] = [before ? last : first, publicKey];

    let cursorCondition = "";

    if (after) {
      cursorCondition = `\nAND t.id > $3`;
      queryParams.push(after);
    }

    if (before) {
      cursorCondition = `\nAND t.id < $3`;
      queryParams.push(before);
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
      b.height as "height",
      b."hash" as "blockHash",
      b."chainId" as "chainId",
      t.gas as "gas",
      t.step as step,
      t.data as data,
      t.code as code,
      t.logs as "logs",
      t.metadata as "metadata",
      t.result as "result",
      t.requestkey as "requestKey"
      FROM "Transactions" t
      JOIN "Blocks" b on t."blockId" = b.id
      WHERE t.id IN (
        SELECT DISTINCT s."transactionId"
        FROM "Signers" s
        WHERE s."pubkey" = $2
      )
      ${cursorCondition}
      ORDER BY t.id ${before ? "DESC" : "ASC"}
      LIMIT $1;
    `;

    const { rows } = await rootPgPool.query(query, queryParams);

    const edges = rows.map((row) => ({
      cursor: row.id.toString(),
      node: transactionValidator.validate(row),
    }));

    const pageInfo = getPageInfo({ rows: edges, first, last });

    return {
      edges,
      pageInfo,
    };
  }

  async getTransactionsByPublicKeyCount(publicKey: string) {
    const query = `
      SELECT COUNT(DISTINCT s."transactionId") as count
      FROM "Signers" s
      WHERE s.pubkey = $1;
    `;

    const { rows } = await rootPgPool.query(query, [publicKey]);
    const totalCount = parseInt(rows?.[0]?.count ?? "0", 10);
    return totalCount;
  }

  async getTransactionsCount(
    params: GetTransactionsCountParams,
  ): Promise<number> {
    const hasNoParams = Object.values(params).every((v) => !v);

    if (hasNoParams) {
      const cachedData = MEMORY_CACHE.get<NetworkStatistics>(
        NETWORK_STATISTICS_KEY,
      );
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
    } = params;

    const queryParams: (string | number)[] = [];
    let conditions = "";

    const localOperator = (paramsLength: number) =>
      paramsLength > 1 ? `\nAND` : "WHERE";

    if (accountName) {
      queryParams.push(accountName);
      const op = localOperator(queryParams.length);
      conditions += `${op} t.sender = $${queryParams.length}`;
    }

    if (blockHash) {
      queryParams.push(blockHash);
      const op = localOperator(queryParams.length);
      conditions += `${op} b.hash = $${queryParams.length}`;
    }

    if (chainId) {
      queryParams.push(chainId);
      const op = localOperator(queryParams.length);
      conditions += `${op} b."chainId" = $${queryParams.length}`;
    }

    if (requestKey) {
      queryParams.push(requestKey);
      const op = localOperator(queryParams.length);
      conditions += `${op} t."requestkey" = $${queryParams.length}`;
    }

    if (maxHeight) {
      queryParams.push(maxHeight);
      const op = localOperator(queryParams.length);
      conditions += `${op} b."height" <= $${queryParams.length}`;
    }

    if (minHeight) {
      queryParams.push(minHeight);
      const op = localOperator(queryParams.length);
      conditions += `${op} b."height" >= $${queryParams.length}`;
    }

    if (minimumDepth) {
      queryParams.push(minimumDepth);
      const op = localOperator(queryParams.length);
      conditions += `${op} b."minimumDepth" >= $${queryParams.length}`;
    }

    if (fungibleName) {
      queryParams.push(fungibleName);
      const op = localOperator(queryParams.length);
      conditions += `
        ${op} EXISTS
        (
          SELECT 1
          FROM "Events" e
          WHERE e."transactionId" = t.id
          AND e."module" = $${queryParams.length}
        )`;
    }

    const totalCountQuery = `
      SELECT COUNT(*) as count
      FROM "Blocks" b
      JOIN "Transactions" t ON b.id = t."blockId"
      ${conditions}
    `;

    const { rows: countResult } = await rootPgPool.query(
      totalCountQuery,
      queryParams,
    );

    const totalCount = parseInt(countResult[0].count, 10);
    return totalCount;
  }

  async getTransactionsByEventIds(
    eventIds: readonly string[],
  ): Promise<TransactionOutput[]> {
    console.log("Batching for event IDs:", eventIds);

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
      b.height as "height",
      b."hash" as "blockHash",
      b."chainId" as "chainId",
      t.gas as "gas",
      t.step as step,
      t.data as data,
      t.code as code,
      t.logs as "logs",
      t.result as "result",
      t.metadata as "metadata",
      e.id as "eventId",
      t.requestkey as "requestKey"
      FROM "Transactions" t
      JOIN "Blocks" b on t."blockId" = b.id
      JOIN "Events" e on e."transactionId" = t."id"
      WHERE e.id = ANY($1::int[])`,
      [eventIds],
    );

    if (rows.length !== eventIds.length) {
      throw new Error("There was an issue fetching blocks for event IDs.");
    }

    const transactionMap = rows.reduce(
      (acum, row) => ({
        ...acum,
        [row.eventId]: transactionValidator.validate(row),
      }),
      {},
    );

    return eventIds.map(
      (eventId) => transactionMap[eventId],
    ) as TransactionOutput[];
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
      WHERE s."transactionId" = $1
    `;

    if (orderIndex) {
      query += `\nAND s."orderIndex" = $2`;
      queryParams.push(orderIndex);
    }

    const { rows } = await rootPgPool.query(query, queryParams);

    const output = rows.map((row) => signerMetaValidator.validate(row));

    return output;
  }
}
