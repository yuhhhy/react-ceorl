## ADDED Requirements

### Requirement: Active column receives data-active attribute
CeorlShell SHALL apply the `data-active="true"` attribute to the CeorlColumn element at the current active index. All other columns SHALL NOT have the `data-active` attribute.

#### Scenario: First column is active
- **WHEN** CeorlShell is rendered with activeIndex=0 and three columns
- **THEN** the first column SHALL have `data-active="true"` and columns 2 and 3 SHALL NOT have `data-active`

#### Scenario: Active column changes on navigation
- **WHEN** activeIndex changes from 0 to 1
- **THEN** column 0 SHALL lose `data-active` and column 1 SHALL gain `data-active="true"`

### Requirement: Active column has CSS highlight
The library CSS SHALL include a visual highlight for columns with `data-active="true"`. The highlight SHALL use a left border accent of at least 2px in a distinguishable color.

#### Scenario: Active column is visually distinguishable
- **WHEN** a column has `data-active="true"`
- **THEN** the column SHALL have a left border style that visually distinguishes it from inactive columns

### Requirement: data-active propagates to both children and columns modes
Whether columns are rendered via the `columns` prop or via `children`, the active column SHALL receive `data-active="true"`.

#### Scenario: Children mode receives data-active
- **WHEN** CeorlShell is rendered with `<CeorlColumn>` children and activeIndex=0
- **THEN** the first child CeorlColumn SHALL have `data-active="true"`

#### Scenario: Columns prop mode receives data-active
- **WHEN** CeorlShell is rendered with `columns={[...]}` and activeIndex=1
- **THEN** the second rendered CeorlColumn SHALL have `data-active="true"`
