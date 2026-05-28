## MODIFIED Requirements

### Requirement: No height: 100vh in CSS
The `.ceorl-shell` CSS rule SHALL use `overflow: hidden`. The rule SHALL NOT include `height`, `overflow-x`, `overflow-y`, `scroll-snap-type`, `scroll-snap-align`, `scroll-behavior`, `scrollbar-width`, or `::-webkit-scrollbar`. All scroll movement SHALL be driven programmatically by `scrollTo({ left, behavior })`.

#### Scenario: CSS uses overflow hidden only
- **WHEN** inspecting the `.ceorl-shell` CSS rules
- **THEN** only `display: flex` and `overflow: hidden` SHALL be specified

### Requirement: Shell defaults to full viewport dimensions
CeorlShell SHALL render with `width: 100vw` and `height: 100vh` by default via inline styles.

#### Scenario: Shell fills viewport by default
- **WHEN** CeorlShell is rendered without explicit `style.width` or `style.height`
- **THEN** the rendered div SHALL have `style="width: 100vw; height: 100vh"`
