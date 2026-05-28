## Context

`useKeyboardNav` hook 从 Phase 0 原型阶段就存在，负责监听 `document` 上的 ArrowLeft/ArrowRight 按键并触发滚动。随着架构演进，它的设计缺陷逐渐暴露：

1. **硬编码按键**：无法支持消费者自定义键位
2. **全局监听**：`document.addEventListener` 劫持所有按键，包括输入框
3. **越界滚动**：Shell 提供 `onNavigate` 回调后，hook 又强制 `scrollBy`，两套滚动逻辑冲突
4. **职责越位**：键盘交互是消费者的事，不是布局库的事

同时，`fix-audit-bugs` 的修复（task 1.4）将 `scrollBy` 从条件执行改为无条件执行，导致键盘导航时 `scrollIntoView`（最小滚动）被 `scrollBy`（全视口宽度）覆盖——这是一个回归。

CEORL 的设计原则是"只负责布局呈现层，不介入组件通信"。键盘交互显然不是布局层。

## Goals / Non-Goals

**Goals:**
- 从库中彻底移除 `useKeyboardNav` hook 及其所有关联代码
- 从 `CeorlShellProps` 移除 `enableKeyboardNav` prop
- 从公开 API 移除 `useKeyboardNav` 导出
- Demo 页面自行实现键盘导航（用 `useEffect` + `focusColumn`）
- 更新相关 specs 反映职责边界

**Non-Goals:**
- 不改变 `useScrollSnap` 的行为
- 不提供替代的键盘库或快捷键注册机制

## Decisions

### D1: 彻底移除，不提供替代

**为什么不提供"参数化按键"的中庸方案？**

因为参数化方案仍然把键盘交互模型编码在库中。消费者如果想用 Vim 风格键（h/l）、Emacs 风格键（C-n/C-p）、手势、游戏手柄——每次都需要改 hook API。这不是扩展性问题。

**职责边界：**

```
             库的职责                        消费者的职责
┌─────────────────────────────────┬─────────────────────────────┐
│                                 │                             │
│  CeorlShell                     │  App（或其他消费者）          │
│  ┌─────────────────────────┐    │                             │
│  │ focusColumn(index)      │    │  useEffect(() => {          │
│  │   → scrollIntoView      │◄───┤    addEventListener(       │
│  │     (最小滚动)            │    │      'keydown', handler)   │
│  │ getColumns() → DOM 数组  │    │  }, [])                    │
│  └─────────────────────────┘    │                             │
│                                 │  消费者完全控制：             │
│  useScrollSnap (内部)           │  • 监听哪个元素               │
│  → 滚动吸附检测                  │  • 哪些按键                   │
│  → onScrollSettle 回调          │  • 是否跳过输入框             │
│                                 │  • 修饰键组合                │
│                                 │                             │
└─────────────────────────────────┴─────────────────────────────┘
```

### D2: Demo 键盘导航用 `useEffect` 实现

保持最简单的方式，不引入第三方键库：

```tsx
// App.tsx 中的键盘导航
useEffect(() => {
  if (!keyboardNav) return
  const handler = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return

    if (e.key === 'ArrowLeft' && activeIndex > 0) {
      e.preventDefault()
      setActiveIndex(activeIndex - 1)
      shellRef.current?.focusColumn(activeIndex - 1)
    } else if (e.key === 'ArrowRight' && activeIndex < columns.length - 1) {
      e.preventDefault()
      setActiveIndex(activeIndex + 1)
      shellRef.current?.focusColumn(activeIndex + 1)
    }
  }
  document.addEventListener('keydown', handler)
  return () => document.removeEventListener('keydown', handler)
}, [keyboardNav, activeIndex, columns.length])
```

这复刻了原来 `useKeyboardNav` 的全部功能，但完全在消费者的控制之下。

### D3: Shell 不再需要 `handleNavigate`

移除 `useKeyboardNav` 后，Shell 不再需要 `handleNavigate` 回调。`doFocus` 保持纯粹——只负责最小滚动，不参与键盘事件分发。

### D4: 方向感知的双面吸附 — scrollTo 替换 scrollIntoView

**`scrollIntoView` 的缺陷：** 只能识别"元素是否可见"，不理解"完整可见"概念。列部分可见时不滚动，列不可见时拉到视口边缘（可能过度滚动）。

**核心洞察 — 方向决定吸附面：**

`scroll-snap-align: start` 只在列左边缘放吸附点。但列右边缘也是一个逻辑吸附面——当向左滚时用它天然最小。

```
向右滚动 → 用列的左吸附面 (colLeft)
    目标列在当前位置右边
    target = colLeft  →  列左边缘对齐视口左边缘
    
向左滚动 → 用列的右吸附面 (colRight - clientWidth)
    目标列在当前位置左边
    target = max(0, colRight - clientWidth)  →  列右边缘对齐视口右边缘
```

**不需要扫描全部吸附点。方向唯一确定目标。**

```
focusColumn(3) from scrollLeft=50, 4列 1/2,1/3,1/4,1/2:
  col3: left=108.3 > viewLeft=50 → 右滚
  target = colLeft = 108.3  →  scrollTo(108.3)
  移动: |108.3 - 50| = 58.3vw
  col3 在视口左边缘，完整可见 ✓

focusColumn(0) from scrollLeft=108.3:
  col0: left=0 < viewLeft=108.3 → 左滚
  target = max(0, 50 - 100) = 0  →  scrollTo(0)
  移动: |0 - 108.3| = 108.3vw
  col0 在视口左边缘，完整可见 ✓
```

**之前（扫描全部吸附点）：** 可能在向左滚时选到 col1 吸附点(50)而不是 0，col0 部分可见。
**现在（方向感知）：** 方向唯一确定吸附面，天然最小。

## Risks / Trade-offs

- **[B] `enableKeyboardNav` prop 被移除** — 直接使用 `<CeorlShell enableKeyboardNav>` 的消费者会报 TypeScript 编译错误。缓解：这是有意为之的 breaking change，消费者需改为自己的键盘绑定。
- **[B] `useKeyboardNav` 导出被移除** — 直接使用 `import { useKeyboardNav } from 'ceorl'` 的消费者会报错。缓解：同上有意 breaking，消费者自己实现或使用键库。
- **[D4] `scrollTo` 不与 `scrollIntoView` 100% 等价** — `scrollTo` 不会自动触发 `scroll` 事件链。缓解：`scrollTo` 同样触发 `scroll` 事件，`useScrollSnap` 的监听不受影响。

## Open Questions

无。
