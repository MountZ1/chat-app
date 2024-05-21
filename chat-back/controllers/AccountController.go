package controllers

import (
	"chat-back/library"
	"chat-back/models"
	"encoding/json"
	"net/http"
	"time"
)

func LoginAccount(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	type User struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	var user User

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	data, session, err := models.LoginAccount(user.Email, user.Password)
	if err != nil {
		res := map[string]interface{}{
			"message": "No user found",
			"status":  http.StatusUnauthorized,
			"user":    data,
		}
		response := library.JsonFormatter(res)

		w.Write(response)
		return
	}

	res := map[string]interface{}{
		"message": "login success",
		"status":  http.StatusOK,
		"user":    data,
		// "cookie":  session,
	}
	response := library.JsonFormatter(res)

	cookie := http.Cookie{
		Name:    "user_identifier",
		Value:   session,
		Path:    "/",
		Expires: time.Now().Add(time.Hour * 24 * 30),
	}
	http.SetCookie(w, &cookie)
	w.Write(response)
}

func CheckUsername(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var username string

	err := json.NewDecoder(r.Body).Decode(&username)
	if err != nil {
		w.Write([]byte(err.Error()))
		return
	}

	err = models.UsernameCheck(username)
	if err != nil {
		jsonResponse := map[string]interface{}{
			"available": false,
			"message":   err.Error(),
		}
		response, err := json.Marshal(jsonResponse)
		if err != nil {
			return
		}
		w.Write(response)
		return
	}

	jsonResponse := map[string]interface{}{
		"available": true,
		"message":   "username available",
	}
	response, err := json.Marshal(jsonResponse)
	if err != nil {
		return
	}

	w.Write(response)
}

func CheckCreditentials(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	session, err := r.Cookie("user_identifier")
	// fmt.Println("session : ", session)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(err.Error()))
		return
	}
	value := session.Value
	valid, message, err := models.CheckCreditential(value)
	// fmt.Println(valid)
	if err != nil {
		w.Write([]byte(err.Error()))
		return
	}
	jsonResponse := map[string]interface{}{
		"valid":   valid,
		"message": message,
	}
	response, err := json.Marshal(jsonResponse)
	if err != nil {
		return
	}
	// fmt.Println(valid)
	w.Write(response)
}

func CreateAccount(w http.ResponseWriter, r *http.Request) {
	type User struct {
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	var user User

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	err = models.CreateAccount(user.Username, user.Email, user.Password)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	res := map[string]interface{}{
		"message": "Account created successfully",
		"status":  http.StatusOK,
	}
	respose, err := json.Marshal(res)
	if err != nil {
		return
	}
	w.Write(respose)
}

func LogoutAccount(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("user_identifier")
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(err.Error()))
		return
	}

	err = models.DestroySession(cookie.Value)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	res := map[string]interface{}{
		"message": "Logout success",
		"status":  http.StatusOK,
	}
	response := library.JsonFormatter(res)

	cookie = &http.Cookie{
		Name:   "user_identifier",
		Value:  "",
		MaxAge: -1,
		Path:   "/",
	}

	http.SetCookie(w, cookie)
	w.Write(response)
}
