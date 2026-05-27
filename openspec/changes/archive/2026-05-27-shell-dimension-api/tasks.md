## 1. WIDTH_MAP — Switch to Percentages

- [x] 1.1 Change `WIDTH_MAP` values in `src/components/types.ts` from `vw`-based to `%`-based
- [x] 1.2 Update `Column.test.tsx` assertions to expect `%` values instead of `vw`

## 2. CSS — Remove Hardcoded Height

- [x] 2.1 Remove `height: 100vh` from `.ceorl-shell` in `src/ceorl.css`

## 3. CeorlShell — Default Dimensions via Inline Style

- [x] 3.1 CeorlShell applies `width: '100vw'` and `height: '100vh'` as default inline styles
- [x] 3.2 Merge consumer `style` prop over the defaults (consumer overrides win)
- [x] 3.3 Ensure `...props` spread works correctly alongside the merged `style`

## 4. Demo — Constrained Shell with Toolbar

- [x] 4.1 Update `App.tsx` to render toolbar and CeorlShell without full-viewport height conflicts
- [x] 4.2 Demonstrate that column widths are correct when shell is constrained

## 5. Test Updates

- [x] 5.1 Update `Column.test.tsx` width assertions to `%` values
- [x] 5.2 Add `Shell.test.tsx` tests for default dimensions and custom `style` override

## 6. Verification

- [x] 6.1 Run `pnpm typecheck` — zero errors
- [x] 6.2 Run `pnpm lint` — zero errors
- [x] 6.3 Run `pnpm test` — all tests pass
- [x] 6.4 Run `pnpm build` — production build succeeds
