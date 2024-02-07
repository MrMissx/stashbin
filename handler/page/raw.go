package page

import (
	"net/http"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"

	"github.com/mrmissx/stashbin/model"
)

func RawPageHandler(c echo.Context) error {
	var doc *model.Document = &model.Document{}
	slug := c.Param("slug")

	db := c.Get("db").(*sqlx.DB)
	err := doc.GetBySlug(db, slug)
	if err != nil {
		c.Redirect(http.StatusTemporaryRedirect, "/")
		return nil
	}
	c.Response().Header().Set("Content-Type", "text/plain")
	return c.HTML(http.StatusOK, doc.Content)
}
