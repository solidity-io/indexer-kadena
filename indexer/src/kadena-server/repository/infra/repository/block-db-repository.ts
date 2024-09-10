import { FindOptions, Op, QueryTypes } from "sequelize";
import { rootPgPool, sequelize } from "../../../../config/database";
import BlockModel, { BlockAttributes } from "../../../../models/block";
import BlockRepository, {
  BlockOutput,
  GetBlocksBetweenHeightsParams,
  GetBlocksFromDepthParams,
  GetCompletedBlocksParams,
} from "../../application/block-repository";
import { getPageInfo } from "../../pagination";
import { blockValidator } from "../schema-validator/block-schema-validator";
import Balance from "../../../../models/balance";

export default class BlockDbRepository implements BlockRepository {
  async getBlockByHash(hash: string) {
    const block = await BlockModel.findOne({
      where: { hash },
    });

    if (!block) {
      throw new Error("Block not found.");
    }

    return blockValidator.mapFromSequelize(block);
  }

  async getBlocksFromDepth(params: GetBlocksFromDepthParams) {
    const { minimumDepth, after, before, first, last, chainIds } = params;

    const query: FindOptions<BlockAttributes> = {
      where: {
        height: { [Op.gt]: minimumDepth ?? 0 },
        ...(after && { id: { [Op.gt]: after } }),
        ...(before && { id: { [Op.lt]: before } }),
        ...(!!chainIds?.length && { chainId: { [Op.in]: chainIds } }),
      },
      limit: before ? last : first,
      order: [["id", before ? "DESC" : "ASC"]],
    };

    const rows = await BlockModel.findAll(query);

    const edges = rows.map((row) => ({
      cursor: row.id.toString(),
      node: blockValidator.mapFromSequelize(row),
    }));

    const pageInfo = getPageInfo({ rows: edges, first, last });

    return {
      edges,
      pageInfo,
    };
  }

  async getBlocksBetweenHeights(params: GetBlocksBetweenHeightsParams) {
    const { startHeight, endHeight, after, before, first, chainIds, last } =
      params;

    const query: FindOptions<BlockAttributes> = {
      where: {
        height: { [Op.gte]: startHeight },
        ...(endHeight && { height: { [Op.lte]: endHeight } }),
        ...(after && { id: { [Op.gt]: after } }),
        ...(before && { id: { [Op.lt]: before } }),
        ...(!!chainIds?.length && { chainId: { [Op.in]: chainIds } }),
      },
      limit: before ? last : first,
      order: [["id", before ? "DESC" : "ASC"]],
    };

    const rows = await BlockModel.findAll(query);

    const edges = rows.map((row) => ({
      cursor: row.id.toString(),
      node: blockValidator.mapFromSequelize(row),
    }));

    const pageInfo = getPageInfo({ rows: edges, first, last });

    return {
      edges,
      pageInfo,
    };
  }

  async getMinerData(hash: string) {
    const balanceRows = await sequelize.query(
      `SELECT ba.id,
              ba.account,
              ba.balance,
              ba."chainId",
              ba.module
        FROM "Blocks" b
        JOIN "Balances" ba ON ba.account = b."minerData"->>'account'
        WHERE b.hash = :hash`,
      {
        model: Balance,
        mapToModel: true,
        replacements: { hash },
        type: QueryTypes.SELECT,
      },
    );

    const [balanceRow] = balanceRows;

    if (!balanceRow) {
      throw new Error("Miner didn't exist.");
    }

    return {
      id: balanceRow.id.toString(),
      accountName: balanceRow.account,
      balance: Number(balanceRow.balance),
      chainId: balanceRow.chainId.toString(),
      fungibleName: balanceRow.module,
    };
  }

  async getChainIds() {
    const query = `
      SELECT DISTINCT b."chainId"
      FROM "Blocks" b
    `;
    const { rows } = await rootPgPool.query(query);
    return rows.map((r) => Number(r.chainId));
  }

  async getCompletedBlocks(params: GetCompletedBlocksParams) {
    const {
      first,
      last,
      before,
      after,
      chainIds: chainIdsParam,
      completedHeights,
      heightCount,
    } = params;

    const chainIds = chainIdsParam?.length
      ? chainIdsParam
      : await this.getChainIds();

    if (completedHeights) {
      const query = `
        SELECT height
        FROM "Blocks"
        GROUP BY height
        HAVING COUNT(*) >= $1
        ORDER BY height DESC
        LIMIT $2;
      `;

      const { rows: heightRows } = await rootPgPool.query(query, [
        chainIds.length,
        heightCount,
      ]);

      const totalCompletedHeights = heightRows.map((r) => r.height) as number[];

      if (totalCompletedHeights.length > 0) {
        const queryParams: any[] = [
          before ? last : first,
          chainIds,
          totalCompletedHeights,
          totalCompletedHeights[0],
        ];

        let conditions = "";

        if (after) {
          queryParams.push(after);
          conditions += "\nAND id > $5";
        }

        if (before) {
          queryParams.push(before);
          conditions += "\nAND id < $5";
        }

        let queryOne = `
          SELECT *
          FROM "Blocks"
          WHERE "chainId" = ANY($2)
          AND (height = ANY($3) OR height > $4)
          ${conditions}
          ORDER BY id ${before ? "DESC" : "ASC"}
          LIMIT $1
        `;

        const { rows: blockRows } = await rootPgPool.query(
          queryOne,
          queryParams,
        );

        const edges = blockRows.map((row) => ({
          cursor: row.id.toString(),
          node: blockValidator.validate(row),
        }));
        const pageInfo = getPageInfo({ rows: edges, first, last });

        return {
          edges,
          pageInfo,
        };
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

    const { rows: heightRows } = await rootPgPool.query(queryTwo, [
      heightCount,
    ]);

    const totalCompletedHeights = heightRows.map((r) => r.height) as number[];

    const queryParams: any[] = [
      before ? last : first,
      chainIds,
      totalCompletedHeights,
    ];

    let conditions = "";

    if (after) {
      queryParams.push(after);
      conditions += "\nAND id > $4";
    }

    if (before) {
      queryParams.push(before);
      conditions += "\nAND id < $4";
    }

    let queryThree = `
      SELECT *
      FROM "Blocks"
      WHERE "chainId" = ANY($2)
      AND height = ANY($3)
      ${conditions}
      ORDER BY id ${before ? "DESC" : "ASC"}
      LIMIT $1
    `;

    const { rows: blockRows } = await rootPgPool.query(queryThree, queryParams);

    const edges = blockRows.map((row) => ({
      cursor: row.id.toString(),
      node: blockValidator.validate(row),
    }));
    const pageInfo = getPageInfo({ rows: edges, first, last });

    return {
      edges,
      pageInfo,
    };
  }

  async getBlocksByEventIds(eventIds: readonly string[]) {
    console.log("Batching for event IDs:", eventIds);

    const { rows: blockRows } = await rootPgPool.query(
      `SELECT b.*, e.id as "eventId"
        FROM "Events" e
        JOIN "Transactions" t ON t.id = e."transactionId"
        JOIN "Blocks" b ON b.id = t."blockId"
        WHERE e.id = ANY($1::int[])`,
      [eventIds],
    );

    if (blockRows.length !== eventIds.length) {
      throw new Error("There was an issue fetching blocks for event IDs.");
    }

    const blockMap = blockRows.reduce(
      (acum, row) => ({
        ...acum,
        [row.eventId]: blockValidator.validate(row),
      }),
      {},
    );

    return eventIds.map((eventId) => blockMap[eventId]) as BlockOutput[];
  }

  async getBlocksByTransactionIds(transactionIds: string[]) {
    console.log("Batching for transactionIds IDs:", transactionIds);

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
      throw new Error(
        "There was an issue fetching blocks for transaction IDs.",
      );
    }

    const blockMap = blockRows.reduce(
      (acum, row) => ({
        ...acum,
        [row.transactionId]: blockValidator.validate(row),
      }),
      {},
    );

    return transactionIds.map((id) => blockMap[id]) as BlockOutput[];
  }

  async getBlockByHashes(hashes: string[]): Promise<BlockOutput[]> {
    console.log("Batching for hashes:", hashes);

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
      throw new Error(
        "There was an issue fetching blocks for transaction IDs.",
      );
    }

    const blockMap = blockRows.reduce(
      (acum, row) => ({
        ...acum,
        [row.hash]: blockValidator.validate(row),
      }),
      {},
    );

    return hashes.map((hash) => blockMap[hash]) as BlockOutput[];
  }

  async getLowestBlockHeight(): Promise<number> {
    const block = await BlockModel.findOne({
      order: [["height", "ASC"]],
      attributes: ["height"],
    });

    return block?.height || 0;
  }

  async getLastBlockHeight(): Promise<number> {
    const block = await BlockModel.findOne({
      order: [["height", "DESC"]],
      attributes: ["height"],
    });

    return block?.height || 0;
  }

  async getTotalCountOfBlockEvents(blockHash: string): Promise<number> {
    const block = await BlockModel.findOne({
      where: { hash: blockHash },
      attributes: ["transactionsCount"],
    });

    return block?.transactionsCount || 0;
  }
}
