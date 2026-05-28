## ADDED Requirements

### Requirement: scrollend event cancels debounce timer
When the browser supports the native `scrollend` event, the `useScrollSnap` hook SHALL cancel the pending debounce `setTimeout` upon receiving `scrollend` before calling the settle handler. This ensures `onScrollSettle` fires exactly once per scroll gesture on browsers with `scrollend` support.

#### Scenario: scrollend clears timer before settling
- **WHEN** a manual scroll gesture completes on a browser that supports `scrollend`
- **THEN** `clearTimeout` SHALL be called on the pending debounce timer before `handleSettle` is invoked

#### Scenario: scrollend path does not double-fire onScrollSettle
- **WHEN** a manual scroll gesture settles on a browser that supports `scrollend`
- **THEN** `onScrollSettle` SHALL be called exactly once with the final computed index

#### Scenario: fallback timer path still works without scrollend
- **WHEN** a manual scroll gesture completes on a browser that does NOT support `scrollend`
- **THEN** `onScrollSettle` SHALL be called exactly once via the 300ms debounce fallback
