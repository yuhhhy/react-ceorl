# CEORL 滚动与焦点

## 定位约束

CEORL 是「**滚动平铺布局**」组件库，不是通用滚动容器。所有滚动操作都以列为单位——起点是某列边界，终点也是某列边界。不存在用户停在两列之间的场景。

由此推导：

- 不需要检测「滚动停在了哪一列」——终点已知
- 不需要 L/R 双面吸附——终点已知
- 不需要防抖、seq 计数器、scrollend 去重——终点已知
- 不需要自定义滚动引擎——`scrollTo` 就够了
- 不需要隐藏滚动条——但保留，不作为功能入口

---

## 当前的滚动场景

| 触发 | 目标 | 是否离散 |
|------|------|---------|
| Prev/Next 按钮 | 前/后一列 | ✅ 离散 |
| 方向键 | 前/后一列 | ✅ 离散 |
| `focusColumn(index)` | 指定列 | ✅ 离散 |
| 鼠标拖滚动条 | 任意位置 | ❌ 连续 |
| 触摸板左右轻扫 | 浏览器解释 | ❌ 浏览器定义 |

鼠标拖滚动条是唯一的不受控路径，但在仪表盘类场景中没有实际需求——用户不会停在列 1.7 的位置。不需要为此引入复杂的滚动检测。

---

## 核心设计

### `focusColumn(index)`

```ts
focusColumn(index):
  scrollTo({ left: targetCol.offsetLeft, behavior: 'smooth' })
  container.focus()
```

两件事合并为一个原子操作：
1. 滚动到目标列
2. 焦点收回 Shell —— 后续方向键事件通过 DOM 冒泡自然到达 handler

任何调用 `focusColumn` 的地方都不需要额外关心焦点。

### 键盘导航

消费者在 `scrollElement` 上绑定 `keydown`：

```tsx
useEffect(() => {
  const el = ref.current?.scrollElement
  if (!el) return
  const handler = (e: KeyboardEvent) => {
    if ((e.target as HTMLElement).closest('input,textarea,select,[contenteditable]')) return
    if (e.key === 'ArrowLeft')  ref.current?.focusColumn(index - 1)
    if (e.key === 'ArrowRight') ref.current?.focusColumn(index + 1)
  }
  el.addEventListener('keydown', handler)
  return () => el.removeEventListener('keydown', handler)
}, [index])
```

Shell 不自带键盘策略——交由消费者决定。

### 焦点行为

```
用户点击 Prev 按钮
  → App 调用 focusColumn(prevIndex)
    → scrollTo 到达
    → container.focus() —— 焦点回 Shell

用户方向键
  → 焦点在 Shell 内 → 事件冒泡到 keydown handler → focusColumn
  → 焦点不在 Shell 内 → 事件不到达 → 浏览器默认（无操作，正确）

用户点击 Shell 外其他区域
  → 焦点离开 → 方向键不再作用
  → 下次 focusColumn / 按钮点击 → 焦点自动回来
```

---

## 简化清单

如果按此设计合并到 main，可以移除的模块：

| 模块 | 理由 |
|------|------|
| `useScrollSettle` | 不再需要检测滚动停止位置 |
| `focusSeqRef` | 不再需要「丢弃过时 settle 回调」 |
| L/R 双面吸附算法 | `scrollTo({ left: col.offsetLeft })` 就够了 |
| `scrollend` 事件监听及去重 | 没有 settle 需要检测 |
| 300ms 防抖 fallback | 同上 |

保留的：

| 模块 | 理由 |
|------|------|
| `scrollElement` getter | 消费者挂键盘事件需要 |
| `getColumns` | 消费者查询 DOM |
| `overflow-x: auto` | 列超出壳宽时自然溢出，不拦截 |
| `scrollbar-width: none` | 可选，单纯视觉整洁 |
| 隐藏滚动条 | 保留，不作为功能入口 |

`useScrollSettle` 的测试（8 个）也可以一并清理。

---

## 公开 API 变更

无。`focusColumn` 的签名不变，`CeorlShellProps` 不变，`CeorlShellHandle` 不变。

唯一内部改动是 `focusColumn` 加了 `container.focus()`。消费者端代码不需要改动。

---

## 实施

1. `Shell.tsx`: `focusColumn` 尾部加 `container.focus()`
2. `Shell.tsx`: 删除 `useScrollSettle` 调用及相关状态
3. 删除 `src/hooks/useScrollSettle.ts` 及其测试文件
4. 更新 README 中 `pnpm test` 的数字
5. 此文作为设计记录，归入 `docs/`
