package main

import (
	"chat-back/controllers"
	"chat-back/routes"
	"fmt"
	"net/http"
	"runtime"
)

func main() {
	runtime.GOMAXPROCS(2)
	fmt.Println("Running Go Web Server on http://localhost:8080")
	routes.Routes()

	go func() {
		err := http.ListenAndServe(":8080", nil)
		if err != nil {
			fmt.Println("Error Starting Server", err)
		}
	}()
	go controllers.HandleMessages()

	select {}
}
