## 1. useScrollSnap — Ignore Flag

- [x] 1.1 Add optional `ignoreRef: RefObject<boolean>` parameter to `useScrollSnap`
- [x] 1.2 In debounced scroll handler: skip `onIndexChange` when `ignoreRef.current === true`
- [x] 1.3 In `scrollend` handler: always compute and emit correct index, then clear `ignoreRef.current`
- [x] 1.4 Feature-detect `scrollend` support; only set ignore flag if supported

## 2. CeorlShell — Wire ignore flag

- [x] 2.1 Create `ignoreScrollRef` in CeorlShell, pass to `useScrollSnap`
- [x] 2.2 Set `ignoreScrollRef.current = true` in `focusColumn` before `scrollIntoView`
- [x] 2.3 Set `ignoreScrollRef.current = true` in `handleNavigate` before `focusColumn`

## 3. CeorlColumn — Remove Default Padding

- [x] 3.1 Change `padding` default from `'16px'` to `undefined`
- [x] 3.2 Only render `style={{ padding }}` on `.ceorl-column-inner` when `padding` is defined

## 4. Test Updates

- [x] 4.1 Update `useScrollSnap.test.ts`: test ignore flag suppresses debounced updates
- [x] 4.2 Update `Column.test.tsx`: test default padding is not set

## 5. Verification

- [x] 5.1 Run `pnpm typecheck` — zero errors
- [x] 5.2 Run `pnpm lint` — zero errors
- [x] 5.3 Run `pnpm test` — all tests pass
- [x] 5.4 Run `pnpm build` — production build succeeds
