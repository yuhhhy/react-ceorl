# controlled-shell Specification

## Purpose
TBD - created by archiving change phase-1-core-enhancements. Update Purpose after archive.
## Requirements
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

### Requirement: Shell is purely controlled via activeIndex prop
CeorlShell SHALL be a fully controlled component. `activeIndex` is a required prop. The shell SHALL NOT maintain any internal scroll state. All scroll position changes SHALL be driven by consumer code calling `ref.current.scrollTo(index)`.

#### Scenario: activeIndex prop is required
- **WHEN** CeorlShell is rendered without `activeIndex` prop
- **THEN** TypeScript SHALL report a type error

