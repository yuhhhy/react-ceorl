## REMOVED Requirements

### Requirement: CeorlShell supports uncontrolled active index
**Reason**: Shell 变为纯受控组件，不再维护内部状态。`defaultActiveIndex` 移除。
**Migration**: 消费者自行 `const [idx, setIdx] = useState(n)` + `activeIndex={idx}`。

### Requirement: CeorlShell supports controlled active index
**Reason**: 保留但简化——`activeIndex` 变为必需 prop（受控模式为唯一模式）。
**Migration**: 不需要 `isControlled` 检测，直接使用 props.activeIndex。

### Requirement: CeorlShell fires onIndexChange callback
**Reason**: 所有 settle 检测基础设施删除。`onIndexChange` 从 `CeorlShellProps` 移除。
**Migration**: 消费者如需检测滚动结束，自己监听 `scrollend`。

### Requirement: CeorlShell exposes imperative scrollToColumn via ref
**Reason**: 重命名为 `scrollTo`，实现委托给独立函数 `scrollToColumn`。
**Migration**: `ref.current.focusColumn(n)` → `ref.current.scrollTo(n)`。

## ADDED Requirements

### Requirement: Shell is purely controlled via activeIndex prop
CeorlShell SHALL be a fully controlled component. `activeIndex` is a required prop. The shell SHALL NOT maintain any internal scroll state. All scroll position changes SHALL be driven by consumer code calling `ref.current.scrollTo(index)`.

#### Scenario: activeIndex prop is required
- **WHEN** CeorlShell is rendered without `activeIndex` prop
- **THEN** TypeScript SHALL report a type error
