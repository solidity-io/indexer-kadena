import pLimit from 'p-limit';
import { closeDatabase, rootPgPool, sequelize } from '../../config/database';
import { getGuardsFromBalances } from './payload';
import Guard from '../../models/guard';

const CONCURRENCY_LIMIT = 4; // Number of concurrent fetches allowed
const limitFetch = pLimit(CONCURRENCY_LIMIT);

export async function backfillGuards() {
  console.info('[INFO][WORKER][BIZ_FLOW] Starting guards backfill process...');

  const deleteGuardsQuery = `
    DELETE FROM "Guards";
    ALTER SEQUENCE "Guards_id_seq" RESTART WITH 1;
  `;

  await rootPgPool.query(deleteGuardsQuery);

  const limit = 1000; // Number of rows to process in one batch
  let offset = 0;

  while (true) {
    console.info(`[INFO][DB][METRIC] Processing guards batch: ${offset}-${offset + limit}`);
    const res = await rootPgPool.query(
      `SELECT b.id, b.account, b."chainId", b.module FROM "Balances" b ORDER BY b.id LIMIT $1 OFFSET $2`,
      [limit, offset],
    );

    const rows = res.rows;
    if (rows.length === 0) {
      console.info('[INFO][DB][DATA_MISSING] No more balance rows to process. Backfill complete.');
      break;
    }

    // Use p-limit to ensure controlled concurrency for fetch requests
    const fetchPromises = rows.map(row =>
      limitFetch(() =>
        getGuardsFromBalances([
          {
            id: row.id,
            account: row.account,
            chainId: row.chainId,
            module: row.module,
          },
        ]),
      ),
    );
    const guards = (await Promise.all(fetchPromises)).flat();
    const tx = await sequelize.transaction();
    try {
      await Guard.bulkCreate(guards, {
        transaction: tx,
      });

      await tx.commit();
      console.info(`[INFO][DB][BIZ_FLOW] Batch at offset ${offset} processed successfully.`);
      offset += limit;
    } catch (batchError) {
      console.error(
        `[ERROR][DB][DATA_CORRUPT] Failed to process guards batch at offset ${offset}:`,
        batchError,
      );
      try {
        await tx.rollback();
        console.info(`[INFO][DB][BIZ_FLOW] Transaction for batch at offset ${offset} rolled back.`);
      } catch (rollbackError) {
        console.error('[ERROR][DB][SYNC_CONFLICT] Transaction rollback failed:', rollbackError);
      }
      break;
    }
  }
  console.info('[INFO][WORKER][BIZ_FLOW] Guards backfill completed successfully.');
}
