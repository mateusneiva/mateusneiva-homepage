// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { useActiveSection } from './use-active-section'

const ids = ['intro', 'overview', 'features']
let tops: number[]
let elements: HTMLElement[]

beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) =>
    window.setTimeout(() => callback(0), 16)
  )
  vi.stubGlobal('cancelAnimationFrame', (id: number) => window.clearTimeout(id))
  tops = [0, 400, 800]
  elements = ids.map((id, index) => {
    const element = document.createElement('section')
    element.id = id
    vi.spyOn(element, 'getBoundingClientRect').mockImplementation(
      () => ({ top: tops[index] }) as DOMRect
    )
    document.body.append(element)
    return element
  })
})

afterEach(() => {
  elements.forEach((element) => element.remove())
  vi.useRealTimers()
})

function scrollToPositions(positions: number[]) {
  act(() => {
    tops = positions
    window.dispatchEvent(new Event('scroll'))
    vi.advanceTimersByTime(17)
  })
}

it('updates the active section while scrolling down and back up', () => {
  const { result } = renderHook(() => useActiveSection(ids))
  act(() => vi.advanceTimersByTime(17))
  expect(result.current).toBe('intro')
  scrollToPositions([-500, 80, 500])
  expect(result.current).toBe('overview')
  scrollToPositions([-1000, -500, 80])
  expect(result.current).toBe('features')
  scrollToPositions([20, 500, 900])
  expect(result.current).toBe('intro')
})

it('rechecks section positions after a resize', () => {
  const { result } = renderHook(() => useActiveSection(ids))
  act(() => {
    tops = [-500, 100, 500]
    window.dispatchEvent(new Event('resize'))
    vi.advanceTimersByTime(17)
  })
  expect(result.current).toBe('overview')
})

it('removes listeners when the guide unmounts', () => {
  const remove = vi.spyOn(window, 'removeEventListener')
  const { unmount } = renderHook(() => useActiveSection(ids))
  unmount()
  expect(remove).toHaveBeenCalledWith('scroll', expect.any(Function))
  expect(remove).toHaveBeenCalledWith('resize', expect.any(Function))
  expect(remove).toHaveBeenCalledWith('hashchange', expect.any(Function))
})
