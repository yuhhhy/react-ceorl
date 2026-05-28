import { useCallback, useEffect, useRef, type RefObject } from 'react'

export interface ScrollSettleOptions {
  onScrollSettle?: (index: number, seq: number) => void
}

export function useScrollSettle(
  containerRef: RefObject<HTMLDivElement | null>,
  options?: ScrollSettleOptions,
) {
  const onScrollSettleRef = useRef(options?.onScrollSettle)

  useEffect(() => {
    onScrollSettleRef.current = options?.onScrollSettle
  })

  const seqRef = useRef(0)
  const scrollingRef = useRef(false)

  const computeIndex = useCallback((el: HTMLDivElement) => {
    const cols = el.querySelectorAll('.ceorl-column')
    if (cols.length === 0) return 0
    let accum = 0
    for (let i = 0; i < cols.length; i++) {
      accum += (cols[i] as HTMLElement).offsetWidth
      if (el.scrollLeft < accum - 1) {
        return i
      }
    }
    return cols.length - 1
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const supportsScrollend = 'onscrollend' in el

    const handleSettle = () => {
      const idx = computeIndex(el)
      scrollingRef.current = false
      onScrollSettleRef.current?.(idx, seqRef.current)
    }

    const handleScrollend = () => {
      clearTimeout(scrollTimer)
      handleSettle()
    }

    if (supportsScrollend) {
      el.addEventListener('scrollend', handleScrollend)
    }

    let scrollTimer: ReturnType<typeof setTimeout>
    const handleScroll = () => {
      if (!scrollingRef.current) {
        seqRef.current += 1
        scrollingRef.current = true
      }
      clearTimeout(scrollTimer)
      scrollTimer = setTimeout(handleSettle, 300)
    }
    el.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      if (supportsScrollend) {
        el.removeEventListener('scrollend', handleScrollend)
      }
      el.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimer)
    }
  }, [containerRef, computeIndex])
}
