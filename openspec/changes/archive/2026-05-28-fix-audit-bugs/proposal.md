## Why

Code audit revealed several runtime bugs and spec-implementation mismatches that affect correctness: `onIndexChange` fires twice per focus, scroll-settle fires twice on scrollend-capable browsers, and a falsy children guard causes silent render failures. These are correctness issues, not feature requests.

## What Changes

- **Fix double `onIndexChange` on programmatic focus** — `focusColumn` currently calls `updateIndex` immediately then again on scroll settle, violating the "exactly once" contract. Remove the immediate `updateIndex` call from `doFocus`, letting the settle path be the sole writer.
- **Fix double `onScrollSettle` on scrollend-supporting browsers** — when `scrollend` is supported, both the `scrollend` listener and the debounced `scroll` timer fire `handleSettle`. Cancel the debounce timer on `scrollend`.
- **Fix falsy children guard in Shell** — `!children` rejects `0`, `""` and other valid-but-falsy React nodes. Use `React.Children.count`.
- **Align CSS focus highlight with spec** — `css-focus-highlight` spec mandates `inset box-shadow`; code uses `outline`. Switch to `box-shadow: inset 0 0 0 2px`.
- **Fix `useKeyboardNav` contract** — when `onNavigate` is provided, the hook skips `scrollBy` but the spec says scroll should still occur. Add `scrollBy` call after `onNavigate`.
- **Strengthen test coverage** — add missing assertions for `defaultActiveIndex`, add regression tests for double-fire fixes, replace fragile `Object.defineProperty` mocks.

## Capabilities

### New Capabilities
- `scrollend-dedup`: prevent duplicate `onScrollSettle` callbacks when browser supports native `scrollend` event

### Modified Capabilities
- `focus-scroll-stability`: `onIndexChange` now fires exactly once per focus transition (was twice)
- `focus-state-controller`: `doFocus` no longer eagerly writes `activeIndex`; only settle path writes
- `css-focus-highlight`: highlight uses `inset box-shadow` instead of `outline`
- `test-suite`: add regression tests for scrollend dedup and single-fire onIndexChange

## Impact

- `src/hooks/useScrollSnap.ts` — add timer cleanup on scrollend
- `src/components/Shell.tsx` — remove eager `updateIndex` from `doFocus`; fix `!children` guard
- `src/ceorl.css` — replace outline with box-shadow for [data-active="true"]
- `src/hooks/useKeyboardNav.ts` — add scrollBy after onNavigate call
- `src/hooks/useScrollSnap.test.ts` — add dedup regression test
- `src/components/Shell.test.tsx` — fix weak defaultActiveIndex test; add single-fire test
