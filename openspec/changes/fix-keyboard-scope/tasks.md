## 1. Shell 暴露 scrollElement

- [x] 1.1 `types.ts`：`CeorlShellHandle` 新增 `scrollElement: HTMLDivElement | null`
- [x] 1.2 `Shell.tsx`：`useImperativeHandle` 新增 `scrollElement: containerRef.current`

## 2. App 改为容器级键盘监听

- [x] 2.1 将 `document.addEventListener('keydown', handler)` 改为 `shellRef.current?.scrollElement?.addEventListener('keydown', handler)`
- [x] 2.2 移除 `INPUT`/`TEXTAREA` 的 tagName 豁免，改为 `closest('input, textarea, select, [contenteditable]')`
- [x] 2.3 `keyboardNav` 关闭时直接不挂 listener（移除 preventDefault 逻辑）

## 3. 验证

- [x] 3.1 Run `pnpm test` — 所有测试通过
- [x] 3.2 Run `pnpm typecheck` — 无类型错误
- [x] 3.3 Run `pnpm build` — 构建成功
