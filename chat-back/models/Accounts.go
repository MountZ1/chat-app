package models

import (
	"chat-back/library"
	"database/sql"
	"errors"
	"fmt"
)

type User struct {
	Username string
	Userid   *string
	Email    string
	Picture  *string
	Password string
	Salt     []byte
	id       int
}

func CreateAccount(username string, email string, password string) error {
	db, err := ConnectionDatabase()
	if err != nil {
		fmt.Println("Connection Failed!")
		return err
	}
	defer db.Close()

	pass, salt, err := library.Hash(password)

	if err != nil {
		return err
	}

	_, err = db.Exec("INSERT INTO users(username, email, password, salt) VALUES($1, $2, $3, $4)", username, email, pass, salt)

	if err != nil {
		fmt.Println("Insert Failed!", err)
		return err
	}
	defer db.Close()

	return err
}

func UsernameCheck(username string) error {
	db, err := ConnectionDatabase()
	if err != nil {
		fmt.Println("Connection Failed!", err)
		return err
	}
	defer db.Close()

	row := db.QueryRow("SELECT username FROM users WHERE username ILIKE $1", username)
	var existingUsername string
	err = row.Scan(&existingUsername)
	if err == sql.ErrNoRows {
		return nil
	} else if err != nil {
		return err
	}

	// fmt.Println("username already exists")
	return errors.New("username already exists")
}

func LoginAccount(identifier string, password string) (string, string, error) {
	db, err := ConnectionDatabase()
	if err != nil {
		fmt.Println("Connection Failed!", err)
		return "Error connecting to database", "", err
	}
	defer db.Close()

	row := db.QueryRow("SELECT username, userid, email, picture, password, salt, id FROM users WHERE email = $1 OR username = $1", identifier)

	var user User
	err = row.Scan(&user.Username, &user.Userid, &user.Email, &user.Picture, &user.Password, &user.Salt, &user.id)
	if err == sql.ErrNoRows {
		return "User not found", "", err
	} else if err != nil {
		fmt.Printf("Error scanning row: %v\n", err)
		return "Error fetching user data", "", err
	}
	check := library.VerifyPassword(password, user.Password, user.Salt)
	// fmt.Println(user.id)

	if !check {
		// fmt.Println("Password does not match")
		return "Username or password incorrect", "", err
	}

	session := library.MakeSession()
	_, err = db.Exec("INSERT INTO session(sess, userid) VALUES($1, $2) ON CONFLICT (userid) DO UPDATE SET sess = $1", session, user.id)

	if err != nil {
		fmt.Println("Insert Failed!", err)
		return "Error updating session", "", err
	}

	data := map[string]interface{}{
		"username": user.Username,
		"userid":   user.Userid,
		"email":    user.Email,
		"picture":  user.Picture,
	}
	jsonData := library.JsonFormatter(data)

	return string(jsonData), session, nil
}

func CheckCreditential(user_session string) (bool, string, error) {
	db, err := ConnectionDatabase()
	if err != nil {
		fmt.Println("Connection Failed!", err)
		return false, "Error connecting to database", err
	}
	defer db.Close()

	row := db.QueryRow("SELECT userid from session where sess = $1", user_session)
	var userid string
	err = row.Scan(&userid)
	if err == sql.ErrNoRows {
		return false, "No user with that session", err
	} else if err != nil {
		return false, "Error fetching session", err
	}

	_, err = db.Exec("Update users set online = true WHERE id = $1", userid)
	if err != nil {
		fmt.Println(err.Error())
		return false, "Something went wrong", err
	}
	return true, "Session valid", err
}

func DestroySession(user_session string) error {
	db, err := ConnectionDatabase()
	if err != nil {
		fmt.Println("Connection Failed!", err)
		return err
	}
	defer db.Close()
	_, err = db.Exec("DELETE FROM session WHERE sess = $1", user_session)
	if err != nil {
		fmt.Println(err.Error())
		return err
	}
	return nil
}
