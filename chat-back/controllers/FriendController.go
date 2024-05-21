package controllers

import (
	"chat-back/library"
	"chat-back/models"
	"net/http"
)

func IndexFriend(w http.ResponseWriter, r *http.Request) {
	userid := r.Context().Value("userid").(string)

	friends, err := models.GetFriends(userid)
	if err != nil {
		w.Write([]byte(err.Error()))
		return
	}

	res := map[string]interface{}{
		"friends": friends,
		"status":  http.StatusOK,
	}

	response := library.JsonFormatter(res)
	w.Write(response)
}
