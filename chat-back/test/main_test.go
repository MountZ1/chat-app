package test

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"net/http"
	"testing"
)

// func TestDatabaseConnection(t *testing.T) {
// 	db, err := models.ConnectionDatabase()
// 	if err != nil {
// 		t.Errorf("Database connection failed: %v", err)
// 		return
// 	}
// 	defer db.Close()

// 	row := db.QueryRow("SELECT password, salt FROM users WHERE email = 'paunz' OR username = 'paunz'")
// 	type User struct {
// 		Password string
// 		Salt     []byte
// 	}
// 	var user User

// 	err = row.Scan(&user.Password, &user.Salt)
// 	if err == sql.ErrNoRows {
// 		fmt.Println("No rows returned from the query")
// 		t.Skip("User not found")
// 		return
// 	} else if err != nil {
// 		fmt.Printf("Error scanning row: %v\n", err)
// 		t.Errorf("Error fetching user data: %v", err)
// 		return
// 	}

// 	fmt.Println("Retrieved Password:", user.Password)
// 	fmt.Println("Retrieved Salt:", user.Salt)

// 	check := library.VerifyPassword("z7954861", user.Password, user.Salt[:])
// 	fmt.Println("Password Verification Result:", check)
// }

func TestCookies(t *testing.T) {
	tokenByte := make([]byte, 32)
	_, err := rand.Read(tokenByte)
	if err != nil {
		t.Errorf("Error generating token: %v", err)
	}
	token := hex.EncodeToString(tokenByte)
	c := &http.Cookie{}

	c.Name = "session"
	c.Value = token

	fmt.Println(c)
}
