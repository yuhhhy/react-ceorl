## MODIFIED Requirements

### Requirement: CeorlShellHandle exposes scrollTo
CeorlShell's imperative handle SHALL expose a `scrollTo(index: number, opts?: { behavior?: ScrollBehavior })` method. The method SHALL delegate to the standalone `scrollToColumn(container, index, opts)` pure function. The method SHALL NOT include any focus management — that is the consumer's responsibility.

#### Scenario: scrollTo delegates to scrollToColumn
- **WHEN** `ref.current.scrollTo(2)` is called
- **THEN** the container SHALL scroll to bring column 2 into view using L/R minimum movement algorithm

### Requirement: scrollToColumn is a standalone pure function
The `scrollToColumn(container, index, opts?)` function SHALL be exported from the library entry point. It SHALL be a pure function with no React dependencies, no side effects, and no state.

#### Scenario: Consumer calls scrollToColumn directly
- **WHEN** a consumer calls `scrollToColumn(el, 2)` where `el` is a `.ceorl-shell` DOM element
- **THEN** the container SHALL scroll to bring column 2 into view

## REMOVED Requirements

### Requirement: CeorlShellHandle exposes focusColumn
**Reason**: 重命名为 `scrollTo`。语义更准确——只做滚动，不管焦点。
**Migration**: `ref.current.focusColumn(n)` → `ref.current.scrollTo(n)`。

### Requirement: Keyboard navigation uses minimal scroll
**Reason**: 键盘交互不再属于库的 spec 范围（已在较早 PR 中移除）。

### Requirement: focusColumn replaces scrollToColumn in public API
**Reason**: `focusColumn` 重命名为 `scrollTo`。独立函数 `scrollToColumn` 是其底层实现。
