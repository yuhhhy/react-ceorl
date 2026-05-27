## Context

`useScrollSnap` uses a dual-event strategy: `scrollend` (native, reliable) and debounced `scroll` (300ms fallback for browsers without `scrollend`). When `focusColumn` triggers a smooth scroll (e.g., 1000px over 300ms), the debounced `scroll` fires at T+300ms when `scrollLeft` is in a transitional state. `computeIndex` reads this intermediate position and returns 0 (or whatever column happens to be at the viewport origin), causing `onIndexChange(0)` to fire incorrectly. Hundred+ ms later, `scrollend` fires and corrects the index.

## Goals / Non-Goals

**Goals:**
- During programmatic scroll (from `focusColumn`), suppress debounced scroll updates
- `scrollend` always fires and provides the final correct index
- No public API change — internal flag mechanism only
- Remove default inner padding so focus highlight sits against content

**Non-Goals:**
- Changing the debounce strategy itself
- Polyfilling `scrollend` for Safari (Safari ships it in Tech Preview, coming soon)

## Decisions

### 1. Ignore flag via ref, not state

**Decision**: Use a `useRef<boolean>` as an ignore flag in `useScrollSnap`, exposed to the caller.

```
useScrollSnap(containerRef, onIndexChange) → { activeIndex, setIgnore }
```

Actually no — returning `setIgnore` couples the hook API to implementation detail. Instead, `useScrollSnap` accepts an optional `ignoreRef: RefObject<boolean>`:

```ts
function useScrollSnap(
  containerRef,
  onIndexChange?,
  ignoreRef?: RefObject<boolean>,
)
```

When `ignoreRef.current === true`, the debounced handler skips `onIndexChange`. `scrollend` always fires and sets `ignoreRef.current = false`.

The caller (CeorlShell) owns the ref:
```ts
const ignoreScrollRef = useRef(false)

function focusColumn(container, index) {
  ignoreScrollRef.current = true
  col.scrollIntoView(...)
  // scrollend will set ignoreScrollRef.current = false
}
```

**Why ref not state**: Setting state causes re-render, ref doesn't. The flag needs to be read synchronously in the scroll handler.

### 2. Clear flag in scrollend handler, not timer

The `scrollend` event fires when the smooth scroll animation completes. At that point, the final scroll position is stable and `computeIndex` returns the correct value. The handler:
1. Computes correct index
2. Calls `onIndexChange`
3. Sets `ignoreRef.current = false`

If the browser doesn't support `scrollend`, the debounced `scroll` fallback fires after the animation completes (the last scroll event + 300ms). In that case the ignore flag was never set (since we only set it for programmatic scrolls that use `scrollIntoView`), and the debounced handler works normally.

## Risks / Trade-offs

- **Safari without `scrollend`**: If Safari lacks `scrollend` and we set the ignore flag, the debounced handler is suppressed. The flag would never be cleared. → Mitigation: only set the ignore flag if `'onscrollend' in container` (feature detection). If not supported, fall back to debounced behavior.
