## MODIFIED Requirements

### Requirement: No height: 100vh in CSS
The `.ceorl-shell` CSS rule SHALL NOT include `height`, `scroll-snap-type`, `scroll-snap-align`, or `scroll-behavior`. Dimensions SHALL be controlled exclusively via inline styles. Scroll behavior SHALL be controlled per-action via `scrollTo({ behavior })`.

#### Scenario: CSS does not set scroll-snap or scroll-behavior
- **WHEN** inspecting the `.ceorl-shell` CSS rules
- **THEN** no `scroll-snap-type`, `scroll-behavior`, or `height` SHALL be specified
