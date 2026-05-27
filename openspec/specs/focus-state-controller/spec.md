# focus-state-controller Specification

## Purpose
TBD - created by archiving change refactor-focus-architecture. Update Purpose after archive.
## Requirements
### Requirement: Shell is the sole writer of activeIndex
CeorlShell SHALL be the only component that updates the active index. The `useScrollSnap` hook SHALL NOT call `onIndexChange` or any equivalent that would override Shell's decision about which column is focused.

#### Scenario: focusColumn sets index and hook does not override
- **WHEN** `focusColumn(2)` is called and the smooth scroll animation completes
- **THEN** `activeIndex` SHALL remain 2, regardless of the final scroll position computed by the hook

#### Scenario: User scroll updates index via hook report
- **WHEN** user manually scrolls and the scroll settles at a new column
- **THEN** `useScrollSnap` SHALL report the observed index to Shell, and Shell SHALL adopt it

### Requirement: Rapid focus switching produces correct final index
When `focusColumn` is called multiple times in quick succession (before prior scroll animations complete), the final `activeIndex` SHALL match the last `focusColumn` call, not any intermediate call.

#### Scenario: Three rapid focus changes
- **WHEN** `focusColumn(0)`, `focusColumn(2)`, then `focusColumn(1)` are called within 100ms
- **THEN** `activeIndex` SHALL be 1 after all scroll animations complete

#### Scenario: User scroll during programmatic scroll
- **WHEN** user manually scrolls while a programmatic `focusColumn` scroll animation is in progress
- **THEN** the user's scroll SHALL take effect after the animation completes and the settle event fires

### Requirement: useScrollSnap does not mutate caller state
`useScrollSnap` SHALL NOT accept or mutate any ref that is owned by the calling component for the purpose of suppressing scroll events. The hook SHALL be a pure observer.

#### Scenario: No ignoreRef parameter exists
- **WHEN** reviewing the `useScrollSnap` function signature
- **THEN** there SHALL be no `ignoreRef` parameter

### Requirement: useScrollSnap reports settle events with sequence number
`useScrollSnap` SHALL provide an `onScrollSettle` callback option that fires when the scroll position stabilizes (via `scrollend` or debounced `scroll`). The callback SHALL receive the observed column index and a monotonic sequence number identifying the scroll gesture.

#### Scenario: Scroll settle fires with index and seq
- **WHEN** a manual scroll settles at column index 1
- **THEN** `onScrollSettle` SHALL be called with `(1, <seq>)` where `<seq>` is a number that increments with each new scroll gesture

### Requirement: Shell uses request counter to guard stale callbacks
CeorlShell SHALL maintain an internal sequence counter. On each `focusColumn` / `handleNavigate` call, the counter SHALL increment. The `onScrollSettle` callback SHALL only update `activeIndex` if its sequence matches the current counter.

#### Scenario: Stale settle event is discarded
- **WHEN** `focusColumn(2)` increments seq to 2, then `focusColumn(1)` increments seq to 3, and the scrollend for seq=2 fires
- **THEN** the seq=2 settle event SHALL be discarded and `activeIndex` SHALL remain 1

