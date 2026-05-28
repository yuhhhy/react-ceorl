# scrollend-dedup Specification

## Purpose
TBD - created by archiving change fix-audit-bugs. Update Purpose after archive.
## Requirements
### Requirement: scrollend event cancels debounce timer
When the browser supports the native `scrollend` event, the scroll settle hook SHALL cancel the pending debounce `setTimeout` upon receiving `scrollend` before calling the settle handler. The hook SHALL be named `useScrollSettle` (not `useScrollSnap`), reflecting that it detects scroll settling rather than snap alignment.

#### Scenario: scrollend clears timer before settling
- **WHEN** a manual scroll gesture completes on a browser that supports `scrollend`
- **THEN** `clearTimeout` SHALL be called on the pending debounce timer before the settle handler is invoked

#### Scenario: scrollend path does not double-fire onScrollSettle
- **WHEN** a manual scroll gesture settles on a browser that supports `scrollend`
- **THEN** `onScrollSettle` SHALL be called exactly once with the final computed index

