## Context

CEORL is a React scroll-snap tiling layout library. The focus architecture went through multiple refinements (`focus-state-controller`, `focus-scroll-stability`) to handle race conditions between programmatic scroll and user scroll. A code audit surfaced several residual bugs where the implementation drifted from the spec.

**Key constraint**: all fixes are bug-fixes, not feature work. No new APIs, no breaking API changes. The public contract (`CeorlShellProps`, `CeorlShellHandle`, `CeorlColumnProps`) is unchanged.

## Goals / Non-Goals

**Goals:**
- Make `onIndexChange` fire exactly once per scroll settle (fix double-fire from `doFocus` + settle)
- Deduplicate `onScrollSettle` on browsers with native `scrollend` support
- Fix falsy children guard in Shell
- Align CSS focus highlight with `css-focus-highlight` spec (`outline` → `inset box-shadow`)
- Add regression tests for the above

**Non-Goals:**
- Restructure the `activeIndex` data flow architecture
- Add new props or API surface
- Fix `computeIndex` hardcoded threshold (`-1px`) — not causing observable issues
- Fix `100vw` Windows scrollbar compatibility — no reports of actual problems

## Decisions

### D1: Remove eager `updateIndex` from `doFocus`, let settle path be sole writer

**Current behavior:**
```
doFocus(index)
├── updateIndex(index)           ← eager write (immediate)
├── col.scrollIntoView(...)      ← smooth scroll
└── scrollend / settle
    └── updateIndex(index)       ← confirm write (duplicate)
```

**New behavior:**
```
doFocus(index)
├── focusSeqRef.current += 1     ← advance seq only
├── col.scrollIntoView(...)      ← smooth scroll
└── scrollend / settle
    └── updateIndex(index)       ← sole write
```

**Rationale**: `focus-scroll-stability` spec requires `onIndexChange` called "exactly once — with the final correct index after the scroll animation completes." The seq counter already guards stale callbacks, so removing the eager write makes the settle path the single source of truth.

**Trade-off**: The active index in controlled mode won't update *during* the scroll animation. For a ~200-500ms scroll, this means the parent's `activeIndex` state remains at the old value until the animation completes. However:
- The `data-active` highlight also won't switch mid-animation (arguably better UX — no flicker)
- The parent can always call `onIndexChange` directly if it needs immediate feedback
- The `focusColumn` API remains unchanged — the column IS being scrolled to, just the index confirm happens later

### D2: Cancel debounce timer when scrollend fires

**Current behavior on scrollend-supporting browsers:**

```
scrollstart → handleScroll(): seq++, timer = setTimeout(handleSettle, 300)
scrollend   → handleSettle()     ← fire 1
~300ms      → timer fires handleSettle()  ← fire 2 (duplicate)
```

**New behavior:**

```
scrollstart → handleScroll(): seq++, timer = setTimeout(handleSettle, 300)
scrollend   → clearTimeout(timer)
               handleSettle()    ← fire once
```

**Rationale**: The `scrollend` event fires before the debounce timer, so we only need one of the two. Since `scrollend` is more precise (fires exactly when scrolling stops, not 300ms after), prefer it. The `setTimeout` 300ms path serves as a fallback for browsers without `scrollend`.

### D3: CSS `outline` → `inset box-shadow`

Current CSS:
```css
.ceorl-column[data-active="true"] {
  outline: 2px solid var(--ceorl-focus-color);
  outline-offset: -2px;
}
```

New CSS:
```css
.ceorl-column[data-active="true"] {
  box-shadow: inset 0 0 0 2px var(--ceorl-focus-color);
}
```

**Rationale**: `css-focus-highlight` spec explicitly requires `inset box-shadow`. `outline` was a shortcut that works visually in most cases but:
- Doesn't follow `border-radius` clipping
- Has inconsistent behavior across browsers with `outline-offset: -2px`

`inset box-shadow 0 0 0 2px` produces a 2px inset border on all four sides, does not affect layout, and follows border radius. Exactly what the spec asks for.

### D4: `useKeyboardNav` — add scrollBy after onNavigate

Current:
```ts
if (onNavigateRef.current) {
  onNavigateRef.current('prev')
} else {
  el.scrollBy(...)
}
```

New:
```ts
if (onNavigateRef.current) {
  onNavigateRef.current('prev')
}
el.scrollBy(...)  // always scroll
```

**Rationale**: The spec says "onNavigate('next') SHALL be called, then the container SHALL scroll right." The hook delegates scrolling to the consumer via `onNavigate`, but the hook contract says the hook also scrolls. Since Shell's `handleNavigate` calls `doFocus` which scrolls via `scrollIntoView`, this change ensures a standalone `useKeyboardNav` consumer (without Shell) still gets scrolling behavior.

**Note**: Shell already uses `scrollIntoView` in its `handleNavigate`, so in Shell's usage, the `scrollBy` and `scrollIntoView` both run. The `scrollIntoView` takes precedence visually. This is harmless — `scrollBy` sets a target, `scrollIntoView` overrides it.

### D5: Fix falsy children guard

```tsx
// Before (broken for 0, "" etc)
if (!children) return null

// After
if (Children.count(children) === 0) return null
```

**Rationale**: `children` prop can be `0`, `""`, `false`, `null`, `undefined`. Of these, `null`, `undefined`, `false` should render nothing (React's normal behavior), while `0` and `""` are valid content. `Children.count` correctly handles all cases, returning 0 only when there truly are no children.

## Risks / Trade-offs

- **[D1] Controlled mode sees delayed index update**: Parents relying on immediate `onIndexChange` during scroll animation will see a delay of 200-500ms. Mitigation: this is the spec-required behavior; if parents need immediate feedback they can set index directly alongside calling `focusColumn`.
- **[D2] scrollend not universally supported**: Safari < 15.4 and some mobile browsers lack `scrollend`. Mitigation: the 300ms `setTimeout` fallback remains intact; feature detection via `'onscrollend' in el`.
- **[D3] CSS change is visual**: The `outline` → `inset box-shadow` swap changes visual rendering order (box-shadow is below content, outline is above). Mitigation: `inset box-shadow 0 0 0 2px` with no content-internal shadows renders identically visually.
- **[D4] Double-scroll with Shell**: `scrollBy` + `scrollIntoView` run sequentially when Shell uses `onNavigate`. Mitigation: `scrollIntoView` overrides the intermediate scroll, no visual artifact. Could optimize later but not a regression.

## Open Questions

None — all decisions are straightforward bug fixes.
