# StashBin — Lode Summary

StashBin is a minimal, open-source pastebin ("save and share text") written in Go and hosted at stashbin.xyz. An Echo v4 server serves templ-rendered pages and a small JSON API over a single `documents` table in PostgreSQL (sqlx), with golang-migrate migrations auto-applied at startup, htmx driving the save flow in the browser, Tailwind (pnpm) for styling, and Prometheus metrics on a separate :8081 server. Everything ships as a multi-stage Docker image.

- Stack: Go 1.26 · Echo v4 · templ + htmx + Tailwind v4 (CSS-first config) · PostgreSQL (sqlx + lib/pq) · golang-migrate · godotenv
- Entry point: `stashbin.go` (setup + routing), see [web/http-api.md](web/http-api.md)
- Core domain: one entity, the Document — see [paste/document.md](paste/document.md)
- Owner: mrmissx (module `github.com/mrmissx/stashbin`)
