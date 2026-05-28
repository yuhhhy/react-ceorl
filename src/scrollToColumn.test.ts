import { describe, it, expect, vi } from 'vitest'
import { scrollToColumn } from './scrollToColumn'

function makeContainer() {
  const div = document.createElement('div')
  div.scrollTo = vi.fn()
  return div
}

function addCol(parent: HTMLElement, offsetLeft: number, offsetWidth: number) {
  const col = document.createElement('div')
  col.className = 'ceorl-column'
  Object.defineProperty(col, 'offsetLeft', { value: offsetLeft })
  Object.defineProperty(col, 'offsetWidth', { value: offsetWidth })
  parent.appendChild(col)
  return col
}

describe('scrollToColumn', () => {
  it('picks L when right snap face is closer', () => {
    const c = makeContainer()
    Object.defineProperty(c, 'scrollLeft', { value: 50 })
    Object.defineProperty(c, 'clientWidth', { value: 1000 })
    addCol(c, 0, 500)
    addCol(c, 800, 400)

    // L=max(0,1200-1000)=200, R=800, |50-200|=150 < |50-800|=750 → L=200
    scrollToColumn(c, 1)
    expect(c.scrollTo).toHaveBeenCalledWith({ left: 200, behavior: 'smooth' })
  })

  it('picks R when left snap face is closer', () => {
    const c = makeContainer()
    Object.defineProperty(c, 'scrollLeft', { value: 400 })
    Object.defineProperty(c, 'clientWidth', { value: 1000 })
    addCol(c, 0, 500)
    addCol(c, 500, 1200)

    // L=700, R=500, |400-700|=300 > |400-500|=100 → R=500
    scrollToColumn(c, 1)
    expect(c.scrollTo).toHaveBeenCalledWith({ left: 500, behavior: 'smooth' })
  })

  it('no-ops when column is fully visible', () => {
    const c = makeContainer()
    Object.defineProperty(c, 'clientWidth', { value: 1000 })
    addCol(c, 0, 500)
    addCol(c, 500, 400)

    scrollToColumn(c, 0)
    expect(c.scrollTo).not.toHaveBeenCalled()
  })

  it('no-ops when container is null', () => {
    expect(() => scrollToColumn(null, 0)).not.toThrow()
  })

  it('no-ops when index is out of bounds', () => {
    const c = makeContainer()
    addCol(c, 0, 500)
    expect(() => scrollToColumn(c, -1)).not.toThrow()
    expect(() => scrollToColumn(c, 999)).not.toThrow()
    expect(c.scrollTo).not.toHaveBeenCalled()
  })

  it('passes opts through to scrollTo', () => {
    const c = makeContainer()
    Object.defineProperty(c, 'scrollLeft', { value: 0 })
    Object.defineProperty(c, 'clientWidth', { value: 1000 })
    addCol(c, 0, 500)
    addCol(c, 600, 500)

    // L=max(0,1100-1000)=100, R=600, |0-100|=100 → L=100
    scrollToColumn(c, 1, { behavior: 'instant' })
    expect(c.scrollTo).toHaveBeenCalledWith({ left: 100, behavior: 'instant' })
  })
})
