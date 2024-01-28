package page

import (
	"net/http"

	"github.com/labstack/echo/v4"

	"github.com/mrmissx/stashbin/utils"
	"github.com/mrmissx/stashbin/view"
)

func HomeHandler(c echo.Context) error {
	return utils.Render(c, http.StatusOK, view.Hello("Hello World"))
}
