package main

import (
	"errors"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/labstack/echo-contrib/echoprometheus"
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
	database.ConnectDb()

	app.HideBanner = true

	app.Use(echoprometheus.NewMiddlewareWithConfig(echoprometheus.MiddlewareConfig{
		Subsystem: "stashbin",
		Skipper: func(c echo.Context) bool {
			prefixes := []string{"/assets", "/images", "/manifest.json", "/robots.txt", "/sitemap.xml", "/metrics", "/health"}
			for _, prefix := range prefixes {
				if strings.HasPrefix(c.Path(), prefix) {
					return true
				}
			}
			return false
		},
	}))
	go func() { // run prometheus metrics on seperate port and goroutine
		metrics := echo.New()
		metrics.HideBanner = true
		metrics.Logger.Info("Starting metrics server on :8081")
		metrics.GET("/metrics", echoprometheus.NewHandler())
		if err := metrics.Start(":8081"); err != nil && !errors.Is(err, http.ErrServerClosed) {
			app.Logger.Fatal(err)
		}
	}()

	app.Pre(middleware.RemoveTrailingSlash())
	app.Pre(middleware.Recover())
	app.Pre(middleware.RateLimiter(middleware.NewRateLimiterMemoryStore(50)))

	app.Use(
		middleware.CORS(),
		dbMidleware(),
	)

	app.Static("/assets", "./public/assets")
	app.Static("/images", "./public/images")
	app.File("/favicon.ico", "./public/favicon.ico")
	app.File("/manifest.json", "./public/manifest.json")
	app.File("/robots.txt", "./public/robots.txt")
	app.File("/sitemap.xml", "./public/sitemap.xml")

	app.GET("/health", api.HealthCheck)

	return app
}

func main() {
	app := setupApp()

	pageGroup := app.Group("")
	{
		pageGroup.Use(
			middleware.LoggerWithConfig(
				middleware.LoggerConfig{
					Format: "[${time_rfc3339}] (${remote_ip}) ${latency_human} ${status} ${method} ${path}\n",
					Output: os.Stdout,
				},
			),
		)
		pageGroup.GET("/", page.HomeHandler)
		pageGroup.GET("/about", page.AboutHandler)
		pageGroup.GET("/:slug", page.DocumentPageHandler)
		pageGroup.GET("/raw/:slug", page.RawPageHandler)

	}

	apiGroup := app.Group("/api")
	{
		apiGroup.Use(
			middleware.LoggerWithConfig(
				middleware.LoggerConfig{
					Format: `[${time_rfc3339}] (${remote_ip}) ${latency_human} ${status} ${method} ${path}
{"user_agent": "${user_agent}", "latency": "${latency_human}", "Hx-Request": "${header:Hx-Request}"}
`,
					Output: os.Stdout,
				},
			),
		)
		apiGroup.POST("/document", api.CreateDocument)
		apiGroup.GET("/document", api.GetDocumentBySlug)
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
