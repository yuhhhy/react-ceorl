## Why

`scroll-snap-type: x mandatory` 最初是为"翻页杂志"体验引入的，但它是后续所有问题的根源：吸附点只在列左边缘，`doFocus` 计算的 L 值 (colRight - W) 被 snap 拉回，导致最小移动无法生效、需要 hack 临时关 snap、代码复杂度逐级上升。

CEORL 的设计目标是类似 niri 的自由滚动平铺布局——niri 没有 snap，snap 只会限制未来扩展（任意宽度列、自由滚动、自定义吸附策略）。基于 `scroll-behavior: smooth` + 精确的 `scrollTo` 已经提供平滑体验。去掉 snap 不仅解决当前 bug，还简化了整个架构。

## What Changes

- **从 CSS 移除 scroll-snap** — 删除 `.ceorl-shell` 的 `scroll-snap-type: x mandatory`、`.ceorl-column` 的 `scroll-snap-align: start`
- **从 CSS 移除 `scroll-behavior: smooth`** — `scrollTo({ behavior: 'smooth' })` 自带，无需全局
- **重命名 `useScrollSnap` → `useScrollSettle`** — 去 snap 后名字不再准确；语义变为"检测滚动停稳"
- **更新所有引用** — Shell.tsx、index.ts、测试文件
- **更新 spec** — 相关 spec 反映已无 snap 的事实
- **删除 `.ceorl-column-inner` CSS 段** — 原本为吸附设计的无意义 wrapper

## Capabilities

### Modified Capabilities
- `scrollend-dedup`：更新描述——不再涉及 scroll-snap 概念，纯滚动停稳去重
- `focus-navigation`：`doFocus` 的 L/R 算法不再被 snap 干扰，target 直接生效
- `shell-dimensions`：移除 CSS 中的 `scroll-snap-align: start` 提及

## Impact

- `src/ceorl.css` — 删除 snap 相关属性和 `.ceorl-column-inner` 段
- `src/hooks/useScrollSnap.ts` → `useScrollSettle.ts` — 重命名 + 更新内部注释
- `src/hooks/useScrollSnap.test.ts` → `useScrollSettle.test.ts` — 重命名
- `src/components/Shell.tsx` — 导入路径更新
- `src/index.ts` — 导出名更新。BREAKING: `useScrollSnap` 不再存在
- `src/App.tsx` — 如有关联导入更新
