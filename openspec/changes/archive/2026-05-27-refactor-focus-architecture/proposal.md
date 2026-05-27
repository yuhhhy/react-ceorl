## Why

The current focus architecture has a fundamental flaw: `useScrollSnap` is both observer and judge. It watches scroll events, computes an active index from scroll position, and calls `onIndexChange` to override what Shell already decided. Three successive patches (ignoreRef, safety timeout, scrollend suppression) have been applied to suppress this override, but each adds complexity without fixing the root cause: **activeIndex should have exactly one author, not two**.

Rapid focus switching exposes residual races — overlapping timeouts, stale ignore flags, and the fundamental impossibility of distinguishing "scroll caused by user" from "scroll caused by programmatic focus change" once the scroll event enters the hook.

## What Changes

- **Shell is the sole owner of `activeIndex`**: Shell chooses when to update it (`focusColumn`, `handleNavigate`, or in response to user scroll events). The hook never calls `onIndexChange` on its own.
- **`useScrollSnap` becomes a pure observer**: It detects scroll-settle events and reports the observed column index back to the caller via a callback. Shell decides whether to adopt it.
- **Remove `ignoreRef` mechanism entirely**: No cross-component ref mutation. No safety timeouts.
- **Request counter for rapid switching**: Each `focusColumn`/`handleNavigate` increments a counter. When the scroll settles, only the latest request is honored. Stale scroll completions are discarded.
- **`useScrollSnap` returns `activeIndex` for read-only use**: The hook still computes and exposes its observed index for diagnostics/external consumers, but no longer pushes it into Shell's state.

## Capabilities

### New Capabilities
- `focus-state-controller`: CeorlShell is the single source of truth for `activeIndex`. Programmatic focus changes (`focusColumn`, keyboard nav) set the index immediately. User scroll events are observed by `useScrollSnap` and passed to Shell, which decides whether to update.

### Modified Capabilities
<!-- None in openspec/specs/ -->

## Impact

- **`src/hooks/useScrollSnap.ts`** — Complete rewrite: no `ignoreRef`, no `onIndexChange` calls during programmatic scroll. Exposes `onScrollSettle(index)` callback and `requestCounter` ref for caller guard.
- **`src/components/Shell.tsx`** — Remove `ignoreScrollRef` and related timeouts. Add request counter guard. Adopt `onScrollSettle` callback instead of passing `onIndexChange` directly.
- **`src/hooks/useScrollSnap.test.ts`** — Rewrite tests for new observer contract.
- **`src/components/Shell.test.tsx`** — Update tests that exercise scroll-based focus behavior.
