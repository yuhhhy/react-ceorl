## Context

Three successive fixes (ignoreRef, safety timeout, scrollend suppression) have been layered onto the focus control system. Each was correct in isolation, but together they reveal a broken architecture: `useScrollSnap` writes to Shell's state via `onIndexChange`, while Shell also writes to its own state via `updateIndex`. Two writers, one state.

The ignoreRef mechanism is particularly fragile — it requires Shell to set a flag on a ref owned by Shell, then `useScrollSnap` reads and clears that same ref. The ref is mutated in three places (focusColumn, scrollend callback, safety timeout), creating race conditions on rapid focus switching.

## Goals / Non-Goals

**Goals:**
- Shell is the single writer of `activeIndex`
- `useScrollSnap` is a pure observer — it reports scroll events, Shell decides
- No cross-component ref mutation (no `ignoreRef` passed to hook)
- Rapid focus switching is correct via request counter guard
- API unchanged: `focusColumn`, `enableKeyboardNav`, `onIndexChange` all work identically

**Non-Goals:**
- Changing `computeIndex` algorithm
- Adding new public API or hooks
- Touch/pinch zoom scroll detection

## Decisions

### 1. Single writer: Shell owns activeIndex

```
旧:  Shell ──set──→ activeIndex
     useScrollSnap ──override→ activeIndex   ← 冲突

新:  Shell ──set──→ activeIndex               ← 唯一写入口
     useScrollSnap ──report→ Shell             ← 只报告
     Shell ──decide→ adopt or ignore
```

**Implementation**: `useScrollSnap` accepts an `onScrollSettle(index: number)` callback. Shell wires this to an internal handler that only fires the callback when no programmatic focus change is in flight.

### 2. Request counter guards against stale scroll completions

```ts
// Shell
const focusSeqRef = useRef(0)

function focusColumn(index: number) {
  focusSeqRef.current += 1
  const seq = focusSeqRef.current
  updateIndex(index)
  col.scrollIntoView(...)
  // When scroll settles, useScrollSnap calls onScrollSettle with seq
}

const onScrollSettle = useCallback((index: number, seq: number) => {
  // Only adopt if this was the latest focus request
  if (seq === focusSeqRef.current) {
    updateIndex(index)
  }
}, [updateIndex])
```

`useScrollSnap` captures the current `seq` when a scroll starts, and passes it back in the settle callback. Shell compares: if `seq` matches the latest request, adopt. Otherwise, this was a stale scroll from an earlier (now superseded) focus change.

**Rapid switching example**:
```
T+0ms:   focusColumn(1) → seq=1 → scrollIntoView
T+50ms:  focusColumn(2) → seq=2 → scrollIntoView (overrides)
T+300ms: scrollend(1) → onScrollSettle(1, seq=1) → 1≠2 → discard
T+350ms: scrollend(2) → onScrollSettle(2, seq=2) → 2=2 → adopt ✓
```

### 3. `useScrollSnap` simplified API

```ts
// 旧
function useScrollSnap(
  containerRef, onIndexChange?, ignoreRef?
): { activeIndex }

// 新
function useScrollSnap(
  containerRef,
  options?: {
    onScrollSettle?: (index: number, seq: number) => void
  }
): { activeIndex: number }
```

No `ignoreRef`. No `onIndexChange` calling with computed index. The hook:
- Returns `{ activeIndex }` for read-only consumers (if any)
- Calls `onScrollSettle(index, seq)` when scroll settles (scrollend or debounce)
- Provides `seq` as the current scroll sequence number

The hook internally tracks a sequence number. Each new scroll gesture (first `scroll` event after a `scrollend`) increments it. When scroll settles, it reports the index + sequence to the caller. The caller decides.

### 4. seq tracking internals

```ts
// Inside useScrollSnap
const seqRef = useRef(0)

// On scrollend:
const handleScrollEnd = () => {
  const idx = computeIndex(el)
  setActiveIndex(idx)
  onScrollSettleRef.current?.(idx, seqRef.current)
}

// On first scroll after settle:
let isScrolling = false
const handleScroll = () => {
  if (!isScrolling) {
    seqRef.current += 1  // new scroll gesture
    isScrolling = true
  }
  // debounce...
}

const handleScrollEnd = () => {
  // ...
  isScrolling = false
}
```

## Risks / Trade-offs

- **Config object overhead**: Switching from positional params to `options` is a minimal API surface change. → Internal to the library, not public API.
- **`seq` counter overflow**: `useRef<number>` wraps at 2^53. → Not a realistic concern.
- **User scroll detection timing**: `isScrolling` flag set on first scroll event after settle. Could misfire if scroll events arrive very slowly. → Highly unlikely in practice; scroll events fire at 60fps.
