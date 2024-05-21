package library

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
)

func Hash(pw string) (string, []byte, error) {
	salt := make([]byte, 16)
	_, err := rand.Read(salt)
	if err != nil {
		return "", nil, err
	}

	hasher := sha256.New()
	hasher.Write([]byte(pw))
	hasher.Write(salt)
	password := hex.EncodeToString(hasher.Sum(nil))

	return password, salt, nil
}

// func VerifyPassword(password string, hashedPassword string, salt []byte) bool {
// 	newHash := sha256.New()
// 	newHash.Write([]byte(password + string(salt)))
// 	newPass := hex.EncodeToString(newHash.Sum(nil))

// 	return newPass == hashedPassword
// }

// func VerifyPassword(password string, hashedPassword string, salt []byte) bool {
// 	// Concatenate password and salt
// 	concatenated := []byte(password)
// 	concatenated = append(concatenated, salt...)

// 	// Compute SHA-256 hash
// 	hash := sha256.Sum256(concatenated)

// 	// Encode hashed password to hexadecimal
// 	hashed := hex.EncodeToString(hash[:])

// 	// Log intermediate values for debugging
// 	fmt.Println("Concatenated:", string(concatenated))
// 	fmt.Println("Expected Hash:", hashedPassword)
// 	fmt.Println("Computed Hash:", hashed)

//		// Use constant-time comparison to mitigate timing attacks
//		return subtle.ConstantTimeCompare([]byte(hashedPassword), []byte(hashed)) == 1
//	}

func VerifyPassword(password string, hashedPassword string, salt []byte) bool {
	concatenated := []byte(password)
	concatenated = append(concatenated, salt...)

	hasher := sha256.New()
	hasher.Write(concatenated)
	hashed := hex.EncodeToString(hasher.Sum(nil))

	return hashed == hashedPassword
}
