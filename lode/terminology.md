# Terminology

- **Document** — a stored paste; row in the `documents` table (`slug`, `content`, `created_at`, `views`). Serialized as `{key, content, date, views}`.
- **Paste** — everyday synonym for Document.
- **Slug** — 10-char random `[a-z]` string; the public identifier of a Document in URLs and the API (`key`).
- **Raw** — plain-text rendering of a Document at `/raw/:slug` (no HTML layout, `text/plain`).
- **Hx-Request** — request header set by htmx; when `"true"`, `POST /api/document` answers `201` + `HX-Location` header instead of JSON.
- **db middleware** — `dbMidleware()` in stashbin.go; injects the global `*sqlx.DB` into the Echo context under key `"db"` for every request.
- **Metrics server** — second Echo instance on `:8081` exposing `/metrics` (Prometheus); disabled by setting `DISABLE_METRICS=true`. Skipped by the app's own metrics middleware.
- **Migration** — versioned SQL up/down file pair in `database/migrations`, applied by golang-migrate (auto at boot, or via Makefile `upgrade`/`downgrade`).
