package utils

import (
	"log"
	"time"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

var session *sqlx.DB

func ConnectDb() {
	dbUri := GetEnv("DB_URI", "")
	if dbUri == "" {
		log.Fatal("DB_URI is not set")
	}

	log.Println("Connecting to database...")

	db := sqlx.MustConnect("postgres", dbUri)
	db.SetMaxIdleConns(5)
	db.SetMaxOpenConns(10)
	db.SetConnMaxLifetime(10 * time.Second)

	session = db
	log.Println("Successfuly connected database")
}

func GetDatabase() *sqlx.DB {
	return session
}
