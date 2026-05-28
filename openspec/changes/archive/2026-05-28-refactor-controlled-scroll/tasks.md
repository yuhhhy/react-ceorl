## 1. CSS — overflow: hidden

- [ ] 1.1 `.ceorl-shell`: `overflow-x: auto; overflow-y: hidden` → `overflow: hidden`
- [ ] 1.2 删除 `scrollbar-width: none`
- [ ] 1.3 删除 `::-webkit-scrollbar` 块

## 2. 提取 scrollToColumn 独立函数

- [ ] 2.1 新建 `src/scrollToColumn.ts` — 从 `doFocus` 提取 L/R 算法
- [ ] 2.2 新建 `src/scrollToColumn.test.ts` — L/R 选择的纯函数测试（~9 个）
- [ ] 2.3 `src/index.ts` 新增 `export { scrollToColumn }`

## 3. Shell 简化

- [ ] 3.1 删除 `useScrollSettle` 调用、`handleScrollSettle`、`focusSeqRef`、`updateIndex`、`isControlled`
- [ ] 3.2 删除 `useState<internalIndex>`，`activeIndex` 直接由 props 读取
- [ ] 3.3 `focusColumn` → `scrollTo`（委托给 `scrollToColumn`）
- [ ] 3.4 `types.ts` 移除 `onIndexChange`、`defaultActiveIndex`
- [ ] 3.5 `types.ts` 移除 `getColumns`，`focusColumn` → `scrollTo`

## 4. 删除 useScrollSettle

- [ ] 4.1 删除 `src/hooks/useScrollSettle.ts`
- [ ] 4.2 删除 `src/hooks/useScrollSettle.test.ts`
- [ ] 4.3 `src/index.ts` 删除 `useScrollSettle` 导出

## 5. Demo + 测试适配

- [ ] 5.1 `App.tsx` 适配新 API
- [ ] 5.2 `Shell.test.tsx` 更新：删 settle 测试，重写 `scrollTo` 测试

## 6. README 重写

- [ ] 6.1 删除所有已移除的 API 描述
- [ ] 6.2 重写为纯受控 API 文档

## 7. 验证

- [ ] 7.1 Run `pnpm test` — 所有测试通过
- [ ] 7.2 Run `pnpm typecheck` — 无类型错误
- [ ] 7.3 Run `pnpm build` — 构建成功
