## Context

Phase 1 added `scrollToColumn(index)` — a method that computes cumulative column widths and scrolls the target to the viewport left edge. This treats CEORL like a carousel: only one column at a time occupies the viewport. In a tiling layout, multiple columns are visible simultaneously, and switching focus should preserve surrounding columns as spatial context.

The `ux-polish-and-demo-enhancements` change added `data-active` with a left-side inset shadow highlight, but the highlight is too subtle and not customizable.

## Goals / Non-Goals

**Goals:**
- `focusColumn(index)` replaces `scrollToColumn(index)`: uses minimum scroll to ensure the column is visible
- If the target column is already fully visible → no scroll occurs
- Keyboard navigation (←/→) uses the same minimal-scroll logic
- Default four-sided focus highlight via `box-shadow: inset` with `--ceorl-focus-color: #66ccff`
- Users can override highlight color via CSS custom property

**Non-Goals:**
- Focus centering behavior (always center focused column)
- Focus following during manual scrolling (already handled by `useScrollSnap`)
- Multi-column focus / range selection
- Scroll-snap customization per column

## Decisions

### 1. Replace `scrollToColumn` with `focusColumn`

**Decision**: Use the column's DOM element and call `scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })`.

```
focusColumn(container, index):
  col = cols[index]
  col.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
```

`inline: 'nearest'` means:
- Column fully visible horizontally → no scroll
- Column partially visible → scroll minimum to show it fully
- Column not visible → scroll to nearest edge

`block: 'nearest'` is also set to handle any (unlikely) vertical misalignment.

**Why `scrollIntoView` over manual offset calculation:**
- `scrollIntoView` is the platform-native way to express "make this visible"
- Handles all edge cases (column wider than viewport, multiple columns partially visible)
- Respects `scroll-behavior: smooth` already set on the container
- One-liner, no offset math

**Scroll-snap interaction**: The shell has `scroll-snap-type: x mandatory`. After `scrollIntoView` scrolls, the browser may perform a snap correction. Since column left edges are snap points (`scroll-snap-align: start`), this correction is benign — the viewport settles at a valid column boundary.

**Alternatives considered**:
- Manual offset calculation: Works but requires maintaining offset math that duplicates browser layout. Error-prone with dynamic widths.
- Adding `scroll-snap-type: none` temporarily during `focusColumn`: Over-engineering. The snap correction is a feature, not a bug.

### 2. CSS custom property for focus color

**Decision**: Define `--ceorl-focus-color: #66ccff` on `.ceorl-column` and use it in the highlight rule.

```css
.ceorl-column {
  --ceorl-focus-color: #66ccff;
}

.ceorl-column[data-active="true"] {
  box-shadow: inset 0 0 0 2px var(--ceorl-focus-color);
}
```

Users override with:
```css
.ceorl-column { --ceorl-focus-color: #ff6b35; }
```

Or directly override the rule to change thickness, style, etc.

**Why CSS custom property over inline style:**
- Library stays presentational; users theme declaratively
- No JS API needed for color changes
- Overridable at any specificity level

**Why `box-shadow: inset` over `outline` or `border`:**
- `border` affects box model (even with `border-box`, it shifts inner content)
- `outline` doesn't follow rounded corners and sits outside the element
- `inset box-shadow` is purely visual, sits inside the element, doesn't affect layout

### 3. Rename `scrollToColumn` → `focusColumn` in `CeorlShellHandle`

**Decision**: Rename the imperative handle method. This is a **BREAKING** API change but accurately reflects the new semantics.

## Risks / Trade-offs

- **`scrollIntoView` browser differences**: Safari may handle `scrollIntoView` with scroll-snap differently than Chrome. → The behavior degrades gracefully — the column will still be visible even if the snap position differs slightly.
- **`behavior: 'smooth'` on rapid successive calls**: If user rapidly clicks Next, multiple smooth scrolls may queue. → Acceptable; `scrollIntoView` cancels existing smooth scrolls on the same element.
- **Breaking API rename**: Code using `scrollToColumn` will fail to compile. → Migration is trivial (rename); breakage is compile-time, not runtime.
