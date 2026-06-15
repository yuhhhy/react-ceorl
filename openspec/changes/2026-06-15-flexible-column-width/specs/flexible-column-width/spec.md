# flexible-column-width Specification

## Purpose

允许 CeorlColumn 的 width prop 接受任意 CSS 可解析的宽度值。移除硬编码的三档枚举，通过统一的 `resolveColumnWidth` 纯函数处理 `number` 比例值、`"a/b"` 分数值和 CSS width 字符串。

## Requirements

### Requirement: ColumnWidth accepts number (0 < n ≤ 1)

CeorlColumn SHALL accept a `number` value for the `width` prop. The number SHALL represent a proportion of the container width, where `0.5 → "50%"`.

#### Scenario: number 0.5 renders as 50%
- **WHEN** Column receives `width={0.5}`
- **THEN** the column SHOULD have inline style `width: "50%"`

#### Scenario: number 1 renders as 100%
- **WHEN** Column receives `width={1}`
- **THEN** the column SHOULD have inline style `width: "100%"`

#### Scenario: number 0.33 renders as 33%
- **WHEN** Column receives `width={0.33}`
- **THEN** the column SHOULD have inline style `width: "33%"`

#### Scenario: number 0 (zero) is invalid, fallback
- **WHEN** Column receives `width={0}`
- **THEN** the column SHOULD fallback to `width: "33.333%"`

#### Scenario: negative number is invalid, fallback
- **WHEN** Column receives `width={-0.5}`
- **THEN** the column SHOULD fallback to `width: "33.333%"`

#### Scenario: number exceeding 1 is invalid, fallback
- **WHEN** Column receives `width={2}`
- **THEN** the column SHOULD fallback to `width: "33.333%"`

#### Scenario: NaN/Infinity is invalid, fallback
- **WHEN** Column receives `width={NaN}` or `width={Infinity}`
- **THEN** the column SHOULD fallback to `width: "33.333%"`

### Requirement: ColumnWidth accepts fraction string "a/b"

CeorlColumn SHALL accept a fraction string in the format `"numerator/denominator"` (e.g. `"1/2"`, `"2/3"`). The value SHALL be computed as `(numerator / denominator) * 100%`.

#### Scenario: "1/2" renders as 50%
- **WHEN** Column receives `width="1/2"`
- **THEN** the column SHOULD have inline style `width: "50%"`

#### Scenario: "1/3" renders as 33.333%
- **WHEN** Column receives `width="1/3"`
- **THEN** the column SHOULD have inline style `width: "33.333%"`

#### Scenario: "2/3" renders as 66.667%
- **WHEN** Column receives `width="2/3"`
- **THEN** the column SHOULD have inline style `width: "66.667%"`

#### Scenario: "3/4" renders as 75%
- **WHEN** Column receives `width="3/4"`
- **THEN** the column SHOULD have inline style `width: "75%"`

#### Scenario: "1/8" renders as 12.5%
- **WHEN** Column receives `width="1/8"`
- **THEN** the column SHOULD have inline style `width: "12.5%"`

#### Scenario: fraction with zero denominator is invalid, fallback
- **WHEN** Column receives `width="1/0"`
- **THEN** the column SHOULD fallback to `width: "33.333%"`

#### Scenario: fraction numerator exceeds denominator is invalid, fallback
- **WHEN** Column receives `width="3/2"`
- **THEN** the column SHOULD fallback to `width: "33.333%"`

### Requirement: ColumnWidth accepts arbitrary CSS width string

CeorlColumn SHALL accept any CSS-valid `width` value string via the `width` prop. Valid values SHALL be applied as the inline `width` style. Invalid values SHALL fallback to `"33.333%"`.

#### Scenario: pixel value passes through
- **WHEN** Column receives `width="320px"`
- **THEN** the column SHOULD have inline style `width: "320px"`

#### Scenario: percentage value passes through
- **WHEN** Column receives `width="40%"`
- **THEN** the column SHOULD have inline style `width: "40%"`

#### Scenario: CSS function value passes through
- **WHEN** Column receives `width="min(420px, 100%)"`
- **THEN** the column SHOULD have inline style `width: "min(420px, 100%)"`

#### Scenario: empty string is invalid, fallback
- **WHEN** Column receives `width=""`
- **THEN** the column SHOULD fallback to `width: "33.333%"`

#### Scenario: invalid CSS width string falls back
- **WHEN** Column receives `width="not-a-valid-width"`
- **THEN** the column SHOULD fallback to `width: "33.333%"`

### Requirement: default width fallback

CeorlColumn SHALL default to `"33.333%"` when no `width` prop is provided, matching the previous default of `"1/3"`.

#### Scenario: no width prop defaults to 33.333%
- **WHEN** Column is rendered without a `width` prop
- **THEN** the column SHOULD have inline style `width: "33.333%"`

### Requirement: resolveColumnWidth is exported

The `resolveColumnWidth` helper function SHALL be publicly exported from the library entry point for consumers who need to compute column widths in non-React contexts.

#### Scenario: import resolves without type error
- **WHEN** consumer imports `{ resolveColumnWidth }` from the library
- **THEN** TypeScript SHALL not report a type error
