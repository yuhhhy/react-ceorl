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
  scrollElement: HTMLDivElement | null
}
```

### D2: App 监听 `scrollElement` 而非 `document`

DOM 冒泡天然隔离——焦点在 Shell 外时方向键不上报到容器。

### D3: Shell 容器加 `tabIndex={-1}` + App 自动聚焦

容器级监听依赖焦点在容器内。Shell 容器默认不可聚焦，页面初始无焦点，事件不到达。

**Shell**：
```tsx
<div tabIndex={-1} ref={containerRef} ...>
```
`tabIndex={-1}` — 可编程聚焦，不在 Tab 序中。

**App**：
```tsx
useEffect(() => {
  shellRef.current?.scrollElement?.focus()
}, [])
```

子元素获焦后事件照样冒泡到容器——不影响。这是 Radix FocusScope 等同模式。

### D4: 豁免 Shell 内的可编辑元素

```ts
if ((e.target as HTMLElement).closest('input, textarea, select, [contenteditable]')) return
```

### D5: keyboardNav 关闭时不挂 listener

不挂 listener = 方向键走浏览器默认行为，无需 preventDefault 兜底。

## Risks / Trade-offs

- **[D1] `scrollElement` 为 null 的窗口期** — 组件首次渲染时 ref 尚未赋值。缓解：`shellRef.current?.scrollElement?.focus()` 的 `?.` 链处理。
- **[D3] 自动聚焦可能引发滚动** — `focus()` 可能让浏览器滚动到容器。缓解：Shell 是全视口容器，不产生滚动。
