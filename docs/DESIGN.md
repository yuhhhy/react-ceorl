# CEORL — Ceorl Rolling Layout

**Composable Ergonomic Ordered Rolling Layouts**

希儿滚动平铺——React 滚动平铺窗口布局组件库。

---

## 设计背景

灵感来自 **niri**（scrollable-tiling Wayland compositor）的横向滚动平铺布局。

在某些信息密集场景下，用户需要同时处理多个信息通道：面板 A、面板 B、面板 C……传统 Tab 切换方案每次只展示一个通道，信息无法并行呈现。

CEORL 让用户在一个视口中并排浏览多个面板，自由调整每个面板的宽度（1/2、1/3、1/4）和堆叠方式，最大化信息呈现密度，降低上下文切换成本。

典型适用场景：仪表盘、设计工具、IDE 面板布局、监控控制台、内容管理系统等。

## 核心交互模型

```
┌──────────────────────────────────────────────────────────────┐
│ [面板 A 1/2] │ [面板 B 1/3] │ [面板 C 1/4] │ [面板 D 1/3] │ → 滚
└──────────────────────────────────────────────────────────────┘
   ← 吸附边界 →   ← 吸附边界 →  ← 吸附边界 →  ← 吸附边界 →
```

- **横向滚动列**——面板按列排列，铺满视口高度，横向滚动切换焦点
- **Snap-to-column**——滚动时自动吸附到最近的列边界，无中间拖尾
- **可变列宽**——每列宽度可为 1/2、1/3、1/4 屏幕宽度，按需调整
- **列内堆叠**——同一列可纵向分割多个面板
- **平滑动画**——列切换和宽度变化有过渡动画

## 组件 API

### CeorlShell

顶层容器。底层是一个 `scroll-snap` 容器，所有子元素以横向排列。

```tsx
<CeorlShell>
  <CeorlColumn>...</CeorlColumn>
  <CeorlColumn>...</CeorlColumn>
</CeorlShell>
```

Props: 继承 `HTMLAttributes<HTMLDivElement>`，无额外必填 props。

### CeorlColumn

单列容器。一个窗口 = 一列，通过 `width` 属性控制宽度档位。

```tsx
<CeorlColumn width="1/3">
  {/* 任意内容 */}
</CeorlColumn>
```

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `width` | `'1/2' \| '1/3' \| '1/4'` | `'1/3'` | 列宽度占视口比例 |

### CeorlStack

列内堆叠容器。在同一列内纵向分割多个面板。

```tsx
<CeorlColumn width="1/2">
  <CeorlStack>
    <PanelA />
    <PanelB />
  </CeorlStack>
</CeorlColumn>
```

Props: 无额外必填 props。子元素自动等分高度。

### Hooks

| Hook | 用途 |
|------|------|
| `useScrollSnap(containerRef)` | 滚动吸附跟踪（预留：后续会更新 activeIndex） |
| `useKeyboardNav(containerRef, enabled?)` | 键盘 ←/→ 导航 |

## 技术实现

纯 CSS + React，不依赖第三方布局库。

### 核心 CSS

```css
.ceorl-shell {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  height: 100vh;
  overflow-y: hidden;
}

.ceorl-column {
  flex-shrink: 0;
  scroll-snap-align: start;
  height: 100%;
}

.ceorl-column[data-width="1/2"] { width: 50vw; }
.ceorl-column[data-width="1/3"] { width: calc(100vw / 3); }
.ceorl-column[data-width="1/4"] { width: 25vw; }
```

### 功能实现评估

| 功能 | 实现方式 | 难度 |
|------|----------|------|
| 横向滚动 + snap | `scroll-snap-type: x mandatory` + `scroll-snap-align: start` | 🟢 一行 CSS |
| 可变宽度 1/2/3/4 | CSS 变量或 data-attribute | 🟢 简单 |
| 列内堆叠 | flex column + overflow-y: auto | 🟢 简单 |
| 挂载组件 | React children / 插槽模式 | 🟢 框架原生 |
| 平滑动画 | `scroll-behavior: smooth` + transition | 🟢 一行 CSS |
| 键盘导航 ← → | `element.scrollBy()` | 🟢 ~20 行 JS |
| 拖拽调整宽度 | pointer events + resize handle | 🟡 ~50 行 JS |
| 列间拖拽移动 | dnd-kit / HTML5 drag & drop | 🟡 ~80 行 JS |
| 自定义物理滚动 | 完全替换原生 scroll 引擎 | 🔴 复杂（暂不需要） |

## 迭代路线图

### Phase 0 — 原型验证（半天）
- [x] 项目脚手架搭建
- [x] CeorlShell 横向滚动容器 + scroll-snap
- [x] CeorlColumn 可变宽度（1/2, 1/3, 1/4）
- [x] CeorlStack 列内堆叠
- [x] 键盘 ←/→ 导航
- [x] Demo 页面可交互运行

### Phase 1 — 基础集成（1-2 天）
- [ ] 稳定 API 设计，支持受控/非受控模式
- [ ] 单元测试（vitest + testing-library）
- [ ] 窗口 CRUD（添加/删除面板）

### Phase 2 — 丰富交互（2-3 天）
- [ ] 拖拽调整宽度（resize handle）
- [ ] 列间拖拽排序
- [ ] 堆叠比例拖拽调整
- [ ] 键盘快捷键完善

### Phase 3 — 配置持久化（1 天）
- [ ] 布局配置序列化为 JSON
- [ ] 从 JSON 恢复布局

### Phase 4 — 优化（按需）
- [ ] 虚拟滚动
- [ ] 动画打磨
- [ ] 性能调优
- [ ] a11y（焦点管理、ARIA 属性）

## 设计原则

- **渐进式复杂性**——默认场景只显示 1 个面板（全屏），用户按需添加
- **信息密度可调**——1/2/1/3/1/4 是认知负载调节器，不是固定的
- **主次分明**——焦点面板占主要视口，相邻面板提供上下文感知
- **非侵入**——只负责布局呈现层，不介入组件通信
- **零运行时依赖**——核心布局只依赖 CSS 原生能力和 React，不做多余抽象
