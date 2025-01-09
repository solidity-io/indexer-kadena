package main

import (
	"database/sql"
	"flag"
	"fmt"
	"go-backfill/config"
	"log"
	"time"

	_ "github.com/lib/pq" // PostgreSQL driver
)

func main() {
	envFile := flag.String("env", ".env", "Path to the .env file")
	flag.Parse()
	config.InitEnv(*envFile)
	env := config.GetConfig()
	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		env.DbHost, env.DbPort, env.DbUser, env.DbPassword, env.DbName)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	log.Println("Connected to database")

	// SQL commands grouped by table
	commands := []struct {
		description string
		query       string
	}{
		// // CREATE INDEX commands for Balances
		// {"Create unique index on Balances", `CREATE UNIQUE INDEX "balances_unique_constraint" ON "Balances" (network, "chainId", account, qualname, "tokenId");`},
		// {"Create account index on Balances", `CREATE INDEX "balances_account_index" ON "Balances" (account);`},
		// {"Create tokenId index on Balances", `CREATE INDEX "balances_tokenid_index" ON "Balances" ("tokenId");`},
		// {"Create contractId index on Balances", `CREATE INDEX "balances_contractid_index" ON "Balances" ("contractId");`},
		// {"Create search index on Balances", `CREATE INDEX "balances_search_idx" ON "Balances" (LOWER(account));`},

		// // CREATE INDEX commands for Blocks
		// {"Create height index on Blocks", `CREATE INDEX "blocks_height_idx" ON "Blocks" (height);`},
		// {"Create chainId height index on Blocks", `CREATE INDEX "blocks_chainid_height_idx" ON "Blocks" ("chainId", height);`},
		// {"Create chainId index on Blocks", `CREATE INDEX "blocks_chainid_idx" ON "Blocks" ("chainId");`},
		// {"Create canonical index on Blocks", `CREATE INDEX "blocks_canonical_idx" ON "Blocks" (canonical);`},
		// {"Create GIN trgm parent index on Blocks", `CREATE INDEX "blocks_trgm_parent_idx" ON "Blocks" USING gin (LOWER(parent) gin_trgm_ops);`},

		// // CREATE INDEX commands for Contracts
		// {"Create unique index on Contracts", `CREATE UNIQUE INDEX "contract_unique_constraint" ON "Contracts" (network, "chainId", module, "tokenId");`},
		// {"Create search index on Contracts", `CREATE INDEX "contracts_search_idx" ON "Contracts" (LOWER(module));`},

		// // CREATE INDEX commands for Events
		// {"Create transactionId index on Events", `CREATE INDEX "events_transactionid_idx" ON "Events" ("transactionId");`},

		// CREATE INDEX commands for Signers
		{"Create publicKey transactionId index on Signers", `CREATE INDEX "signers_pubkey_transactionid_idx" ON "Signers" (pubkey, "transactionId");`},

		// CREATE INDEX commands for Transactions
		{"Create requestkey index on Transactions", `CREATE INDEX "transactions_requestkey_idx" ON "Transactions" (requestkey);`},
		{"Create sender index on Transactions", `CREATE INDEX "transactions_sender_idx" ON "Transactions" (sender);`},
		{"Create chainId blockId index on Transactions", `CREATE INDEX "transactions_chainid_blockid_idx" ON "Transactions" ("chainId", "blockId");`},
		{"Create hash index on Transactions", `CREATE INDEX "transactions_hash_idx" ON "Transactions" (hash);`},
		{"Create canonical index on Transactions", `CREATE INDEX "transactions_canonical_idx" ON "Transactions" (canonical);`},
		{"Create GIN trgm requestkey index on Transactions", `CREATE INDEX "transactions_trgm_requestkey_idx" ON "Transactions" USING gin (LOWER(requestkey) gin_trgm_ops);`},
		{"Create GIN trgm hash index on Transactions", `CREATE INDEX "transactions_trgm_hash_idx" ON "Transactions" USING gin (LOWER(hash) gin_trgm_ops);`},
		{"Create GIN trgm txid index on Transactions", `CREATE INDEX "transactions_trgm_txid_idx" ON "Transactions" USING gin (LOWER(txid) gin_trgm_ops);`},
		{"Create GIN trgm pactid index on Transactions", `CREATE INDEX "transactions_trgm_pactid_idx" ON "Transactions" USING gin (LOWER(pactid) gin_trgm_ops);`},
		{"Create GIN trgm sender index on Transactions", `CREATE INDEX "transactions_trgm_sender_idx" ON "Transactions" USING gin (LOWER(sender) gin_trgm_ops);`},

		// CREATE INDEX commands for Transfers
		{"Create contractId index on Transfers", `CREATE INDEX "transfers_contractid_idx" ON "Transfers" ("contractId");`},
		{"Create type index on Transfers", `CREATE INDEX "transfers_type_idx" ON "Transfers" (type);`},
		{"Create transactionId index on Transfers", `CREATE INDEX "transfers_transactionid_idx" ON "Transfers" ("transactionId");`},
		{"Create modulename index on Transfers", `CREATE INDEX "transfers_modulename_idx" ON "Transfers" (modulename);`},
		{"Create from_acct modulename index on Transfers", `CREATE INDEX "transfers_from_acct_modulename_idx" ON "Transfers" (from_acct, modulename);`},
	}

	for i, cmd := range commands {
		log.Printf("Executing (%d/%d): %s", i+1, len(commands), cmd.description)

		start := time.Now()
		_, err := db.Exec(cmd.query)
		elapsed := time.Since(start)

		if err != nil {
			log.Printf("Error executing (%d): %s - %v", i+1, cmd.description, err)
			break // Optionally exit on error or log and continue
		} else {
			log.Printf("Successfully executed (%d): %s in %v", i+1, cmd.description, elapsed)
		}
	}

	log.Println("All commands executed")
}
