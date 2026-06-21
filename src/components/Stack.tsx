import type { HTMLAttributes } from 'react'
import type { CeorlStackProps } from './types'
import { cn } from '../cn'

/**
 * CeorlStack — 列内堆叠容器
 *
 * 在同一列内纵向分割多个面板。用 flex-col 排布子元素，
 * 每个子元素等分高度（flex-1），默认不溢出时平均分配。
 */
export function CeorlStack({
  children,
  ...props
}: CeorlStackProps & HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={cn('ceorl-stack', props.className)}>
      {children}
    </div>
  )
}
