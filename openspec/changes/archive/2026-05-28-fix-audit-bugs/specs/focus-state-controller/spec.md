## MODIFIED Requirements

### Requirement: Shell is the sole writer of activeIndex
CeorlShell SHALL be the only component that updates the active index. The `useScrollSnap` hook SHALL NOT call `onIndexChange` or any equivalent that would override Shell's decision about which column is focused. When `focusColumn` is called, Shell SHALL NOT write `activeIndex` immediately — it SHALL only write `activeIndex` after the scroll settle event confirms the final position.

#### Scenario: focusColumn sets index only after settle
- **WHEN** `focusColumn(2)` is called and the smooth scroll animation begins
- **THEN** `activeIndex` SHALL NOT change immediately; it SHALL update to 2 only after the scroll animation completes and the settle event fires

#### Scenario: User scroll updates index via hook report
- **WHEN** user manually scrolls and the scroll settles at a new column
- **THEN** `useScrollSnap` SHALL report the observed index to Shell, and Shell SHALL adopt it

### Requirement: Rapid focus switching produces correct final index
When `focusColumn` is called multiple times in quick succession (before prior scroll animations complete), the final `activeIndex` SHALL match the last `focusColumn` call, not any intermediate call.

#### Scenario: Three rapid focus changes
- **WHEN** `focusColumn(0)`, `focusColumn(2)`, then `focusColumn(1)` are called within 100ms
- **THEN** after all scroll animations complete, `activeIndex` SHALL be 1

#### Scenario: User scroll during programmatic scroll
- **WHEN** user manually scrolls while a programmatic `focusColumn` scroll animation is in progress
- **THEN** the user's scroll SHALL take effect after the animation completes and the settle event fires

### Requirement: Shell uses request counter to guard stale callbacks
CeorlShell SHALL maintain an internal sequence counter. On each `focusColumn` / `handleNavigate` call, the counter SHALL increment. The `onScrollSettle` callback SHALL only update `activeIndex` if its sequence matches the current counter.

#### Scenario: Stale settle event is discarded
- **WHEN** `focusColumn(2)` increments seq to 2, then `focusColumn(1)` increments seq to 3, and the scrollend for seq=2 fires
- **THEN** the seq=2 settle event SHALL be discarded and `activeIndex` SHALL remain 1
