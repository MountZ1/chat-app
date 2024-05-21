package routes

import (
	"fmt"
	"net/http"
	"os"
)

type justFilesFilesystem struct {
	fs http.FileSystem
}

func (fs justFilesFilesystem) Open(name string) (http.File, error) {
	f, err := fs.fs.Open(name)
	if err != nil {
		return nil, fmt.Errorf("you don't have permission to access this resource")
	}
	return neuteredReaddirFile{f}, nil
}

type neuteredReaddirFile struct {
	http.File
}

func (f neuteredReaddirFile) Readdir(count int) ([]os.FileInfo, error) {
	return nil, nil
}

func FileServer() {
	fileserver := justFilesFilesystem{http.Dir("/root_project/chat-app/chat-back/assets/")}
	http.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(fileserver)))
}
