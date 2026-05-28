## 1. 删除 `useKeyboardNav` hook

- [x] 1.1 删除 `src/hooks/useKeyboardNav.ts`
- [x] 1.2 删除 `src/hooks/useKeyboardNav.test.ts`

## 2. 清理 Shell 中的键盘导航代码

- [x] 2.1 从 `Shell.tsx` 移除 `useKeyboardNav` 导入和调用
- [x] 2.2 从 `Shell.tsx` 的参数解构中移除 `enableKeyboardNav`
- [x] 2.3 从 `Shell.tsx` 删除 `handleNavigate` 回调
- [x] 2.4 从 `CeorlShellProps`（`types.ts`）移除 `enableKeyboardNav` 属性

## 3. 更新公开 API

- [x] 3.1 从 `src/index.ts` 移除 `useKeyboardNav` 导出
- [x] 3.2 从 `src/components/index.ts` 检查并清理相关导出

## 4. Demo 页面添加键盘导航

- [x] 4.1 在 `App.tsx` 中添加 `useEffect` 键盘导航逻辑：监听 ArrowLeft/ArrowRight，跳过输入框，调用 `setActiveIndex` + `focusColumn`

## 5. 修复 focusColumn — 方向感知双面吸附

- [x] 5.1 用方向感知算法替换扫描全部吸附点的实现：右滚用 `colLeft`（左吸附面），左滚用 `colRight - clientWidth`（右吸附面），完整可见不滚

## 6. 测试清理与更新

- [x] 6.1 删除 `Shell.test.tsx` 中的键盘导航测试
- [x] 6.2 删除 `Shell.test.tsx` 中引用 `enableKeyboardNav` 的任何测试引用
- [x] 6.3 更新 `focusColumn` 测试：验证方向感知逻辑（右滚用 colLeft，左滚用 colRight-clientWidth，完整可见不滚）

## 7. 验证

- [x] 7.1 Run `pnpm test` — 所有测试通过
- [x] 7.2 Run `pnpm typecheck` — 无类型错误
- [x] 7.3 Run `pnpm lint` — 无 lint 错误
- [x] 7.4 Run `pnpm build` — 构建成功
