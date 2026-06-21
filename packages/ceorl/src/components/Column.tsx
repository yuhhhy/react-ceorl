import type { HTMLAttributes } from 'react'
import type { CeorlColumnProps } from './types'
import { resolveColumnWidth } from '../resolveColumnWidth'
import { cn } from '../cn'

/**
 * CeorlColumn — 单列容器
 *
 * 一个窗口 = 一列。通过 width prop 控制列宽。
 * 列内可放置任意内容，或嵌套 CeorlStack 实现纵向分割。
 */
export function CeorlColumn({
  width,
  children,
  padding,
  style,
  ...props
}: CeorlColumnProps & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn('ceorl-column', props.className)}
      style={{ ...style, width: resolveColumnWidth(width) }}
    >
      <div className="ceorl-column-inner" style={padding != null ? { padding } : undefined}>
        {children}
      </div>
    </div>
  )
}
