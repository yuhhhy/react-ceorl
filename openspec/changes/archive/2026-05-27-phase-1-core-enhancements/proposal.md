## Why

Phase 0 validated the core layout primitives (Shell, Column, Stack) are viable with pure CSS + React. However, the current implementation is purely presentational — it exposes no programmatic control over the active column, no way to dynamically add or remove columns, and has zero test coverage. Phase 1 transforms CEORL from a static layout experiment into an integrable library component by adding controlled/uncontrolled API modes, dynamic column management, and a test suite.

## What Changes

- **CeorlShell API expansion**: Add `activeIndex` / `defaultActiveIndex` props and `onIndexChange` callback to support controlled and uncontrolled modes
- **Dynamic column management**: CeorlShell exposes imperative methods (`addColumn`, `removeColumn`) or accepts a managed column model for runtime column CRUD
- **Test infrastructure**: Set up vitest + @testing-library/react with jsdom, write unit tests for all components (Shell, Column, Stack) and hooks (useScrollSnap, useKeyboardNav)
- **Ref forwarding and DOM refs**: Ensure CeorlShell ref exposes scroll container for programmatic `scrollToColumn(index)` usage
- **Type exports**: Ensure all public types, props interfaces, and hook signatures are properly exported from the library entry point

## Capabilities

### New Capabilities
- `controlled-shell`: Controlled/uncontrolled mode for CeorlShell — accept `activeIndex`/`defaultActiveIndex` props and `onIndexChange` callback; expose `scrollToColumn(index)` via ref
- `dynamic-columns`: CeorlShell supports adding and removing columns at runtime — either through declarative column state management or imperative API
- `test-suite`: Unit tests covering all components (CeorlShell, CeorlColumn, CeorlStack) and hooks (useScrollSnap, useKeyboardNav) using vitest + @testing-library/react

### Modified Capabilities
<!-- None — no existing specs to modify -->

## Impact

- **`src/components/Shell.tsx`**: Add controlled/uncontrolled props, ref imperative handle for `scrollToColumn`
- **`src/components/Column.tsx`**: Accept `index` or key for identification; no major API change expected
- **`src/components/types.ts`**: Add new prop types (`CeorlShellControlledProps`, imperative handle interface)
- **`src/hooks/useScrollSnap.ts`**: Complete active-index detection logic (was placeholder)
- **`src/hooks/useKeyboardNav.ts`**: May need changes to work with controlled mode (emit `onIndexChange`)
- **`src/index.ts`**: Export new types and interfaces
- **Dev dependencies**: Add `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`
- **Config**: Add `vitest.config.ts`, test scripts to `package.json`
