## ADDED Requirements

### Requirement: CeorlShell accepts columns prop as an array of descriptors
CeorlShell SHALL accept a `columns` prop of type `readonly ColumnDescriptor[]`. Each descriptor MUST include an `id` (unique string), optional `width` (ColumnWidth, defaults to `'1/3'`), and `content` (ReactNode). The shell SHALL render one CeorlColumn per descriptor.

#### Scenario: Render columns from descriptor array
- **WHEN** CeorlShell is rendered with `columns={[{id:'a', content:<div>Hello</div>}, {id:'b', width:'1/2', content:<div>World</div>}]}`
- **THEN** two columns SHALL be rendered with the first at default width 1/3 and the second at 1/2 width

#### Scenario: Empty columns array renders empty shell
- **WHEN** CeorlShell is rendered with `columns={[]}`
- **THEN** the shell SHALL render but contain zero CeorlColumn elements

### Requirement: Column descriptors must have unique id
Each column descriptor in the `columns` array SHALL have a unique `id`. CeorlShell MUST use `id` as the React `key` for each rendered CeorlColumn.

#### Scenario: Duplicate ids in development
- **WHEN** CeorlShell is rendered with two descriptors sharing the same `id` in development mode
- **THEN** React SHALL emit a key warning (standard React behavior)

### Requirement: Dynamic columns preserve scroll position on insertion
When new columns are inserted before the current active column, existing columns' relative scroll positions SHALL be preserved. The active index SHALL shift to account for the insertion.

#### Scenario: Insert column at index 0 shifts active index
- **WHEN** shell has 3 columns with activeIndex=1, and a new column descriptor is inserted at index 0
- **THEN** activeIndex SHALL become 2 (the same column that was at index 1 is now at index 2)

### Requirement: Dynamic columns preserve scroll position on removal
When a column is removed from the `columns` array, the active index SHALL be clamped to remain within bounds.

#### Scenario: Remove active column clamps to last valid index
- **WHEN** shell has 3 columns with activeIndex=2, and the column at index 2 is removed
- **THEN** activeIndex SHALL become 1 (clamped to the new last valid index)

#### Scenario: Remove column before active shifts index
- **WHEN** shell has 4 columns with activeIndex=2, and the column at index 0 is removed
- **THEN** activeIndex SHALL become 1 (the same column shifts one position left)

### Requirement: ColumnDescriptor type is exported publicly
The `ColumnDescriptor` interface SHALL be exported from the library's public API (`src/index.ts`).

#### Scenario: Import ColumnDescriptor from library
- **WHEN** consumer writes `import type { ColumnDescriptor } from 'ceorl'`
- **THEN** the type SHALL resolve to `{ id: string; width?: ColumnWidth; content: ReactNode }`
