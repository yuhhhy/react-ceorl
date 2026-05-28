## MODIFIED Requirements

### Requirement: Programmatic focus change does not emit intermediate indices
When `focusColumn` triggers a smooth scroll, the `onIndexChange` callback SHALL be called exactly once — with the final correct index after the scroll animation completes via the scroll settle path. No intermediate or immediate index SHALL be emitted before the scroll animation begins. The seq counter SHALL still guard against stale settle events.

#### Scenario: Long-distance smooth scroll emits only final index
- **WHEN** `focusColumn(3)` is called on a shell with 4+ columns, triggering a scroll animation spanning >200ms
- **THEN** `onIndexChange` SHALL be called with 3 exactly once after the animation settles, and SHALL NOT be called before the animation begins

#### Scenario: Scrollend event clears suppression and emits correct index
- **WHEN** the smooth scroll animation completes and `scrollend` fires
- **THEN** the handler SHALL compute and emit the correct active index, and the ignore flag SHALL be cleared

#### Scenario: Immediate updateIndex not called in doFocus
- **WHEN** `doFocus(index)` is invoked on a shell
- **THEN** the seq counter SHALL be incremented, the column SHALL be scrolled into view, but `updateIndex` SHALL NOT be called until the scroll settle event fires

### Requirement: Manual scroll still updates index with debounce
When the user manually scrolls (mouse wheel, touchpad, drag), the debounced scroll handler SHALL continue to update the active index normally.

#### Scenario: Manual scroll updates index via debounce
- **WHEN** user manually scrolls and 300ms passes without further scroll events
- **THEN** `onIndexChange` SHALL be called with the computed active index

### Requirement: CeorlColumn default padding is removed
CeorlColumn's `padding` prop SHALL default to `undefined`. When not specified, no inline `padding` style SHALL be applied to `.ceorl-column-inner`.

#### Scenario: No padding without explicit prop
- **WHEN** CeorlColumn is rendered without a `padding` prop
- **THEN** `.ceorl-column-inner` SHALL have no inline `padding` style

#### Scenario: Explicit padding still works
- **WHEN** CeorlColumn is rendered with `padding="8px"`
- **THEN** `.ceorl-column-inner` SHALL have `style="padding: 8px"`
