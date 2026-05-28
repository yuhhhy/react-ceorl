## ADDED Requirements

### Requirement: Scoped listeners exempt editable elements within shell
When a consumer implements scoped keyboard navigation on the shell container, they SHALL exempt direction keys pressed within editable elements (input, textarea, select, contenteditable) to preserve standard interaction semantics.

#### Scenario: Direction keys in editable elements are not intercepted
- **WHEN** a direction key is pressed inside an `<input>`, `<textarea>`, `<select>`, or `[contenteditable]` element within the shell
- **THEN** the keyboard handler SHALL pass through without calling `preventDefault()` or triggering navigation

## MODIFIED Requirements

### Requirement: Keyboard navigation is the consumer's responsibility
The library SHALL NOT provide keyboard event handling. Consumers SHALL implement their own keyboard navigation by listening on the shell's container element (`scrollElement` exposed via ref) rather than on `document`. Container-level scoped listening ensures keyboard events only affect the shell when focus is within it.

#### Scenario: Consumer binds to scrollElement, not document
- **WHEN** a consumer implements keyboard navigation by calling `ref.current.scrollElement.addEventListener('keydown', handler)`
- **THEN** direction keys SHALL only trigger navigation when focus is within the shell container

#### Scenario: Library does not register global keydown listeners
- **WHEN** CeorlShell is rendered and mounted
- **THEN** the library SHALL NOT register any global keyboard event listeners on `document`

#### Scenario: scrollElement is exposed via ref handle
- **WHEN** a consumer accesses `ref.current.scrollElement` after mount
- **THEN** the ref SHALL return the shell's scroll container `HTMLDivElement`
