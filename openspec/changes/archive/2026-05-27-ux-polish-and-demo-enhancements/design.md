## Context

Phase 1 implemented controlled/uncontrolled mode with keyboard navigation always enabled (`useKeyboardNav(enabled=true)`). User feedback identified several UX gaps: arrow keys conflict with page-level shortcuts, no visual indicator for the active column, column padding is hardcoded, and the demo doesn't showcase the library's width variety.

## Goals / Non-Goals

**Goals:**
- Keyboard navigation is opt-in (`enableKeyboardNav` defaults to `false`)
- Active column receives a visual highlight (CSS-only, no JS animation needed)
- CeorlColumn accepts `padding` prop to customize inner content spacing
- Demo page demonstrates all width ratios and the keyboard toggle

**Non-Goals:**
- Customizable keyboard key bindings (Phase 2)
- Animated transitions for active state change (Phase 4)
- Padding per-column in demo (demo just shows the feature exists)
- Changing the scroll-snap mechanism itself

## Decisions

### 1. `enableKeyboardNav` default: `false`

**Decision**: Keyboard navigation is opt-in.

Rationale: Arrow keys are commonly used for page-level navigation (scrolling, switching slides). A layout library should not hijack them by default. Users who want keyboard nav explicitly opt in.

Implementation: Pass `enabled` prop from CeorlShell through to `useKeyboardNav(containerRef, enableKeyboardNav, handleNavigate)`.

### 2. Active column highlight via `data-active` attribute

**Decision**: CeorlShell sets `data-active="true"` on the active CeorlColumn via React, and CSS handles the visual styling.

```css
.ceorl-column[data-active="true"] {
  border-left: 2px solid rgba(100, 150, 255, 0.6);
}
```

Alternatives considered:
- Class-based `.ceorl-column--active` — requires Column to accept `className` merging, more verbose
- Inline style — no CSS needed but couples presentation to component logic

`data-active` is the simplest: CeorlColumn already accepts `...props` (HTMLAttributes), so `data-active` passes through naturally. CSS attribute selectors handle the rest.

### 3. Propagation of active state to columns

**Decision**: When rendering from the `columns` prop, CeorlShell directly sets `data-active="true"` on the `<CeorlColumn>` for the active index. When rendering children, it clones each child and injects `data-active`.

For children mode: `React.Children.map(children, (child, i) => cloneElement(child, { 'data-active': i === activeIndex ? 'true' : undefined }))`.

For columns prop mode: Directly set `data-active={i === activeIndex ? 'true' : undefined}` on each `<CeorlColumn>`.

### 4. `padding` prop on CeorlColumn

**Decision**: Accept `padding?: string` (CSS value). Default `"16px"`. Applied as inline style on `.ceorl-column-inner`.

```tsx
<CeorlColumn padding="8px">content</CeorlColumn>
// renders: <div class="ceorl-column-inner" style="padding: 8px">
```

This is a thin wrapper over CSS. More complex padding modes (responsive, per-side) are deferred — users can pass arbitrary CSS strings like `"8px 24px 8px 12px"`.

## Risks / Trade-offs

- **`React.Children.map` performance**: Cloning children adds overhead, but column counts are typically small (<20). → Acceptable for now; virtual scrolling handles scale later.
- **data-active on cloned children may conflict with user props**: If a user passes `data-active` on their children, it will be overwritten. → Document this behavior.
