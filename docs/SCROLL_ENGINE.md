# CEORL 定位与设计

## 一句话

**一个带列对齐滚动能力的 flexbox 布局渲染器。**

布局和滚动由库提供，策略和交互由消费者决定。

---

## 库的不可替代性

CEORL 只做两件消费者自己写起来很麻烦的事：

1. **列渲染** — 把 `ColumnDescriptor[]` 渲染成带宽度档位（`1/2`、`1/3`、`1/4`）的 flex 列
2. **列对齐** — `scrollToColumn(container, index)` 用 L/R 最小移动算法把指定列完全滚进视口

其他都是消费者的事。

---

## 消费者自己的事

| 功能 | 消费者负责 | 示例代码 |
|------|-----------|---------|
| 键盘绑定 | 自己写 `useEffect` | `el.addEventListener('keydown', handler)` |
| 焦点管理 | 自己调 `scrollElement.focus()` | `handle?.scrollElement?.focus()` |
| 点击列切换 | 自己写点击 handler | `onClick={() => setIdx(i)}` |
| 动画类型 | 传入 `behavior` 参数 | `scrollTo(i, { behavior: 'instant' })` |
| 越界检查 | 自己判断边界 | `if (idx > 0) scrollTo(idx - 1)` |
| 当前激活列 | 自己维护 state | `activeIndex={idx}` |
| 滚动停稳后做某事 | 自己 `setTimeout` 或 `scrollend` | `el.onscrollend = ...` |
| 基础键盘豁免 | 自己加 `closest` 判断 | `if (target.closest('input')) return` |

库不兜底任何一种策略——每家应用不一样，兜了也是错的一半。

---

## 公开 API

```tsx
// 组件
<CeorlShell
  ref={shellRef}
  columns={cols}                    // 列描述数组（必需）
  activeIndex={idx}                 // 受控激活列索引
/>

<CeorlColumn width="1/3"> ... </CeorlColumn>
<CeorlStack> ... </CeorlStack>

// Handle — 只提供工具，不执行策略
interface CeorlShellHandle {
  scrollTo: (index: number, opts?: { behavior?: ScrollBehavior }) => void
  scrollElement: HTMLDivElement | null   // 滚动容器 DOM 引用
}

// 独立函数 — 不用 ref 也能用
scrollToColumn(container: HTMLDivElement | null, index: number, opts?: { behavior?: ScrollBehavior }): void
```

---

## 核心算法：L/R 双面吸附

```ts
function scrollToColumn(
  container: HTMLDivElement | null,
  index: number,
  opts?: { behavior?: ScrollBehavior },
) {
  if (!container) return
  const cols = container.querySelectorAll<HTMLElement>('.ceorl-column')
  if (index < 0 || index >= cols.length) return

  const col = cols[index]
  const viewLeft = container.scrollLeft
  const viewRight = viewLeft + container.clientWidth
  const colLeft = col.offsetLeft
  const colRight = colLeft + col.offsetWidth

  // 已经在视口内，不滚
  if (colLeft >= viewLeft && colRight <= viewRight) return

  // L = 右吸附面（列右边缘对齐视口右边缘）
  // R = 左吸附面（列左边缘对齐视口左边缘）
  // 选离当前位置更近的面 → 最小移动
  const L = Math.max(0, colRight - container.clientWidth)
  const R = colLeft

  const target = abs(container.scrollLeft - L) <= abs(container.scrollLeft - R) ? L : R

  container.scrollTo({ left: target, ...opts })
}
```

不是策略——是纯数学计算。没有状态、没有事件、没有副作用。

---

## 消费者的典型代码

```tsx
import { useRef, useState, useEffect, useCallback } from 'react'
import { CeorlShell } from 'ceorl'
import type { CeorlShellHandle } from 'ceorl'

export default function Dashboard() {
  const ref = useRef<CeorlShellHandle>(null)
  const [idx, setIdx] = useState(0)
  const [columns] = useState([...])  // 列描述数组

  // 键盘绑定 — 自己策略
  useEffect(() => {
    const el = ref.current?.scrollElement
    if (!el) return

    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input,textarea,select,[contenteditable]')) return
      if (e.key === 'ArrowLeft' && idx > 0)        setIdx(idx - 1)
      if (e.key === 'ArrowRight' && idx < columns.length - 1) setIdx(idx + 1)
    }
    el.addEventListener('keydown', handler)
    return () => el.removeEventListener('keydown', handler)
  }, [idx])

  // activeIndex 变化 → 滚动 + 焦点
  useEffect(() => {
    ref.current?.scrollTo(idx)
    ref.current?.scrollElement?.focus()
  }, [idx])

  return (
    <CeorlShell ref={ref} columns={columns} activeIndex={idx} />
  )
}
```

`scrollTo` 和 `scrollElement` 以工具形式提供，不给语义绑定的「服务」。

---

## 与之前版本的对比

| 版本 | CeorlShellHandle | 内部状态 | 焦点管理 | 消费者负担 |
|------|-----------------|---------|---------|-----------|
| main | `focusColumn`, `getColumns`, `scrollElement` | `useScrollSettle`, `focusSeqRef`, `activeIndex` | 无（消费者自己 `useEffect` 配 `document`） | 中 |
| PR #2 | + `scrollElement` getter | 同上 | 同上 | 中 |
| 本设计 | `scrollTo`, `scrollElement` | 无 | 消费者 `useEffect` 配容器级 | 中+（但无隐性契约） |

消费者负担没有显著增加——之前也不用管焦点，而是根本管不了（浏览器焦点在 Shell 外就不工作）。现在是「你管，你一定能管好」。

---

## 删除清单

```
src/hooks/useScrollSettle.ts        — 不再需要
src/hooks/useScrollSettle.test.ts   — 同上
src/components/Shell.tsx
  ├─ useScrollSettle 调用
  ├─ focusSeqRef
  ├─ handleScrollSettle
  ├─ updateIndex / isControlled
  ├─ useState<internalIndex>
  └─ columns mode 的 data-active 赋值（由 CeorlShell 自己管理）
src/components/types.ts
  ├─ CeorlShellProps.onIndexChange
  ├─ CeorlShellProps.defaultActiveIndex
  └─ CeorlShellHandle.getColumns
```

保留：

```
src/components/Shell.tsx
  ├─ doFocus → scrollTo (rename)
  ├─ L/R 吸附算法
  └─ useImperativeHandle → { scrollTo, scrollElement }
src/components/types.ts
  ├─ CeorlShellProps.activeIndex（受控）
  ├─ CeorlShellHandle.scrollTo
  └─ CeorlShellHandle.scrollElement
```

---

## 未来方向

### 消费者辅助函数（可选，不影响核心 API）

当前消费者需要自己写键盘绑定、焦点管理、点击切换——约 30-40 行样板代码。未来可以提供纯工具函数，由消费者显式调用，不自动挂载：

```tsx
// 消费者选择引入
useCeorlKeyboardNav(ref, { onPrev: () => setIdx(i-1), onNext: () => setIdx(i+1) })
useCeorlAutoFocus(ref, { when: 'after-scroll' })
```

重点是**不自动执行**——消费者调用才是执行，不调就没有。这些辅助函数不属于 `CeorlShell` 的内部逻辑，不增加库的隐性契约。

### 方案 B 评估（滚动输入接管）

当前设计不拦截任何滚动行为，只提供 `scrollTo`。如果未来需要 niri 级的滚动体验（方向键无缝、自定义惯性），需要评估方案 B：

- `overflow: hidden` + wheel handler 接管滚轮
- macOS 触控板惯性在 wheel 事件中的表现
- 是否需要引入物理引擎

方案 B 的触发条件：确认 wheel 事件在主流浏览器（Chrome/Firefox/Safari）上都能拿到 delta 值，且触控板惯性不产生不可接受的跳变。当前无此需求，搁置。

---

## 核心设计原则

1. **库不做策略判断** — 不决定焦点在哪、不绑定键盘、不检测滚动结束
2. **库提供算力** — L/R 双面吸附是纯数学，没有副作用和状态
3. **消费者全权** — 所有交互行为由消费者在自己代码中编排，可读、可改、可测
4. **极简工具接口** — handle 只给两个东西：一个算滚动位置的函数、一个容器 DOM 引用
