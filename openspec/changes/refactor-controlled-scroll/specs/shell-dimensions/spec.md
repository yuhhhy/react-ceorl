## MODIFIED Requirements

### Requirement: Shell defaults to full viewport dimensions
CeorlShell SHALL render with `width: 100vw` and `height: 100vh` by default via inline styles.

#### Scenario: Shell fills viewport by default
- **WHEN** CeorlShell is rendered without explicit `style.width` or `style.height`
- **THEN** the rendered div SHALL have `style="width: 100vw; height: 100vh"`

### Requirement: No overflow: auto in CSS
The `.ceorl-shell` CSS rule SHALL use `overflow: hidden`. The shell SHALL NOT use `overflow-x: auto` or `overflow-y: hidden`. User scrolling SHALL be prevented at the CSS level; all scroll movement SHALL be driven by `scrollTo({ left, behavior })`.

#### Scenario: CSS does not allow user scrolling
- **WHEN** inspecting the `.ceorl-shell` CSS rules
- **THEN** `overflow` SHALL be `hidden`; `scrollbar-width` and `::-webkit-scrollbar` SHALL NOT be present

### Requirement: No scrollbar styling
The `.ceorl-shell` CSS SHALL NOT contain `scrollbar-width: none` or `::-webkit-scrollbar` rules. With `overflow: hidden`, scrollbars are not rendered.

## REMOVED Requirements

### Requirement: No height: 100vh in CSS
**Reason**: `overflow: hidden` 已包含此约束。不再需要单独说明。
