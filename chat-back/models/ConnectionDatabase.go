package models

import (
	"database/sql"
	"fmt"
	"net/url"

	_ "github.com/lib/pq"
)

func ConnectionDatabase() (*sql.DB, error) {
	encodedPassword := url.QueryEscape("z8579973#&+")
	conStr := "postgresql://mountz:" + encodedPassword + "@localhost/chatapp?sslmode=disable"
	db, err := sql.Open("postgres", conStr)

	if err != nil {
		fmt.Println("Connection Failed!")
		return nil, err
	}

	return db, nil
}
