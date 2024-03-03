package page

import (
	"net/http"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"

	"github.com/mrmissx/stashbin/database/model"
	"github.com/mrmissx/stashbin/utils/response"
	"github.com/mrmissx/stashbin/view"
)

func DocumentPageHandler(c echo.Context) error {
	var doc *model.Document = &model.Document{}
	slug := c.Param("slug")

	db := c.Get("db").(*sqlx.DB)
	err := doc.GetBySlug(db, slug)
	if err != nil {
		c.Redirect(http.StatusTemporaryRedirect, "/")
		return nil
	}
	return response.Render(c, http.StatusOK, view.Document(doc.Content, doc.Slug))
}
