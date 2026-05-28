## Context

参考 `docs/SCROLL_ENGINE.md`（完整的定位与设计文档）。

核心洞察：CEORL 是纯受控的列布局渲染器。所有"策略"——键盘绑定、焦点管理、滚动结束检测——都是消费者的责任，不是库的。

## Goals / Non-Goals

**Goals:**
- Shell 变为纯受控组件（只读 `activeIndex`，不维护内部状态）
- `useScrollSettle` 完全删除
- L/R 算法提取为 `scrollToColumn` 独立纯函数
- `overflow: hidden` 封闭受控模型

**Non-Goals:**
- 不提供替代的键盘/焦点管理方案
- 不实现滚轮/触摸接管（消费者自行实现）

## Decisions

### D1: `overflow: hidden` — 封闭受控模型

`overflow-x: auto` 允许用户通过拖滚动条/触控板直接改 `scrollLeft`——与受控模型矛盾。`overflow: hidden` 关闭这个后门，只通过 `scrollTo` 驱动。

### D2: 删除 `useScrollSettle` 及所有 settle 基础设施

不再需要"检测滚动停在了哪"——每次导航目标是已知的。移除：
- `useScrollSettle` hook
- `focusSeqRef`、`handleScrollSettle`、`updateIndex`
- `useState<internalIndex>`、`isControlled`

### D3: `scrollToColumn` 独立纯函数

L/R 算法脱离 React: 在 `src/scrollToColumn.ts` 中公开导出。纯函数无需 mock React 组件即可测试。

### D4: `activeIndex` 必需 prop

Shell 不再维护内部状态，`activeIndex` 由消费者提供。无默值。

## Risks / Trade-offs

- **[B] 3 个 prop 移除 + handle 改名** — `onIndexChange`、`defaultActiveIndex`、`focusColumn`→`scrollTo`。缓解：文档中提供完整迁移指南。
- **[B] `overflow: hidden`** — 用户无法拖滚动条。缓解：niri 也是纯程序化滚动。消费者自己接管滚轮/触摸即可。
