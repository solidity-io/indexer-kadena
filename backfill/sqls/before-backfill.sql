BEGIN;

ALTER TABLE "Guards" DROP CONSTRAINT IF EXISTS "Guards_pkey";
DROP INDEX IF EXISTS "Guards_pkey";
DROP INDEX IF EXISTS guards_publickey_predicate_balanceid_idx;

ALTER TABLE "Balances" DROP CONSTRAINT IF EXISTS "Balances_pkey" CASCADE;
DROP INDEX IF EXISTS "Balances_pkey";
DROP INDEX IF EXISTS balances_account_index;
DROP INDEX IF EXISTS balances_contractid_index;
DROP INDEX IF EXISTS balances_search_idx;
DROP INDEX IF EXISTS balances_tokenid_index;
DROP INDEX IF EXISTS balances_unique_constraint;

ALTER TABLE "Contracts" DROP CONSTRAINT IF EXISTS "Contracts_pkey" CASCADE;
DROP INDEX IF EXISTS "Contracts_pkey";
DROP INDEX IF EXISTS contract_unique_constraint;
DROP INDEX IF EXISTS contracts_search_idx;

ALTER TABLE "Events" DROP CONSTRAINT IF EXISTS "Events_pkey";
DROP INDEX IF EXISTS "Events_pkey";
DROP INDEX IF EXISTS events_module_name_idx;
DROP INDEX IF EXISTS events_transactionid_idx;

ALTER TABLE "Signers" DROP CONSTRAINT IF EXISTS "Signers_pkey";
DROP INDEX IF EXISTS "Signers_pkey";
DROP INDEX IF EXISTS signers_pubkey_idx;
DROP INDEX IF EXISTS signers_pubkey_transactionid_idx;
DROP INDEX IF EXISTS signers_transaction_id_idx;

ALTER TABLE "Transactions" DROP CONSTRAINT IF EXISTS "Transactions_pkey" CASCADE;
DROP INDEX IF EXISTS "Transactions_pkey";
DROP INDEX IF EXISTS "transactions_blockId_idx";
DROP INDEX IF EXISTS transactions_canonical_idx;
DROP INDEX IF EXISTS "transactions_chainId_idx";
DROP INDEX IF EXISTS transactions_chainid_blockid_idx;
DROP INDEX IF EXISTS transactions_hash_idx;
DROP INDEX IF EXISTS transactions_requestkey_idx;
DROP INDEX IF EXISTS transactions_sender_id_idx;
DROP INDEX IF EXISTS transactions_sender_idx;
DROP INDEX IF EXISTS transactions_trgm_hash_idx;
DROP INDEX IF EXISTS transactions_trgm_pactid_idx;
DROP INDEX IF EXISTS transactions_trgm_requestkey_idx;
DROP INDEX IF EXISTS transactions_trgm_sender_idx;
DROP INDEX IF EXISTS transactions_trgm_txid_idx;

ALTER TABLE "Transfers" DROP CONSTRAINT IF EXISTS "Transfers_pkey";
DROP INDEX IF EXISTS "Transfers_pkey";
DROP INDEX IF EXISTS from_acct_idx;
DROP INDEX IF EXISTS to_acct_idx;
DROP INDEX IF EXISTS transfers_chainid_from_acct_modulename_idx;
DROP INDEX IF EXISTS transfers_chainid_to_acct_modulename_idx;
DROP INDEX IF EXISTS transfers_contractid_idx;
DROP INDEX IF EXISTS transfers_from_acct_modulename_idx;
DROP INDEX IF EXISTS "transfers_hasTokenId_idx";
DROP INDEX IF EXISTS transfers_modulename_idx;
DROP INDEX IF EXISTS transfers_transactionid_idx;
DROP INDEX IF EXISTS transfers_type_idx;

ALTER TABLE "Blocks" DROP CONSTRAINT IF EXISTS "Blocks_pkey" CASCADE;
DROP INDEX IF EXISTS "Blocks_pkey";
DROP INDEX IF EXISTS blocks_canonical_idx;
DROP INDEX IF EXISTS blocks_chainid_height_idx;
DROP INDEX IF EXISTS blocks_chainid_idx;
DROP INDEX IF EXISTS "blocks_chainwebVersion_chainid_hash_unique_idx";
DROP INDEX IF EXISTS blocks_hash_idx;
DROP INDEX IF EXISTS blocks_height_id_idx;
DROP INDEX IF EXISTS blocks_height_idx;
DROP INDEX IF EXISTS blocks_trgm_parent_idx;

COMMIT;
