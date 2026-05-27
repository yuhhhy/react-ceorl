## ADDED Requirements

### Requirement: Keyboard navigation is disabled by default
CeorlShell SHALL NOT respond to keyboard arrow keys by default. The `useKeyboardNav` hook SHALL only be activated when an explicit `enableKeyboardNav` prop is set to `true`.

#### Scenario: Arrow keys do nothing by default
- **WHEN** CeorlShell is rendered without `enableKeyboardNav` prop and user presses ArrowLeft or ArrowRight
- **THEN** no column navigation SHALL occur

#### Scenario: Arrow keys navigate when enabled
- **WHEN** CeorlShell is rendered with `enableKeyboardNav={true}` and user presses ArrowRight
- **THEN** the active column SHALL advance to the next index

### Requirement: CeorlShell accepts enableKeyboardNav prop
CeorlShell SHALL accept an optional `enableKeyboardNav` prop of type `boolean`. When `true`, the arrow key navigation hook is active. When `false` or omitted, the hook is disabled.

#### Scenario: Prop defaults to false
- **WHEN** CeorlShell is rendered with no `enableKeyboardNav` prop
- **THEN** keyboard navigation SHALL be disabled

#### Scenario: Prop explicitly true
- **WHEN** CeorlShell is rendered with `enableKeyboardNav={true}`
- **THEN** keyboard navigation SHALL be active

### Requirement: enableKeyboardNav prop is exported from public API
The `enableKeyboardNav` prop SHALL be part of `CeorlShellProps` and exported from the library entry point.

#### Scenario: TypeScript consumer can use the prop
- **WHEN** consumer writes `<CeorlShell enableKeyboardNav={true}>`
- **THEN** TypeScript SHALL not report a type error
