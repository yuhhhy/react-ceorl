## 1. Type & API Rename

- [x] 1.1 Rename `scrollToColumn` → `focusColumn` in `CeorlShellHandle` interface
- [x] 1.2 Update exports in `src/components/index.ts` (types only, no code change needed)

## 2. CSS Focus Highlight

- [x] 2.1 Replace `[data-active="true"]` rule: use `box-shadow: inset 0 0 0 2px var(--ceorl-focus-color)`
- [x] 2.2 Add `--ceorl-focus-color: #66ccff` on `.ceorl-column`

## 3. CeorlShell — focusColumn Implementation

- [x] 3.1 Replace `scrollToColumn` helper with `focusColumn` using `col.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })`
- [x] 3.2 Update `useImperativeHandle` to expose `focusColumn`
- [x] 3.3 Update `handleNavigate` to call `focusColumn` instead of manual offset scroll

## 4. Demo Update

- [x] 4.1 Update `App.tsx` Prev/Next button handlers to call `shellRef.current?.focusColumn(next)`

## 5. Test Updates

- [x] 5.1 Update `Shell.test.tsx`: rename `scrollToColumn` → `focusColumn`, update assertions
- [x] 5.2 Add `Shell.test.tsx` test: `focusColumn` on already-visible column does not scroll
- [x] 5.3 Update `Column.test.tsx` if CSS assertions changed
- [x] 5.4 Update `useKeyboardNav.test.ts` if behavior changed

## 6. Verification

- [x] 6.1 Run `pnpm typecheck` — zero errors
- [x] 6.2 Run `pnpm lint` — zero errors
- [x] 6.3 Run `pnpm test` — all tests pass
- [x] 6.4 Run `pnpm build` — production build succeeds
