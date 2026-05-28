<div align="center">

# CEORL

**C**omposable **E**rgonomic **O**rdered **R**olling **L**ayouts · 希儿滚动平铺

[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite)](https://vite.dev)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

React 横向滚动平铺窗口布局组件库 · 受 [niri](https://github.com/YaLTeR/niri) 启发

</div>

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 120" width="100%" height="120">
  <defs>
    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
    <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f3460"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
    <linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#533483"/>
      <stop offset="100%" style="stop-color:#0f3460"/>
    </linearGradient>
    <linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#e94560"/>
      <stop offset="100%" style="stop-color:#533483"/>
    </linearGradient>
  </defs>

  <!-- 背景 -->
  <rect width="800" height="120" rx="12" fill="#0d1117"/>

  <!-- 列 -->
  <rect x="4" y="8" width="330" height="104" rx="6" fill="url(#g1)" stroke="rgba(102,204,255,0.4)" stroke-width="2"/>
  <rect x="340" y="8" width="220" height="104" rx="6" fill="url(#g2)"/>
  <rect x="566" y="8" width="164" height="104" rx="6" fill="url(#g3)"/>
  <rect x="736" y="8" width="60" height="104" rx="6" fill="url(#g4)" opacity="0.3"/>

  <!-- 列标签 -->
  <text x="169" y="60" text-anchor="middle" fill="#e0e0e0" font-family="system-ui,monospace" font-size="14" font-weight="600">Panel A · ½</text>
  <text x="450" y="60" text-anchor="middle" fill="rgba(224,224,224,0.6)" font-family="system-ui,monospace" font-size="13">Panel B · ⅓</text>
  <text x="648" y="60" text-anchor="middle" fill="rgba(224,224,224,0.4)" font-family="system-ui,monospace" font-size="12">Panel C · ¼</text>

  <!-- 滚动指示 -->
  <text x="770" y="60" text-anchor="middle" fill="rgba(224,224,224,0.15)" font-family="system-ui,monospace" font-size="24">→</text>

  <!-- 焦点高亮边框 (CSS ::after 效果) -->
  <rect x="4" y="8" width="330" height="104" rx="6" fill="none" stroke="#66ccff" stroke-width="1.5" opacity="0.6"/>
</svg>
```

> **纯受控 · 零策略 · 只做布局。** 键盘、焦点、动画——全部由消费者决定。

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
| `width` | `'1/2' \| '1/3' \| '1/4'` | `'1/3'` | 列宽度 |
| `padding` | `string` | — | CSS padding 值 |

### CeorlStack

列内纵向堆叠容器。子元素等分高度。

### ColumnDescriptor

```ts
interface ColumnDescriptor {
  id: string
  width?: '1/2' | '1/3' | '1/4'
  content: ReactNode
}
```

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

详见 [`docs/SCROLL_ENGINE.md`](docs/SCROLL_ENGINE.md)。

---

## 开发

```bash
pnpm dev        # 启动
pnpm test       # 测试（24 个）
pnpm typecheck  # 类型检查
pnpm build      # 构建
```

## License

MIT
