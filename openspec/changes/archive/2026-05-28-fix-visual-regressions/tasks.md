## 1. CSS 修复 — 焦点高亮 + 去除全局污染

- [x] 1.1 从 `ceorl.css` 删除 `html, body, #root` 全局选择器规则
- [x] 1.2 给 `.ceorl-column` 添加 `position: relative`（为 `::after` 提供定位上下文）
- [x] 1.3 将 `.ceorl-column[data-active="true"]` 的高亮改为 `::after` 伪元素方案：`position: absolute; inset: 0; pointer-events: none; box-shadow: inset 0 0 0 2px var(--ceorl-focus-color)`

## 2. Demo 页面样式迁移

- [x] 2.1 在 `index.html` 中添加 `<style>` 标签，包含之前从库 CSS 移除的页面级 reset：`html, body, #root { margin: 0; padding: 0; height: 100%; overflow: hidden }`

## 3. 测试更新

- [x] 3.1 在 `Column.test.tsx` 中添加测试：验证 `.ceorl-column` 的 computed `position` 为 `relative`
- [x] 3.2 运行全部测试，确认无回归

## 4. 验证

- [x] 4.1 Run `pnpm test` — 所有测试通过
- [x] 4.2 Run `pnpm typecheck` — 无类型错误
- [x] 4.3 Run `pnpm lint` — 无 lint 错误
- [x] 4.4 Run `pnpm build` — 生产构建成功（手动 `pnpm dev` 启动后可验证高亮可见）
