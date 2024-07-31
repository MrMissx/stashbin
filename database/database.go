package database

import (
	"database/sql"
	"time"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"github.com/mrmissx/stashbin/utils"
)

var session *sqlx.DB

func runMigrations(instance *sql.DB) {
	utils.Logger.Info("Running migrations...")
	driver, err := postgres.WithInstance(instance, &postgres.Config{})
	if err != nil {
		utils.Logger.Fatal("Could not create migrate driver: ", err)
	}
	m, err := migrate.NewWithDatabaseInstance("file://database/migrations", "postgres", driver)
	if err != nil {
		utils.Logger.Fatal("Failed to create migration instance: ", err)
	}
	if err := m.Up(); err != nil {
		if err == migrate.ErrNoChange {
			utils.Logger.Info("Database schema is up to date")
			return
		} else {
			utils.Logger.Fatal("Failed to apply migrations")
		}
	}
	utils.Logger.Info("Migrations completed")
}

func ConnectDb() {
	dbUri := utils.GetEnv("DB_URI", "")
	if dbUri == "" {
		utils.Logger.Fatal("DB_URI is not set")
	}

	utils.Logger.Info("Connecting to database...")

	db := sqlx.MustConnect("postgres", dbUri)
	db.SetMaxIdleConns(5)
	db.SetMaxOpenConns(10)
	db.SetConnMaxIdleTime(10 * time.Minute)
	db.SetConnMaxLifetime(1 * time.Hour)
	utils.Logger.Info("Successfuly connected database")

	runMigrations(db.DB)

	session = db
}

func GetDatabase() *sqlx.DB {
	return session
}
