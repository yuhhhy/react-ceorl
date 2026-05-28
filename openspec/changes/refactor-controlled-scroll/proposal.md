## Why

CEORL 当前的架构混合了"库"和"框架"两个角色——Shell 内部管理 `activeIndex` 状态（`useState` + `useScrollSettle`）、监听 `scrollend`、维护 seq 计数器、运行 300ms 防抖。这些策略代码占 Shell 近一半行数，但其可用性反而不高：`onIndexChange` 与程序化滚动不协调、浏览器 `overflow: auto` 允未受控用户输入导致数据脱节。

正确的定位已经在 `docs/SCROLL_ENGINE.md` 中明确：**CEORL 是纯受控的列布局渲染器**，所有交互策略由消费者决定，库只提供列渲染和 L/R 吸附计算。

## What Changes

- **删除 `useScrollSettle`** — 不再需要检测滚动停止位置。BREAKING: 公开导出移除。
- **删除 Shell 内部状态管理** — 移除 `useState<internalIndex>`、`focusSeqRef`、`handleScrollSettle`、`updateIndex`。**BREAKING**: `defaultActiveIndex` 和 `onIndexChange` 从 `CeorlShellProps` 移除。
- **`focusColumn` 重命名为 `scrollTo`** — 只做滚动计算，不加焦点管理策略。**BREAKING**: handle 方法改名。
- **`scrollElement` getter 保留** — 供消费者挂事件。
- **提取 `scrollToColumn` 为独立纯函数** — L/R 算法脱离 React，在 `src/scrollToColumn.ts` 中公开导出。
- **Shell 为纯受控组件** — `activeIndex` 变为必需 prop。`overflow: hidden` 封闭受控模型。
- **CSS** — `overflow-x: auto` → `overflow: hidden`。删除 `scrollbar-width`、`::-webkit-scrollbar`。

## Capabilities

### Modified Capabilities
- `focus-navigation`：`focusColumn` → `scrollTo`，提取 L/R 为独立函数 `scrollToColumn`
- `shell-dimensions`：`overflow: hidden` 替代 `overflow-x: auto`
- `controlled-shell`：移除 `defaultActiveIndex`/`onIndexChange`，Shell 变为纯受控

### Removed Capabilities
- `scrollend-dedup`：随 `useScrollSettle` 删除
- `focus-scroll-stability`：所有 settle 回调链删除
- `focus-state-controller`：Shell 不再管理焦点状态

## Impact

- `src/hooks/useScrollSettle.ts` — 删除
- `src/hooks/useScrollSettle.test.ts` — 删除
- `src/scrollToColumn.ts` — 新增（L/R 算法 + `scrollToColumn` 导出）
- `src/components/Shell.tsx` — 大量简化（-50 行）
- `src/components/types.ts` — 移除 3 个 prop/handle 方法，`activeIndex` 必填
- `src/components/Shell.test.tsx` — 重写，删 settle 相关测试
- `src/ceorl.css` — `overflow: hidden`，删除滚动条样式
- `src/index.ts` — 移除 `useScrollSettle`，新增 `scrollToColumn`
- `src/App.tsx` — 适配新 API
- `README.md` — 全文重写
