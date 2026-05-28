# shell-dimensions Specification

## Purpose
TBD - created by archiving change shell-dimension-api. Update Purpose after archive.
## Requirements
### Requirement: Shell defaults to full viewport dimensions
CeorlShell SHALL render with `width: 100vw` and `height: 100vh` by default via inline styles.

#### Scenario: Shell fills viewport by default
- **WHEN** CeorlShell is rendered without explicit `style.width` or `style.height`
- **THEN** the rendered div SHALL have `style="width: 100vw; height: 100vh"`

### Requirement: Shell dimensions are overridable via style prop
CeorlShell SHALL accept the standard `style` prop (from `HTMLAttributes<HTMLDivElement>`). Consumer-supplied `style.width` and `style.height` overrides the defaults.

#### Scenario: Consumer sets custom height
- **WHEN** CeorlShell is rendered with `style={{ height: 'calc(100vh - 64px)' }}`
- **THEN** the rendered div SHALL have `height: calc(100vh - 64px)` and the default `100vh` SHALL NOT apply

#### Scenario: Consumer sets custom width
- **WHEN** CeorlShell is rendered with `style={{ width: '800px' }}`
- **THEN** the rendered div SHALL have `width: 800px` and the default `100vw` SHALL NOT apply

### Requirement: No height: 100vh in CSS
The `.ceorl-shell` CSS rule SHALL use `overflow: hidden`. The rule SHALL NOT include `height`, `overflow-x`, `overflow-y`, `scroll-snap-type`, `scroll-snap-align`, `scroll-behavior`, `scrollbar-width`, or `::-webkit-scrollbar`. All scroll movement SHALL be driven programmatically by `scrollTo({ left, behavior })`.

#### Scenario: CSS uses overflow hidden only
- **WHEN** inspecting the `.ceorl-shell` CSS rules
- **THEN** only `display: flex` and `overflow: hidden` SHALL be specified

### Requirement: Column widths are percentage-based relative to shell
The `WIDTH_MAP` constant SHALL map column width ratios to percentage strings relative to the shell container, not viewport units.

#### Scenario: WIDTH_MAP uses percentages
- **WHEN** `WIDTH_MAP['1/2']` is accessed
- **THEN** the value SHALL be `'50%'`

#### Scenario: WIDTH_MAP['1/3'] uses percentage
- **WHEN** `WIDTH_MAP['1/3']` is accessed
- **THEN** the value SHALL be `'33.333%'`

#### Scenario: WIDTH_MAP['1/4'] uses percentage
- **WHEN** `WIDTH_MAP['1/4']` is accessed
- **THEN** the value SHALL be `'25%'`

### Requirement: Column height adapts to shell height
CeorlColumn SHALL fill the full height of the CeorlShell container, regardless of the shell's configured height.

#### Scenario: Column fills constrained shell
- **WHEN** CeorlShell is rendered with `height: 400px` and contains CeorlColumn children
- **THEN** each column SHALL be 400px tall

