## Context

CEORL 是一个 React 滚动平铺布局组件库。最近一次修复（`fix-audit-bugs`）将焦点高亮从 `outline` 改为了 spec 要求的 `inset box-shadow`，但引入了一个可见性回归：`inset box-shadow` 绘制层级低于子元素内容，被列内面板的不透明背景完全覆盖。

另一个长期存在的问题是 `ceorl.css` 中存在 `html, body, #root` 全局选择器，这些选择器作为库样式是侵入性的——会破坏任何集成 CEORL 的页面的全局布局。

## Goals / Non-Goals

**Goals:**
- 焦点高亮在列内容有背景色的场景下始终可见
- 库 CSS 不包含全局选择器，所有样式限制在 `.ceorl-*` 命名空间
- demo 页面通过自身样式文件提供页面级 reset

**Non-Goals:**
- 不改变键盘导航的监听机制（将在后续变更中单独处理）
- 不调整 `.ceorl-stack` 的 `gap` 或其他硬编码值
- 不导出构建产物（CSS 文件等）——当前项目为 dev 阶段

## Decisions

### D1: 使用 `::after` 伪元素实现焦点高亮

**当前问题：CSS 渲染层级**

```
.ceorl-column
  ├── background (transparent)
  ├── box-shadow: inset  ← 在此绘制，位于内容下
  ├── .ceorl-column-inner
  │   └── DemoPanel (opaque background) ← 覆盖了 box-shadow
  └── outline (如使用) ← 在此绘制，位于内容上。但已移除
```

`inset box-shadow` 在元素的 border-box 内侧绘制，但绘制层级低于内容。子元素的背景会将其覆盖。而 `outline` 绘制在内容之上，所以之前是可见的。

**方案对比：**

| 方案 | 可见性 | 布局影响 | border-radius | 复杂度 |
|------|--------|----------|---------------|--------|
| `outline` | ✓ 始终可见 | ✗ 无 | ✗ 不跟随圆角 | 低 |
| `inset box-shadow` | ✗ 被子元素覆盖 | ✓ 无 | ✓ 跟随 | 低 |
| `border` | ✓ | ✗ 2px 偏移 | ✓ | 低 |
| `::after` + `inset box-shadow` | ✓ 始终可见 | ✓ 无 | ✓ 跟随 | 中 |

**选择：`::after` 伪元素**

```css
.ceorl-column {
  position: relative;  /* 为 ::after 提供定位上下文 */
}

.ceorl-column[data-active="true"]::after {
  content: '';
  position: absolute;
  inset: 0;           /* 铺满整个 column */
  pointer-events: none;  /* 不阻碍鼠标/触摸交互 */
  box-shadow: inset 0 0 0 2px var(--ceorl-focus-color);
}
```

`::after` 伪元素以 `absolute` 定位在 column 的最上层（内容之上），`box-shadow: inset` 在其上绘制 2px 四边高亮，`pointer-events: none` 保证不拦截任何交互事件。

**Trade-off**: 增加了一个伪元素和 `position: relative`。对性能的影响可忽略不计（伪元素是浏览器原生优化路径）。

### D2: 移除全局 CSS 选择器，页面级样式迁移到 demo

**当前代码：**

```css
/* ceorl.css */
html, body, #root {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}
```

**问题：**
- `html, body` 是全局选择器，会影响页面上所有元素
- `#root` 是具体 ID，消费者的根元素可能不同
- `overflow: hidden` 禁用了整个页面的滚动
- 这违反了库的"非侵入"设计原则（DESIGN.md："零运行时依赖"、"只负责布局呈现层"）

**迁移方案：**

1. 从 `ceorl.css` 删除上述三段选择器
2. 在 `index.html` 的 `<style>` 标签中添加等效的 demo 专用样式

Demo 页面需要这些样式才能正常工作（CeorlShell 默认 `100vw x 100vh`，需要页面无 margin），但这是 demo 的责任，不是库的责任。

### D3: 不对 `.ceorl-shell` 添加隐式高度

根据 `shell-dimensions` spec，Shell 的尺寸完全由 inline style 控制（默认 `100vw x 100vh`），CSS 文件中不设置。D2 删除全局样式后，`.ceorl-shell` 的 `height` 仍然来自 inline style，行为不变。

## Risks / Trade-offs

- **[D1] `position: relative` 可能影响列内绝对定位的子元素** — 如果有消费者在 CeorlColumn 内部使用了绝对定位的子元素且依赖 column 作为定位上下文，原本 column 没有 `position: relative`（子元素的绝对定位相对于更外层），现在会变成相对于 column。缓解：`::after` 需要定位上下文，这是必须的副作用。消费者可以用 `position: static` 覆盖列样式。
- **[D2] Demo 页面的样式依赖独立 CSS 文件或 inline `<style>`** — 如果消费者参考 demo 页面搭建自己的页面，需要自行加上页面 reset。缓解：在 README 中说明。

## Open Questions

无 — 两个修复都是明确的技术决策，无需进一步讨论。
