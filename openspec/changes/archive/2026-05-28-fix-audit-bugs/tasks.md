## 1. Core Bug Fixes

- [x] 1.1 Fix `useScrollSnap` double settle on scrollend-capable browsers: cancel debounce timer in `handleSettle` when `scrollend` fires
- [x] 1.2 Fix `Shell.doFocus` double onIndexChange: remove eager `updateIndex(index)` call, let scroll settle be sole writer; keep `focusSeqRef` increment
- [x] 1.3 Fix `Shell.renderColumns` falsy children guard: replace `!children` with `Children.count(children) === 0`
- [x] 1.4 Fix `useKeyboardNav` contract: add `scrollBy` call after `onNavigate` invocation so hook always performs scroll

## 2. CSS Alignment

- [x] 2.1 Replace `outline` + `outline-offset` with `inset box-shadow` in `.ceorl-column[data-active="true"]` CSS rule
- [x] 2.2 Remove now-unused `outline-offset` from base `.ceorl-column` rules if present

## 3. Test Fixes & Additions

- [x] 3.1 Fix `defaultActiveIndex` weak test: assert `data-active="true"` on second column when `defaultActiveIndex={1}`
- [x] 3.2 Add regression test: `onIndexChange` called exactly once when `focusColumn` triggers scroll
- [x] 3.3 Add regression test: `onScrollSettle` fires exactly once in scrollend-capable environment
- [x] 3.4 Add regression test: Shell renders children `{0}` correctly
- [x] 3.5 Add regression test: `useKeyboardNav` calls `scrollBy` even with `onNavigate` callback

## 4. Verification

- [x] 4.1 Run `pnpm test` — all existing 43 tests pass; 5 new tests pass
- [x] 4.2 Run `pnpm typecheck` — no new type errors
- [x] 4.3 Run `pnpm lint` — no new lint errors
- [x] 4.4 Run `pnpm build` — production build succeeds
