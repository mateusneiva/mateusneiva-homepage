import { describe, expect, it } from 'vitest'
import { createGrid, createGridLayout } from './grid'
import { waveMask } from './wave'

function column(mask: ReturnType<typeof waveMask>, x: number, time: number, step = 4) {
  return Array.from({ length: 400 / step }, (_, row) => mask(x, row * step, time))
}

describe('waveMask', () => {
  it('draws a ribbon that narrows and gets denser as it twists away from the viewer', () => {
    const mask = waveMask(400, 400)
    const samples = Array.from({ length: 40 }, (_, step) => step * 0.25)
    const widthAt = (time: number) => column(mask, 340, time).filter((value) => value > 0).length
    const widths = samples.map(widthAt)
    const narrowest = widths.indexOf(Math.min(...widths))
    const widest = widths.indexOf(Math.max(...widths))
    expect(widths[widest]).toBeGreaterThan(widths[narrowest] * 1.4)
    const peak = (time: number) => Math.max(...column(mask, 340, time))
    expect(peak(samples[narrowest])).toBeGreaterThan(peak(samples[widest]))
  })

  it('has a stronger crest that travels along the ribbon while the ends stay weaker', () => {
    const mask = waveMask(400, 400)
    const crestAt = (time: number) => {
      const peaks = Array.from({ length: 31 }, (_, step) => Math.max(...column(mask, 40 + step * 10, time)))
      return { peaks, position: peaks.indexOf(Math.max(...peaks)) }
    }
    const start = crestAt(0)
    expect(Math.max(...start.peaks)).toBeGreaterThan(start.peaks[0] * 1.5)
    expect(crestAt(9).position).not.toBe(start.position)
  })

  it('fades softly toward the edges instead of cutting off', () => {
    const mask = waveMask(400, 400)
    const values = Array.from({ length: 400 }, (_, row) => mask(340, row, 1))
    const steps = values.slice(1).map((value, row) => Math.abs(value - values[row]))
    expect(Math.max(...steps)).toBeLessThan(0.05)
  })

  it('moves smoothly between frames', () => {
    const mask = waveMask(400, 400)
    const grid = createGrid(createGridLayout(400, 400, 8))
    const deltas = grid.map((point) => Math.abs(mask(point.x, point.y, 2) - mask(point.x, point.y, 2 + 1 / 60)))
    expect(Math.max(...deltas)).toBeLessThan(0.03)
  })

  it('draws a diagonal band rising from the bottom left to the top right', () => {
    const mask = waveMask(400, 400)
    const peak = (x: number, from: number) => Math.max(...Array.from({ length: 33 }, (_, row) => mask(x, from + row * 4, 0)))
    expect(peak(40, 268)).toBeGreaterThan(0.1)
    expect(peak(360, 0)).toBeGreaterThan(0.4)
    expect(mask(40, 40, 0)).toBe(0)
    expect(mask(360, 380, 0)).toBe(0)
  })

  it('keeps the band low on the left half, leaving room for the copy', () => {
    const mask = waveMask(400, 400)
    expect(mask(100, 200, 0)).toBe(0)
    expect(mask(160, 160, 0)).toBe(0)
    expect(mask(60, 320, 0)).toBe(0)
  })

  it('never reaches the bottom right corner', () => {
    const mask = waveMask(400, 400)
    const times = Array.from({ length: 200 }, (_, step) => step * 0.1)
    expect(times.every((time) => mask(340, 370, time) === 0)).toBe(true)
  })

  it('stays within 0 and 1 and moves over time', () => {
    const mask = waveMask(300, 200)
    const frame = (time: number) => createGrid(createGridLayout(300, 200, 10)).map((point) => mask(point.x, point.y, time))
    const values = frame(2)
    expect(Math.min(...values)).toBeGreaterThanOrEqual(0)
    expect(Math.max(...values)).toBeLessThanOrEqual(1)
    expect(frame(3)).not.toEqual(frame(0))
  })

  it('is empty when the field has no size', () => {
    expect(waveMask(0, 400)(10, 10, 1)).toBe(0)
    expect(waveMask(400, 0)(10, 10, 1)).toBe(0)
  })
})
