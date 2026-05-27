## Context

Phase 0 delivered the three layout primitives (CeorlShell, CeorlColumn, CeorlStack) and two hooks (useScrollSnap placeholder, useKeyboardNav). The current CeorlShell is a pure presentational wrapper: it passes `ref` through `forwardRef` but exposes no imperative API, no active-index tracking, and no way to dynamically manage columns. Phase 1 adds programmability.

Key constraints:
- Zero third-party layout/runtime dependencies (CSS-only layout)
- React 19 + TypeScript 6.0
- Use `forwardRef` + `useImperativeHandle` for imperative APIs (React pattern, not external state lib)
- Avoid pulling in state management libraries — colocate state in CeorlShell

## Goals / Non-Goals

**Goals:**
- Controlled mode: CeorlShell accepts `activeIndex`/`defaultActiveIndex` props and fires `onIndexChange(currentIndex)`
- Imperative `scrollToColumn(index)` via ref handle
- Dynamic column list: `columns` prop (array of column descriptors) as primary API; children-based API for simple static layouts
- Unit test suite with vitest + @testing-library/react covering rendering, props, and user interactions
- `useScrollSnap` becomes functional: detects active column from scroll position

**Non-Goals:**
- Drag-to-resize or drag-to-reorder (Phase 2)
- Layout serialization (Phase 3)
- Virtual scrolling or accessibility polish (Phase 4)
- Keyboard modifier shortcuts (Ctrl+N, Ctrl+W) — deferred
- Internationalization or ARIA

## Decisions

### 1. Controlled/uncontrolled pattern: `activeIndex` + `onIndexChange`

**Decision**: Follow React's standard controlled/uncontrolled convention.

```tsx
// Uncontrolled (shell owns state)
<CeorlShell defaultActiveIndex={0} onIndexChange={i => console.log(i)}>
  <CeorlColumn>...</CeorlColumn>
</CeorlShell>

// Controlled (parent owns state)
<CeorlShell activeIndex={idx} onIndexChange={setIdx}>
  <CeorlColumn>...</CeorlColumn>
</CeorlShell>
```

- If `activeIndex` is provided → controlled mode (shell does NOT manage internal state)
- If `defaultActiveIndex` is provided → uncontrolled mode (shell manages `useState`)
- If neither → start at index 0, uncontrolled
- `onIndexChange` fires on scroll-snap settle (debounced) or keyboard navigation

**Alternatives considered**: Single `activeIndex` with optional `onChange` for both modes (React 19 pattern). Rejected because `defaultActiveIndex` makes uncontrolled usage more ergonomic and matches React conventions (e.g., `<input defaultValue>`).

### 2. Imperative handle: `scrollToColumn(index)` via ref

**Decision**: Use `useImperativeHandle` to expose a `CeorlShellHandle` interface:

```ts
interface CeorlShellHandle {
  scrollToColumn: (index: number) => void
  getColumns: () => HTMLDivElement[]
}
```

`scrollToColumn` computes the cumulative scroll offset from column widths and calls `el.scrollTo({ left: offset, behavior: 'smooth' })`.

### 3. Dynamic columns: `columns` prop as declarative API

**Decision**: Add an optional `columns` prop to CeorlShell that accepts an array of column descriptors. When `columns` is provided, CeorlShell renders columns from the array (ignoring children). When omitted, children-as-columns fallback (Phase 0 behavior preserved).

```ts
interface ColumnDescriptor {
  id: string
  width?: ColumnWidth
  content: ReactNode
}
```

This enables parent components to manage column state declaratively:

```tsx
const [columns, setColumns] = useState<ColumnDescriptor[]>([...])

<CeorlShell columns={columns}>
  {/* children ignored when columns prop is set */}
</CeorlShell>
```

Adding/removing columns is done by mutating the `columns` array at the parent level. No imperative `addColumn`/`removeColumn` methods on the shell — keeping the API declarative and React-idiomatic.

**Alternatives considered**: Imperative `addColumn(id, content)` on `CeorlShellHandle`. Rejected because it creates two sources of truth and complicates the controlled story. Parent-managed arrays are simpler to test and integrate.

### 4. `useScrollSnap` completion: active-index from scroll position

**Decision**: Implement active-index detection by dividing `scrollLeft` by each column's cumulative width. Use a `scrollend` event listener (or debounced `scroll` as fallback) to detect when snap settles, then call a provided callback.

The hook signature changes to:

```ts
function useScrollSnap(
  containerRef: RefObject<HTMLDivElement | null>,
  onIndexChange?: (index: number) => void,
  enabled?: boolean,
): { activeIndex: number }
```

**Alternatives considered**: Use `IntersectionObserver`. Rejected — overkill for a simple horizontal scroll container where columns have predictable widths.

### 5. Test infrastructure: vitest + testing-library + jsdom

**Decision**: Standard Vitest setup with React Testing Library.

- `vitest` as test runner
- `@testing-library/react` + `@testing-library/jest-dom` for component testing
- `jsdom` for DOM environment
- Test files co-located with source: `src/components/Shell.test.tsx`, etc.
- `npm run test` / `npm run test:watch` scripts

## Risks / Trade-offs

- **Scroll-snap timing**: `scrollend` event has limited browser support (Chrome 114+, Safari not yet). → Fall back to debounced `scroll` event (300ms debounce).
- **Column width calculation**: Dynamic column widths mean `activeIndex` calculation needs to walk columns and sum widths, not just divide by a constant. → Query `col.offsetWidth` at calculation time.
- **`columns` vs children API conflict**: Both APIs could be used simultaneously. → Document that `columns` takes precedence; warn via console if both provided.
- **Keyboard nav with controlled mode**: Arrow keys should call `onIndexChange` not just `scrollBy`. → Update `useKeyboardNav` to accept an optional `onNavigate` callback.
