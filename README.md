# CEORL

**Composable Ergonomic Ordered Rolling Layouts** · 希儿滚动平铺

React 横向滚动平铺窗口布局组件库。灵感来自 [niri](https://github.com/YaLTeR/niri)（scrollable-tiling Wayland compositor）。

```
┌──────────────────────────────────────────────────────────────┐
│ [ 面板 A 1/2 ][ 面板 B 1/3 ][ 面板 C 1/4 ][ 面板 D ] → 滚 │
└──────────────────────────────────────────────────────────────┘
```

## 特性

- **横向平铺** — 面板按列排列，横向滚动切换
- **可变列宽** — 每列支持 1/2、1/3、1/4 宽度比例
- **列内堆叠** — 同一列可纵向分割多个子面板 (`CeorlStack`)
- **受控/非受控** — 完整 React 状态管理：`activeIndex`、`onIndexChange`
- **最小移动** — `focusColumn(index)` 计算 L/R 双面吸附，以最小滚动将列带入视口；已在视口内则不动
- **焦点高亮** — 当前激活列显示 `::after` 伪元素高亮，通过 `--ceorl-focus-color` 自定义
- **零布局依赖** — 纯 CSS（flex + scroll）+ React，不依赖第三方布局库

## 快速开始

```tsx
import { CeorlShell, CeorlColumn, CeorlStack } from 'ceorl'

function App() {
  return (
    <CeorlShell>
      <CeorlColumn width="1/2">
        <h2>面板 A</h2>
        <p>½ 宽度列</p>
      </CeorlColumn>
      <CeorlColumn width="1/3">
        <CeorlStack>
          <div>子面板 1</div>
          <div>子面板 2</div>
        </CeorlStack>
      </CeorlColumn>
      <CeorlColumn width="1/4">
        <p>¼ 宽度列</p>
      </CeorlColumn>
    </CeorlShell>
  )
}
```

## 组件

### CeorlShell

顶层横向滚动容器。

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `activeIndex` | `number` | — | 受控模式：当前激活列索引 |
| `defaultActiveIndex` | `number` | `0` | 非受控模式：初始激活列索引 |
| `onIndexChange` | `(index: number) => void` | — | 激活列变化时回调 |
| `columns` | `ColumnDescriptor[]` | — | 声明式列数组（与 `children` 二选一） |

**命令式接口** (`ref.current`)：

| 方法 | 说明 |
|------|------|
| `focusColumn(index)` | 最小滚动聚焦到目标列，已在视口内则无操作 |
| `getColumns()` | 返回所有列的 DOM 元素数组 |
| `scrollElement` | 滚动容器 DOM 引用，供消费者挂载键盘事件 |

### CeorlColumn

单列容器。

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `width` | `'1/2' \| '1/3' \| '1/4'` | `'1/3'` | 列宽度比例 |
| `padding` | `string` | — | 列内边距，CSS padding 值 |

### CeorlStack

列内纵向堆叠容器。子元素自动等分高度。

### ColumnDescriptor

```ts
interface ColumnDescriptor {
  id: string
  width?: '1/2' | '1/3' | '1/4'
  content: ReactNode
}
```

## Hooks

| Hook | 说明 |
|------|------|
| `useScrollSettle(ref, options?)` | 纯观察者：检测滚动停止事件，通过 `onScrollSettle(index, seq)` 回调报告 |

## 定制

### 焦点高亮颜色

```css
/* 改颜色 */
.ceorl-column { --ceorl-focus-color: #ff6b35; }

/* 完全覆盖 */
.ceorl-column[data-active="true"]::after {
  box-shadow: inset 0 0 0 3px red;
}
```

### Shell 尺寸

```tsx
{/* 默认占满视口 */}
<CeorlShell>...</CeorlShell>

{/* 嵌入带工具栏的页面 */}
<CeorlShell style={{ height: 'calc(100vh - 48px)', width: '100%' }}>
  ...
</CeorlShell>
```

### 动态列管理

```tsx
const [columns, setColumns] = useState<ColumnDescriptor[]>([...])

<CeorlShell
  columns={columns}
  activeIndex={idx}
  onIndexChange={setIdx}
/>
```

### 键盘导航

库不再内置键盘导航（`useKeyboardNav` 已移除）。消费者通过 `focusColumn` 自行绑定：

```tsx
const ref = useRef<CeorlShellHandle>(null)

useEffect(() => {
  const el = ref.current?.scrollElement
  if (!el) return
  const handler = (e: KeyboardEvent) => {
    if ((e.target as HTMLElement).closest('input, textarea, select, [contenteditable]')) return
    if (e.key === 'ArrowLeft')  ref.current?.focusColumn(prev)
    if (e.key === 'ArrowRight') ref.current?.focusColumn(next)
  }
  el.addEventListener('keydown', handler)
  return () => el.removeEventListener('keydown', handler)
}, [])
```

## 开发

```bash
pnpm install
pnpm dev        # 启动开发服务器
pnpm test       # 运行测试（36 个）
pnpm typecheck  # 类型检查
pnpm lint       # 代码检查
pnpm build      # 生产构建
```

## License

MIT
