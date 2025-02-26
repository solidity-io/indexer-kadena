package process

import (
	"encoding/json"
	"fmt"
	"go-backfill/fetch"
	"go-backfill/repository"
	"strconv"
)

type Coinbase struct {
	ReqKey string          `json:"reqKey"`
	TxID   int             `json:"txId"`
	Events []fetch.Event   `json:"events"`
	Result json.RawMessage `json:"result"`
	Logs   string          `json:"logs"`
}

func decodeCoinbase(jsonStr string) (*Coinbase, error) {
	var coinbase Coinbase
	err := json.Unmarshal([]byte(jsonStr), &coinbase)
	if err != nil {
		return nil, err
	}
	return &coinbase, nil
}

func processCoinbaseTransaction(coinbase string, blockId int64, creationTime int64, chainId int64) (repository.TransactionAttributes, error) {

	coinbaseDecoded, err := decodeCoinbase(coinbase)
	if err != nil {
		return repository.TransactionAttributes{}, fmt.Errorf("decoding Coinbase JSON of block %d: %w", blockId, err)
	}

	emptyJSON, _ := json.Marshal(map[string]interface{}{})
	emptyArray, _ := json.Marshal([]interface{}{})

	txAttribute := repository.TransactionAttributes{
		BlockId:      blockId,
		Code:         emptyJSON,
		Data:         emptyJSON,
		ChainId:      int(chainId),
		CreationTime: strconv.FormatInt(creationTime, 10),
		GasLimit:     "0",
		GasPrice:     "0",
		Hash:         coinbaseDecoded.ReqKey,
		Nonce:        "",
		PactId:       nil,
		Continuation: emptyJSON,
		Gas:          "0",
		Result:       coinbaseDecoded.Result,
		Logs:         coinbaseDecoded.Logs,
		NumEvents:    len(coinbaseDecoded.Events),
		RequestKey:   coinbaseDecoded.ReqKey,
		Rollback:     false,
		Sender:       "coinbase",
		Sigs:         emptyArray,
		Step:         0,
		Proof:        nil,
		TTL:          "0",
		TxId:         fmt.Sprintf("%d", coinbaseDecoded.TxID),
	}

	return txAttribute, nil
}
