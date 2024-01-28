package api

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/mrmissx/stashbin/utils"
)

func GetDocumentBySlug(c echo.Context) error {
	return c.JSON(http.StatusOK, utils.JSON{"message": "GET /api/document"})
}

func CreateDocument(c echo.Context) error {
	return c.JSON(http.StatusOK, utils.JSON{"message": "POST /api/document"})
}
