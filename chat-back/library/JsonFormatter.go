package library

import (
	"encoding/json"
)

func JsonFormatter(data interface{}) []byte {
	jsonData, err := json.Marshal(data)
	if err != nil {
		return nil
	}

	return jsonData
}
