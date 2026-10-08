import { describe, expect, it } from 'vitest'
import { createGrid, createGridLayout, type Point } from './grid'
import { createPointerTrail, stampTrail, type TrailPoint } from './trail'

const layout = createGridLayout(400, 200, 10)
const points = createGrid(layout)
const trail = [{ x: 105, y: 105, time: 1000 }]

function stamp(now: number, path: readonly TrailPoint[] = trail, live: Point | null = null) {
  const influence = new Float32Array(points.length)
  stampTrail(influence, layout, { points: path, live, now, radius: 80, lifetime: 1200 })
  return influence
}

function at(influence: Float32Array, x: number, y: number) {
  return influence[points.findIndex((point) => point.x === x && point.y === y)]
}

describe('stampTrail', () => {
  it('is strongest at a fresh trail point and fades with distance', () => {
    const influence = stamp(1000)
    expect(at(influence, 105, 105)).toBe(1)
    expect(at(influence, 135, 105)).toBeGreaterThan(at(influence, 205, 105))
    expect(at(influence, 205, 105)).toBeGreaterThan(0)
    expect(at(influence, 305, 105)).toBe(0)
  })

  it('fades out as the trail ages and clears previous frames', () => {
    const older = stamp(1600)
    expect(at(older, 105, 105)).toBeLessThan(1)
    expect(at(older, 105, 105)).toBeGreaterThan(0)
    expect(stamp(2200).every((value) => value === 0)).toBe(true)
    expect(stamp(1000, []).every((value) => value === 0)).toBe(true)
  })

  it('keeps the live pointer at full strength between trail samples', () => {
    expect(at(stamp(1100, trail, { x: 105, y: 105 }), 105, 105)).toBe(1)
    expect(at(stamp(1100), 105, 105)).toBeLessThan(1)
  })

  it('keeps the strongest value where trail points overlap', () => {
    const influence = stamp(1600, [...trail, { x: 145, y: 105, time: 1600 }])
    expect(at(influence, 145, 105)).toBe(1)
    expect(at(influence, 105, 105)).toBeGreaterThan(at(stamp(1600), 105, 105))
  })
})

describe('createPointerTrail', () => {
  it('eases toward the pointer instead of jumping to it', () => {
    const pointer = createPointerTrail({ radius: 80, lifetime: 1200 })
    const influence = new Float32Array(points.length)
    pointer.setTarget({ x: 105, y: 105 })
    pointer.update(1000)
    pointer.setTarget({ x: 305, y: 105 })
    pointer.update(1016)
    pointer.stamp(influence, layout, 1016)
    expect(at(influence, 155, 105)).toBe(1)
    expect(at(influence, 155, 105)).toBeGreaterThan(at(influence, 305, 105))
  })

  it('keeps the live pointer at full strength while it rests', () => {
    const pointer = createPointerTrail({ radius: 80, lifetime: 1200 })
    const influence = new Float32Array(points.length)
    pointer.setTarget({ x: 105, y: 105 })
    pointer.update(1000)
    pointer.update(1100)
    pointer.stamp(influence, layout, 1100)
    expect(at(influence, 105, 105)).toBe(1)
  })
})
