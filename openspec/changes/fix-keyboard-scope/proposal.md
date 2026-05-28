## Why

当前键盘导航使用 `document.addEventListener('keydown', ...)` 全局监听方向键。这会拦截页面上所有区域的方向键——即使焦点在 Shell 容器之外、在其他组件中、在 `<select>`/contentEditable 等标准交互元素中。虽然豁免了 `INPUT`/`TEXTAREA`，但豁免列表必然不完备（`<select>`、`<input type="range">`、`contentEditable` 等全部漏掉）。

行业标准做法是"焦点在哪，事件就去哪"——Radix Tabs、Ant Carousel、Swiper 等同类组件全部使用组件级/容器级事件监听，不拦截全局键盘。

## What Changes

- **Shell 新增 `scrollElement` 引用** — `CeorlShellHandle` 增加 `scrollElement: HTMLDivElement | null`，暴露滚动容器的 DOM 引用
- **App 键盘监听从 `document` 移到 `scrollElement`** — 方向键只拦截 Shell 容器内的事件（通过 DOM 冒泡天然隔离），焦点在容器外时自动不受影响
- **移除 INPUT/TEXTAREA 豁免** — 不需要了。Shell 内的 `<input>` 方向键照样冒泡到容器，但用 `closest('input, textarea, select, [contenteditable]')` 一行豁免
- **移除 `keyboardNav` 关闭时的 preventDefault** — 不需要了。键盘关闭时直接不挂 listener，Shell 外方向键不受任何影响

## Capabilities

### Modified Capabilities
- `keyboard-nav-config`：更新键盘导航范本——从全局 `document` 监听改为容器级监听

## Impact

- `src/components/types.ts` — `CeorlShellHandle` 新增 `scrollElement`
- `src/components/Shell.tsx` — `useImperativeHandle` 新增 `scrollElement`
- `src/App.tsx` — `document.addEventListener` → `shellRef.current?.scrollElement?.addEventListener`；移除 INPUT/TEXTAREA 豁免；keyboardNav 关闭时直接不挂 listener
