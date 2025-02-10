package process

import (
	"go-backfill/fetch"
	"go-backfill/repository"
)

func PrepareTransfers(network string, payload fetch.ProcessedPayload, transactionsId []int64) []repository.TransferAttributes {
	transactions := payload.Transactions

	if len(transactions) == 0 {
		return []repository.TransferAttributes{}
	}

	const avgTransfersPerTransaction = 80
	transfers := make([]repository.TransferAttributes, 0, len(transactions)*avgTransfersPerTransaction)

	for index, t := range transactions {
		ChainId := payload.Header.ChainId
		coinTransfers := GetCoinTransfers(t.Events, ChainId, t.ReqKey, transactionsId[index])
		nftTransfers := GetNftTransfers(network, ChainId, t.Events, t.ReqKey, transactionsId[index])
		transfers = append(transfers, coinTransfers...)
		transfers = append(transfers, nftTransfers...)
	}

	return transfers
}
