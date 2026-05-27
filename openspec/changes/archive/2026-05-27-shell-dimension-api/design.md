## Context

CeorlShell currently hardcodes `height: 100vh` in CSS and column widths in `vw` units (viewport-relative). This was fine for a full-page demo but prevents embedding the shell inside a page with external chrome. The core fix is twofold: make shell dimensions overridable, and make column widths container-relative.

## Goals / Non-Goals

**Goals:**
- Shell height and width are consumer-configurable, with `100vw`/`100vh` defaults for backward compatibility
- Column widths (`1/2`, `1/3`, `1/4`) are relative to the shell container, not the viewport
- Shell uses inline styles for defaults, allowing `style` prop to override cleanly

**Non-Goals:**
- Responsive / breakpoint-based column widths
- Percentage-based height for columns (columns always fill shell height)
- Min/max constraints on column width

## Decisions

### 1. Percentage-based column widths (`%` instead of `vw`)

**Decision**: Change `WIDTH_MAP` from viewport-relative to container-relative:

```ts
const WIDTH_MAP: Record<ColumnWidth, string> = {
  '1/2': '50%',
  '1/3': '33.333%',
  '1/4': '25%',
}
```

When the shell is `100vw` wide (default), `50%` = `50vw` — identical visual result. When the shell is constrained (e.g., `calc(100vw - 240px)` for a sidebar), `50%` correctly gives half the shell width.

CSS `%` on flex children resolves against the flex container's content width, so `overflow-x: auto` still allows content to exceed the container.

**Alternatives considered**: 
- Keep `vw` and use a CSS variable on the shell that columns reference → too complex
- `calc()` based on shell width → not possible without JS
- Pass shell width as React context → overkill for a CSS property

### 2. Shell defaults via inline style, not CSS

**Decision**: Remove `height: 100vh` from `.ceorl-shell` CSS. Instead, CeorlShell applies `width: '100vw'` and `height: '100vh'` as default inline styles:

```tsx
<div
  style={{
    width: '100vw',
    height: '100vh',
    ...style,  // consumer's style prop
  }}
>
```

This allows consumers to override with `<CeorlShell style={{ height: 'calc(100vh - 64px)' }}>` or `<CeorlShell style={{ width: '800px' }}>`.

Both `width` and `height` come from `HTMLAttributes<HTMLDivElement>` which provides `width?: number | string` and `height?: number | string`. No new prop types needed — just handle the defaults.

**Alternatives considered**:
- Custom `shellWidth`/`shellHeight` props → redundant with HTML attributes, more API surface
- CSS custom properties (`--ceorl-width`) → less intuitive than inline style

### 3. Style merging strategy

The component destructures `style` from the spread props and merges it AFTER the defaults:

```tsx
{ width, height, style, ...rest } = props
// style = consumer's style
// merged = { width: '100vw', height: '100vh', ...style }
```

This means consumer's `style.height` overrides the default `100vh`. Consumer's `style.width` overrides `100vw`. Consumer's other styles (background, etc.) pass through.

Since `width` and `height` from HTMLAttributes could also be set directly (`<CeorlShell width={800}>`), we need to respect those too. But using `style` is the idiomatic React way.

### 4. Column height: always 100% of shell

Column height remains `height: 100%` in CSS. This means columns fill the shell's height regardless of what that height is. The `.ceorl-shell` no longer forces viewport height, so columns flex to whatever shell height the consumer sets.

## Risks / Trade-offs

- **`%` vs `vw` subtle rendering differences**: At fractional viewport widths, `33.333%` vs `calc(100vw / 3)` can differ by subpixel amounts. → Negligible for layout purposes; CSS rounding handles it.
- **Shell without explicit width may collapse**: If consumer doesn't set width, shell defaults to `100vw`. If they override with an empty string, shell may collapse. → Document the default behavior.
