## 1. Shell 暴露 scrollElement

- [x] 1.1 `types.ts`：`CeorlShellHandle` 新增 `scrollElement: HTMLDivElement | null`
- [x] 1.2 `Shell.tsx`：`useImperativeHandle` 新增 getter `get scrollElement()`

## 2. Shell 容器可聚焦 + App 自动聚焦

- [x] 2.1 `Shell.tsx`：容器 div 加 `tabIndex={-1}`
- [x] 2.2 `App.tsx`：新增 `useEffect` 自动聚焦 `shellRef.current?.scrollElement`

## 3. App 改为容器级键盘监听

- [x] 3.1 将 `document.addEventListener` 改为 `scrollElement.addEventListener`
- [x] 3.2 豁免 editable 改用 `closest('input,textarea,select,[contenteditable]')`
- [x] 3.3 `keyboardNav` 关闭时直接不挂 listener

## 4. 验证

- [x] 4.1 Run `pnpm test` — 所有测试通过
- [x] 4.2 Run `pnpm typecheck` — 无类型错误
- [x] 4.3 Run `pnpm build` — 构建成功
