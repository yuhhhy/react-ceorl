## MODIFIED Requirements

### Requirement: CeorlShellHandle exposes focusColumn
CeorlShell's imperative handle SHALL expose a `focusColumn(index: number)` method. The method SHALL determine the scroll direction from the relative position of the target column:

- If the target column's left edge is to the right of the viewport left edge (colLeft >= viewLeft): scroll RIGHT, using the column's LEFT snap face. Target: `colLeft`.
- If the target column's left edge is to the left (colLeft < viewLeft): scroll LEFT, using the column's RIGHT snap face. Target: `max(0, colLeft + col.offsetWidth - clientWidth)`.
- If the column is already fully visible within the viewport, no scroll SHALL occur.

The method SHALL use `container.scrollTo({ left: target, behavior: 'smooth' })`.

#### Scenario: Focus column right of viewport uses left snap face
- **WHEN** `focusColumn(3)` is called and column 3's left edge is to the right of `scrollLeft`
- **THEN** `scrollTo` SHALL be called with `left = col3.offsetLeft`

#### Scenario: Focus column left of viewport uses right snap face
- **WHEN** `focusColumn(0)` is called and column 0's left edge is to the left of `scrollLeft`
- **THEN** `scrollTo` SHALL be called with `left = max(0, colRight - clientWidth)`

#### Scenario: Focus column already fully visible does nothing
- **WHEN** `focusColumn(1)` is called and column 1 is fully within `[scrollLeft, scrollLeft + clientWidth]`
- **THEN** no scroll SHALL occur

#### Scenario: Invalid index does nothing
- **WHEN** `focusColumn(-1)` or `focusColumn(999)` is called
- **THEN** the method SHALL NOT throw and SHALL NOT scroll

## ADDED Requirements

### Requirement: focusColumn uses L/R dual-face selection
The `focusColumn` implementation SHALL compute both L = max(0, colRight - clientWidth) and R = colLeft, and select whichever is closer to the current scroll position.

#### Scenario: L is selected when closer
- **WHEN** `focusColumn` is called and L is closer to `scrollLeft` than R
- **THEN** `scrollTo` SHALL be called with `left = L`

#### Scenario: R is selected when closer
- **WHEN** `focusColumn` is called and R is closer to `scrollLeft` than L
- **THEN** `scrollTo` SHALL be called with `left = R`

## REMOVED Requirements

### Requirement: Keyboard navigation uses minimal scroll
**Reason**: 键盘交互不再由库负责。
**Migration**: 消费者在键盘处理中调用 `focusColumn(index)`。
