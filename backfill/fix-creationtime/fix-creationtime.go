package main

import (
	"context"
	"flag"
	"fmt"
	"go-backfill/config"
	"log"
	"time"

	"github.com/jackc/pgx/v5"
)

const (
	batchSize = 1000
	lastId    = 105126770
)

func fixBatchCreationTime(conn *pgx.Conn, lastId int64) (bool, int64, error) {
	startTime := time.Now()

	// Start transaction for writes
	tx, err := conn.Begin(context.Background())
	if err != nil {
		return false, lastId, fmt.Errorf("failed to begin transaction: %v", err)
	}
	defer tx.Rollback(context.Background())

	// Update creation time for coinbase transactions in batch
	updateQuery := `
		WITH OrderedUpdates AS (
			SELECT id
			FROM "Transactions"
			WHERE id > $1 AND sender = 'coinbase'
			ORDER BY id ASC
			LIMIT $2
		)
		UPDATE "Transactions"
		SET creationtime = (CAST(creationtime AS BIGINT) / 1000000)::TEXT
		FROM OrderedUpdates
		WHERE "Transactions".id = OrderedUpdates.id
		RETURNING "Transactions".id, "Transactions".creationtime
	`

	rows, err := tx.Query(context.Background(), updateQuery, lastId, batchSize)
	if err != nil {
		return false, lastId, fmt.Errorf("failed to execute update: %v", err)
	}
	defer rows.Close()

	var updatedCount int
	var lastProcessedId int64
	var lastCreationTime string
	for rows.Next() {
		if err := rows.Scan(&lastProcessedId, &lastCreationTime); err != nil {
			return false, lastId, fmt.Errorf("failed to scan row: %v", err)
		}
		updatedCount++

	}

	if err := tx.Commit(context.Background()); err != nil {
		return false, lastId, fmt.Errorf("failed to commit transaction: %v", err)
	}

	elapsed := time.Since(startTime)
	log.Printf("Fixed creation time for %d coinbase transactions. Batch time: %.2fs", updatedCount, elapsed.Seconds())

	return updatedCount == batchSize, lastProcessedId, nil
}

func main() {
	envFile := flag.String("env", ".env", "Path to the .env file")
	flag.Parse()

	config.InitEnv(*envFile)
	env := config.GetConfig()

	// Database connection
	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		env.DbHost, env.DbPort, env.DbUser, env.DbPassword, env.DbName)

	conn, err := pgx.Connect(context.Background(), connStr)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer conn.Close(context.Background())

	log.Println("Connected to database")

	lastId := int64(0)
	hasMore := true
	processedTransactions := int64(0)

	for hasMore {
		var err error
		hasMore, lastId, err = fixBatchCreationTime(conn, lastId)
		if err != nil {
			log.Fatalf("Error during batch processing: %v", err)
		}
		processedTransactions += batchSize
		progress := float64(processedTransactions) / float64(105126770) * 100

		if hasMore {
			log.Printf("Progress: %.2f%% (%d/%d transactions processed)", progress, processedTransactions, lastId)
		} else {
			log.Printf("Progress: 100.00%%")
		}

		time.Sleep(100 * time.Millisecond)
	}

	log.Println("Creation time fix completed successfully")
}
