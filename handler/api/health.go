package api

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/mrmissx/stashbin/utils"
)

func HealthCheck(c echo.Context) error {
	return c.JSON(http.StatusOK, utils.JSON{"message": "ok"})
}
