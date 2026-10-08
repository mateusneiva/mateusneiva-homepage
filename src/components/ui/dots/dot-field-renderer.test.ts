import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Palette } from './color'
import { createDotRenderer, type DotFieldOptions } from './dot-field-renderer'

type Rect = { x: number; y: number; size: number; style: string }

function createContext() {
  const frames: Rect[][] = [[]]
  let style = ''
  const context = {
    canvas: { width: 0, height: 0 },
    set fillStyle(value: string) {
      style = value
    },
    setTransform: () => undefined,
    clearRect: () => frames.push([]),
    fillRect: (x: number, y: number, width: number, height: number) => {
      frames.at(-1)!.push({ x, y, size: width, style })
      if (width !== height) throw new Error(`Expected a square, received ${width}x${height}.`)
    },
  }
  return { context: context as unknown as CanvasRenderingContext2D, frames }
}

function createClock() {
  let callback: FrameRequestCallback | null = null
  let now = 0
  vi.stubGlobal('requestAnimationFrame', (next: FrameRequestCallback) => {
    callback = next
    return 1
  })
  vi.stubGlobal('cancelAnimationFrame', () => {
    callback = null
  })
  return (milliseconds: number) => {
    for (let elapsed = 0; elapsed < milliseconds; elapsed += 10) {
      now += 10
      callback?.(now)
    }
  }
}

function alphas(rects: Rect[]) {
  return new Set(rects.map((rect) => rect.style.split(',').at(-1)))
}

function near(rects: Rect[], point: { x: number; y: number }, reach = 40) {
  return rects.filter((rect) => Math.hypot(rect.x - point.x, rect.y - point.y) < reach)
}

const palette: Palette = { canvas: [250, 250, 245], accent: [86, 140, 18], ink: [20, 20, 20] }
const ink: Palette = { canvas: [250, 250, 245], accent: [20, 20, 20], ink: [0, 0, 0] }
const options: DotFieldOptions = {
  mask: 'wave',
  spacing: 12,
  radius: 4.5,
  trailRadius: 180,
  trailLifetime: 1400,
  animated: true,
  alpha: 1,
  interactive: true,
}

afterEach(() => vi.unstubAllGlobals())

describe('createDotRenderer', () => {
  it('draws the wave with many distinct opacities', () => {
    const { context, frames } = createContext()
    createDotRenderer(context, options, palette).resize({ width: 1200, height: 800, ratio: 1 })
    expect(alphas(frames.at(-1)!).size).toBeGreaterThan(150)
  })

  it('paints dots under the pointer in an empty corner', () => {
    const advance = createClock()
    const { context, frames } = createContext()
    const renderer = createDotRenderer(context, { ...options, animated: false }, palette)
    renderer.resize({ width: 400, height: 400, ratio: 1 })
    const point = { x: 340, y: 370 }
    expect(near(frames.at(-1)!, point)).toHaveLength(0)
    renderer.setRunning(true)
    renderer.setPointer(point)
    advance(200)
    expect(near(frames.at(-1)!, point).length).toBeGreaterThan(10)
  })

  it('keeps the dots under a resting pointer steady between frames', () => {
    const advance = createClock()
    const { context, frames } = createContext()
    const renderer = createDotRenderer(context, { ...options, animated: false }, palette)
    renderer.resize({ width: 400, height: 400, ratio: 1 })
    renderer.setRunning(true)
    renderer.setPointer({ x: 340, y: 370 })
    advance(600)
    const start = frames.length
    advance(600)
    const sizes = frames.slice(start).map((rects) => rects.map((rect) => rect.size.toFixed(4)).join())
    expect(new Set(sizes).size).toBe(1)
    expect(frames.at(-1)!.length).toBeGreaterThan(0)
  })

  it('repaints with the new palette', () => {
    const { context, frames } = createContext()
    const renderer = createDotRenderer(context, options, palette)
    renderer.resize({ width: 1200, height: 800, ratio: 1 })
    const before = frames.at(-1)![0].style
    renderer.setPalette(ink)
    expect(frames.at(-1)![0].style).not.toBe(before)
  })

  it('stops scheduling frames when paused', () => {
    const advance = createClock()
    const { context, frames } = createContext()
    const renderer = createDotRenderer(context, options, palette)
    renderer.resize({ width: 400, height: 400, ratio: 1 })
    renderer.setRunning(true)
    advance(100)
    renderer.setRunning(false)
    const paused = frames.length
    advance(100)
    expect(frames.length).toBe(paused)
  })
})
