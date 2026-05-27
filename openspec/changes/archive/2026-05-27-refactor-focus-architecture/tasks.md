## 1. useScrollSnap — Rewrite as Pure Observer

- [x] 1.1 Remove `onIndexChange` and `ignoreRef` parameters
- [x] 1.2 Add `options.onScrollSettle?: (index: number, seq: number) => void` parameter
- [x] 1.3 Add internal `seqRef` counter, incremented on each new scroll gesture
- [x] 1.4 `handleScrollEnd` calls `onScrollSettle(index, seq)` instead of `onIndexChange(index)`
- [x] 1.5 Remove internal `onIndexChangeRef` and related `useEffect`

## 2. CeorlShell — Adopt Single-Writer Model

- [x] 2.1 Remove `ignoreScrollRef` and all safety timeouts
- [x] 2.2 Add `focusSeqRef` counter for request ordering
- [x] 2.3 `focusColumn` / `handleNavigate`: increment `focusSeqRef`, call `updateIndex`, then `scrollIntoView`
- [x] 2.4 Wire `onScrollSettle` callback: only adopt index if settle seq matches `focusSeqRef`
- [x] 2.5 Pass `useScrollSnap(containerRef, { onScrollSettle: handleScrollSettle })`

## 3. Demo & Integration

- [x] 3.1 Verify demo Prev/Next buttons and keyboard nav work correctly
- [x] 3.2 Verify manual scrolling updates focus correctly

## 4. Test Updates

- [x] 4.1 Rewrite `useScrollSnap.test.ts` for new observer contract (seq tracking, settle callback)
- [x] 4.2 Update `Shell.test.tsx` for single-writer model (no ignoreRef, seq guard)
- [x] 4.3 Add test: rapid focus changes produce correct final index

## 5. Verification

- [x] 5.1 Run `pnpm typecheck` — zero errors
- [x] 5.2 Run `pnpm lint` — zero errors
- [x] 5.3 Run `pnpm test` — all tests pass
- [x] 5.4 Run `pnpm build` — production build succeeds
