# column-padding Specification

## Purpose
TBD - created by archiving change ux-polish-and-demo-enhancements. Update Purpose after archive.
## Requirements
### Requirement: CeorlColumn accepts padding prop
CeorlColumn SHALL accept an optional `padding` prop of type `string`. The value SHALL be applied as the CSS `padding` inline style on the `.ceorl-column-inner` element.

#### Scenario: Default padding is 16px
- **WHEN** CeorlColumn is rendered without a `padding` prop
- **THEN** the `.ceorl-column-inner` SHALL have `style="padding: 16px"`

#### Scenario: Custom padding overrides default
- **WHEN** CeorlColumn is rendered with `padding="8px 24px"`
- **THEN** the `.ceorl-column-inner` SHALL have `style="padding: 8px 24px"`

#### Scenario: Zero padding is valid
- **WHEN** CeorlColumn is rendered with `padding="0"`
- **THEN** the `.ceorl-column-inner` SHALL have `style="padding: 0"`

### Requirement: padding prop is exported from public API
The `padding` prop SHALL be part of `CeorlColumnProps` and exported from the library entry point.

#### Scenario: TypeScript consumer can use the prop
- **WHEN** consumer writes `<CeorlColumn padding="12px">`
- **THEN** TypeScript SHALL not report a type error

