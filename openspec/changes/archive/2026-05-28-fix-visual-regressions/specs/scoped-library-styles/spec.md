## ADDED Requirements

### Requirement: Library CSS is scoped to .ceorl-* namespace
The library's CSS file (`ceorl.css`) SHALL only contain rules targeting class selectors within the `.ceorl-*` namespace. It SHALL NOT contain rules targeting `html`, `body`, `#root`, or any other global selectors.

#### Scenario: No global selectors in library CSS
- **WHEN** reviewing `ceorl.css`
- **THEN** no rule SHALL target `html`, `body`, `#root`, `*`, or any element selector outside the `.ceorl-*` class namespace

#### Scenario: Library CSS only affects library components
- **WHEN** the library CSS is loaded on any page
- **THEN** only elements with `.ceorl-*` class names SHALL be styled; the page's global layout SHALL NOT be affected

### Requirement: Page-level styles are consumer's responsibility
The library SHALL NOT provide or require any page-level reset styles. Consumers MUST provide their own reset or layout styles as needed for their specific page context.

#### Scenario: Demo page provides its own reset
- **WHEN** the demo page (`index.html`) is loaded
- **THEN** the page's `html`, `body`, `#root` reset styles SHALL be provided by the demo's own stylesheet, not by `ceorl.css`

#### Scenario: Consumer page without reset still renders components
- **WHEN** a consumer imports CEORL into a page without any page-level reset
- **THEN** the CeorlShell and CeorlColumn components SHALL render correctly (consumer controls page layout)
