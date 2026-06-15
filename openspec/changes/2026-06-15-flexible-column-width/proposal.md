## Why

当前 `ColumnWidth` 类型为 `"1/2" | "1/3" | "1/4"` 硬编码枚举，通过 `WIDTH_MAP` 查表转 CSS 值。用户无法直接传入像素、`calc()`、`rem`、`min()` 等任意 CSS width，也不支持 `number 0~1` 作为比例值。为了实现 0.1 版本发布，列宽需要更灵活的表达方式。

## What Changes

- `ColumnWidth` 类型从 `"1/2" | "1/3" | "1/4"` 改为 `number | string`
- **`number` 类型**：接受 `0 < n ≤ 1` 的比例值，自动转为百分比（如 `0.5 → "50%"`），超出区间或非有限数时 fallback 到 `"33.333%"`
- **`string` 类型**：优先匹配分数格式 `"a/b"`（如 `"1/2" → "50%"`, `"2/3" → "66.667%"`），其次在浏览器环境用 `CSS.supports("width", value)` 校验 CSS width 合法性，通过则透传，不通过 fallback。非浏览器环境直接透传（仅过滤空字符串）
- 移除 `WIDTH_MAP` 查表，替换为统一纯函数 `resolveColumnWidth`
- `resolveColumnWidth` 公开导出，方便消费者在 JS 环境下计算列宽

## Capabilities

### Modified Capabilities
- `flexible-column-width` — 新增 specification

### Removed Capabilities
- `WIDTH_MAP` 常量从 `types.ts` 移除（非公开导出，无 breaking change）

## Impact

- `src/components/types.ts` — `ColumnWidth` 类型更改，`WIDTH_MAP` 删除
- `src/components/Column.tsx` — 引入 `resolveColumnWidth` 替换 `WIDTH_MAP` 查表
- `src/components/Column.test.tsx` — 补全新类型对应的测试
- `src/index.ts` — 新增导出 `resolveColumnWidth`
- `src/App.tsx` — 适配新类型（`WIDTH_OPTIONS` 从枚举改为合法值）
