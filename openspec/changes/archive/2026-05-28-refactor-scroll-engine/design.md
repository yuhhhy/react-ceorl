## Context

CEORL 的滚动架构已通过前几个变更逐步修正：
1. `fix-audit-bugs` — 修复 `onIndexChange` 双发、`scrollend` 双发
2. `remove-use-keyboard-nav` — 删除 `useKeyboardNav`、修复 `doFocus` 为 L/R 双面吸附算法

当前的遗留问题是 `scroll-snap-type: x mandatory`。它最初用于吸附到列边界，但吸附点只在 `scroll-snap-align: start`（列左边缘），与 L/R 算法中的 R 值不匹配。L = colRight - W 不是 CSS 吸附点，导致 `scrollTo(L)` 被 snap 拉回。

## Goals / Non-Goals

**Goals:**
- 从 CSS 彻底移除 scroll-snap
- 将 `useScrollSnap` 重命名为 `useScrollSettle`
- `doFocus` 的 L/R 算法直接生效，不被 snap 干扰

**Non-Goals:**
- 不改变 `doFocus` 的 L/R 算法（已在 remove-use-keyboard-nav 中完成）
- 不改变 `useScrollSettle` 的 settle 检测逻辑
- 不实现自定义 snap（后续扩展）

## Decisions

### D1: 彻底移除，不保留 CSS snap

保留 snap 的唯一理由是为"纯滚轮用户"提供自动吸附体验。但：
- 列宽不等（1/2、1/3、1/4），吸附后间距不均匀，视觉节奏不一致
- `focusColumn` + 键盘/按钮导航已经提供了精确的列切换
- niri 原型支持自由滚动，没有 snap
- 未来任意宽度列 + 自定义吸附需要自己实现，CSS snap 不可控

### D2: `useScrollSnap` → `useScrollSettle`

去 snap 后名字误导。`useScrollSettle` 准确描述职责——检测滚动停止并回传当前列索引。

**对外影响**：公开 API 中 `useScrollSnap` 改为 `useScrollSettle`（BREAKING）。但 `useScrollSnap` 本身是"内部" hook，消费者通常不直接使用。

### D3: 保留 `.ceorl-column-inner` CSS

`.ceorl-column-inner` 的 `height: 100%; box-sizing: border-box` 是让列内容撑满高度的关键样式，同时是 `padding` prop 的载体。只删除 snap 属性，保留此段 CSS。

### D4: 删除 `scroll-behavior: smooth`

`.ceorl-shell { scroll-behavior: smooth }` 影响该容器内所有滚动——包括用户滚轮。`scrollTo({ behavior: 'smooth' })` 已经在每次调用时显式指定 smooth，不需要全局设置。

**影响**：用户滚轮滚动将变为即时响应（instant），不作全局 smooth 动画。这是正确行为——smooth 只应该用在 programmatic 导航时。

## Risks / Trade-offs

- **[D2] `useScrollSettle` 重命名 BREAKING** — 直接 import 的消费者需更新。缓解：hook 本身是"内部" API，通常只有 Shell 内部使用。
- **[D4] 用户滚轮不再有 smooth** — 浏览器原生 `smooth` 滚轮由 OS/浏览器设置控制，无需库干预。不影响体验。
