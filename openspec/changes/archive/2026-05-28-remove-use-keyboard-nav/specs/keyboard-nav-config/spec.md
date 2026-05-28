## REMOVED Requirements

### Requirement: Keyboard navigation is disabled by default
**Reason**: `useKeyboardNav` hook 和 `enableKeyboardNav` prop 被移除。键盘导航完全由消费者通过 `focusColumn` API 自行实现，不再是库的内置能力。
**Migration**: 消费者自行绑定键盘事件。示例代码见 `App.tsx`（demo 中的 `useEffect` 键盘导航）。

### Requirement: CeorlShell accepts enableKeyboardNav prop
**Reason**: `enableKeyboardNav` prop 从 `CeorlShellProps` 移除。消费者不再通过 prop 控制键盘导航，而是自行监听键盘事件。
**Migration**: 从组件中移除 `enableKeyboardNav` prop，改用自定义键盘绑定。

### Requirement: enableKeyboardNav prop is exported from public API
**Reason**: 随 `enableKeyboardNav` prop 一同移除。
**Migration**: 无需替代导出——键盘交互不再属于库的 API。

## ADDED Requirements

### Requirement: Keyboard navigation is the consumer's responsibility
The library SHALL NOT provide keyboard event handling. Consumers SHALL implement their own keyboard navigation using the `focusColumn(index)` imperative API and `getColumns()` DOM accessor. The library SHALL only provide layout and scrolling capabilities.

#### Scenario: Consumer binds custom keys
- **WHEN** a consumer calls `ref.current.focusColumn(1)` in their own keyboard event handler
- **THEN** the shell SHALL scroll to bring column 1 into view with minimal scroll movement

#### Scenario: Library does not register keydown listeners
- **WHEN** CeorlShell is rendered and mounted
- **THEN** the library SHALL NOT register any global keyboard event listeners
