import { rootPgPool } from '../../config/database';

export async function backfillBalances() {
  await rootPgPool.query(
    `
      BEGIN;
      SET enable_seqscan = OFF;
      WITH combined AS (
          SELECT "chainId", "from_acct" AS "account", "modulename" AS "module"
          FROM "Transfers"
          UNION ALL
          SELECT "chainId", "to_acct" AS "account", "modulename" AS "module"
          FROM "Transfers"
      )
      INSERT INTO "Balances" ("chainId", "account", "module", "createdAt", "updatedAt", "tokenId")
      SELECT "chainId", "account", "module", NOW() AS "createdAt", NOW() AS "updatedAt", '' AS "tokenId"
      FROM combined
      GROUP BY "chainId", "account", "module"
      ON CONFLICT ("chainId", "account", "module", "tokenId") DO NOTHING;
      COMMIT;
    `,
  );

  console.log('Balances backfilled successfully.');
}
