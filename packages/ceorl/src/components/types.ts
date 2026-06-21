import type { ReactNode } from 'react'

/** Column width value. Numbers are fractions in the range (0, 1]. */
export type ColumnWidth = number | string

export interface ColumnDescriptor {
  id: string
  width?: ColumnWidth
  content: ReactNode
}

export interface CeorlShellHandle {
  scrollTo: (index: number, opts?: { behavior?: ScrollBehavior }) => void
  scrollElement: HTMLDivElement | null
}

export interface CeorlShellProps {
  children?: ReactNode
  activeIndex?: number
  columns?: readonly ColumnDescriptor[]
}

export interface CeorlColumnProps {
  /** 列宽度 */
  width?: ColumnWidth
  children?: ReactNode
  /** 列内边距 (CSS padding 值) */
  padding?: string
}

export interface CeorlStackProps {
  children?: ReactNode
}
