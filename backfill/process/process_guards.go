package process

import (
	"encoding/json"
	"fmt"
	"go-backfill/fetch"
	"go-backfill/repository"
	"regexp"
	"strconv"
)

type LocalCmd struct {
	NetworkID string `json:"networkId"`
	Payload   struct {
		Exec *struct {
			Data map[string]interface{} `json:"data"`
			Code string                 `json:"code"`
		} `json:"exec"`
	} `json:"payload"`
	Meta struct {
		ChainID string `json:"chainId"`
		Sender  string `json:"sender"`
	} `json:"meta"`
}

type Keyset struct {
	Pred string   `json:"pred"`
	Keys []string `json:"keys"`
}

func PrepareGuards(
	processedPayload fetch.ProcessedPayload,
) ([]repository.GuardAttributes, error) {

	transactions := processedPayload.Transactions

	if len(transactions) == 0 {
		return []repository.GuardAttributes{}, nil
	}

	const avgGuardsPerTransaction = 4
	guards := make([]repository.GuardAttributes, 0, len(transactions)*avgGuardsPerTransaction)

	for _, transaction := range transactions {
		var cmdData LocalCmd

		// First, unmarshal to get the JSON-encoded string
		var cmdRaw string
		err := json.Unmarshal(transaction.Cmd, &cmdRaw)
		if err != nil {
			return []repository.GuardAttributes{}, fmt.Errorf("failed to unmarshal Cmd as string: %w", err)
		}

		// Preprocess the JSON string to fix empty `data` fields
		cmdRaw, err = preprocessCmdRaw(cmdRaw)
		if err != nil {
			return []repository.GuardAttributes{}, fmt.Errorf("failed to preprocess Cmd: %w", err)
		}

		// Second, unmarshal the JSON string into the Cmd struct
		err = json.Unmarshal([]byte(cmdRaw), &cmdData)
		if err != nil {
			return []repository.GuardAttributes{}, fmt.Errorf("failed to unmarshal Cmd to struct: %w", err)
		}

		sender := cmdData.Meta.Sender
		chainId, err := strconv.Atoi(cmdData.Meta.ChainID)
		if err != nil {
			return []repository.GuardAttributes{}, fmt.Errorf("error converting ChainId to int: %w", err)
		}
		var keyset *Keyset
		if cmdData.Payload.Exec != nil {
			keysetName := getKeysetName(cmdData.Payload.Exec.Code)
			if keysetName != "" {
				if rawValue, exists := cmdData.Payload.Exec.Data[keysetName]; exists {
					rawJSON, err := json.Marshal(rawValue)
					if err == nil {
						var ks Keyset
						if json.Unmarshal(rawJSON, &ks) == nil {
							keyset = &ks
						}
					}
				}
			}
		}

		if keyset == nil {
			continue
		}

		for _, publicKey := range keyset.Keys {
			if len(publicKey) > 64 {
				fmt.Printf("Invalid public key length: %s\n", transaction.ReqKey)
				continue
			}
			guards = append(guards, repository.GuardAttributes{
				PublicKey: publicKey,
				ChainID:   chainId,
				Predicate: keyset.Pred,
				Account:   sender,
			})
		}
	}

	return guards, nil
}

func preprocessCmdRaw(cmdRaw string) (string, error) {
	var cmdMap map[string]interface{}
	if err := json.Unmarshal([]byte(cmdRaw), &cmdMap); err != nil {
		return "", fmt.Errorf("failed to unmarshal CmdRaw into map: %w", err)
	}

	if payload, ok := cmdMap["payload"].(map[string]interface{}); ok {
		if exec, ok := payload["exec"].(map[string]interface{}); ok {
			if data, ok := exec["data"]; ok {
				switch v := data.(type) {
				case string:
					// Replace empty string with an empty map
					if v == "" {
						exec["data"] = map[string]interface{}{}
					}
				case []interface{}:
					// Handle data as an array
					if len(v) != 0 {
						fmt.Printf("Unexpected format for data: %s\n", cmdRaw)
					}
					exec["data"] = map[string]interface{}{}
				default:
					// Leave other types unchanged
				}
			}
		}
	}

	// Marshal the fixed map back to JSON string
	fixedCmdRaw, err := json.Marshal(cmdMap)
	if err != nil {
		return "", fmt.Errorf("failed to marshal fixed CmdRaw: %w", err)
	}

	return string(fixedCmdRaw), nil
}

func getKeysetName(code string) string {
	re := regexp.MustCompile(`(?i)\(read-keyset\s+(?:'|")([a-zA-Z0-9_-]+)(?:'|")\)`)

	matches := re.FindStringSubmatch(code)

	if len(matches) > 1 {
		return matches[1]
	}

	return ""
}
