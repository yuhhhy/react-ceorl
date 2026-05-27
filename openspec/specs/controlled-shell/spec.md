# controlled-shell Specification

## Purpose
TBD - created by archiving change phase-1-core-enhancements. Update Purpose after archive.
## Requirements
### Requirement: CeorlShell supports uncontrolled active index
CeorlShell SHALL accept a `defaultActiveIndex` prop to set the initial active column index. When only `defaultActiveIndex` is provided (no `activeIndex`), the shell MUST manage active-index state internally. The first column SHALL be index 0.

#### Scenario: Default active index starts at first column
- **WHEN** CeorlShell is rendered with `<CeorlShell><CeorlColumn /><CeorlColumn /></CeorlShell>` and no `activeIndex` or `defaultActiveIndex` prop
- **THEN** the active index SHALL be 0

#### Scenario: Uncontrolled mode with explicit defaultActiveIndex
- **WHEN** CeorlShell is rendered with `defaultActiveIndex={1}` and three children columns
- **THEN** the active index SHALL be 1

### Requirement: CeorlShell supports controlled active index
CeorlShell SHALL accept an `activeIndex` prop. When `activeIndex` is provided, the shell MUST operate in controlled mode — the active column is determined solely by the prop value, not by internal state. The shell MUST NOT update activeIndex internally in controlled mode.

#### Scenario: Controlled mode overrides internal state
- **WHEN** CeorlShell is rendered with `activeIndex={2}` and three children columns
- **THEN** the active index SHALL be 2 regardless of scroll position

#### Scenario: Controlled mode ignores defaultActiveIndex
- **WHEN** CeorlShell is rendered with both `activeIndex={1}` and `defaultActiveIndex={0}`
- **THEN** the active index SHALL be 1 (controlled takes precedence)

### Requirement: CeorlShell fires onIndexChange callback
CeorlShell SHALL accept an `onIndexChange` callback prop. The callback MUST be invoked with the new active column index whenever the active column changes due to scroll-snap settling or programmatic navigation. The callback SHALL NOT be invoked in controlled mode (parent manages state).

#### Scenario: Scroll snap triggers onIndexChange
- **WHEN** user scrolls the shell such that a different column snaps to view, in uncontrolled mode with `onIndexChange` provided
- **THEN** `onIndexChange` SHALL be called with the new column index

#### Scenario: Keyboard navigation triggers onIndexChange
- **WHEN** user presses ArrowRight key while shell has keyboard navigation enabled and `onIndexChange` provided
- **THEN** `onIndexChange` SHALL be called with the next column index

#### Scenario: Controlled mode does not trigger onIndexChange on scroll
- **WHEN** CeorlShell is in controlled mode (`activeIndex` provided) and user scrolls
- **THEN** `onIndexChange` SHALL NOT be called (parent controls state)

### Requirement: CeorlShell exposes imperative scrollToColumn via ref
CeorlShell SHALL expose a ref handle with a `scrollToColumn(index: number)` method that scrolls the container to bring the specified column index into view using smooth scroll behavior.

#### Scenario: Programmatic scroll to column
- **WHEN** `scrollToColumn(2)` is called on a CeorlShell ref with at least 3 columns
- **THEN** the shell SHALL scroll so that column index 2 is aligned to the snap position

#### Scenario: Invalid index does nothing
- **WHEN** `scrollToColumn(-1)` or `scrollToColumn(999)` is called
- **THEN** the shell SHALL NOT scroll and SHALL NOT throw

### Requirement: CeorlShell renders all children as columns
CeorlShell SHALL render each direct child in a horizontally scrollable flex row, preserving scroll-snap alignment on each column boundary.

#### Scenario: Multiple children render as scrollable columns
- **WHEN** CeorlShell is rendered with 3 `<CeorlColumn>` children
- **THEN** all 3 columns SHALL be visible in the scroll container and SHALL snap to column boundaries

### Requirement: CeorlShell accepts columns prop for dynamic column management
CeorlShell SHALL accept an optional `columns` prop of type `ColumnDescriptor[]`. When `columns` is provided, the shell MUST render columns from the array. When `columns` is not provided, the shell SHALL render children directly (backward compatible with Phase 0).

#### Scenario: Columns prop renders descriptors
- **WHEN** CeorlShell is rendered with `columns={[{id:'a', content:'A'}, {id:'b', content:'B'}]}`
- **THEN** two columns SHALL be rendered with content 'A' and 'B'

#### Scenario: Columns prop takes precedence over children
- **WHEN** CeorlShell is rendered with both `columns={[...]}` and `<CeorlColumn>` children
- **THEN** only the columns from the `columns` prop SHALL be rendered

### Requirement: useScrollSnap returns active index
The `useScrollSnap` hook SHALL return the active column index based on the current scroll position of the container. It SHALL accept an optional `onIndexChange` callback that fires when the active index changes.

#### Scenario: Active index updates on scroll
- **WHEN** container scrolls to a position where a different column is at the snap boundary
- **THEN** the returned `activeIndex` SHALL reflect the new column

#### Scenario: onIndexChange callback fires
- **WHEN** active index changes from 0 to 1 and `onIndexChange` callback is provided
- **THEN** `onIndexChange` SHALL be called with value 1

### Requirement: useKeyboardNav supports navigation callback
The `useKeyboardNav` hook SHALL accept an optional `onNavigate(direction)` callback. When provided, the callback MUST be invoked with `'prev'` or `'next'` on arrow key press before performing the scroll.

#### Scenario: Arrow keys trigger onNavigate
- **WHEN** user presses ArrowRight and `onNavigate` callback is provided
- **THEN** `onNavigate('next')` SHALL be called, then the container SHALL scroll right

