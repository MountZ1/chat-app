package routes

import (
	"chat-back/middleware"
	"net/http"
)

func Routes() {
	// r := http.NewServeMux()
	WebService()
	FileServer()

	http.Handle("/api/", http.StripPrefix("/api", middleware.SetHeader(http.Handler(ApiService()))))
}
