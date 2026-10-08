import { describe, expect, it } from 'vitest'
import { createGrid, createGridLayout, grain } from './grid'

describe('createGrid', () => {
  it('fills the area with evenly spaced, centered points', () => {
    const points = createGrid(createGridLayout(100, 50, 20))
    expect(points).toHaveLength(5 * 2)
    expect(points[0]).toEqual({ x: 10, y: 15 })
    expect(points[1].x - points[0].x).toBe(20)
    expect(points.at(-1)).toEqual({ x: 90, y: 35 })
  })

  it('returns no points for empty areas', () => {
    expect(createGrid(createGridLayout(0, 100, 10))).toEqual([])
    expect(createGrid(createGridLayout(100, 100, 0))).toEqual([])
  })
})

describe('grain', () => {
  it('gives each dot a stable variation between 0 and 1', () => {
    const values = createGrid(createGridLayout(200, 200, 10)).map((point) => grain(point.x, point.y))
    expect(Math.min(...values)).toBeGreaterThanOrEqual(0)
    expect(Math.max(...values)).toBeLessThan(1)
    expect(new Set(values.map((value) => value.toFixed(2))).size).toBeGreaterThan(20)
    expect(grain(30, 40)).toBe(grain(30, 40))
  })
})
