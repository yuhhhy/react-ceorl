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
import { useScrollSnap } from '../hooks/useScrollSnap'
import { useKeyboardNav } from '../hooks/useKeyboardNav'

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
    enableKeyboardNav = false,
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

  const activeIndexRef = useRef(activeIndex)
  activeIndexRef.current = activeIndex

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

  useScrollSnap(containerRef, { onScrollSettle: handleScrollSettle })

  const doFocus = useCallback(
    (targetIndex: number) => {
      const container = containerRef.current
      if (!container || targetIndex < 0) return
      const cols = container.querySelectorAll('.ceorl-column')
      if (targetIndex >= cols.length) return

      focusSeqRef.current += 1
      const col = cols[targetIndex] as HTMLElement
      col.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
    },
    [],
  )

  const handleNavigate = useCallback(
    (dir: 'prev' | 'next') => {
      const current = activeIndexRef.current
      const newIndex = dir === 'next' ? current + 1 : current - 1
      if (newIndex < 0) return
      const container = containerRef.current
      if (!container) return
      if (newIndex >= container.querySelectorAll('.ceorl-column').length) return
      doFocus(newIndex)
    },
    [doFocus],
  )

  useKeyboardNav(containerRef, enableKeyboardNav, handleNavigate)

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
