# Practices

Patterns and conventions this codebase follows.

## Templ workflow

- Views are authored in `view/**/*.templ`; the generated `*_templ.go` files are git-ignored and never edited by hand.
- Regenerate with `make generate` (runs `go tool templ generate` + `bun run build` for Tailwind). Any manual change to a `.templ` file must be followed by regeneration or the build silently uses stale output.

## Echo conventions

- Middleware order in `setupApp()` (stashbin.go): Pre → `RemoveTrailingSlash`, `Recover`, `RateLimiter` (memory store, 50 req); Use → `CORS`, `dbMidleware`.
- Two route groups with different logger formats: page group (`/`, `/about`, `/:slug`, `/raw/:slug`) and `/api` group.
- Handlers are thin: pull `db` from context, call a model method, render or JSON via `utils/response`.

## Response envelope

- Success: `response.NewResult(msg, data)` → `{"ok":true,"message":...,"data":...}`
- Error: shared `response.ErrXxx` singletons → `{"ok":false,"message":...}`
- HTML pages render via `response.Render(c, status, templComponent)`.

## Model layer

- Model structs own their SQL; methods take `*sqlx.DB` as a parameter (no global DB access from models, though `database.GetDatabase()` exists).
- Retry pattern for unique violations: catch `*pq.Error` code `23505`, retry up to 3 times with a fresh slug.

## Tooling

- Go deps: `go mod download`; JS deps: `bun install` (`make install` does both). Lockfile is `bun.lock`.
- Dev: `make dev` (tailwind watch + go run) or `make dev-go` (generate + run).
- DB migrations: `make revision name=...` / `upgrade` / `downgrade` (golang-migrate CLI at `$(GOPATH)/bin/migrate`, reads `DB_URI` from `.env`).
- Env config via `.env` (autoloaded by godotenv): `DB_URI` (required), `PORT` (default 8080), `DISABLE_METRICS` (optional).
