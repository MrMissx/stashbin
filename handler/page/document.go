package page

import (
	"net/http"

	"github.com/labstack/echo/v4"

	"github.com/mrmissx/stashbin/response"
	"github.com/mrmissx/stashbin/view"
)

func DocumentPageHandler(c echo.Context) error {
	return response.Render(c, http.StatusOK, view.Hello("Hello World"))
}
