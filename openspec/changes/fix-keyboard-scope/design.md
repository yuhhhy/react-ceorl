## Context

CEORL 经过 `remove-use-keyboard-nav` 重构后，键盘导航从库移到了 Demo（App.tsx）。但实现仍然使用 `document.addEventListener` 全局监听。方向键在各种浏览器/平台有标准交互语义（select 选项切换、range 数值调整、contentEditable 光标移动），全局拦截会破坏这些行为。

## Goals / Non-Goals

**Goals:**
- 键盘导航只在 Shell 容器内响应
- Shell 容器外方向键按操作系统默认行为
- Shell 暴露 `scrollElement` 供消费者挂监听

**Non-Goals:**
- 不改变 `focusColumn` 的行为
- 不改变其他组件接口

## Decisions

### D1: Shell 暴露 `scrollElement` 引用

```ts
interface CeorlShellHandle {
  focusColumn: (index: number) => void
  getColumns: () => HTMLDivElement[]
  scrollElement: HTMLDivElement | null   // 新增
}
```

`containerRef` 已有，只需要在 `useImperativeHandle` 中暴露即可。不需要额外 DOM 创建或重排。

### D2: App 监听 `scrollElement` 而非 `document`

```
之前:
  document.addEventListener('keydown', handler)
  → 全页面方向键被拦截
  → 需要手动豁免 INPUT/TEXTAREA（不完备）
  → keyboardNav=false 仍需挂 handler（preventDefault）

之后:
  scrollElement.addEventListener('keydown', handler)
  → 只在 Shell 容器内响应
  → 天然隔离：焦点在工具栏/浏览器其他区域 → 不到达
  → keyboardNav=false → 直接不挂 listener
  → 仍然豁免 Shell 内的可编辑元素
```

### D3: 豁免 Shell 内的可编辑元素

Shell 容器内仍可能有 `<input>` 等可编辑元素（列内容中的表单）。用 `closest` 一行豁免：

```ts
const handler = (e: KeyboardEvent) => {
  if ((e.target as HTMLElement).closest('input, textarea, select, [contenteditable]')) return
  // ...
}
```

`closest` 比 `tagName` 检查更健壮——覆盖嵌套元素（`<span contenteditable>`、`<input>` wrapper 等）。

### D4: keyboardNav 关闭时不挂 listener

之前即使 `keyboardNav=false` 也需要挂 handler 来 `preventDefault`（阻止浏览器原生滚动）。容器级监听后，不挂 listener = 方向键走浏览器默认行为。

## Risks / Trade-offs

- **[D1] `scrollElement` 为 null 的窗口期** — 组件首次渲染时 ref 尚未赋值。缓解：`shellRef.current?.scrollElement?.addEventListener(...)` 的 `?.` 链已在 demo 中处理。
- **[D2] 容器级监听需要容器获得焦点** — 浏览器默认 div 不可聚焦。但键盘事件通过事件冒泡到达容器，不需要容器聚焦。焦点在容器内任何子元素上即可。
