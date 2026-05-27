## Why

The current focus/switching model treats CEORL like a carousel — `scrollToColumn(index)` forces the target column to the left edge of the viewport. This destroys spatial context: other visible columns get scrolled out of view unnecessarily. CEORL is a tiling layout where multiple columns coexist in the viewport. Switching focus should use minimum scroll movement to ensure the focused column is visible, preserving the surrounding columns as context.

Additionally, the focus highlight (`box-shadow: inset 2px 0 0`) is too subtle and not user-customizable. It should be a clear four-sided highlight with a well-defined customization path via CSS custom properties.

## What Changes

- **`scrollToColumn` semantics change to `focusColumn`**: The imperative handle method and internal navigation both switch to minimal-scroll behavior. If the target column is already fully visible in the viewport, no scroll occurs. If partially visible or hidden, scroll just enough to bring it into view. **BREAKING** from the previous snap-to-left behavior.
- **Keyboard navigation uses minimal scroll**: Arrow key navigation delegates to the same `focusColumn` logic.
- **Default focus highlight**: Replace the left-only `box-shadow` with a full inset border (`box-shadow: inset 0 0 0 2px var(--ceorl-focus-color)`) using CSS custom property `--ceorl-focus-color` defaulting to `#66ccff`. Users override via `--ceorl-focus-color` or by restyling `[data-active="true"]`.
- **Demo reflects new model**: Prev/Next buttons call `focusColumn` and the active column is clearly highlighted.

## Capabilities

### New Capabilities
- `focus-navigation`: CeorlShellHandle exposes `focusColumn(index)` that uses `scrollIntoView({ inline: 'nearest', behavior: 'smooth' })` semantics. Keyboard navigation and demo buttons use this method. Column fully visible → no-op.
- `css-focus-highlight`: Default four-sided inset focus highlight via `box-shadow` with `--ceorl-focus-color: #66ccff`. Users can customize via CSS custom property or override the `[data-active="true"]` selector.

### Modified Capabilities
<!-- No specs in openspec/specs/ to modify -->

## Impact

- **`src/components/Shell.tsx`**: Replace `scrollToColumn` helper with `focusColumn`; update `handleNavigate` in keyboard nav; rename ref handle method
- **`src/components/types.ts`**: Rename `scrollToColumn` to `focusColumn` in `CeorlShellHandle`
- **`src/ceorl.css`**: Replace highlight rule with CSS custom property approach
- **`src/App.tsx`**: Update button handlers to use `focusColumn`
- **`src/components/Shell.test.tsx`**: Update tests for new semantics
- **`src/hooks/useKeyboardNav.test.ts`**: Update tests if keyboard nav behavior changes
