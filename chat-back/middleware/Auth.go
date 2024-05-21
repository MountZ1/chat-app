package middleware

import (
	"chat-back/models"
	"context"
	"errors"
	"net/http"
)

var (
	ErrUnauthorized        = errors.New("unauthorized")
	ErrInternalServerError = errors.New("internal server error")
	ErrDatabaseConnection  = errors.New("database connection error")
	ErrSessionNotFound     = errors.New("session not found")
)

func Auth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Establish a database connection
		db, err := models.ConnectionDatabase()
		if err != nil {
			http.Error(w, ErrDatabaseConnection.Error(), http.StatusInternalServerError)
			return
		}

		// Retrieve the cookie
		cookie, err := r.Cookie("user_identifier")
		if err != nil {
			if errors.Is(err, http.ErrNoCookie) {
				http.Error(w, ErrUnauthorized.Error(), http.StatusUnauthorized)
			} else {
				http.Error(w, ErrInternalServerError.Error(), http.StatusInternalServerError)
			}
			return
		}

		// Query the database for the session
		var userID string
		row := db.QueryRow("SELECT userid FROM session WHERE sess = $1", cookie.Value)
		err = row.Scan(&userID)
		if err != nil {
			http.Error(w, ErrSessionNotFound.Error(), http.StatusUnauthorized)
			return
		}

		// Check if userID is empty
		if userID == "" {
			http.Error(w, ErrUnauthorized.Error(), http.StatusUnauthorized)
			return
		}

		// Add userID to the request context and call the next handler
		ctx := context.WithValue(r.Context(), "userid", userID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
