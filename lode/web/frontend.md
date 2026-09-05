# Frontend (templ + htmx + Tailwind)

## Structure

- `view/*.templ` — pages: `Home` (editor), `Document` (paste view), `About`
- `view/layout/` — `BaseLayout`, `Header` (takes `templ.Component` children, e.g. save/tools buttons), `Footer`
- `view/icons/` — inline SVG icon components (Save, Tools)
- Generated `*_templ.go` files sit next to sources; git-ignored, never edited (see [../practices.md](../practices.md))

## Save flow (Home)

```html
<form hx-post="/api/document" hx-trigger="keydown[keyCode === 83 && (ctrlKey || metaKey)]">
  <textarea name="content" id="editor" ...></textarea>
</form>
```

- `Ctrl/Cmd+S` submits via htmx; server answers `201` + `HX-Location: /{slug}` and htmx performs the client-side redirect. There is no submit button.
- A small inline script prevents the browser's native Ctrl+S dialog (with a Mac-specific `metaKey` path via `navigator.platform`).

## Paste view (Document)

- `view/document.templ` splits content on `\n` into `lines`, then renders a two-column flex layout: a right-aligned line-number **gutter** (one `<div>` per line, muted `#a2acaf`, `select-none`) and a `<pre>` with one `<div class="whitespace-pre-wrap">` per line (block-level, so lines stack and wrap independently). The whole container is `overflow-auto`, so numbers and content scroll together as one unit — no JS required.
- Line numbers come from an explicit index loop (`1..len(lines)`), **not** CSS `list-decimal`. This keeps the gutter aligned to physical lines even when long lines wrap (the old `<ul class="list-decimal">` approach drifted across browsers and was replaced). The `li::marker` rule in `globals.css` is dead and removed.
- `icons.Tools(slug)` header provides per-paste actions (raw/copy/new links).

## Tailwind (v4)

- CSS-first configuration. All config lives in `public/assets/globals.css`:
  - `@import "tailwindcss" important;` — full framework + `important` strategy (was `important: true` in the old JS config).
  - `@source "../../view";` — points Tailwind at the `.templ` files for class detection (v4 auto-detection doesn't include `.templ`).
  - `@theme { --color-* }` — custom tokens: `primary` (#1b1e2b, bg), `secondary` (#292d3e, bg), `editor` (#d5e2e6, text), `hover` (#dda3b2, text).
- CLI is `@tailwindcss/cli` (the `tailwindcss` bin): `tailwindcss -i public/assets/globals.css -o public/assets/style.css`.
- Output `public/assets/style.css` is the **only** stylesheet referenced (base.templ); `globals.css` is compiled in, not served separately.
- Output is git-ignored; `bun run watch` during `make dev`.
- **v4 color-namespace note:** v3 allowed `textColor.primary` (#fff) and `backgroundColor.primary` (#1b1e2b) to differ. v4 unifies colors under `--color-*`, so `text-primary` on `<body>` was renamed to `text-white`.
- No `tailwind.config.js` — removed in the v4 migration.
- Layout uses fixed-height calculations (`h-[calc(100vh-7rem)]` for editor) — header/footer heights are coupled to these values.

Related: [http-api.md](http-api.md), [../infra/deployment.md](../infra/deployment.md).
