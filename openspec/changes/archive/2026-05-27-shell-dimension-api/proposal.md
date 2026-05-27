## Why

CeorlShell currently hardcodes full-viewport dimensions: `height: 100vh` in CSS and column widths in `vw` units. This makes it impossible to embed the shell alongside external toolbars, navigation bars, or sidebars. Every real application has chrome (headers, sidebars, status bars), and a layout library that only works in a vacuum is not integrable. Column widths must be relative to the shell container, not the viewport.

## What Changes

- **Remove hardcoded `height: 100vh` from CSS**: Shell height defaults to `100vh` via inline style, overridable by consumer via `style` or explicit props. **BREAKING** for any CSS that depended on `.ceorl-shell { height: 100vh }`.
- **Column widths switch from `vw` to `%`**: `WIDTH_MAP` values change from viewport-relative (`50vw`, `calc(100vw / 3)`, `25vw`) to container-relative (`50%`, `33.333%`, `25%`). Columns now size relative to the shell's width. **BREAKING** visual change — columns in full-viewport shells render identically, but behavior changes for non-full-width shells.
- **Shell defaults to `100vw` × `100vh`**: CeorlShell applies `width: 100vw` and `height: 100vh` as default inline styles. Consumers override via the existing `style` prop or by setting `width`/`height` HTML attributes.
- **Demo embeds shell in a page with toolbar**: App.tsx demonstrates a constrained shell (toolbar at top, shell below) to validate the API.

## Capabilities

### New Capabilities
- `shell-dimensions`: CeorlShell renders with configurable width and height (defaults `100vw` × `100vh`). Column widths are percentage-based and relative to the shell container, not the viewport.

### Modified Capabilities
<!-- No existing specs in openspec/specs/ to modify -->

## Impact

- **`src/ceorl.css`**: Remove `height: 100vh` from `.ceorl-shell`
- **`src/components/types.ts`**: Update `WIDTH_MAP` values from `vw` to `%`
- **`src/components/Shell.tsx`**: Add default `width`/`height` inline styles, merge with consumer `style`
- **`src/components/Column.tsx`**: No changes needed (reads `WIDTH_MAP` which is updated)
- **`src/App.tsx`**: Demonstrate shell with constrained height alongside toolbar
- **`src/components/Column.test.tsx`**: Update expected width values to `%`-based
- **`src/components/Shell.test.tsx`**: Add tests for custom `width`/`height`
