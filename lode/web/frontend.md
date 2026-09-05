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

- `view/document.templ` splits content on `\n` and renders each line as a numbered `<li><code>` — line numbers for free, no JS highlighting.
- `icons.Tools(slug)` header provides per-paste actions (raw/copy/new links).

## Tailwind

- `tailwindcss build -o public/assets/style.css` (npm script `build`, used by `make generate`); `pnpm run watch` during `make dev`.
- Source `public/assets/globals.css`; output `style.css` is git-ignored.
- Layout uses fixed-height calculations (`h-[calc(100vh-7rem)]` for editor) — header/footer heights are coupled to these values.

Related: [http-api.md](http-api.md), [../infra/deployment.md](../infra/deployment.md).
