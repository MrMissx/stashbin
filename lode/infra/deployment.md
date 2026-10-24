# Deployment & Runtime

## Docker (Dockerfile)

Multi-stage:

1. **build** (`golang:1.27.3`): installs curl/unzip/make, then bun via the install script (`/root/.bun/bin` on PATH). `make install` (go mod download + `bun install`), `go install templ`, copies source, `make generate` (templ + tailwind), `make build` → binary `stashbin`.

The toolchain tag is pinned to an **exact patch**, not a minor float (`golang:1.26`): the stdlib (including the `crypto/x509` certificate denylist) is compiled into the binary, so the patch level is a security-relevant input. `go.mod`'s `go 1.27.3` directive is the single source of truth; the Dockerfile tag mirrors it and both must move together.
2. **runner** (`debian:bookworm-slim`): copies only the `stashbin` binary, `public/` (static assets), and `database/migrations` (migrations re-apply at boot).

## docker-compose.yml

- Service `stashbin`, builds locally, maps host `5000 → container 5000`, `restart: unless-stopped`.
- Env: `DB_URI` (from host env, **not** `.env` — compose doesn't load it) and `PORT: 5000`.

## Configuration

| Var | Default | Meaning |
|---|---|---|
| `DB_URI` | — (required, `Fatal` if empty) | PostgreSQL DSN |
| `PORT` | `8080` | main server port (compose uses 5000, `.env.example` suggests 5000) |
| `DISABLE_METRICS` | unset | `"true"` disables the metrics server entirely |

`.env` is autoloaded via `godotenv/autoload` in dev; `utils.GetEnv(key, default)` is the accessor.

## Metrics sidecar

`setupApp` starts a second Echo instance in a goroutine on hardcoded **:8081** serving `/metrics` (echoprometheus), unless `DISABLE_METRICS=true`. The main app's metrics middleware excludes static/health paths (list in [../web/http-api.md](../web/http-api.md)).

Operational notes:

- `:8081` is hardcoded — in compose/k8s, expose or drop it explicitly; a port conflict kills startup only via `app.Logger.Fatal`.
- Rate limiting is per-process memory — one instance only; horizontal scaling would share nothing (rate limits, DB pool is fine).

Related: [database.md](database.md), [../practices.md](../practices.md).
