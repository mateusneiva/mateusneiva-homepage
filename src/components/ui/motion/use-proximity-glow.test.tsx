// @vitest-environment jsdom
import { act, render, screen } from '@testing-library/react'
import { useRef } from 'react'
import { beforeEach, expect, it, vi } from 'vitest'
import { useProximityGlow } from './use-proximity-glow'

const mocks = vi.hoisted(() => ({
  subscribe: vi.fn(),
  unsubscribe: vi.fn(),
  reduced: vi.fn(() => false),
}))
vi.mock('@/components/ui/motion/pointer-tracker', () => ({ subscribePointer: mocks.subscribe }))
vi.mock('framer-motion', async (importOriginal) => ({
  ...await importOriginal<typeof import('framer-motion')>(),
  useReducedMotion: mocks.reduced,
}))

let intersect: (entries: { isIntersecting: boolean }[]) => void
let pointer: (position: { x: number; y: number } | null) => void
let disconnect: ReturnType<typeof vi.fn>

function Probe() {
  const ref = useRef<HTMLDivElement>(null)
  useProximityGlow(ref, 70)
  return <div ref={ref} data-testid="tag" />
}

beforeEach(() => {
  mocks.subscribe.mockReset().mockImplementation((listener) => {
    pointer = listener
    listener(null)
    return mocks.unsubscribe
  })
  mocks.unsubscribe.mockReset()
  mocks.reduced.mockReturnValue(false)
  disconnect = vi.fn()
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })))
  vi.stubGlobal('IntersectionObserver', class {
    constructor(callback: typeof intersect) { intersect = callback }
    observe() {}
    disconnect = disconnect
  })
})

it('only reads element geometry while visible and releases subscriptions on exit', () => {
  const { unmount } = render(<Probe />)
  const bounds = vi.spyOn(screen.getByTestId('tag'), 'getBoundingClientRect')
    .mockReturnValue(new DOMRect(0, 0, 100, 50))
  expect(mocks.subscribe).not.toHaveBeenCalled()
  act(() => intersect([{ isIntersecting: false }]))
  expect(bounds).not.toHaveBeenCalled()
  act(() => intersect([{ isIntersecting: true }]))
  expect(mocks.subscribe).toHaveBeenCalledTimes(1)
  act(() => pointer({ x: 20, y: 20 }))
  expect(bounds).toHaveBeenCalledTimes(1)
  act(() => intersect([{ isIntersecting: false }]))
  expect(mocks.unsubscribe).toHaveBeenCalledTimes(1)
  act(() => intersect([{ isIntersecting: true }]))
  expect(mocks.subscribe).toHaveBeenCalledTimes(2)
  unmount()
  expect(mocks.unsubscribe).toHaveBeenCalledTimes(2)
  expect(disconnect).toHaveBeenCalledTimes(1)
})

it('does not track the pointer when reduced motion is enabled', () => {
  mocks.reduced.mockReturnValue(true)
  render(<Probe />)
  expect(mocks.subscribe).not.toHaveBeenCalled()
})

it('does not track the pointer on touch devices', () => {
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false })))
  render(<Probe />)
  expect(mocks.subscribe).not.toHaveBeenCalled()
})
