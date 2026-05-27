## Why

When `focusColumn` triggers a long-distance smooth scroll, the `useScrollSnap` hook's 300ms debounced scroll handler fires mid-scroll. At that point `scrollLeft` is at an intermediate position, and `computeIndex` returns an incorrect value (usually 0). The active index jumps to the wrong column briefly before `scrollend` corrects it. Users see a visual flicker: focus D → flash A → back to D.

Additionally, the default 16px inner padding creates unnecessary space between the focus highlight border and the column content.

## What Changes

- **Suppress index updates during programmatic scroll**: `useScrollSnap` gains an `ignoring` ref flag. `focusColumn` sets the flag before scrolling, and only `scrollend` (not debounced `scroll`) clears it. While the flag is set, debounced scroll events are ignored. **No API change** — this is internal to the hook and Shell.
- **Remove default column padding**: `CeorlColumn`'s `padding` prop defaults to `undefined` (no inline style). The `.ceorl-column-inner` CSS padding is removed. Focus highlight sits directly against content edge.

## Capabilities

### New Capabilities
- `focus-scroll-stability`: Programmatic focus changes via `focusColumn` or keyboard navigation produce a single, correct active index transition. No intermediate incorrect index is emitted during the smooth scroll animation.

### Modified Capabilities
<!-- No existing specs in openspec/specs/ -->

## Impact

- **`src/hooks/useScrollSnap.ts`**: Add `ignoreRef` pattern — debounced scroll handler checks flag, skips update if set. `scrollend` handler always fires and clears flag.
- **`src/components/Shell.tsx`**: `focusColumn` sets ignore flag before scrolling. `handleNavigate` passes ignore signal.
- **`src/components/Column.tsx`**: Change `padding` default from `'16px'` to `undefined`, remove inline style when not set.
- **`src/ceorl.css`**: Remove `padding` from `.ceorl-column-inner` (already absent after ux-polish, verify).
- **`src/components/Column.test.tsx`**: Update padding default test.
- **`src/hooks/useScrollSnap.test.ts`**: Add test for scroll suppression during ignore phase.
