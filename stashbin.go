package main

import (
	"fmt"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/mrmissx/stashbin/handler/api"
	"github.com/mrmissx/stashbin/handler/page"
	"github.com/mrmissx/stashbin/utils"

	_ "github.com/joho/godotenv/autoload"
)

func setupApp() *echo.Echo {
	app := echo.New()
	utils.ConnectDb()

	app.HideBanner = true

	app.Pre(middleware.RemoveTrailingSlash())
	app.Pre(middleware.Recover())
	app.Pre(middleware.RateLimiter(middleware.NewRateLimiterMemoryStore(10)))

	app.Use(
		middleware.LoggerWithConfig(
			middleware.LoggerConfig{
				Format: "[${time_rfc3339}] (${remote_ip}) ${latency_human} ${status} ${method} ${path}\n",
				Output: os.Stdout,
			},
		),
		database(),
	)

	app.Static("/assets", "assets")

	return app
}

func main() {
	app := setupApp()

	root := app.Group("")
	{
		root.GET("/", page.HomeHandler)
		root.GET("/about", page.AboutHandler)
		root.GET("/:slug", page.DocumentPageHandler)

		apiGroup := root.Group("/api")
		{
			apiGroup.POST("/document", api.CreateDocument)
			apiGroup.GET("/document", api.GetDocumentBySlug)
			apiGroup.GET("/health", api.HealthCheck)
		}
	}

	app.Logger.Fatal(app.Start(fmt.Sprintf(":%v", utils.GetEnv("PORT", "8080"))))
}

// Inject db to context
func database() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(ctx echo.Context) error {
			ctx.Set("db", utils.GetDatabase())
			return next(ctx)
		}
	}
}
