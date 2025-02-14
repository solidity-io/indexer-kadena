import { FindOptions, Op, QueryTypes } from 'sequelize';
import { rootPgPool, sequelize } from '../../../../config/database';
import BlockModel, { BlockAttributes } from '../../../../models/block';
import BlockRepository, {
  BlockOutput,
  GetBlocksBetweenHeightsParams,
  GetBlocksFromDepthParams,
  GetCompletedBlocksParams,
  GetLatestBlocksParams,
} from '../../application/block-repository';
import { getPageInfo, getPaginationParams } from '../../pagination';
import { blockValidator } from '../schema-validator/block-schema-validator';
import Balance from '../../../../models/balance';
import { handleSingleQuery } from '../../../utils/raw-query';
import { formatGuard_NODE } from '../../../../utils/chainweb-node';
import { MEMORY_CACHE } from '../../../../cache/init';
import { NODE_INFO_KEY } from '../../../../cache/keys';
import { GetNodeInfo } from '../../application/network-repository';
import { TransactionOutput } from '../../application/transaction-repository';

export default class BlockDbRepository implements BlockRepository {
  async getBlockByHash(hash: string) {
    const block = await BlockModel.findOne({
      where: { hash },
    });

    if (!block) {
      throw new Error('Block not found.');
    }

    return blockValidator.mapFromSequelize(block);
  }

  async getBlocksFromDepth(params: GetBlocksFromDepthParams) {
    const {
      minimumDepth,
      after: afterEncoded,
      before: beforeEncoded,
      first,
      last,
      chainIds,
    } = params;

    const { limit, order, after, before } = getPaginationParams({
      after: afterEncoded,
      before: beforeEncoded,
      first,
      last,
    });

    const query: FindOptions<BlockAttributes> = {
      where: {
        height: { [Op.gt]: minimumDepth ?? 0 },
        ...(after && { id: { [Op.lt]: after } }),
        ...(before && { id: { [Op.gt]: before } }),
        ...(!!chainIds?.length && { chainId: { [Op.in]: chainIds } }),
      },
      limit,
      order: [['id', order]],
    };

    const rows = await BlockModel.findAll(query);

    const edges = rows.map(row => ({
      cursor: row.id.toString(),
      node: blockValidator.mapFromSequelize(row),
    }));

    const pageInfo = getPageInfo({ edges, order, limit, after, before });
    return pageInfo;
  }

  async getBlocksBetweenHeights(params: GetBlocksBetweenHeightsParams) {
    const {
      startHeight,
      endHeight,
      after: afterEncoded,
      before: beforeEncoded,
      first,
      chainIds,
      last,
    } = params;

    const { limit, order, after, before } = getPaginationParams({
      after: afterEncoded,
      before: beforeEncoded,
      first,
      last,
    });

    const queryParams: (string | number | string[])[] = [limit, startHeight];
    let conditions = '';

    if (before) {
      queryParams.push(before);
      conditions += `\nAND b.id > $${queryParams.length}`;
    }

    if (after) {
      queryParams.push(after);
      conditions += `\nAND b.id < $${queryParams.length}`;
    }

    if (chainIds?.length) {
      queryParams.push(chainIds);
      conditions += `\nAND b."chainId" = $${queryParams.length}`;
    }

    if (endHeight) {
      queryParams.push(endHeight);
      conditions += `\nAND b."height" <= $${queryParams.length}`;
    }

    const query = `
      SELECT b.id,
        b.hash,
        b."chainId",
        b."creationTime",
        b."epochStart",
        b."featureFlags",
        b.height as "height",
        b.nonce as "nonce",
        b."payloadHash" as "payloadHash",
        b.weight as "weight",
        b.target as "target",
        b.adjacents as "adjacents",
        b.parent as "parent"
      FROM "Blocks" b
      WHERE b.height >= $2
      ${conditions}
      ORDER BY b.id ${order}
      LIMIT $1;
    `;

    const { rows: blockRows } = await rootPgPool.query(query, queryParams);

    const edges = blockRows.map(row => ({
      cursor: row.id.toString(),
      node: blockValidator.validate(row),
    }));

    const pageInfo = getPageInfo({ edges, order, limit, after, before });
    return pageInfo;
  }

  async getMinerData(hash: string, chainId: string) {
    const balanceRows = await sequelize.query(
      `SELECT ba.id,
              ba.account,
              ba.balance,
              ba."chainId",
              ba.module
        FROM "Blocks" b
        JOIN "Balances" ba ON ba.account = b."minerData"->>'account'
        WHERE b.hash = :hash
        AND ba."chainId" = :chainId`,
      {
        model: Balance,
        mapToModel: true,
        replacements: { hash, chainId },
        type: QueryTypes.SELECT,
      },
    );

    const [balanceRow] = balanceRows;

    if (!balanceRow) {
      throw new Error("Miner didn't exist.");
    }

    const res = await handleSingleQuery({
      chainId: chainId.toString(),
      code: `(${balanceRow.module}.details \"${balanceRow.account}\")`,
    });

    return {
      id: balanceRow.id.toString(),
      accountName: balanceRow.account,
      balance: Number(balanceRow.balance),
      chainId: balanceRow.chainId.toString(),
      fungibleName: balanceRow.module,
      guard: formatGuard_NODE(res),
    };
  }

  async getChainIds() {
    const nodeInfo = MEMORY_CACHE.get(NODE_INFO_KEY) as GetNodeInfo;
    return nodeInfo.nodeChains.map(chainId => Number(chainId));
  }

  async getCompletedBlocks(params: GetCompletedBlocksParams) {
    const {
      first,
      last,
      before: beforeEncoded,
      after: afterEncoded,
      chainIds: chainIdsParam,
      completedHeights,
      heightCount,
    } = params;

    const { limit, order, after, before } = getPaginationParams({
      after: afterEncoded,
      before: beforeEncoded,
      first,
      last,
    });

    const chainIds = chainIdsParam?.length ? chainIdsParam : await this.getChainIds();

    if (completedHeights) {
      const query = `
        SELECT height
        FROM "Blocks"
        GROUP BY height
        HAVING COUNT(*) >= $1
        ORDER BY height DESC
        LIMIT $2;
      `;

      const { rows: heightRows } = await rootPgPool.query(query, [chainIds.length, heightCount]);

      const totalCompletedHeights = heightRows.map(r => r.height) as number[];

      if (totalCompletedHeights.length > 0) {
        const queryParams: any[] = [
          limit,
          chainIds,
          totalCompletedHeights,
          totalCompletedHeights[0],
        ];

        let conditions = '';

        if (after) {
          queryParams.push(after);
          conditions += '\nAND id < $5';
        }

        if (before) {
          queryParams.push(before);
          conditions += '\nAND id > $5';
        }

        let queryOne = `
          SELECT *
          FROM "Blocks"
          WHERE "chainId" = ANY($2)
          AND (height = ANY($3) OR height > $4)
          ${conditions}
          ORDER BY id ${order}
          LIMIT $1
        `;

        const { rows: blockRows } = await rootPgPool.query(queryOne, queryParams);

        const edges = blockRows.map(row => ({
          cursor: row.id.toString(),
          node: blockValidator.validate(row),
        }));

        const pageInfo = getPageInfo({ edges, order, limit, after, before });
        return pageInfo;
      }
    }

    const queryTwo = `
      SELECT height, COUNT(*)
      FROM "Blocks"
      GROUP BY height
      HAVING COUNT(*) > 1
      ORDER BY height DESC
      LIMIT $1
    `;

    const { rows: heightRows } = await rootPgPool.query(queryTwo, [heightCount]);

    const totalCompletedHeights = heightRows.map(r => r.height) as number[];

    const queryParams: any[] = [limit, chainIds, totalCompletedHeights];

    let conditions = '';

    if (after) {
      queryParams.push(after);
      conditions += '\nAND id < $4';
    }

    if (before) {
      queryParams.push(before);
      conditions += '\nAND id > $4';
    }

    let queryThree = `
      SELECT *
      FROM "Blocks"
      WHERE "chainId" = ANY($2)
      AND height = ANY($3)
      ${conditions}
      ORDER BY id ${order}
      LIMIT $1
    `;

    const { rows: blockRows } = await rootPgPool.query(queryThree, queryParams);

    const edges = blockRows.map(row => ({
      cursor: row.id.toString(),
      node: blockValidator.validate(row),
    }));

    const pageInfo = getPageInfo({ edges, order, limit, after, before });
    return pageInfo;
  }

  async getBlocksByEventIds(eventIds: readonly string[]) {
    console.log('Batching for event IDs:', eventIds);

    const { rows: blockRows } = await rootPgPool.query(
      `SELECT b.*, e.id as "eventId"
        FROM "Events" e
        JOIN "Transactions" t ON t.id = e."transactionId"
        JOIN "Blocks" b ON b.id = t."blockId"
        WHERE e.id = ANY($1::int[])`,
      [eventIds],
    );

    if (blockRows.length !== eventIds.length) {
      throw new Error('There was an issue fetching blocks for event IDs.');
    }

    const blockMap = blockRows.reduce(
      (acum, row) => ({
        ...acum,
        [row.eventId]: blockValidator.validate(row),
      }),
      {},
    );

    return eventIds.map(eventId => blockMap[eventId]) as BlockOutput[];
  }

  async getBlocksByTransactionIds(transactionIds: string[]) {
    console.log('Batching for transactionIds IDs:', transactionIds);

    const { rows: blockRows } = await rootPgPool.query(
      `SELECT b.id,
        b.hash,
        b."chainId",
        b."creationTime",
        b."epochStart",
        b."featureFlags",
        b.height as "height",
        b.nonce as "nonce",
        b."payloadHash" as "payloadHash",
        b.weight as "weight",
        b.target as "target",
        b.adjacents as "adjacents",
        b.parent as "parent",
        t.id as "transactionId"
        FROM "Blocks" b
        JOIN "Transactions" t ON b.id = t."blockId"
        WHERE t.id = ANY($1::int[])`,
      [transactionIds],
    );

    if (blockRows.length !== transactionIds.length) {
      throw new Error('There was an issue fetching blocks for transaction IDs.');
    }

    const blockMap = blockRows.reduce(
      (acum, row) => ({
        ...acum,
        [row.transactionId]: blockValidator.validate(row),
      }),
      {},
    );

    return transactionIds.map(id => blockMap[id]) as BlockOutput[];
  }

  async getBlockByHashes(hashes: string[]): Promise<BlockOutput[]> {
    console.log('Batching for hashes:', hashes);

    const { rows: blockRows } = await rootPgPool.query(
      `SELECT b.id,
        b.hash,
        b."chainId",
        b."creationTime",
        b."epochStart",
        b."featureFlags",
        b.height as "height",
        b.nonce as "nonce",
        b."payloadHash" as "payloadHash",
        b.weight as "weight",
        b.target as "target",
        b.adjacents as "adjacents",
        b.parent as "parent"
        FROM "Blocks" b
        WHERE b.hash = ANY($1::text[])`,
      [hashes],
    );

    if (blockRows.length !== hashes.length) {
      throw new Error('There was an issue fetching blocks for transaction IDs.');
    }

    const blockMap = blockRows.reduce(
      (acum, row) => ({
        ...acum,
        [row.hash]: blockValidator.validate(row),
      }),
      {},
    );

    return hashes.map(hash => blockMap[hash]) as BlockOutput[];
  }

  async getLowestBlockHeight(): Promise<number> {
    const block = await BlockModel.findOne({
      order: [['height', 'ASC']],
      attributes: ['height'],
    });

    return block?.height || 0;
  }

  async getLastBlockHeight(): Promise<number> {
    const block = await BlockModel.findOne({
      order: [['height', 'DESC']],
      attributes: ['height'],
    });

    return block?.height || 0;
  }

  async getTotalCountOfBlockEvents(blockHash: string): Promise<number> {
    const block = await BlockModel.findOne({
      where: { hash: blockHash },
      attributes: ['transactionsCount'],
    });

    return block?.transactionsCount || 0;
  }

  async getLatestBlocks(params: GetLatestBlocksParams): Promise<BlockOutput[]> {
    const { creationTime, lastBlockId, chainIds = [] } = params;
    const blocks = await BlockModel.findAll({
      where: {
        ...(lastBlockId && { id: { [Op.gt]: lastBlockId } }),
        creationTime: { [Op.gt]: creationTime },
        ...(chainIds.length && { chainId: { [Op.in]: chainIds } }),
      },
      limit: 100,
      order: [['id', 'DESC']],
    });

    const output = blocks.map(b => blockValidator.mapFromSequelize(b));
    return output;
  }

  async getTransactionsOrderedByBlockDepth(
    transactions: TransactionOutput[],
  ): Promise<TransactionOutput[]> {
    const query = `
      WITH RECURSIVE BlockDescendants AS (
        SELECT hash, parent, hash AS root_hash, 0 AS depth, height, "chainId"
        FROM "Blocks"
        WHERE hash = ANY($1::text[])
        UNION ALL
        SELECT b.hash, b.parent, d.root_hash, d.depth + 1 AS depth, b.height, b."chainId"
        FROM BlockDescendants d
        JOIN "Blocks" b ON d.hash = b.parent
          AND b.height = d.height + 1
          AND b."chainId" = d."chainId"
        WHERE d.depth <= 6
      )
      SELECT root_hash, MAX(depth) AS depth
      FROM BlockDescendants
      GROUP BY root_hash;
    `;

    const { rows } = await rootPgPool.query(query, [transactions.map(t => t.blockHash)]);

    rows.sort((a, b) => b.depth - a.depth);

    const output = rows.map(r => transactions.find(t => t.blockHash === r.root_hash)) as any;

    return output;
  }
}
