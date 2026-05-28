import { useEffect, useRef, type RefObject } from 'react'

type Direction = 'prev' | 'next'

export function useKeyboardNav(
  containerRef: RefObject<HTMLDivElement | null>,
  enabled = true,
  onNavigate?: (dir: Direction) => void,
) {
  const onNavigateRef = useRef(onNavigate)

  useEffect(() => {
    onNavigateRef.current = onNavigate
  })

  useEffect(() => {
    if (!enabled) return

    const el = containerRef.current
    if (!el) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        if (onNavigateRef.current) {
          onNavigateRef.current('prev')
        }
        el.scrollBy({ left: -el.clientWidth, behavior: 'smooth' })
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        if (onNavigateRef.current) {
          onNavigateRef.current('next')
        }
        el.scrollBy({ left: el.clientWidth, behavior: 'smooth' })
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [containerRef, enabled])
}
