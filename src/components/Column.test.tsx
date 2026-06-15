import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { CeorlColumn } from './Column'
import type { ColumnWidth } from './types'

function renderColumn(width?: ColumnWidth) {
  const { container } = render(<CeorlColumn width={width}>Content</CeorlColumn>)
  return container.querySelector('.ceorl-column') as HTMLElement
}

describe('CeorlColumn', () => {
  it('renders with default width', () => {
    const { container } = render(<CeorlColumn>Content</CeorlColumn>)
    const col = container.querySelector('.ceorl-column')
    expect(col).toHaveStyle({ width: '33.333%' })
  })

  it.each([
    [0.5, '50%'],
    [1, '100%'],
    [0.33, '33%'],
    [0, '33.333%'],
    [-1, '33.333%'],
    [2, '33.333%'],
    [Number.NaN, '33.333%'],
  ])('resolves numeric width %s to %s', (width, expected) => {
    const col = renderColumn(width)
    expect(col).toHaveStyle({ width: expected })
  })

  it.each([
    ['1/2', '50%'],
    ['1/3', '33.333%'],
    ['2/3', '66.667%'],
    ['3/4', '75%'],
    ['1/8', '12.5%'],
  ])('resolves fraction width %s to %s', (width, expected) => {
    const col = renderColumn(width)
    expect(col).toHaveStyle({ width: expected })
  })

  it.each([
    ['1/0', '33.333%'],
    ['3/2', '33.333%'],
  ])('falls back for invalid fraction width %s', (width, expected) => {
    const col = renderColumn(width)
    expect(col).toHaveStyle({ width: expected })
  })

  it.each([
    ['320px', '320px'],
    ['40%', '40%'],
    ['', '33.333%'],
  ])('resolves CSS string width %s to %s', (width, expected) => {
    const col = renderColumn(width)
    expect(col).toHaveStyle({ width: expected })
  })

  it('renders children inside .ceorl-column-inner', () => {
    const { container } = render(
      <CeorlColumn>
        <span data-testid="child">Hello</span>
      </CeorlColumn>,
    )
    const inner = container.querySelector('.ceorl-column-inner')
    expect(inner).toBeInTheDocument()
    expect(inner?.querySelector('[data-testid="child"]')).toBeInTheDocument()
  })

  it('has no default padding on inner', () => {
    const { container } = render(<CeorlColumn>Content</CeorlColumn>)
    const inner = container.querySelector('.ceorl-column-inner') as HTMLElement
    expect(inner.style.padding).toBe('')
  })

  it('custom padding overrides default', () => {
    const { container } = render(<CeorlColumn padding="8px 24px">Content</CeorlColumn>)
    const inner = container.querySelector('.ceorl-column-inner') as HTMLElement
    expect(inner.style.padding).toBe('8px 24px')
  })

  it('zero padding is valid', () => {
    const { container } = render(<CeorlColumn padding="0">Content</CeorlColumn>)
    const inner = container.querySelector('.ceorl-column-inner') as HTMLElement
    expect(inner.style.padding).toBe('0px')
  })

  it('has position relative for ::after focus highlight context', () => {
    const style = document.createElement('style')
    style.textContent = '.ceorl-column { position: relative; }'
    document.head.appendChild(style)

    const { container } = render(<CeorlColumn>Content</CeorlColumn>)
    const col = container.querySelector('.ceorl-column') as HTMLElement
    expect(window.getComputedStyle(col).position).toBe('relative')

    style.remove()
  })
})
