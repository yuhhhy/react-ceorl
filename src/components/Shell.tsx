import {
  Children,
  cloneElement,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactElement,
} from 'react'
import type { CeorlShellHandle, CeorlShellProps } from './types'
import { CeorlColumn } from './Column'
import { useScrollSettle } from '../hooks/useScrollSettle'

export const CeorlShell = forwardRef<
  CeorlShellHandle,
  CeorlShellProps & HTMLAttributes<HTMLDivElement>
>(function CeorlShell(
  {
    children,
    activeIndex: controlledIndex,
    defaultActiveIndex = 0,
    onIndexChange,
    columns,
    className = '',
    style,
    ...props
  },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isControlled = controlledIndex !== undefined

  const [internalIndex, setInternalIndex] = useState(defaultActiveIndex)
  const activeIndex = controlledIndex ?? internalIndex

  const focusSeqRef = useRef(0)

  const updateIndex = useCallback(
    (index: number) => {
      if (isControlled) {
        onIndexChange?.(index)
      } else {
        setInternalIndex(index)
        onIndexChange?.(index)
      }
    },
    [isControlled, onIndexChange],
  )

  const handleScrollSettle = useCallback(
    (index: number, seq: number) => {
      if (seq < focusSeqRef.current) return
      updateIndex(index)
    },
    [updateIndex],
  )

  useScrollSettle(containerRef, { onScrollSettle: handleScrollSettle })

  // 只有稳定 ref（containerRef、focusSeqRef），省略 deps 安全
  const doFocus = useCallback(
    (targetIndex: number) => {
      const container = containerRef.current
      if (!container || targetIndex < 0) return
      const cols = container.querySelectorAll('.ceorl-column')
      if (targetIndex >= cols.length) return

      focusSeqRef.current += 1
      const col = cols[targetIndex] as HTMLElement

      const viewLeft = container.scrollLeft
      const viewRight = viewLeft + container.clientWidth
      const colLeft = col.offsetLeft
      const colRight = colLeft + col.offsetWidth

      if (colLeft >= viewLeft && colRight <= viewRight) return

      const L = Math.max(0, colRight - container.clientWidth)
      const R = colLeft

      const target = Math.abs(container.scrollLeft - L) <= Math.abs(container.scrollLeft - R)
        ? L
        : R

      container.scrollTo({ left: target, behavior: 'smooth' })
    },
    [],
  )

  const getColumns = useCallback((): HTMLDivElement[] => {
    if (!containerRef.current) return []
    return Array.from(containerRef.current.querySelectorAll('.ceorl-column'))
  }, [])

  useImperativeHandle(
    ref,
    () => ({
      focusColumn: (index: number) => {
        doFocus(index)
      },
      getColumns,
    }),
    [getColumns, doFocus],
  )

  const renderColumns = () => {
    if (columns) {
      return columns.map((col, i) => (
        <CeorlColumn
          key={col.id}
          width={col.width}
          data-active={i === activeIndex ? 'true' : undefined}
        >
          {col.content}
        </CeorlColumn>
      ))
    }
    if (Children.count(children) === 0) return null
    return Children.map(children, (child, i) => {
      if (typeof child === 'object' && child !== null && 'type' in child) {
        return cloneElement(child as ReactElement<{ 'data-active'?: string }>, {
          'data-active': i === activeIndex ? 'true' : undefined,
        })
      }
      return child
    })
  }

  return (
    <div
      ref={containerRef}
      className={`ceorl-shell${className ? ' ' + className : ''}`}
      style={{
        width: '100vw',
        height: '100vh',
        ...style,
      }}
      {...props}
    >
      {renderColumns()}
    </div>
  )
})
