/**
 * scrollToColumn — L/R 双面吸附最小移动算法
 *
 * 纯函数，无 React 依赖，无副作用，无状态。
 *
 * L = 右吸附面（列右边缘对齐视口右边缘）
 * R = 左吸附面（列左边缘对齐视口左边缘）
 * 选离当前位置更近的面 → 最小移动
 */
export function scrollToColumn(
  container: HTMLDivElement | null,
  index: number,
  opts?: { behavior?: ScrollBehavior },
) {
  if (!container) return
  const cols = container.querySelectorAll<HTMLElement>('.ceorl-column')
  if (index < 0 || index >= cols.length) return

  const col = cols[index]
  const viewLeft = container.scrollLeft
  const viewRight = viewLeft + container.clientWidth
  const colLeft = col.offsetLeft
  const colRight = colLeft + col.offsetWidth

  if (colLeft >= viewLeft && colRight <= viewRight) return

  const L = Math.max(0, colRight - container.clientWidth)
  const R = colLeft

  const target = Math.abs(container.scrollLeft - L) <= Math.abs(container.scrollLeft - R) ? L : R

  container.scrollTo({ left: target, behavior: 'smooth', ...opts })
}
