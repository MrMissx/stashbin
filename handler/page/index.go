package page

import (
	"net/http"

	"github.com/labstack/echo/v4"

	"github.com/mrmissx/stashbin/utils/response"
	"github.com/mrmissx/stashbin/view"
)

func HomeHandler(c echo.Context) error {
	return response.Render(c, http.StatusOK, view.Home())
}
