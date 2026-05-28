import {
  Children,
  cloneElement,
  forwardRef,
  useImperativeHandle,
  useRef,
  type HTMLAttributes,
  type ReactElement,
} from 'react'
import type { CeorlShellHandle, CeorlShellProps } from './types'
import { CeorlColumn } from './Column'
import { scrollToColumn } from '../scrollToColumn'

/**
 * CeorlShell — 纯受控横向滚动列布局容器
 *
 * activeIndex 为必需 prop。所有滚动通过 ref.scrollTo(index) 由消费者驱动。
 * columns prop 与 children 二选一，columns 优先。
 */
export const CeorlShell = forwardRef<
  CeorlShellHandle,
  CeorlShellProps & HTMLAttributes<HTMLDivElement>
>(function CeorlShell(
  {
    children,
    activeIndex = 0,
    columns,
    className = '',
    style,
    ...props
  },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleScrollTo = (index: number) => {
    scrollToColumn(containerRef.current, index, { behavior: 'smooth' })
  }

  useImperativeHandle(
    ref,
    () => ({
      scrollTo: handleScrollTo,
      get scrollElement() { return containerRef.current },
    }),
    [],
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
