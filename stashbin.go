package main

import (
	"fmt"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/mrmissx/stashbin/database"
	"github.com/mrmissx/stashbin/handler/api"
	"github.com/mrmissx/stashbin/handler/page"
	"github.com/mrmissx/stashbin/utils"

	_ "github.com/joho/godotenv/autoload"
)

func setupApp() *echo.Echo {
	app := echo.New()
	// database.ConnectDb()

	app.HideBanner = true

	app.Pre(middleware.RemoveTrailingSlash())
	app.Pre(middleware.Recover())
	app.Pre(middleware.RateLimiter(middleware.NewRateLimiterMemoryStore(50)))

	app.Use(
		middleware.CORS(),
		middleware.LoggerWithConfig(
			middleware.LoggerConfig{
				Format: `[${time_rfc3339}] (${remote_ip}) ${latency_human} ${status} ${method} ${path}
{"user_agent": "${user_agent}", "latency": "${latency_human}", "Hx-Request": "${header:Hx-Request}"}
`,
				Output: os.Stdout,
			},
		),
		dbMidleware(),
	)

	app.Static("/assets", "./public/assets")
	app.Static("/images", "./public/images")
	app.File("/favicon.ico", "./public/favicon.ico")
	app.File("/manifest.json", "./public/manifest.json")
	app.File("/robots.txt", "./public/robots.txt")
	app.File("/sitemap.xml", "./public/sitemap.xml")

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
func dbMidleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(ctx echo.Context) error {
			ctx.Set("db", database.GetDatabase())
			return next(ctx)
		}
	}
}
