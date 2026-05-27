# demo-variety Specification

## Purpose
TBD - created by archiving change ux-polish-and-demo-enhancements. Update Purpose after archive.
## Requirements
### Requirement: Demo shows multiple column widths
The demo application SHALL render columns with at least two different width ratios (1/2, 1/3, 1/4) to demonstrate the library's width variety.

#### Scenario: At least two width ratios visible
- **WHEN** the demo page loads
- **THEN** at least two columns with different `width` props SHALL be rendered

### Requirement: Demo has keyboard nav toggle
The demo SHALL include a toggle button to enable or disable keyboard arrow navigation.

#### Scenario: Toggle enables keyboard nav
- **WHEN** user clicks the keyboard nav toggle to enable
- **THEN** arrow keys SHALL navigate between columns

#### Scenario: Toggle disables keyboard nav
- **WHEN** user clicks the keyboard nav toggle to disable
- **THEN** arrow keys SHALL NOT navigate between columns

### Requirement: Demo layout has compact toolbar
The demo toolbar SHALL use minimal padding and height to leave more space for the column layout.

#### Scenario: Toolbar does not obstruct layout
- **WHEN** the demo page loads
- **THEN** the toolbar height SHALL be no more than 48px and the columns SHALL fill the remaining viewport height

### Requirement: Demo shows active column indicator
The demo SHALL visually indicate which column is currently active, leveraging the library's focus highlight feature.

#### Scenario: Active column has highlight in demo
- **WHEN** the demo page loads with columns visible
- **THEN** the active column SHALL have a visible highlight distinct from other columns

