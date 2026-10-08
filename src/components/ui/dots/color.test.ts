import { describe, expect, it } from 'vitest'
import { createToneStyles, mixRgb, parseRgb, toneLevel, toneOpacity, toneRamp } from './color'

const palette = { canvas: [0, 0, 0], accent: [100, 200, 50], ink: [255, 255, 255] } as const

function alpha(style: string) {
  return Number(style.split(',').at(-1)?.replace(')', ''))
}

describe('colors', () => {
  it('makes weak tones much more transparent than strong ones', () => {
    expect(toneOpacity(0)).toBeCloseTo(0.08)
    expect(toneOpacity(1)).toBe(1)
    expect(toneOpacity(0.5)).toBeLessThan(0.55)
    expect(toneOpacity(-1)).toBe(toneOpacity(0))
  })

  it('groups tones into a fixed number of levels', () => {
    expect(toneLevel(0, 32)).toBe(0)
    expect(toneLevel(1, 32)).toBe(31)
    expect(toneLevel(0.5, 32)).toBe(16)
    expect(toneLevel(3, 32)).toBe(31)
  })

  it('parses the space separated channels used by the theme tokens', () => {
    expect(parseRgb(' 190 242 100 ')).toEqual([190, 242, 100])
    expect(parseRgb('17, 18, 16')).toEqual([17, 18, 16])
  })

  it('mixes two colors and clamps the amount', () => {
    expect(mixRgb([0, 0, 0], [200, 100, 50], 0.5)).toEqual([100, 50, 25])
    expect(mixRgb([0, 0, 0], [200, 100, 50], 2)).toEqual([200, 100, 50])
    expect(mixRgb([0, 0, 0], [200, 100, 50], -1)).toEqual([0, 0, 0])
  })

  it('ramps from a muted tone through the accent to a pale highlight', () => {
    const steps = [0, 0.35, 0.7, 1].map((position) => toneRamp(palette, position))
    expect(steps[0][1]).toBeGreaterThan(palette.canvas[1])
    expect(steps[0][1]).toBeLessThan(palette.accent[1])
    expect(steps[2]).toEqual(palette.accent)
    expect(steps[3][2]).toBeGreaterThan(palette.accent[2])
    expect(new Set(steps.map(String)).size).toBe(4)
    expect(toneRamp(palette, 2)).toEqual(steps[3])
  })

  it('builds many opacities and scales them by alpha', () => {
    const full = createToneStyles(palette, 1)
    const faded = createToneStyles(palette, 0.5)
    expect(alpha(full[0])).toBeLessThan(alpha(full.at(-1)!))
    expect(new Set(full.map(alpha)).size).toBeGreaterThan(150)
    expect(alpha(faded.at(-1)!)).toBeCloseTo(alpha(full.at(-1)!) * 0.5)
  })
})
