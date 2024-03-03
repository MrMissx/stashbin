package api

import (
	"net/http"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"github.com/mrmissx/stashbin/database/model"
	"github.com/mrmissx/stashbin/utils/response"
)

func GetDocumentBySlug(c echo.Context) error {
	var doc *model.Document = &model.Document{}
	slug := c.QueryParam("key")
	if slug == "" {
		return c.JSON(http.StatusBadRequest, response.ErrNoKeyQuery)
	}

	db := c.Get("db").(*sqlx.DB)
	err := doc.GetBySlug(db, slug)
	if err != nil {
		return c.JSON(http.StatusNotFound, response.ErrDocumentNotFound)
	}

	return c.JSON(http.StatusOK, response.NewResult("successfuly retrieved document", response.JSON{"content": doc.Content}))
}

func CreateDocument(c echo.Context) error {
	var doc *model.Document = &model.Document{}

	is_htmx := c.Request().Header.Get("Hx-Request")

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

	if is_htmx == "true" {
		c.Response().Header().Set("HX-Location", "/"+doc.Slug)
		c.Response().WriteHeader(http.StatusCreated)
		return nil
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
