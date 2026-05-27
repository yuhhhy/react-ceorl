## 1. Type & API Changes

- [x] 1.1 Add `enableKeyboardNav?: boolean` to `CeorlShellProps` in `src/components/types.ts`
- [x] 1.2 Add `padding?: string` to `CeorlColumnProps` in `src/components/types.ts`
- [x] 1.3 Export new props from `src/components/index.ts` and `src/index.ts`

## 2. CeorlColumn Padding Support

- [x] 2.1 Accept `padding` prop in CeorlColumn component, default to `"16px"`
- [x] 2.2 Apply padding as inline style on `.ceorl-column-inner`

## 3. CeorlShell Keyboard Nav Opt-in

- [x] 3.1 Accept `enableKeyboardNav` prop (default `false`) in CeorlShell
- [x] 3.2 Pass `enableKeyboardNav` to `useKeyboardNav` as the `enabled` parameter (instead of hardcoded `true`)

## 4. Active Column Focus Highlight

- [x] 4.1 CeorlShell applies `data-active="true"` to the CeorlColumn at `activeIndex` (columns mode)
- [x] 4.2 CeorlShell clones children and injects `data-active` for child mode (children mode)
- [x] 4.3 Add `.ceorl-column[data-active="true"]` CSS rule with left border highlight in `src/ceorl.css`

## 5. Demo Page Rewrite

- [x] 5.1 Rewrite `App.tsx` with mixed column widths (at least 1/2, 1/3, 1/4)
- [x] 5.2 Add keyboard nav toggle button in toolbar
- [x] 5.3 Reduce toolbar height/padding to ≤48px
- [x] 5.4 Ensure columns fill remaining viewport height (no excessive page padding)

## 6. Test Updates

- [x] 6.1 Update `CeorlShell.test.tsx`: add tests for `enableKeyboardNav` and `data-active` attribute
- [x] 6.2 Update `CeorlColumn.test.tsx`: add test for `padding` prop
- [x] 6.3 Update `useKeyboardNav.test.ts` if behavior changed

## 7. Verification

- [x] 7.1 Run `pnpm typecheck` — zero errors
- [x] 7.2 Run `pnpm lint` — zero errors
- [x] 7.3 Run `pnpm test` — all tests pass
- [x] 7.4 Run `pnpm build` — production build succeeds
