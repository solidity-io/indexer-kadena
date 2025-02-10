package repository

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
)

type SignerAttributes struct {
	TransactionId int64           `json:"transactionId"`
	Address       *string         `json:"address"`
	Clist         json.RawMessage `json:"clist"`
	PubKey        string          `json:"pubKey"`
	OrderIndex    int             `json:"orderIndex"`
	Scheme        *string         `json:"scheme"`
	CreatedAt     time.Time       `json:"createdAt"`
	UpdatedAt     time.Time       `json:"updatedAt"`
}

func SaveSignersToDatabase(signers []SignerAttributes, db pgx.Tx) error {
	if len(signers) == 0 {
		return nil
	}

	query := `
		INSERT INTO "Signers" 
		("transactionId", address, "orderIndex", pubkey, clist, scheme, "createdAt", "updatedAt")
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
	`

	now := time.Now()
	batch := &pgx.Batch{}
	for _, signer := range signers {
		batch.Queue(
			query,
			signer.TransactionId,
			signer.Address,
			signer.OrderIndex,
			signer.PubKey,
			signer.Clist,
			signer.Scheme,
			now,
			now,
		)
	}

	br := db.SendBatch(context.Background(), batch)
	defer br.Close()

	// Check for errors in each batch execution
	for i := 0; i < len(signers); i++ {
		if _, err := br.Exec(); err != nil {
			return fmt.Errorf("failed to execute batch for signer index %d: %v", i, err)
		}
	}

	return nil
}
