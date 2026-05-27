# css-focus-highlight Specification

## Purpose
TBD - created by archiving change focus-behavior-refinement. Update Purpose after archive.
## Requirements
### Requirement: Active column has default inset focus highlight
The active CeorlColumn (`data-active="true"`) SHALL display a four-sided inset highlight using `box-shadow`. The default color SHALL be `#66ccff` and the width SHALL be `2px`.

#### Scenario: Active column shows four-sided highlight
- **WHEN** a CeorlColumn has `data-active="true"`
- **THEN** the column SHALL have an inset box-shadow of `0 0 0 2px` in the focus color visible on all four edges

#### Scenario: Inactive column has no highlight
- **WHEN** a CeorlColumn does not have `data-active="true"` (or has `data-active` unset)
- **THEN** no focus highlight box-shadow SHALL be applied

### Requirement: Focus color is customizable via CSS custom property
The focus highlight color SHALL be controlled by the `--ceorl-focus-color` CSS custom property, defined on `.ceorl-column`. The default value SHALL be `#66ccff`.

#### Scenario: Default focus color
- **WHEN** no custom CSS overrides `--ceorl-focus-color`
- **THEN** the active column highlight SHALL use `#66ccff`

#### Scenario: User overrides focus color
- **WHEN** user sets `.ceorl-column { --ceorl-focus-color: #ff6b35; }`
- **THEN** the active column highlight SHALL use `#ff6b35`

#### Scenario: User overrides entire highlight rule
- **WHEN** user writes `.ceorl-column[data-active="true"] { box-shadow: inset 0 0 0 3px red; }`
- **THEN** the active column SHALL display the user's custom highlight instead of the default

### Requirement: Highlight does not affect column layout
The focus highlight SHALL NOT change the column's box-model dimensions or cause layout shift in neighboring columns.

#### Scenario: Column width unchanged when active
- **WHEN** a column becomes active and receives the highlight
- **THEN** the column's `offsetWidth` SHALL remain unchanged

