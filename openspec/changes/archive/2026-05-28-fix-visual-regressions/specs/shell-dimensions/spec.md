## MODIFIED Requirements

### Requirement: No height: 100vh in CSS
The `.ceorl-shell` CSS rule SHALL NOT include `height: 100vh`. The height SHALL be controlled exclusively via inline style defaults. Additionally, the library CSS SHALL NOT set `height` or `overflow` on `html`, `body`, or `#root` — these are consumer-managed page-level concerns.

#### Scenario: CSS does not force viewport height
- **WHEN** inspecting the `.ceorl-shell` CSS rules
- **THEN** `height` SHALL NOT be specified in the CSS file

#### Scenario: CSS does not style html or body
- **WHEN** inspecting the `ceorl.css` file
- **THEN** no rule SHALL target `html`, `body`, `#root`, or similar global selectors
