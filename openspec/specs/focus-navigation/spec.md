# focus-navigation Specification

## Purpose
TBD - created by archiving change focus-behavior-refinement. Update Purpose after archive.
## Requirements
### Requirement: CeorlShellHandle exposes focusColumn
CeorlShell's imperative handle SHALL expose a `focusColumn(index: number)` method. Without scroll-snap, the `scrollTo` target is applied directly without interference.

The method SHALL compute L = max(0, colRight - clientWidth) and R = colLeft, and select whichever is closer to the current scroll position.

#### Scenario: L value scrolls directly without snap interference
- **WHEN** `focusColumn` selects L (right snap face) and calls `scrollTo(L, smooth)`
- **THEN** the container SHALL scroll to L without snap correction

### Requirement: focusColumn replaces scrollToColumn in public API
The `CeorlShellHandle` interface SHALL contain `focusColumn` instead of `scrollToColumn`. The `scrollToColumn` method SHALL be removed.

#### Scenario: Consumer uses focusColumn via ref
- **WHEN** consumer calls `ref.current.focusColumn(2)`
- **THEN** TypeScript SHALL resolve the method and the column SHALL be focused with minimal scroll

### Requirement: focusColumn uses L/R dual-face selection
The `focusColumn` implementation SHALL compute both L = max(0, colRight - clientWidth) and R = colLeft, and select whichever is closer to the current scroll position.

#### Scenario: L is selected when closer
- **WHEN** `focusColumn` is called and L is closer to `scrollLeft` than R
- **THEN** `scrollTo` SHALL be called with `left = L`

#### Scenario: R is selected when closer
- **WHEN** `focusColumn` is called and R is closer to `scrollLeft` than L
- **THEN** `scrollTo` SHALL be called with `left = R`

