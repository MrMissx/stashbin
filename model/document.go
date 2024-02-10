package model

import (
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
	"github.com/mrmissx/stashbin/utils"
)

type Document struct {
	Slug      string    `json:"key"`
	Content   string    `json:"content" form:"content"`
	CreatedAt time.Time `json:"date"`
	Views     uint      `json:"views"`
}

func insertDocument(db *sqlx.DB, doc *Document, retry int) error {
	if retry > 3 {
		utils.Logger.Warning("Failed to insert document after 3 retries")
		return nil
	}

	doc.Slug = utils.CreateSlug()
	doc.CreatedAt = time.Now()

	_, err := db.Exec(
		"INSERT INTO documents (slug, content, created_at) VALUES ($1, $2, $3)",
		doc.Slug,
		doc.Content,
		doc.CreatedAt,
	)
	if err != nil {
		pgErr, ok := err.(*pq.Error)
		// duplicate slug
		if ok && pgErr.Code == "23505" && retry <= 3 {
			utils.Logger.Warning("Slug %s already exists, retrying...", doc.Slug)
			return insertDocument(db, doc, retry+1)
		}
	}

	return err
}

func (doc *Document) Create(db *sqlx.DB) error {
	return insertDocument(db, doc, 0)
}

func (doc *Document) incrementViews(db *sqlx.DB) {
	tx, err := db.Beginx()

	defer func() {
		if err != nil {
			tx.Rollback()
			utils.Logger.Error("Failed to start transaction: %v", err)
		} else {
			tx.Commit()
		}
	}()

	_, err = tx.Exec("UPDATE documents SET views = views + 1 WHERE slug = $1", doc.Slug)
}

func (doc *Document) GetBySlug(db *sqlx.DB, slug string) error {
	err := db.QueryRowx(
		"SELECT slug, content, created_at, views FROM documents WHERE slug = $1 LIMIT 1",
		slug,
	).Scan(&doc.Slug, &doc.Content, &doc.CreatedAt, &doc.Views)

	if err != nil {
		return err
	}

	go doc.incrementViews(db)

	return nil
}
