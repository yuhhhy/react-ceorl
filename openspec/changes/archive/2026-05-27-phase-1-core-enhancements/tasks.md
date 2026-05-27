## 1. Test Infrastructure Setup

- [x] 1.1 Install dev dependencies: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`
- [x] 1.2 Create `vitest.config.ts` with jsdom environment and React plugin config
- [x] 1.3 Add `"test"` and `"test:watch"` scripts to `package.json`
- [x] 1.4 Create `src/test-setup.ts` with `@testing-library/jest-dom` import
- [x] 1.5 Verify test infrastructure: write a smoke test and run `pnpm test`

## 2. Type System Expansion

- [x] 2.1 Add `CeorlShellHandle` interface (scrollToColumn, getColumns) to `src/components/types.ts`
- [x] 2.2 Add `ColumnDescriptor` interface (id, width?, content) to `src/components/types.ts`
- [x] 2.3 Add controlled props to `CeorlShellProps`: `activeIndex?`, `defaultActiveIndex?`, `onIndexChange?`, `columns?`
- [x] 2.4 Export all new types from `src/components/index.ts` and `src/index.ts`

## 3. CeorlShell Controlled/Uncontrolled Mode

- [x] 3.1 Implement controlled vs uncontrolled state logic in `CeorlShell` (internal `useState` only when no `activeIndex` prop)
- [x] 3.2 Implement `useImperativeHandle` exposing `CeorlShellHandle` (scrollToColumn method)
- [x] 3.3 Implement `scrollToColumn(index)` — compute cumulative offset from column widths, call `scrollTo`
- [x] 3.4 Wire active-index tracking: use `useScrollSnap` hook with `onIndexChange` callback inside CeorlShell
- [x] 3.5 Wire keyboard navigation: update `useKeyboardNav` usage to propagate index changes via `onIndexChange`

## 4. Dynamic Columns via `columns` Prop

- [x] 4.1 Implement `columns` prop rendering path in CeorlShell (render CeorlColumn per descriptor)
- [x] 4.2 Ensure `columns` takes precedence over children when both are provided
- [x] 4.3 Handle empty `columns` array gracefully (render empty shell, no crash)

## 5. Hook Completion

- [x] 5.1 Complete `useScrollSnap`: compute activeIndex from scroll position by walking column widths
- [x] 5.2 Add `onIndexChange` callback parameter to `useScrollSnap`
- [x] 5.3 Use `scrollend` event with debounced `scroll` fallback for snap-settle detection
- [x] 5.4 Update `useKeyboardNav` to accept optional `onNavigate?: (dir: 'prev' | 'next') => void` callback
- [x] 5.5 In controlled mode, `useKeyboardNav` calls `onNavigate` but does NOT call `scrollBy` directly (parent triggers scroll via `scrollToColumn`)

## 6. Unit Tests — Components

- [x] 6.1 Write `CeorelShell.test.tsx`: renders children, renders columns prop, forwardRef, defaultActiveIndex, onIndexChange fires on scroll
- [x] 6.2 Write `CeorelColumn.test.tsx`: default width (data-width, style), explicit width, children render inside inner
- [x] 6.3 Write `CeorelStack.test.tsx`: renders children, has ceorl-stack class

## 7. Unit Tests — Hooks

- [x] 7.1 Write `useScrollSnap.test.ts`: listener registration/cleanup, activeIndex calculation, onIndexChange callback
- [x] 7.2 Write `useKeyboardNav.test.ts`: ArrowLeft/Right triggers scroll, disabled suppresses events, onNavigate callback, non-arrow keys ignored

## 8. Integration & Polish

- [x] 8.1 Update `App.tsx` with Phase 1 demo showing controlled mode with dynamic column add/remove
- [x] 8.2 Run `pnpm typecheck` and fix any type errors
- [x] 8.3 Run `pnpm lint` and fix any lint issues
- [x] 8.4 Run `pnpm test` — ensure all tests pass
- [x] 8.5 Run `pnpm build` — ensure production build succeeds
