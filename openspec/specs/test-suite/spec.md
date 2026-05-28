# test-suite Specification

## Purpose
TBD - created by archiving change phase-1-core-enhancements. Update Purpose after archive.
## Requirements
### Requirement: Vitest test runner is configured
The project SHALL include a `vitest.config.ts` configuration file that sets `jsdom` as the test environment and includes React configuration. The `package.json` SHALL include `test` and `test:watch` scripts.

#### Scenario: npm run test executes all tests
- **WHEN** `npm run test` (or `pnpm test`) is executed
- **THEN** vitest SHALL run all `*.test.{ts,tsx}` files and report pass/fail status

#### Scenario: TypeScript types resolve in tests
- **WHEN** a test file imports from `'../components'` or `'../hooks/useScrollSnap'`
- **THEN** TypeScript SHALL resolve the imports without errors

### Requirement: CeorlShell component tests exist
Tests for CeorlShell SHALL verify: rendering with children, rendering with columns prop, forwardRef working, activeIndex/defaultActiveIndex behavior, and onIndexChange firing.

#### Scenario: CeorlShell renders children
- **WHEN** CeorlShell is rendered with `<CeorlColumn>` children
- **THEN** the children SHALL be present in the DOM within a `.ceorl-shell` container

#### Scenario: CeorlShell attaches ref
- **WHEN** a ref is passed to CeorlShell
- **THEN** `ref.current` SHALL be an HTMLDivElement with class `ceorl-shell`

#### Scenario: Default active index is 0
- **WHEN** CeorlShell is rendered without activeIndex or defaultActiveIndex
- **THEN** internal active index SHALL be 0 (verified via scrollToColumn or snapshot)

### Requirement: CeorlColumn component tests exist
Tests for CeorlColumn SHALL verify: rendering with default width, rendering with explicit width, data-width attribute, inline style width, and children rendering.

#### Scenario: Default width is 1/3
- **WHEN** CeorlColumn is rendered without a `width` prop
- **THEN** the rendered div SHALL have `data-width="1/3"` and width style matching `calc(100vw / 3)`

#### Scenario: Explicit width prop
- **WHEN** CeorlColumn is rendered with `width="1/2"`
- **THEN** the rendered div SHALL have `data-width="1/2"` and width style matching `50vw`

#### Scenario: Children render inside column inner
- **WHEN** CeorlColumn is rendered with `<span data-testid="child">text</span>` as children
- **THEN** the child span SHALL be present inside `.ceorl-column-inner`

### Requirement: CeorlStack component tests exist
Tests for CeorlStack SHALL verify: rendering children, CSS class `ceorl-stack`, and flex-column layout behavior.

#### Scenario: Renders with class
- **WHEN** CeorlStack is rendered
- **THEN** the root element SHALL have class `ceorl-stack`

#### Scenario: Renders children
- **WHEN** CeorlStack is rendered with two div children
- **THEN** both divs SHALL be present in the DOM

### Requirement: useScrollSnap hook tests exist
Tests for useScrollSnap SHALL verify: event listener registration/cleanup, active index calculation from scroll position, and onIndexChange callback.

#### Scenario: Registers scroll listener
- **WHEN** a component using useScrollSnap mounts with a valid container ref
- **THEN** a scroll event listener SHALL be attached to the container

#### Scenario: Cleans up scroll listener on unmount
- **WHEN** a component using useScrollSnap unmounts
- **THEN** the scroll event listener SHALL be removed

### Requirement: useKeyboardNav hook tests exist
Tests for useKeyboardNav SHALL verify: ArrowLeft/ArrowRight triggers scroll, disabled state suppresses events, onNavigate callback fires, and event listener cleanup.

#### Scenario: ArrowRight scrolls right
- **WHEN** ArrowRight key is pressed while hook is active
- **THEN** `scrollBy` SHALL be called with a positive `left` delta

#### Scenario: ArrowLeft scrolls left
- **WHEN** ArrowLeft key is pressed while hook is active
- **THEN** `scrollBy` SHALL be called with a negative `left` delta

#### Scenario: Disabled suppresses key events
- **WHEN** hook is initialized with `enabled=false` and ArrowRight is pressed
- **THEN** `scrollBy` SHALL NOT be called

#### Scenario: Non-arrow keys are ignored
- **WHEN** a key other than ArrowLeft/ArrowRight is pressed
- **THEN** no scroll action SHALL occur

### Requirement: Testing libraries are installed as dev dependencies
The project SHALL include `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, and `jsdom` as devDependencies.

#### Scenario: Dependencies resolve
- **WHEN** `pnpm install` is run
- **THEN** vitest, @testing-library/react, @testing-library/jest-dom, and jsdom SHALL be installed and importable

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

