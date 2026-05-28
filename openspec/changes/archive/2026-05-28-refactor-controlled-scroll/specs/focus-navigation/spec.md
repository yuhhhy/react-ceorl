## MODIFIED Requirements

### Requirement: CeorlShellHandle exposes focusColumn
CeorlShell's imperative handle SHALL expose a `scrollTo(index: number, opts?: { behavior?: ScrollBehavior })` method named `scrollTo` (previously `focusColumn`). The method SHALL delegate to the standalone `scrollToColumn(container, index, opts)` pure function. The method SHALL NOT include any focus management — that is the consumer's responsibility.

#### Scenario: scrollTo delegates to scrollToColumn
- **WHEN** `ref.current.scrollTo(2)` is called
- **THEN** the container SHALL scroll to bring column 2 into view using L/R minimum movement algorithm

### Requirement: focusColumn uses L/R dual-face selection
The `scrollToColumn` function SHALL compute both L = max(0, colRight - clientWidth) and R = colLeft, and select whichever is closer to the current scroll position.

#### Scenario: L is selected when closer
- **WHEN** `scrollToColumn` is called and L is closer to `scrollLeft` than R
- **THEN** `scrollTo` SHALL be called with `left = L`

#### Scenario: R is selected when closer
- **WHEN** `scrollToColumn` is called and R is closer to `scrollLeft` than L
- **THEN** `scrollTo` SHALL be called with `left = R`

## ADDED Requirements

### Requirement: scrollToColumn is a standalone pure function
The `scrollToColumn(container, index, opts?)` function SHALL be exported from the library entry point. It SHALL be a pure function with no React dependencies, no side effects, and no state.

#### Scenario: Consumer calls scrollToColumn directly
- **WHEN** a consumer calls `scrollToColumn(el, 2)` where `el` is a `.ceorl-shell` DOM element
- **THEN** the container SHALL scroll to bring column 2 into view

## REMOVED Requirements

### Requirement: focusColumn replaces scrollToColumn in public API
**Reason**: `focusColumn` 重命名为 `scrollTo`。独立函数 `scrollToColumn` 是其底层实现。
