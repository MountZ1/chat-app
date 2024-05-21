package controllers

import (
	"chat-back/library"
	"chat-back/models"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
)

type SocketPayload struct {
	Conv_Id int
	Message string
	Sender  string
}

// var Clients = make(map[*websocket.Conn]bool) // connected clients
// var Broadcast = make(chan SocketPayload)     // broadcast channel

// var upgrader = websocket.Upgrader{
// 	ReadBufferSize:  1024,
// 	WriteBufferSize: 1024,
// 	CheckOrigin:     func(r *http.Request) bool { return true },
// }

func RetriveUsersChat(w http.ResponseWriter, r *http.Request) {
	userid := r.Context().Value("userid").(string)
	chat, err := models.GetUsersChat(userid)
	if err != nil {
		w.Write([]byte(err.Error()))
		return
	}

	res := map[string]interface{}{
		"chat":   chat,
		"status": http.StatusOK,
	}

	response := library.JsonFormatter(res)
	w.Write(response)
}

func OpenConversations(w http.ResponseWriter, r *http.Request) {
	userid := r.Context().Value("userid").(string)
	var conv_id int
	err := json.NewDecoder(r.Body).Decode(&conv_id)
	if err != nil {
		w.Write([]byte(err.Error()))
		return
	}
	// fmt.Println("userid : ", conv_id)

	conversations, err := models.GetConversations(conv_id, userid)
	if err != nil {
		w.Write([]byte(err.Error()))
		return
	}

	res := map[string]interface{}{
		"conversations": conversations,
		"status":        http.StatusOK,
	}
	response := library.JsonFormatter(res)
	w.Write(response)
}

var Clients = make(map[*websocket.Conn]bool)         // connected clients
var Broadcast = make(chan SocketPayload)             // broadcast channel
var ClientUserMap = make(map[*websocket.Conn]string) // map WebSocket connections to user IDs

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

func Chat(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("WebSocket upgrade failed:", err)
		return
	}
	defer ws.Close()

	Clients[ws] = true

	// Handle incoming messages from the client
	for {
		var message SocketPayload
		err := ws.ReadJSON(&message)
		if err != nil {
			fmt.Println("Failed to read JSON message:", err)
			delete(Clients, ws)
			delete(ClientUserMap, ws) // Remove connection from ClientUserMap
			break
		}
		if message.Sender == "" || message.Message == "" {
			fmt.Println("Invalid sender ID or message:", message)
			continue
		}
		// Store the incoming message and broadcast it to other clients
		err = models.StoreConversation(message.Conv_Id, message.Sender, message.Message)
		if err != nil {
			fmt.Println("Failed to store conversation:", err)
			return
		}
		ClientUserMap[ws] = message.Sender // Map WebSocket connection to user ID
		Broadcast <- message
	}
}

// HandleMessages concurrently processes incoming messages and broadcasts them to clients
func HandleMessages() {
	for {
		message := <-Broadcast
		for client := range Clients {
			if ClientUserMap[client] != message.Sender { // Exclude sender from receiving the message
				err := client.WriteJSON(message)
				if err != nil {
					fmt.Println("Failed to send message to client:", err)
					client.Close()
					delete(Clients, client)
					delete(ClientUserMap, client) // Remove connection from ClientUserMap
				}
			}
		}
	}
}
