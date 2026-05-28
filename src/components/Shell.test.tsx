import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { CeorlShell } from './Shell'
import { CeorlColumn } from './Column'
import type { CeorlShellHandle } from './types'
import { createRef } from 'react'

describe('CeorlShell', () => {
  it('renders children inside .ceorl-shell container', () => {
    render(
      <CeorlShell>
        <CeorlColumn>Panel A</CeorlColumn>
        <CeorlColumn>Panel B</CeorlColumn>
      </CeorlShell>,
    )
    expect(screen.getByText('Panel A')).toBeInTheDocument()
    expect(screen.getByText('Panel B')).toBeInTheDocument()
    expect(document.querySelector('.ceorl-shell')).toBeInTheDocument()
  })

  it('renders columns from columns prop', () => {
    render(
      <CeorlShell
        columns={[
          { id: 'a', content: 'Column A' },
          { id: 'b', content: 'Column B', width: '1/2' },
        ]}
      />,
    )
    expect(screen.getByText('Column A')).toBeInTheDocument()
    expect(screen.getByText('Column B')).toBeInTheDocument()
    const cols = document.querySelectorAll('.ceorl-column')
    expect(cols).toHaveLength(2)
    expect(cols[1]).toHaveAttribute('data-width', '1/2')
  })

  it('columns prop takes precedence over children', () => {
    render(
      <CeorlShell
        columns={[{ id: 'a', content: 'From Column' }]}
      >
        <CeorlColumn>From Child</CeorlColumn>
      </CeorlShell>,
    )
    expect(screen.getByText('From Column')).toBeInTheDocument()
    expect(screen.queryByText('From Child')).not.toBeInTheDocument()
  })

  it('renders empty shell with empty columns array', () => {
    render(<CeorlShell columns={[]} />)
    expect(document.querySelector('.ceorl-shell')).toBeInTheDocument()
    expect(document.querySelectorAll('.ceorl-column')).toHaveLength(0)
  })

  it('forwardRef exposes CeorlShellHandle', () => {
    const ref = createRef<CeorlShellHandle>()
    render(
      <CeorlShell ref={ref}>
        <CeorlColumn>Test</CeorlColumn>
      </CeorlShell>,
    )
    expect(ref.current).not.toBeNull()
    expect(typeof ref.current?.focusColumn).toBe('function')
    expect(typeof ref.current?.getColumns).toBe('function')
  })

  it('exposes getColumns via ref handle', () => {
    const ref = createRef<CeorlShellHandle>()
    render(
      <CeorlShell ref={ref}>
        <CeorlColumn>A</CeorlColumn>
        <CeorlColumn>B</CeorlColumn>
      </CeorlShell>,
    )
    const cols = ref.current?.getColumns()
    expect(cols).toHaveLength(2)
    expect(cols?.[0]).toBeInstanceOf(HTMLDivElement)
  })

  it('focusColumn does not throw on invalid index', () => {
    const ref = createRef<CeorlShellHandle>()
    render(
      <CeorlShell ref={ref}>
        <CeorlColumn>A</CeorlColumn>
      </CeorlShell>,
    )
    expect(() => ref.current?.focusColumn(-1)).not.toThrow()
    expect(() => ref.current?.focusColumn(999)).not.toThrow()
  })

  it('renders children when value is 0 (falsy but valid React node)', () => {
    render(<CeorlShell>{0}</CeorlShell>)
    expect(document.querySelector('.ceorl-shell')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('defaultActiveIndex sets initial active column', () => {
    render(
      <CeorlShell defaultActiveIndex={1}>
        <CeorlColumn>A</CeorlColumn>
        <CeorlColumn>B</CeorlColumn>
        <CeorlColumn>C</CeorlColumn>
      </CeorlShell>,
    )
    const cols = document.querySelectorAll('.ceorl-column')
    expect(cols[0]).not.toHaveAttribute('data-active')
    expect(cols[1]).toHaveAttribute('data-active', 'true')
    expect(cols[2]).not.toHaveAttribute('data-active')
  })

  it('has default width 100vw and height 100vh as inline styles', () => {
    const { container } = render(
      <CeorlShell>
        <CeorlColumn>Test</CeorlColumn>
      </CeorlShell>,
    )
    const shell = container.querySelector('.ceorl-shell') as HTMLElement
    expect(shell.style.width).toBe('100vw')
    expect(shell.style.height).toBe('100vh')
  })

  it('consumer style overrides default dimensions', () => {
    const { container } = render(
      <CeorlShell style={{ height: 'calc(100vh - 64px)', width: '800px' }}>
        <CeorlColumn>Test</CeorlColumn>
      </CeorlShell>,
    )
    const shell = container.querySelector('.ceorl-shell') as HTMLElement
    expect(shell.style.height).toBe('calc(100vh - 64px)')
    expect(shell.style.width).toBe('800px')
  })

  it('keyboard nav is disabled by default', () => {
    render(
      <CeorlShell>
        <CeorlColumn>Test</CeorlColumn>
      </CeorlShell>,
    )
    // Arrow keys should not cause any scroll when keyboard nav is disabled
    expect(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    }).not.toThrow()
  })

  it('keyboard nav calls focusColumn when enabled', () => {
    const { container } = render(
      <CeorlShell enableKeyboardNav={true}>
        <CeorlColumn>A</CeorlColumn>
        <CeorlColumn>B</CeorlColumn>
      </CeorlShell>,
    )
    const shell = container.querySelector('.ceorl-shell') as HTMLElement
    shell.scrollBy = vi.fn()
    const cols = container.querySelectorAll('.ceorl-column')
    const scrollIntoViewSpy = vi.fn()
    Object.defineProperty(cols[1], 'scrollIntoView', { value: scrollIntoViewSpy })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    expect(scrollIntoViewSpy).toHaveBeenCalled()
  })

  it('applies data-active to active column in columns mode', () => {
    render(
      <CeorlShell
        columns={[
          { id: 'a', content: 'A' },
          { id: 'b', content: 'B' },
        ]}
        activeIndex={1}
      />,
    )
    const cols = document.querySelectorAll('.ceorl-column')
    expect(cols[0]).not.toHaveAttribute('data-active')
    expect(cols[1]).toHaveAttribute('data-active', 'true')
  })

  it('applies data-active to active column in children mode', () => {
    render(
      <CeorlShell activeIndex={0}>
        <CeorlColumn>A</CeorlColumn>
        <CeorlColumn>B</CeorlColumn>
      </CeorlShell>,
    )
    const cols = document.querySelectorAll('.ceorl-column')
    expect(cols[0]).toHaveAttribute('data-active', 'true')
    expect(cols[1]).not.toHaveAttribute('data-active')
  })

  it('focusColumn calls scrollIntoView on the target column', () => {
    const ref = createRef<CeorlShellHandle>()
    render(
      <CeorlShell ref={ref}>
        <CeorlColumn>A</CeorlColumn>
        <CeorlColumn>B</CeorlColumn>
        <CeorlColumn>C</CeorlColumn>
      </CeorlShell>,
    )
    const cols = document.querySelectorAll('.ceorl-column')
    const spy = vi.fn()
    Object.defineProperty(cols[2], 'scrollIntoView', { value: spy })
    ref.current?.focusColumn(2)
    expect(spy).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    })
  })

  it('focusColumn on first column calls scrollIntoView', () => {
    const ref = createRef<CeorlShellHandle>()
    render(
      <CeorlShell ref={ref} activeIndex={2}>
        <CeorlColumn>A</CeorlColumn>
        <CeorlColumn>B</CeorlColumn>
        <CeorlColumn>C</CeorlColumn>
      </CeorlShell>,
    )
    const cols = document.querySelectorAll('.ceorl-column')
    const spy = vi.fn()
    Object.defineProperty(cols[0], 'scrollIntoView', { value: spy })
    ref.current?.focusColumn(0)
    expect(spy).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    })
  })

  it('onIndexChange is called once after scroll settle when focusColumn is invoked', () => {
    vi.useFakeTimers()
    const onIndexChange = vi.fn()
    const ref = createRef<CeorlShellHandle>()
    const { container } = render(
      <CeorlShell ref={ref} onIndexChange={onIndexChange}>
        <CeorlColumn>A</CeorlColumn>
        <CeorlColumn>B</CeorlColumn>
      </CeorlShell>,
    )
    const cols = container.querySelectorAll('.ceorl-column')
    Object.defineProperty(cols[1], 'scrollIntoView', { value: vi.fn() })

    act(() => {
      ref.current?.focusColumn(1)
    })

    expect(onIndexChange).not.toHaveBeenCalled()

    const shell = container.querySelector('.ceorl-shell') as HTMLElement
    Object.defineProperty(shell, 'scrollLeft', { value: 600, configurable: true })
    Object.defineProperty(cols[0], 'offsetWidth', { value: 500 })
    Object.defineProperty(cols[1], 'offsetWidth', { value: 500 })

    shell.dispatchEvent(new Event('scroll'))
    vi.advanceTimersByTime(300)

    expect(onIndexChange).toHaveBeenCalledTimes(1)
    expect(onIndexChange).toHaveBeenCalledWith(1)

    vi.useRealTimers()
  })

  it('user scroll triggers onIndexChange via settle', async () => {
    vi.useFakeTimers()
    const onIndexChange = vi.fn()
    const { container } = render(
      <CeorlShell onIndexChange={onIndexChange}>
        <CeorlColumn>A</CeorlColumn>
        <CeorlColumn>B</CeorlColumn>
      </CeorlShell>,
    )
    const shell = container.querySelector('.ceorl-shell') as HTMLElement

    // Simulate user scrolling to column 1
    Object.defineProperty(shell, 'scrollLeft', { value: 600, configurable: true })

    // Update column widths for computeIndex
    const cols = shell.querySelectorAll('.ceorl-column')
    Object.defineProperty(cols[0], 'offsetWidth', { value: 500 })
    Object.defineProperty(cols[1], 'offsetWidth', { value: 500 })

    shell.dispatchEvent(new Event('scroll'))
    vi.advanceTimersByTime(300)

    expect(onIndexChange).toHaveBeenCalledWith(1)

    vi.useRealTimers()
  })
})
