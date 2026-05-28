## MODIFIED Requirements

### Requirement: CeorlShellHandle exposes focusColumn
CeorlShell's imperative handle SHALL expose a `focusColumn(index: number)` method. Without scroll-snap, the `scrollTo` target is applied directly without interference.

The method SHALL compute L = max(0, colRight - clientWidth) and R = colLeft, and select whichever is closer to the current scroll position.

#### Scenario: L value scrolls directly without snap interference
- **WHEN** `focusColumn` selects L (right snap face) and calls `scrollTo(L, smooth)`
- **THEN** the container SHALL scroll to L without snap correction
