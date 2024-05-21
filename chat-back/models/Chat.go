package models

import (
	"fmt"
)

type Chat struct {
	Conv_id          int
	Opponent_id      int
	Opponent         string
	Opponent_Picture *string
	Opponent_online  bool
	Message          string
}

type Conversations struct {
	Sender_type string
	Username    string
	Picture     *string
	Message     string
	Time_sent   string
}

func GetUsersChat(userid string) ([]Chat, error) {
	db, err := ConnectionDatabase()
	if err != nil {
		fmt.Println("Connection Failed!")
		return nil, err
	}
	defer db.Close()
	query := `WITH user_conversations AS (
					SELECT 
						cp.conversation_id
					FROM 
						conversations_participants cp
					WHERE 
						cp.user_id = $1
				),
				latest_message AS (
					SELECT 
						m.conversations_id,
						m.message,
						m.sender_id,
						m.time_sent,
						ROW_NUMBER() OVER (PARTITION BY m.conversations_id ORDER BY m.time_sent DESC) AS rn
					FROM 
						messages m
					INNER JOIN 
						user_conversations uc ON m.conversations_id = uc.conversation_id
				),
				opponent AS (
					SELECT 
						cp.conversation_id,
						u.username AS opponent_username,
						u.picture AS opponent_picture,
						u.online AS opponent_online
					FROM 
						conversations_participants cp
					INNER JOIN 
						users u ON cp.user_id = u.id
					WHERE 
						cp.conversation_id IN (SELECT conversation_id FROM user_conversations)
						AND u.id != $1
				)
				SELECT 
					lm.conversations_id,
					lm.message,
					lm.sender_id,
					o.opponent_username,
					o.opponent_picture,
					o.opponent_online
				FROM 
					latest_message lm
				INNER JOIN 
					opponent o ON lm.conversations_id = o.conversation_id
				WHERE 
					lm.rn = 1
				ORDER BY 
					lm.time_sent DESC`

	row, err := db.Query(query, userid)
	if err != nil {
		return nil, err
	}
	defer db.Close()

	var chat []Chat
	for row.Next() {
		var chats Chat
		if err := row.Scan(&chats.Conv_id, &chats.Message, &chats.Opponent_id, &chats.Opponent, &chats.Opponent_Picture, &chats.Opponent_online); err != nil {
			return nil, err
		}

		chat = append(chat, chats)
	}

	return chat, nil
}

func GetConversations(conf_id int, userid string) ([]Conversations, error) {
	db, err := ConnectionDatabase()
	if err != nil {
		fmt.Println("Connection Failed!")
		return nil, err
	}
	defer db.Close()

	row, err := db.Query(`WITH opponent as (
							SELECT
								'opponent' AS sender_type,
								users.username,
								users.picture,
								messages.message,
								messages.time_sent
							FROM messages
							INNER JOIN users ON messages.sender_id = users.id
							WHERE messages.conversations_id = $1 AND sender_id != $2
						), self as (
							SELECT
								'self' AS sender_type,
								users.username,
								users.picture,
								messages.message,
								messages.time_sent
							FROM messages
							INNER JOIN users ON messages.sender_id = users.id
							WHERE messages.conversations_id = $1 AND sender_id = $2
						) SELECT * FROM self UNION SELECT * FROM opponent ORDER BY time_sent`, conf_id, userid)
	if err != nil {
		return nil, err
	}
	defer db.Close()

	var conversation []Conversations
	for row.Next() {
		var conv Conversations
		if err := row.Scan(&conv.Sender_type, &conv.Username, &conv.Picture, &conv.Message, &conv.Time_sent); err != nil {
			return nil, err
		}
		conversation = append(conversation, conv)
	}

	return conversation, nil
}

func StoreConversation(conv_id int, sender_username string, message string) error {
	db, err := ConnectionDatabase()
	if err != nil {
		fmt.Println("Connection Failed!")
		return err
	}
	defer db.Close()

	query := `WITH sender_id AS (
		SELECT id FROM users WHERE username = $1
	  )
	  INSERT INTO messages (conversations_id, sender_id, message) 
	  VALUES ($2, (SELECT id FROM sender_id), $3);
	  `

	_, err = db.Exec(query, sender_username, conv_id, message)
	if err != nil {
		return err
	}
	defer db.Close()

	return nil
}

func GetParticipant(conv_id int, sender string) (string, error) {
	db, err := ConnectionDatabase()
	if err != nil {
		fmt.Println("Connection Failed!")
		return "", err
	}
	defer db.Close()

	row := db.QueryRow(`select user_id from conversations_participants where conversation_id = $1 and user_id != $2`, conv_id, sender)

	var userID string
	if err := row.Scan(&userID); err != nil {
		return "", err
	}
	defer db.Close()

	return userID, nil
}
