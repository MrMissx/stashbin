package database

import (
	"time"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"github.com/mrmissx/stashbin/utils"
)

var session *sqlx.DB

func ConnectDb() {
	dbUri := utils.GetEnv("DB_URI", "")
	if dbUri == "" {
		utils.Logger.Fatal("DB_URI is not set")
	}

	utils.Logger.Info("Connecting to database...")

	db := sqlx.MustConnect("postgres", dbUri)
	db.SetMaxIdleConns(5)
	db.SetMaxOpenConns(10)
	db.SetConnMaxLifetime(10 * time.Second)

	session = db
	utils.Logger.Info("Successfuly connected database")
}

func GetDatabase() *sqlx.DB {
	return session
}
