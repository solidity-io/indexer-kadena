package process

import (
	"encoding/json"
	"fmt"
	"go-backfill/fetch"
	"go-backfill/repository"
)

type Signer struct {
	PubKey  string          `json:"pubKey"`
	Clist   json.RawMessage `json:"clist"`
	Address *string         `json:"address"`
	Scheme  *string         `json:"scheme"`
}

type Cmd struct {
	Signers []Signer `json:"signers"`
}

func PrepareSigners(network string, payload fetch.ProcessedPayload, transactionsId []int64) []repository.SignerAttributes {
	transactions := payload.Transactions

	if len(transactions) == 0 {
		return []repository.SignerAttributes{}
	}

	const avgSignersPerTransaction = 80
	signers := make([]repository.SignerAttributes, 0, len(transactions)*avgSignersPerTransaction)

	for txIndex, transaction := range transactions {
		if txIndex >= len(transactionsId) {
			fmt.Printf("Warning: No transactionId for transaction index %d\n", txIndex)
			break
		}

		transactionId := transactionsId[txIndex]

		var cmd Cmd

		// First, unmarshal to get the JSON-encoded string
		var cmdRaw string
		err := json.Unmarshal(transaction.Cmd, &cmdRaw)
		if err != nil {
			fmt.Printf("Failed to unmarshal Cmd as string for transaction index %d: %v\n", txIndex, err)
			continue
		}

		// Second, unmarshal the JSON string into the Cmd struct
		err = json.Unmarshal([]byte(cmdRaw), &cmd)
		if err != nil {
			fmt.Printf("Failed to unmarshal Cmd for transaction index %d: %v\n", txIndex, err)
			continue
		}

		for signerIndex, signer := range cmd.Signers {
			signers = append(signers, repository.SignerAttributes{
				PubKey:        signer.PubKey,
				Clist:         signer.Clist,
				OrderIndex:    signerIndex,
				Scheme:        signer.Scheme,
				TransactionId: transactionId,
			})
		}
	}

	return signers
}
