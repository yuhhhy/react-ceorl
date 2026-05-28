## Why

上一轮修复将焦点高亮从 `outline` 改为 `inset box-shadow` 后，高亮完全不可见——`box-shadow` 的绘制层级低于子元素内容，被列内 DemoPanel 的不透明背景完全覆盖。同时，`ceorl.css` 中存在全局样式污染：`html, body, #root` 选择器会破坏任何集成 CEORL 的页面的全局布局。这两个都是必须立即修复的可见性问题。

## What Changes

- **修复焦点高亮不可见** — 将 `inset box-shadow` 改为 `::after` 伪元素方案，使高亮始终渲染在列内容之上，不受子元素背景遮挡
- **移除 CSS 全局样式污染** — 删除 `ceorl.css` 中的 `html, body, #root` 全局选择器，页面级样式迁移到 Demo 专属样式文件
- **更新 `css-focus-highlight` spec** — `inset box-shadow` 方案有渲染层级缺陷，改为 `::after` 伪元素方案
- **新增 `scoped-library-styles` spec** — 规范库 CSS 的作用域原则，禁止全局选择器

## Capabilities

### New Capabilities
- `scoped-library-styles`：库 CSS 必须限制在 `.ceorl-*` 类命名空间内，不得使用 `html`、`body`、`#root` 等全局选择器；页面级样式由消费者自行管理

### Modified Capabilities
- `css-focus-highlight`：焦点高亮从直接 `box-shadow` 改为 `::after` 伪元素方案，保证高亮始终渲染在内容之上
- `shell-dimensions`：明确 Shell 的视口尺寸通过 inline style 提供，不再依赖全局 CSS

## Impact

- `src/ceorl.css` — 删除全局 `html, body, #root` 规则；修改 `.ceorl-column[data-active="true"]` 为 `::after` 伪元素
- `src/App.tsx` — 补充原先由全局 CSS 提供的页面 reset 样式
- `src/components/Column.test.tsx` — 适配新的高亮实现（`::after` 伪元素检测方式变化）
