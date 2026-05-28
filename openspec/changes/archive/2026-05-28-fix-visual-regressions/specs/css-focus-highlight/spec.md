## ADDED Requirements

### Requirement: Column has relative positioning for highlight context
The `.ceorl-column` SHALL have `position: relative` so that the `::after` pseudo-element with `position: absolute` can position relative to the column.

#### Scenario: Column has position relative
- **WHEN** a CeorlColumn is rendered
- **THEN** the column's computed `position` SHALL be `relative`

## MODIFIED Requirements

### Requirement: Active column has default inset focus highlight
The active CeorlColumn (`data-active="true"`) SHALL display a four-sided inset highlight that is always visible regardless of child element backgrounds. The highlight SHALL be implemented using a `::after` pseudo-element with `position: absolute; inset: 0; pointer-events: none` and `box-shadow: inset 0 0 0 2px var(--ceorl-focus-color)`. The base `.ceorl-column` SHALL have `position: relative` to provide a positioning context.

#### Scenario: Active column shows four-sided highlight
- **WHEN** a CeorlColumn has `data-active="true"`
- **THEN** a four-sided inset highlight of 2px SHALL be visible on all four edges of the column, rendered by the `::after` pseudo-element

#### Scenario: Highlight visible over opaque child backgrounds
- **WHEN** a CeorlColumn has `data-active="true"` and its child content has an opaque background color
- **THEN** the highlight SHALL remain visible on all four edges (not covered by child content)

#### Scenario: Inactive column has no highlight
- **WHEN** a CeorlColumn does not have `data-active="true"` (or has `data-active` unset)
- **THEN** no `::after` highlight SHALL be rendered (the pseudo-element SHALL NOT have box-shadow or SHALL not be generated)

### Requirement: Focus color is customizable via CSS custom property
The focus highlight color SHALL be controlled by the `--ceorl-focus-color` CSS custom property, defined on `.ceorl-column`. The default value SHALL be `#66ccff`.

#### Scenario: Default focus color
- **WHEN** no custom CSS overrides `--ceorl-focus-color`
- **THEN** the active column highlight SHALL use `#66ccff`

#### Scenario: User overrides focus color
- **WHEN** user sets `.ceorl-column { --ceorl-focus-color: #ff6b35; }`
- **THEN** the active column highlight SHALL use `#ff6b35`

#### Scenario: User overrides entire highlight rule
- **WHEN** user writes `.ceorl-column[data-active="true"]::after { box-shadow: inset 0 0 0 3px red; }`
- **THEN** the active column SHALL display the user's custom highlight instead of the default

### Requirement: Highlight does not affect column layout
The focus highlight SHALL NOT change the column's box-model dimensions or cause layout shift in neighboring columns. The `::after` pseudo-element SHALL use `position: absolute` so it is out of flow.

#### Scenario: Column width unchanged when active
- **WHEN** a column becomes active and receives the highlight
- **THEN** the column's `offsetWidth` SHALL remain unchanged
