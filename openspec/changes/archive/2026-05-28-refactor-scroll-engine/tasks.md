## 1. CSS 清理

- [x] 1.1 从 `.ceorl-shell` 删除 `scroll-snap-type: x mandatory` 和 `scroll-behavior: smooth`
- [x] 1.2 从 `.ceorl-column` 删除 `scroll-snap-align: start`

## 2. 重命名 `useScrollSnap` → `useScrollSettle`

- [x] 2.1 重命名文件 `useScrollSnap.ts` → `useScrollSettle.ts`
- [x] 2.2 重命名文件 `useScrollSnap.test.ts` → `useScrollSettle.test.ts`
- [x] 2.3 更新函数名和接口名：`ScrollSnapOptions` → `ScrollSettleOptions`
- [x] 2.4 更新 `Shell.tsx` 中的导入
- [x] 2.5 更新 `src/index.ts` 中的导出

## 3. 测试更新

- [x] 3.1 更新 `useScrollSettle.test.ts` 中的 describe/it 名称
- [x] 3.2 确认所有现有测试仍然通过

## 4. 验证

- [x] 4.1 Run `pnpm test` — 所有测试通过
- [x] 4.2 Run `pnpm typecheck` — 无类型错误
- [x] 4.3 Run `pnpm lint` — 无 lint 错误
- [x] 4.4 Run `pnpm build` — 构建成功
