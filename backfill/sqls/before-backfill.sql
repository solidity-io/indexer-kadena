-- Drop indexes from the Balances table
DROP INDEX IF EXISTS "balances_unique_constraint";
DROP INDEX IF EXISTS "balances_account_index";
DROP INDEX IF EXISTS "balances_tokenid_index";
DROP INDEX IF EXISTS "balances_contractid_index";
DROP INDEX IF EXISTS "balances_search_idx";

-- Drop indexes from the Blocks table
DROP INDEX IF EXISTS "blocks_chainwebVersion_chainid_hash_unique_idx";
DROP INDEX IF EXISTS "blocks_height_idx";
DROP INDEX IF EXISTS "blocks_chainid_height_idx";
DROP INDEX IF EXISTS "blocks_chainid_idx";
DROP INDEX IF EXISTS "blocks_canonical_idx";
DROP INDEX IF EXISTS "blocks_trgm_parent_idx";

-- Drop indexes from the Contracts table
DROP INDEX IF EXISTS "contract_unique_constraint";
DROP INDEX IF EXISTS "contracts_search_idx";

-- Drop indexes from the Events table
DROP INDEX IF EXISTS "events_transactionid_idx";

-- Drop indexes from the Guards table
DROP INDEX IF EXISTS "signers_pubkey_transactionid_idx";

-- Drop indexes from the Signers table
DROP INDEX IF EXISTS "signers_pubkey_transactionid_idx";

-- Drop indexes from the Transactions table
DROP INDEX IF EXISTS "transactions_requestkey_idx";
DROP INDEX IF EXISTS "transactions_blockId_idx";
DROP INDEX IF EXISTS "transactions_sender_idx";
DROP INDEX IF EXISTS "transactions_chainId_idx";
DROP INDEX IF EXISTS "transactions_chainid_blockid_idx";
DROP INDEX IF EXISTS "transactions_hash_idx";
DROP INDEX IF EXISTS "transactions_canonical_idx";
DROP INDEX IF EXISTS "transactions_trgm_requestkey_idx";
DROP INDEX IF EXISTS "transactions_trgm_hash_idx";
DROP INDEX IF EXISTS "transactions_trgm_txid_idx";
DROP INDEX IF EXISTS "transactions_trgm_pactid_idx";
DROP INDEX IF EXISTS "transactions_trgm_sender_idx";

-- Drop indexes from the Transfers table
DROP INDEX IF EXISTS "transfers_type_idx";
DROP INDEX IF EXISTS "transfers_transactionid_idx";
DROP INDEX IF EXISTS "transfers_hasTokenId_idx";
DROP INDEX IF EXISTS "transfers_contractid_idx";
DROP INDEX IF EXISTS "transfers_modulename_idx";
DROP INDEX IF EXISTS "transfers_from_acct_modulename_idx";

-- Drop constraints from the Balances table
ALTER TABLE "Balances" DROP CONSTRAINT IF EXISTS "Balances_pkey";

-- Drop constraints from the Blocks table
ALTER TABLE "Blocks" DROP CONSTRAINT IF EXISTS "Blocks_pkey";

-- Drop constraints from the Contracts table
ALTER TABLE "Contracts" DROP CONSTRAINT IF EXISTS "Contracts_pkey";

-- Drop constraints from the Events table
ALTER TABLE "Events" DROP CONSTRAINT IF EXISTS "Events_pkey";

-- Drop constraints from the Guards table
ALTER TABLE "Guards" DROP CONSTRAINT IF EXISTS "Guards_pkey";

-- Drop constraints from the Signers table
ALTER TABLE "Signers" DROP CONSTRAINT IF EXISTS "Signers_pkey";

-- Drop constraints from the Transactions table
ALTER TABLE "Transactions" DROP CONSTRAINT IF EXISTS "Transactions_pkey";

-- Drop constraints from the Transfers table
ALTER TABLE "Transfers" DROP CONSTRAINT IF EXISTS "Transfers_pkey";
