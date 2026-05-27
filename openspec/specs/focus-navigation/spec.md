# focus-navigation Specification

## Purpose
TBD - created by archiving change focus-behavior-refinement. Update Purpose after archive.
## Requirements
### Requirement: CeorlShellHandle exposes focusColumn
CeorlShell's imperative handle SHALL expose a `focusColumn(index: number)` method. The method SHALL bring the specified column into view using the minimum scroll movement necessary.

#### Scenario: Focus column already visible does nothing
- **WHEN** `focusColumn(1)` is called and column 1 is already fully visible in the viewport
- **THEN** no scroll SHALL occur

#### Scenario: Focus column partially visible scrolls to show it
- **WHEN** `focusColumn(2)` is called and column 2 is only partially visible (its right edge is outside the viewport)
- **THEN** the shell SHALL scroll right just enough to make column 2 fully visible

#### Scenario: Focus column hidden on the right scrolls to nearest edge
- **WHEN** `focusColumn(3)` is called and column 3 is completely outside the viewport on the right
- **THEN** the shell SHALL scroll right until column 3 becomes visible at the right edge of the viewport

#### Scenario: Focus column hidden on the left scrolls to nearest edge
- **WHEN** `focusColumn(0)` is called and column 0 is completely outside the viewport on the left
- **THEN** the shell SHALL scroll left until column 0 becomes visible

#### Scenario: Invalid index does nothing
- **WHEN** `focusColumn(-1)` or `focusColumn(999)` is called
- **THEN** the method SHALL NOT throw and SHALL NOT scroll

### Requirement: Keyboard navigation uses minimal scroll
When keyboard navigation is enabled, ArrowLeft and ArrowRight SHALL switch focus to the previous/next column using minimal scroll, not snap-to-left.

#### Scenario: ArrowRight to next column with minimal scroll
- **WHEN** ArrowRight is pressed, the next column is partially visible
- **THEN** the shell SHALL scroll just enough to make the next column fully visible

#### Scenario: ArrowRight to next column already visible
- **WHEN** ArrowRight is pressed and the next column is already fully visible
- **THEN** focus SHALL advance to the next column and no scroll SHALL occur

### Requirement: focusColumn replaces scrollToColumn in public API
The `CeorlShellHandle` interface SHALL contain `focusColumn` instead of `scrollToColumn`. The `scrollToColumn` method SHALL be removed.

#### Scenario: Consumer uses focusColumn via ref
- **WHEN** consumer calls `ref.current.focusColumn(2)`
- **THEN** TypeScript SHALL resolve the method and the column SHALL be focused with minimal scroll

