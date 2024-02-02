package api

import (
	"net/http"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"github.com/mrmissx/stashbin/model"
	"github.com/mrmissx/stashbin/response"
)

func GetDocumentBySlug(c echo.Context) error {
	var doc *model.Document = &model.Document{}
	slug := c.QueryParam("key")
	if slug == "" {
		return c.JSON(http.StatusBadRequest, response.ErrNoKeyQuery)
	}

	db := c.Get("db").(*sqlx.DB)
	document, err := doc.GetBySlug(db, slug)
	if err != nil {
		return c.JSON(http.StatusNotFound, response.ErrDocumentNotFound)
	}

	return c.JSON(http.StatusOK, response.NewResult("successfuly retrieved document", response.JSON{"content": document.Content}))
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
