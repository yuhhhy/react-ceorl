## Why

`useKeyboardNav` hook 存在三个根本问题：(1) 硬编码方向键、监听 `document` 全局事件，无法由消费者自定义；(2) 上一轮修复（`fix-audit-bugs`）添加的强制 `scrollBy` 覆盖了 `focusColumn` 的"最小移动"语义，导致每次导航都滚动整个视口宽度；(3) hook 承担了不属于布局库的键盘交互职责，违反了"非侵入"设计原则。正确的做法是：库只提供 `focusColumn(index)` 这一滚动接口，键盘绑定完全由消费者负责。

## What Changes

- **移除 `useKeyboardNav` hook** — 删除 `src/hooks/useKeyboardNav.ts` 及对应测试文件，不再作为公开 API
- **从 `CeorlShell` 移除 `enableKeyboardNav` prop** — 键盘导航不再是 Shell 的内置能力。**BREAKING**
- **从公开 API 移除 `useKeyboardNav` 导出** — `src/index.ts` 不再导出该 hook。**BREAKING**
- **键盘导航逻辑迁移到 Demo** — `App.tsx` 中用 `useEffect` + `focusColumn` 实现键盘导航，只监听 demo 页面需要的按键
- **修复 `focusColumn` 最小移动语义** — `scrollIntoView` 无法理解"完整可见"概念，改为手动计算列边界 + `scrollTo`，确保"不在视口才滚动，滚动最少距离"
- **更新 `keyboard-nav-config` spec** — 废弃 `enableKeyboardNav` prop 和 hook 相关 requirement
- **更新 `focus-navigation` spec** — 移除键盘相关 requirement；用精确的 `scrollTo` 算法描述 `focusColumn` 的最小移动行为

## Capabilities

### Modified Capabilities
- `keyboard-nav-config`：废弃 `enableKeyboardNav` prop 和 `useKeyboardNav` hook；键盘导航完全由消费者通过 `focusColumn` API 自行实现
- `focus-navigation`：移除"Keyboard navigation uses minimal scroll" requirement — 键盘交互不再是库的职责

## Impact

- `src/hooks/useKeyboardNav.ts` — 删除
- `src/hooks/useKeyboardNav.test.ts` — 删除
- `src/components/Shell.tsx` — 移除 `useKeyboardNav` 导入和调用、移除 `enableKeyboardNav` prop 解构、移除 `handleNavigate` 回调
- `src/components/types.ts` — 从 `CeorlShellProps` 移除 `enableKeyboardNav`
- `src/index.ts` — 移除 `useKeyboardNav` 导出
- `src/App.tsx` — 添加 demo 自己的键盘导航逻辑（`useEffect` + `focusColumn`）
- `src/components/Shell.test.tsx` — 移除键盘导航相关测试，更新 `onIndexChange` 测试
