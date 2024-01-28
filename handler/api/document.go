package api

import (
	"net/http"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"github.com/mrmissx/stashbin/model"
	"github.com/mrmissx/stashbin/response"
)

func GetDocumentBySlug(c echo.Context) error {
	return c.JSON(http.StatusOK, response.JSON{"message": "GET /api/document"})
}

func CreateDocument(c echo.Context) error {
	var doc *model.Document = &model.Document{}

	if err := (&echo.DefaultBinder{}).BindBody(c, doc); err != nil {
		return c.JSON(http.StatusBadRequest, response.ErrInvalidBody)
	}
	if doc.Content == "" {
		return c.JSON(http.StatusBadRequest, response.ErrContentEmpty)
	}

	db := c.Get("db").(*sqlx.DB)
	if err := doc.Create(db); err != nil {
		return c.JSON(http.StatusInternalServerError, response.ErrInternalServerError)
	}

	return c.JSON(http.StatusCreated, response.NewResult(
		"succesfully created document",
		response.JSON{
			"key":    doc.Slug,
			"length": len(doc.Content),
			"date":   doc.CreatedAt,
		},
	))
}
