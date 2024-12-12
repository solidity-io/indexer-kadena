import { rootPgPool } from "../../../../config/database";
import BalanceModel from "../../../../models/balance";
import BalanceRepository, {
  FungibleAccountOutput,
  FungibleChainAccountOutput,
  INonFungibleAccount,
  INonFungibleChainAccount,
  INonFungibleTokenBalance,
} from "../../application/balance-repository";
import {
  getNonFungibleAccountBase64ID,
  getNonFungibleChainAccountBase64ID,
} from "../base64-id-generators";
import { fungibleAccountValidator } from "../schema-validator/fungible-account-validator";
import { fungibleChainAccountValidator } from "../schema-validator/fungible-chain-account-validator";
import { nonFungibleTokenBalanceValidator } from "../schema-validator/non-fungible-token-balance-validator";

export default class BalanceDbRepository implements BalanceRepository {
  async getAccountInfo(accountName: string, fungibleName?: string) {
    const account = await BalanceModel.findOne({
      where: {
        account: accountName,
        ...(fungibleName && { module: fungibleName }),
      },
    });

    const totalBalanceQuery = `
      select b.account, sum(balance) as "totalBalance"
      from "Balances" b
      where b.account = $1
      and b.module = $2
      group by b.account
    `;

    const { rows } = await rootPgPool.query(totalBalanceQuery, [
      accountName,
      fungibleName,
    ]);

    if (!account || !rows?.length) {
      throw new Error("Account not found.");
    }

    const accountInfo = fungibleAccountValidator.mapFromSequelize(account);
    const totalBalance = fungibleAccountValidator.validateTotalBalance(rows[0]);
    return { ...accountInfo, totalBalance };
  }

  async getChainsAccountInfo(
    accountName: string,
    fungibleName: string,
    chainIds?: string[],
  ): Promise<FungibleChainAccountOutput[]> {
    let query = `
      SELECT b.id, b."chainId", b.balance, b.module, b.account as "accountName"
      FROM "Balances" b
      WHERE b.account = $1
      AND b.module = $2
    `;

    const queryParams: any[] = [accountName, fungibleName];

    if (chainIds?.length) {
      queryParams.push(chainIds);
      query += ` AND b."chainId" = ANY($3::int[])`;
    }

    const { rows } = await rootPgPool.query(query, queryParams);

    const output = rows.map((r) => fungibleChainAccountValidator.validate(r));
    return output;
  }

  async getAccountsByPublicKey(
    publicKey: string,
    fungibleName: string,
  ): Promise<FungibleAccountOutput[]> {
    const publicKeyQuery = `
      SELECT p.id, p."chainId", p.account, p.module
      FROM "Guards" p
      WHERE p."publicKey" = $1
      AND p.module = $2
    `;

    const queryParams = [publicKey, fungibleName];
    const { rows } = await rootPgPool.query(publicKeyQuery, queryParams);

    const totalBalanceQuery = `
      select b.account, sum(balance) as "totalBalance"
      from "Balances" b
      WHERE b.account = ANY($1::text[])
      AND b.module = $2
      group by b.account
    `;

    const { rows: totalBalanceRows } = await rootPgPool.query(
      totalBalanceQuery,
      [rows.map((a) => a.account), fungibleName],
    );

    const balanceMapping = totalBalanceRows.reduce(
      (acum, cur) => ({
        ...acum,
        [cur.account]: cur.totalBalance,
      }),
      {},
    );
    const output = rows.map((r) => {
      return {
        ...fungibleAccountValidator.validate(r),
        totalBalance: balanceMapping[r.account],
      };
    });

    return output;
  }

  async getChainAccountsByPublicKey(
    publicKey: string,
    fungibleName: string,
    chainId: string,
  ): Promise<FungibleChainAccountOutput[]> {
    const publicKeyQuery = `
      SELECT p.id, p."chainId", p.account, p.module
      FROM "Guards" p
      WHERE p."publicKey" = $1
      AND p.module = $2
      AND p."chainId" = $3
    `;

    const queryParams = [publicKey, fungibleName, chainId];
    const { rows } = await rootPgPool.query(publicKeyQuery, queryParams);

    if (rows.length === 0) return [];

    const balanceQueryParams: any = [];
    const placeholders = rows
      .map((r) => ({
        chainId: r.chainId,
        module: r.module,
        account: r.account,
      }))
      .map((filter, index) => {
        balanceQueryParams.push(filter.chainId, filter.module, filter.account);
        const startIndex = index * 3 + 1;
        return `($${startIndex}, $${startIndex + 1}, $${startIndex + 2})`;
      })
      .join(", ");

    const balanceQuery = `
        SELECT
          b.id,
          b."chainId",
          b.module,
          b.account as "accountName",
          b.balance
        FROM "Balances" b
        WHERE (b."chainId", b.module, b.account) IN (${placeholders})
    `;

    const { rows: accountRows } = await rootPgPool.query(
      balanceQuery,
      balanceQueryParams,
    );

    const output = accountRows.map((r) =>
      fungibleChainAccountValidator.validate(r),
    );
    return output;
  }

  async getNonFungibleAccountInfo(
    accountName: string,
  ): Promise<INonFungibleAccount | null> {
    const queryParams = [accountName];
    let query = `
      SELECT b.id, b."chainId", b.balance, b."tokenId", b.account
      FROM "Balances" b
      WHERE b.account = $1
      AND "hasTokenId" = true
    `;

    const { rows } = await rootPgPool.query(query, queryParams);

    if (rows.length === 0) return null;

    const nonFungibleTokenBalances = rows.map((row) => {
      return nonFungibleTokenBalanceValidator.validate(row);
    });

    return {
      id: getNonFungibleAccountBase64ID(accountName),
      accountName,
      nonFungibleTokenBalances,
    };
  }

  async getNonFungibleChainAccountInfo(
    accountName: string,
    chainId: string,
  ): Promise<INonFungibleChainAccount | null> {
    const queryParams = [accountName, chainId];
    const query = `
      SELECT b.id, b."chainId", b.balance, b."tokenId", b.account
      FROM "Balances" b
      WHERE b.account = $1
      AND "hasTokenId" = true
      AND b."chainId" = $2
    `;

    const { rows } = await rootPgPool.query(query, queryParams);

    if (rows.length === 0) return null;

    const nonFungibleTokenBalances = rows.map((row) => {
      return nonFungibleTokenBalanceValidator.validate(row);
    });

    return {
      id: getNonFungibleChainAccountBase64ID(chainId, accountName),
      accountName,
      chainId,
      nonFungibleTokenBalances,
    };
  }

  async getNonFungibleTokenBalance(
    accountName: string,
    chainId: string,
    tokenId: string,
  ): Promise<INonFungibleTokenBalance | null> {
    const queryParams = [accountName, tokenId, chainId];
    let query = `
      SELECT b.id, b."chainId", b.balance, b."tokenId", b.account
      FROM "Balances" b
      WHERE b.account = $1
      AND b."tokenId" = $2
      AND "chainId" = $3
      AND "hasTokenId" = true
    `;

    const { rows } = await rootPgPool.query(query, queryParams);

    if (rows.length === 0) return null;

    const output = nonFungibleTokenBalanceValidator.validate(rows[0]);

    return output;
  }
}
