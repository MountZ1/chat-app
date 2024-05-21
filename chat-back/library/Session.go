package library

import (
	"crypto/rand"
	"encoding/hex"
)

func MakeSession() string {
	tokenByte := make([]byte, 32)
	_, err := rand.Read(tokenByte)
	if err != nil {
		return "Error generating token"
	}

	token := hex.EncodeToString(tokenByte)

	return token
}

// func CreateUserSession() {

// }
