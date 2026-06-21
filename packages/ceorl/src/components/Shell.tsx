import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type HTMLAttributes,
} from 'react'
import type { CeorlShellHandle, CeorlShellProps } from './types'
import { CeorlColumn } from './Column'
import { scrollToColumn } from '../scrollToColumn'
import { cn } from '../cn'

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
    activeIndex = 0,
    columns,
    className,
    style,
    ...props
  },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleScrollTo = (index: number, opts?: { behavior?: ScrollBehavior }) => {
    scrollToColumn(containerRef.current, index, opts)
  }

  useImperativeHandle(
    ref,
    () => ({
      scrollTo: handleScrollTo,
      get scrollElement() { return containerRef.current },
    }),
    [],
  )

  return (
    <div
      {...props}
      ref={containerRef}
      className={cn('ceorl-shell', className)}
      style={{
        width: '100%',
        height: '100%',
        ...style,
      }}
    >
      {columns?.map((col, i) => (
        <CeorlColumn
          key={col.id}
          width={col.width}
          data-active={i === activeIndex ? 'true' : undefined}
        >
          {col.content}
        </CeorlColumn>
      ))}
    </div>
  )
})
