<div align="center">

# CEORL

**C**omposable **E**rgonomic **O**rdered **R**olling **L**ayouts · 希儿滚动平铺

[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite)](https://vite.dev)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

React 横向滚动平铺窗口布局组件库 · 受 [niri](https://github.com/YaLTeR/niri) 启发

> **纯受控 · 零策略 · 只做布局。** 键盘、焦点、动画——全部由消费者决定。

</div>

---

## 安装

```bash
pnpm add ceorl
```

## 快速开始

```tsx
import { useRef, useState, useEffect } from 'react'
import { CeorlShell } from 'ceorl'
import type { CeorlShellHandle, ColumnDescriptor } from 'ceorl'

const columns: ColumnDescriptor[] = [
  { id: 'a', width: 0.5,   content: <PanelA /> },
  { id: 'b', width: 1 / 3, content: <PanelB /> },
  { id: 'c', width: 0.25,  content: <PanelC /> },
]

export default function App() {
  const ref = useRef<CeorlShellHandle>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    ref.current?.scrollTo(activeIndex)
  }, [activeIndex])

  return (
    <CeorlShell
      ref={ref}
      columns={columns}
      activeIndex={activeIndex}
      inset={8}
      radius={6}
    />
  )
}
```

---

## CeorlShell API

### CeorlShell Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| `columns` | 列描述数组 | `ColumnDescriptor[]` | — |
| `activeIndex` | 当前激活列的索引，对应列会附加 `data-active="true"` | `number` | `0` |
| `inset` | 列间距与容器四边内缩，等同于 niri 的 `gaps` | `number \| string` | — |
| `radius` | 列圆角，同步作用于列容器与焦点环 | `number \| string` | — |
| `columnBg` | 所有列的背景色，支持 `rgba()` 实现透明效果 | `string` | `transparent` |

> `CeorlShell` 同时接受所有标准 `HTMLDivElement` 属性（`style`、`className` 等）。

### CeorlShell Exposes

| 名称 | 说明 | 类型 |
|------|------|------|
| `scrollTo` | 将指定列滚入视口 | `(index: number, opts?: { behavior?: ScrollBehavior }) => void` |
| `scrollElement` | 滚动容器的 DOM 引用 | `HTMLDivElement \| null` |

---

## CeorlColumn API

### CeorlColumn Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| `width` | 列宽度。支持小数（如 `0.5`）、分数字符串（如 `"1/3"`）或任意 CSS 宽度值（如 `"320px"`） | `number \| string` | `0.5` |
| `padding` | 列内边距，任意 CSS padding 值 | `string` | — |

### CeorlColumn Slots

| 插槽名 | 说明 |
|--------|------|
| `default` | 列内容 |

---

## CeorlStack API

列内纵向堆叠容器，子元素等分高度，适用于在单列内放置多个面板。

### CeorlStack Slots

| 插槽名 | 说明 |
|--------|------|
| `default` | 纵向堆叠的面板 |

---

## ColumnDescriptor API

### ColumnDescriptor 字段

| 字段名 | 说明 | 类型 | 必填 |
|--------|------|------|------|
| `id` | 列的唯一标识，用作 React `key` | `string` | ✓ |
| `width` | 列宽度，同 `CeorlColumn` 的 `width` prop | `number \| string` | — |
| `style` | 附加到列容器的内联样式 | `CSSProperties` | — |
| `content` | 列内容 | `ReactNode` | ✓ |

---

## CSS 变量

在 `.ceorl-shell` 上覆盖以下变量来定制外观：

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `--ceorl-focus-color` | 激活列焦点环颜色 | `#66ccff` |
| `--ceorl-focus-width` | 焦点环宽度 | `2px` |

```css
.ceorl-shell {
  --ceorl-focus-color: #a78bfa;
  --ceorl-focus-width: 3px;
}
```

---

## 设计原则

| 原则 | 说明 |
|------|------|
| 纯受控 | `activeIndex` 是唯一定位状态，库不持有内部焦点状态 |
| 零策略 | 不绑键盘、不管焦点、不检测手势，消费者全权决定交互逻辑 |
| 只做布局 | 动画、拖拽调宽、列增删——均为消费者职责 |

---

## 开发

```bash
pnpm dev    # 启动 demo
pnpm test   # 运行测试
pnpm build  # 构建库
```

## License

MIT
