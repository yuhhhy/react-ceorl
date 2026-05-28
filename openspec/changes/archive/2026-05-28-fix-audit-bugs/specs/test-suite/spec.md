## ADDED Requirements

### Requirement: scrollend dedup regression test exists
The `useScrollSnap` test suite SHALL include a test that verifies `onScrollSettle` is called exactly once per scroll gesture on scrollend-supporting test environments.

#### Scenario: Single onScrollSettle call on scroll settle
- **WHEN** a scroll gesture completes in a test environment that fires `scrollend`
- **THEN** `onScrollSettle` SHALL be called exactly once

### Requirement: focusColumn single-fire regression test exists
The `CeorlShell` test suite SHALL include a test that verifies `onIndexChange` is called exactly once when `focusColumn` triggers a scroll.

#### Scenario: onIndexChange fires once for focusColumn
- **WHEN** `focusColumn(1)` is called on a shell with `onIndexChange` callback
- **THEN** `onIndexChange` SHALL be called exactly once with value 1, and SHALL NOT be called with any intermediate value

### Requirement: Shell handles falsy-but-valid children
The `CeorlShell` test suite SHALL include a test that verifies the shell renders when children is a falsy-but-valid React node such as `0`.

#### Scenario: Children equals 0 renders as a column
- **WHEN** `CeorlShell` is rendered with children `{0}`
- **THEN** a column containing the text "0" SHALL be present in the DOM

### Requirement: defaultActiveIndex sets correct active column
The `CeorlShell` test suite SHALL include a test that verifies `defaultActiveIndex={1}` results in the second column having `data-active="true"`.

#### Scenario: Second column is active with defaultActiveIndex={1}
- **WHEN** `CeorlShell` is rendered with `defaultActiveIndex={1}` and three children columns
- **THEN** the second column SHALL have `data-active="true"` and the first SHALL NOT

### Requirement: Keyboard nav calls scrollBy after onNavigate
The `useKeyboardNav` test suite SHALL include a test that verifies `scrollBy` is called even when an `onNavigate` callback is provided.

#### Scenario: scrollBy called after onNavigate
- **WHEN** `useKeyboardNav` is used with an `onNavigate` callback and ArrowRight is pressed
- **THEN** `scrollBy` SHALL be called with positive `left` delta after `onNavigate` is invoked
