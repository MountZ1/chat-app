package models

import (
	"fmt"
)

type Friends struct {
	Username string
	Picture  *string
}

func GetFriends(userid string) ([]Friends, error) {
	db, err := ConnectionDatabase()
	if err != nil {
		fmt.Println("Connection Failed!")
		return nil, err
	}
	defer db.Close()

	query := `
			SELECT users.username, users.picture
			FROM friendlist
			INNER JOIN users ON friendlist.user_id = users.id
			WHERE friendlist.friend_id = $1
			UNION ALL
			SELECT users.username, users.picture
			FROM friendlist
			INNER JOIN users ON friendlist.friend_id = users.id
			WHERE friendlist.user_id = $1
	`

	row, err := db.Query(query, userid)

	if err != nil {
		return nil, err
	}
	defer row.Close()

	var friends []Friends
	for row.Next() {
		var friend Friends
		if err := row.Scan(&friend.Username, &friend.Picture); err != nil {
			return nil, err
		}
		friends = append(friends, friend)
	}

	return friends, nil
}
