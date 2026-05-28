# keyboard-nav-config Specification

## Purpose
TBD - created by archiving change ux-polish-and-demo-enhancements. Update Purpose after archive.
## Requirements
### Requirement: Keyboard navigation is the consumer's responsibility
The library SHALL NOT provide keyboard event handling. Consumers SHALL implement their own keyboard navigation using the `focusColumn(index)` imperative API and `getColumns()` DOM accessor. The library SHALL only provide layout and scrolling capabilities.

#### Scenario: Consumer binds custom keys
- **WHEN** a consumer calls `ref.current.focusColumn(1)` in their own keyboard event handler
- **THEN** the shell SHALL scroll to bring column 1 into view with minimal scroll movement

#### Scenario: Library does not register keydown listeners
- **WHEN** CeorlShell is rendered and mounted
- **THEN** the library SHALL NOT register any global keyboard event listeners

