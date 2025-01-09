package repository

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
)

type GuardAttributes struct {
	PublicKey string    `json:"publicKey"`
	ChainID   int       `json:"chainId"`
	Account   string    `json:"account"`
	Predicate string    `json:"predicate"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

func SaveGuardsToDatabase(guards []GuardAttributes, db pgx.Tx) error {
	if len(guards) == 0 {
		return nil
	}

	query := `
		INSERT INTO "Guards" 
		("publicKey", "chainId", "account", "predicate", "createdAt", "updatedAt")
		VALUES ($1, $2, $3, $4, $5, $6)
		ON CONFLICT ("publicKey", "chainId", "account") DO NOTHING
	`

	now := time.Now()
	batch := &pgx.Batch{}

	for _, guard := range guards {
		batch.Queue(
			query,
			guard.PublicKey,
			guard.ChainID,
			guard.Account,
			guard.Predicate,
			now,
			now,
		)
	}

	br := db.SendBatch(context.Background(), batch)
	defer br.Close()

	// Check for errors in each batch execution
	for i := 0; i < len(guards); i++ {
		if _, err := br.Exec(); err != nil {
			return fmt.Errorf("failed to execute batch for guard index %d: %v", i, err)
		}
	}

	return nil
}
