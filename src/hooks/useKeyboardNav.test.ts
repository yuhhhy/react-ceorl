import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useKeyboardNav } from './useKeyboardNav'

function createMockContainer() {
  const div = document.createElement('div')
  Object.defineProperty(div, 'clientWidth', { value: 1024 })
  div.scrollBy = vi.fn()
  return div
}

describe('useKeyboardNav', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls scrollBy on ArrowRight press', () => {
    const container = createMockContainer()
    const ref = { current: container }

    renderHook(() => useKeyboardNav(ref))

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))

    expect(container.scrollBy).toHaveBeenCalledWith({
      left: 1024,
      behavior: 'smooth',
    })
  })

  it('calls scrollBy on ArrowLeft press', () => {
    const container = createMockContainer()
    const ref = { current: container }

    renderHook(() => useKeyboardNav(ref))

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))

    expect(container.scrollBy).toHaveBeenCalledWith({
      left: -1024,
      behavior: 'smooth',
    })
  })

  it('does not call scrollBy when disabled', () => {
    const container = createMockContainer()
    const ref = { current: container }

    renderHook(() => useKeyboardNav(ref, false))

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))

    expect(container.scrollBy).not.toHaveBeenCalled()
  })

  it('calls onNavigate with direction when provided', () => {
    const container = createMockContainer()
    const ref = { current: container }
    const onNavigate = vi.fn()

    renderHook(() => useKeyboardNav(ref, true, onNavigate))

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    expect(onNavigate).toHaveBeenCalledWith('next')

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
    expect(onNavigate).toHaveBeenCalledWith('prev')
  })

  it('calls both onNavigate and scrollBy when onNavigate is provided', () => {
    const container = createMockContainer()
    const ref = { current: container }
    const onNavigate = vi.fn()

    renderHook(() => useKeyboardNav(ref, true, onNavigate))

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    expect(onNavigate).toHaveBeenCalledWith('next')
    expect(container.scrollBy).toHaveBeenCalledWith({
      left: 1024,
      behavior: 'smooth',
    })
  })

  it('ignores non-arrow keys', () => {
    const container = createMockContainer()
    const ref = { current: container }
    const onNavigate = vi.fn()

    renderHook(() => useKeyboardNav(ref, true, onNavigate))

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }))

    expect(onNavigate).not.toHaveBeenCalled()
    expect(container.scrollBy).not.toHaveBeenCalled()
  })

  it('removes keydown listener on unmount', () => {
    const container = createMockContainer()
    const ref = { current: container }

    const removeSpy = vi.spyOn(document, 'removeEventListener')
    const { unmount } = renderHook(() => useKeyboardNav(ref))
    unmount()

    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    removeSpy.mockRestore()
  })

  it('does nothing when container ref is null', () => {
    const ref = { current: null }

    expect(() => renderHook(() => useKeyboardNav(ref))).not.toThrow()
  })
})
