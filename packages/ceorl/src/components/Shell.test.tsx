import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CeorlShell } from './Shell'
import type { CeorlShellHandle } from './types'
import { createRef } from 'react'

describe('CeorlShell', () => {
  it('renders columns with width support', () => {
    render(
      <CeorlShell
        columns={[
          { id: 'a', content: 'Panel A' },
          { id: 'b', content: 'Panel B', width: 0.5 },
        ]}
      />,
    )
    expect(screen.getByText('Panel A')).toBeInTheDocument()
    expect(screen.getByText('Panel B')).toBeInTheDocument()
    expect(document.querySelector('.ceorl-shell')).toBeInTheDocument()
    const cols = document.querySelectorAll('.ceorl-column')
    expect(cols).toHaveLength(2)
    expect(cols[1]).toHaveStyle({ width: '50%' })
  })

  it('renders empty shell with empty columns array', () => {
    render(<CeorlShell columns={[]} />)
    expect(document.querySelector('.ceorl-shell')).toBeInTheDocument()
    expect(document.querySelectorAll('.ceorl-column')).toHaveLength(0)
  })

  it('forwardRef exposes CeorlShellHandle', () => {
    const ref = createRef<CeorlShellHandle>()
    render(
      <CeorlShell ref={ref}
        columns={[{ id: 'a', content: 'Test' }]}
      />,
    )
    expect(ref.current).not.toBeNull()
    expect(typeof ref.current?.scrollTo).toBe('function')
    expect(ref.current?.scrollElement).toBeInstanceOf(HTMLDivElement)
  })

  it('scrollTo does not throw on invalid index', () => {
    const ref = createRef<CeorlShellHandle>()
    render(
      <CeorlShell ref={ref}
        columns={[{ id: 'a', content: 'A' }]}
      />,
    )
    expect(() => ref.current?.scrollTo(-1)).not.toThrow()
    expect(() => ref.current?.scrollTo(999)).not.toThrow()
  })

  it('has default width 100% and height 100% as inline styles', () => {
    const { container } = render(
      <CeorlShell
        columns={[{ id: 'a', content: 'Test' }]}
      />,
    )
    const shell = container.querySelector('.ceorl-shell') as HTMLElement
    expect(shell.style.width).toBe('100%')
    expect(shell.style.height).toBe('100%')
  })

  it('consumer style overrides default dimensions', () => {
    const { container } = render(
      <CeorlShell style={{ height: 'calc(100vh - 64px)', width: '800px' }}
        columns={[{ id: 'a', content: 'Test' }]}
      />,
    )
    const shell = container.querySelector('.ceorl-shell') as HTMLElement
    expect(shell.style.height).toBe('calc(100vh - 64px)')
    expect(shell.style.width).toBe('800px')
  })

  it('applies data-active to active column', () => {
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

  it('scrollTo picks L when right snap face is closer', () => {
    const ref = createRef<CeorlShellHandle>()
    const { container } = render(
      <CeorlShell ref={ref}
        columns={[
          { id: 'a', content: 'A' },
          { id: 'b', content: 'B' },
        ]}
      />,
    )
    const shell = container.querySelector('.ceorl-shell') as HTMLElement
    shell.scrollTo = vi.fn()
    Object.defineProperty(shell, 'scrollLeft', { value: 50 })
    Object.defineProperty(shell, 'clientWidth', { value: 1000 })

    const cols = shell.querySelectorAll('.ceorl-column')
    Object.defineProperty(cols[0], 'offsetLeft', { value: 0 })
    Object.defineProperty(cols[1], 'offsetLeft', { value: 800 })
    Object.defineProperty(cols[1], 'offsetWidth', { value: 400 })

    // L=200, R=800, |50-200|=150 < |50-800|=750 → L=200
    ref.current?.scrollTo(1)
    expect(shell.scrollTo).toHaveBeenCalledWith({ left: 200, behavior: 'smooth' })
  })

  it('scrollTo picks R when left snap face is closer', () => {
    const ref = createRef<CeorlShellHandle>()
    const { container } = render(
      <CeorlShell ref={ref}
        columns={[
          { id: 'a', content: 'A' },
          { id: 'b', content: 'B' },
        ]}
      />,
    )
    const shell = container.querySelector('.ceorl-shell') as HTMLElement
    shell.scrollTo = vi.fn()
    Object.defineProperty(shell, 'scrollLeft', { value: 400 })
    Object.defineProperty(shell, 'clientWidth', { value: 1000 })

    const cols = shell.querySelectorAll('.ceorl-column')
    Object.defineProperty(cols[0], 'offsetLeft', { value: 0 })
    Object.defineProperty(cols[1], 'offsetLeft', { value: 500 })
    Object.defineProperty(cols[1], 'offsetWidth', { value: 1200 })

    // L=700, R=500, |400-700|=300 > |400-500|=100 → R=500
    ref.current?.scrollTo(1)
    expect(shell.scrollTo).toHaveBeenCalledWith({ left: 500, behavior: 'smooth' })
  })

  it('scrollTo does not scroll when column is fully visible', () => {
    const ref = createRef<CeorlShellHandle>()
    const { container } = render(
      <CeorlShell ref={ref}
        columns={[
          { id: 'a', content: 'A' },
          { id: 'b', content: 'B' },
        ]}
      />,
    )
    const shell = container.querySelector('.ceorl-shell') as HTMLElement
    shell.scrollTo = vi.fn()
    Object.defineProperty(shell, 'clientWidth', { value: 1000 })

    const cols = shell.querySelectorAll('.ceorl-column')
    Object.defineProperty(cols[0], 'offsetLeft', { value: 0 })
    Object.defineProperty(cols[0], 'offsetWidth', { value: 500 })

    ref.current?.scrollTo(0)
    expect(shell.scrollTo).not.toHaveBeenCalled()
  })
})
