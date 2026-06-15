<div align="center">

# CEORL

**C**omposable **E**rgonomic **O**rdered **R**olling **L**ayouts · 希儿滚动平铺

[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite)](https://vite.dev)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

React 横向滚动平铺窗口布局组件库 · 受 [niri](https://github.com/YaLTeR/niri) 启发

> **纯受控 · 零策略 · 只做布局。** 键盘、焦点、动画——全部由消费者决定。

<img src="docs/demo.svg" alt="CEORL 滚动平铺示意图" width="100%">

</div>

---

## 快速开始

```bash
pnpm add ceorl react react-dom
```

```tsx
import { CeorlShell, CeorlColumn } from 'ceorl'

function App() {
  return (
    <CeorlShell>
      <CeorlColumn width="1/2"><h2>面板 A</h2></CeorlColumn>
      <CeorlColumn width="1/3"><h2>面板 B</h2></CeorlColumn>
      <CeorlColumn width="1/4"><h2>面板 C</h2></CeorlColumn>
    </CeorlShell>
  )
}
```

---

## API

### CeorlShell

`ref` 暴露：

| Handle | 类型 | 说明 |
|--------|------|------|
| `scrollTo(index)` | `(index: number) => void` | L/R 最小移动——把指定列滚进视口 |
| `scrollElement` | `HTMLDivElement \| null` | 滚动容器 DOM 引用 |

Props：

| Prop | 类型 | 默认 | 说明 |
|------|------|------|------|
| `activeIndex` | `number` | `0` | `data-active` 属性映射到第几列 |
| `columns` | `ColumnDescriptor[]` | — | 描述列配置（与 `children` 二选一） |

### CeorlColumn

| Prop | 类型 | 默认 | 说明 |
|------|------|------|------|
| `width` | `number \| string` | `1/3` | 列宽度（number: 比例 0~1；string: 分数 `"a/b"` 或 CSS width 值） |
| `padding` | `string` | — | CSS padding 值 |

### CeorlStack

列内纵向堆叠容器。子元素等分高度。

### ColumnDescriptor

```ts
interface ColumnDescriptor {
  id: string
  width?: number | string  // number(0~1) | "a/b" | CSS width
  content: ReactNode
}
```

### resolveColumnWidth

将任意 `ColumnWidth` 值解析为 CSS width 字符串的纯函数：

```ts
import { resolveColumnWidth } from 'ceorl'

resolveColumnWidth(0.5)            // "50%"
resolveColumnWidth('1/3')          // "33.333%"
resolveColumnWidth('320px')        // "320px"
```

- `number`（`0 < n ≤ 1`）→ `"n * 100%"`，超出范围 fallback 到 `"33.333%"`
- `"a/b"` → `"(a/b) * 100%"`，分子 > 分母或分母 = 0 时 fallback
- 其他字符串 → 浏览器环境用 `CSS.supports("width", value)` 校验，不通过则 fallback

### scrollToColumn

独立纯函数，无需 ref：

```ts
import { scrollToColumn } from 'ceorl'
scrollToColumn(el, 3) // 滚动到第 4 列
```

---

## 消费者示例

### 完整 Demo（键盘 + 按钮）

```tsx
import { useRef, useState, useEffect } from 'react'
import { CeorlShell } from 'ceorl'
import type { CeorlShellHandle, ColumnDescriptor } from 'ceorl'

export default function App() {
  const ref = useRef<CeorlShellHandle>(null)
  const [idx, setIdx] = useState(0)
  const [columns] = useState<ColumnDescriptor[]>([...])
  const [kb, setKb] = useState(true)

  const idxRef = useRef(idx)
  useEffect(() => { idxRef.current = idx })

  // 键盘导航 — 全局监听
  useEffect(() => {
    if (!kb) return
    const h = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input,textarea,select,[contenteditable]')) return
      if (e.key === 'ArrowLeft')  idxRef.current > 0 && setIdx(idxRef.current - 1)
      if (e.key === 'ArrowRight') idxRef.current < columns.length - 1 && setIdx(idxRef.current + 1)
    }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [kb])

  // activeIndex 变化 → 滚动
  useEffect(() => { ref.current?.scrollTo(idx) }, [idx])

  return (
    <>
      <button onClick={() => setIdx(idx - 1)} disabled={idx <= 0}>← Prev</button>
      <button onClick={() => setIdx(idx + 1)} disabled={idx >= columns.length - 1}>Next →</button>
      <button onClick={() => setKb(!kb)}>KB: {kb ? 'ON' : 'OFF'}</button>

      <CeorlShell ref={ref} columns={columns} activeIndex={idx} />
    </>
  )
}
```

### 定制高亮颜色

```css
.ceorl-column { --ceorl-focus-color: #ff6b35; }
```

---

## 设计原则

| 原则 | 说明 |
|------|------|
| 纯受控 | `activeIndex` 是唯一定位。`overflow: hidden` — 浏览器不接管输入 |
| 零策略 | 不绑键盘、不管焦点、不检测滚动停稳。消费者全权 |
| 极简 API | 2 个 handle 方法。独立纯函数 `scrollToColumn` 可无 React 使用 |
| L/R 双面吸附 | 右面 L = max(0, colRight − viewWidth)，左面 R = colLeft，选最近的 |

---

## 开发

```bash
pnpm dev        # 启动
pnpm test       # 测试（39 个）
pnpm typecheck  # 类型检查
pnpm build      # 构建
```

## License

MIT
