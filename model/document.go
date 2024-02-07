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
			return insertDocument(db, doc, retry+1)
		}
	}

	return err
}

func (doc *Document) Create(db *sqlx.DB) error {
	return insertDocument(db, doc, 0)
}

func (doc *Document) incrementViews(db *sqlx.DB) {
	_, err := db.Exec("UPDATE documents SET views = views + 1 WHERE slug = $1", doc.Slug)
	if err != nil {
		utils.Logger.Error("Failed to update document '%v' : %v", doc.Slug, err)
	}
}

func (doc *Document) GetBySlug(db *sqlx.DB, slug string) (*Document, error) {
	var result Document
	err := db.QueryRowx(
		"SELECT slug, content, created_at, views FROM documents WHERE slug = $1 LIMIT 1",
		slug,
	).Scan(&result.Slug, &result.Content, &result.CreatedAt, &result.Views)

	if err != nil {
		return nil, err
	}

	go result.incrementViews(db)

	return &result, nil
}