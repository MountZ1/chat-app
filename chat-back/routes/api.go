package routes

import (
	"chat-back/controllers"
	"chat-back/middleware"
	"net/http"
)

func ApiService() http.Handler {
	r := http.NewServeMux()

	r.HandleFunc("/accounts", controllers.LoginAccount)
	r.HandleFunc("/accounts/check", controllers.CheckUsername)
	r.HandleFunc("/accounts/credentials", controllers.CheckCreditentials)
	r.HandleFunc("/accounts/create", controllers.CreateAccount)
	r.Handle("/friend", middleware.Auth(http.HandlerFunc(controllers.IndexFriend)))
	r.Handle("/getchat", middleware.Auth(http.HandlerFunc(controllers.RetriveUsersChat)))
	r.Handle("/openchat", middleware.Auth(http.HandlerFunc(controllers.OpenConversations)))
	r.Handle("/chat", middleware.Auth(http.HandlerFunc(controllers.Chat)))
	r.HandleFunc("/accounts/logout", controllers.LogoutAccount)

	return r
}
