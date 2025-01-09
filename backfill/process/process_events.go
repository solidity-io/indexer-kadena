package process

import (
	"encoding/json"
	"fmt"
	"go-backfill/fetch"
	"go-backfill/repository"
)

func PrepareEvents(network string, payload fetch.ProcessedPayload, transactionsId []int64) ([]repository.EventAttributes, error) {
	transactions := payload.Transactions

	if len(transactions) == 0 {
		return []repository.EventAttributes{}, nil
	}

	const avgEventsPerTransaction = 80
	events := make([]repository.EventAttributes, 0, len(transactions)*avgEventsPerTransaction)

	for txIndex, t := range transactions {

		for eventIndex, event := range t.Events {

			module := buildModuleName(event.Module.Namespace, event.Module.Name)

			qualName := buildModuleName(event.Module.Namespace, event.Module.Name)

			paramsJSON, err := json.Marshal(event.Params)
			if err != nil {
				return []repository.EventAttributes{}, fmt.Errorf("marshaling params for event %s: %w", event.Name, err)
			}

			eventRecord := repository.EventAttributes{
				TransactionId: transactionsId[txIndex],
				ChainId:       payload.Header.ChainId,
				Module:        module,
				Name:          event.Name,
				Params:        paramsJSON,
				QualName:      qualName,
				RequestKey:    t.ReqKey,
				OrderIndex:    eventIndex,
			}
			events = append(events, eventRecord)
		}

	}

	return events, nil
}
