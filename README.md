# CEORL — Ceorl Rolling Layout

**Composable Ergonomic Ordered Rolling Layouts**

React horizontal-scrolling tiling layout component library. Inspired by [niri](https://github.com/YaLTeR/niri) (scrollable-tiling Wayland compositor).

```
┌──────────────────────────────────────────────────────────────┐
│ [ Panel A 1/2 ][ Panel B 1/3 ][ Panel C 1/4 ][ Panel D ] → │
└──────────────────────────────────────────────────────────────┘
```

## Features

- **Horizontal tiling** — Panels arranged as columns, scroll horizontally
- **CSS snap-to-column** — Scroll snaps to column boundaries, no intermediate positions
- **Variable column widths** — 1/2, 1/3, 1/4 viewport/shell width per column
- **Vertical stacking** — Split a column vertically into sub-panels via `CeorlStack`
- **Controlled / uncontrolled** — Full React state management: `activeIndex`, `onIndexChange`
- **Focus navigation** — `focusColumn(index)` with minimal scroll; only moves viewport if column is not visible
- **Focus highlight** — Active column gets `outline` highlight, customizable via `--ceorl-focus-color`
- **Zero layout dependencies** — Pure CSS (`scroll-snap`) + React

## Quick Start

```tsx
import { CeorlShell, CeorlColumn, CeorlStack } from 'ceorl'
import 'ceorl/styles.css'

function App() {
  return (
    <CeorlShell>
      <CeorlColumn width="1/2">
        <h2>Panel A</h2>
        <p>½ width column</p>
      </CeorlColumn>
      <CeorlColumn width="1/3">
        <CeorlStack>
          <div>Sub-panel 1</div>
          <div>Sub-panel 2</div>
        </CeorlStack>
      </CeorlColumn>
      <CeorlColumn width="1/4">
        <p>¼ width column</p>
      </CeorlColumn>
    </CeorlShell>
  )
}
```

## Components

### CeorlShell

Top-level horizontal scroll-snap container.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `activeIndex` | `number` | — | Controlled active column index |
| `defaultActiveIndex` | `number` | `0` | Initial active index (uncontrolled) |
| `onIndexChange` | `(index: number) => void` | — | Called when active column changes |
| `columns` | `ColumnDescriptor[]` | — | Declarative column array |
| `enableKeyboardNav` | `boolean` | `false` | Enable ←/→ arrow key navigation |

**Imperative handle** (`ref.current`):

| Method | Description |
|--------|-------------|
| `focusColumn(index)` | Focus column with minimal scroll (no-op if already visible) |
| `getColumns()` | Returns column DOM elements |

### CeorlColumn

Single column container.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `'1/2' \| '1/3' \| '1/4'` | `'1/3'` | Column width ratio |
| `padding` | `string` | — | CSS padding value for inner content |

### CeorlStack

Vertical stacking container inside a column. Children auto-share height.

### ColumnDescriptor

```ts
interface ColumnDescriptor {
  id: string
  width?: ColumnWidth
  content: ReactNode
}
```

## Hooks

| Hook | Description |
|------|-------------|
| `useScrollSnap(ref, options?)` | Pure observer: detects scroll-settle events, reports index + sequence number |
| `useKeyboardNav(ref, enabled?, onNavigate?)` | Binds left/right arrow keys for navigation |

## Customization

### Focus Highlight

```css
/* Change highlight color */
.ceorl-column { --ceorl-focus-color: #ff6b35; }

/* Or override entirely */
.ceorl-column[data-active="true"] {
  outline: 3px dashed #00ff88;
  outline-offset: -3px;
}
```

### Shell Dimensions

```tsx
{/* Full viewport (default) */}
<CeorlShell>...</CeorlShell>

{/* Embedded with toolbar */}
<CeorlShell style={{ height: 'calc(100vh - 48px)', width: '100%' }}>
  ...
</CeorlShell>
```

## Dev

```bash
pnpm install
pnpm dev       # Start dev server
pnpm test      # Run tests (43 tests)
pnpm typecheck # Type check
pnpm lint      # Lint
pnpm build     # Production build
```

## License

MIT
