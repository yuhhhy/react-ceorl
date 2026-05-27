## Why

Phase 1 delivered core API functionality (controlled mode, dynamic columns, tests) but the user experience is rough. Keyboard arrow keys are hard-bound with no way to opt out, there's no visual indicator showing which column is active, column inner padding is hardcoded, and the demo page lacks variety. These issues make the library feel unfinished and limit its usefulness in real applications.

## What Changes

- **Keyboard nav is opt-in**: CeorlShell's `enableKeyboardNav` prop defaults to `false`. Arrow keys no longer hijack scrolling unless explicitly enabled. **BREAKING** from Phase 1 behavior.
- **Active column focus highlight**: The active column gets a CSS highlight effect (subtle border or glow) driven by a `.ceorl-column--active` class applied by CeorlShell.
- **Customizable column padding**: CeorlColumn accepts a `padding` prop to override the default 16px inner padding. Accepts a CSS dimension string.
- **Demo page improvements**: Shows columns with mixed width ratios (1/2, 1/3, 1/4), reduced page chrome padding, and demonstrates opt-in keyboard nav toggle.

## Capabilities

### New Capabilities
- `keyboard-nav-config`: CeorlShell accepts `enableKeyboardNav` prop (default `false`). When `true`, arrow keys navigate columns. When `false`, arrow keys are ignored by the shell.
- `focus-highlight`: CeorlShell applies `data-active` attribute to the currently active CeorlColumn. CSS styles the active column with a visual highlight (left border accent).
- `column-padding`: CeorlColumn accepts optional `padding` prop (CSS string, e.g. `"8px"`, `"24px 16px"`). Defaults to `"16px"`. Applied as inline style on `.ceorl-column-inner`.
- `demo-variety`: Demo page uses mixed column widths (1/2, 1/3, 1/4), reduced toolbar height, optimal page layout, and keyboard nav toggle button.

### Modified Capabilities
<!-- No existing specs in openspec/specs/ to modify yet -->

## Impact

- **`src/components/Shell.tsx`**: Add `enableKeyboardNav` prop, apply `data-active` to active column, pass `activeIndex` down to children
- **`src/components/Column.tsx`**: Accept `padding` prop, forward `data-active` attribute
- **`src/components/types.ts`**: Add `enableKeyboardNav` to CeorlShellProps, `padding` to CeorlColumnProps
- **`src/ceorl.css`**: Add `.ceorl-column[data-active]` highlight styles
- **`src/App.tsx`**: Rewrite demo with varied widths, keyboard toggle, better layout
- **`src/components/Shell.test.tsx`**: Add tests for `enableKeyboardNav` and `data-active` behavior
- **`src/components/Column.test.tsx`**: Add test for `padding` prop
