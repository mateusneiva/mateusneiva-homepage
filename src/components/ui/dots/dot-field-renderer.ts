import { createToneStyles, opacityLevels, toneLevel, toneLevels, toneStyleIndex, type Palette } from './color'
import { createGrid, createGridLayout, grain, type GridLayout, type Point } from './grid'
import { createPointerTrail } from './trail'
import { masks, type DotMask, type MaskName } from './wave'

export type DotFieldOptions = {
  mask: MaskName
  spacing: number
  radius: number
  trailRadius: number
  trailLifetime: number
  animated: boolean
  alpha: number
  interactive: boolean
}

export type DotFieldSize = { width: number; height: number; ratio: number }

export type DotFieldMessage =
  | { type: 'init'; canvas: OffscreenCanvas; options: DotFieldOptions; palette: Palette }
  | { type: 'resize'; size: DotFieldSize }
  | { type: 'palette'; palette: Palette }
  | { type: 'pointer'; point: Point | null }
  | { type: 'running'; running: boolean }

export type DotFieldRenderer = {
  resize: (size: DotFieldSize) => void
  setPalette: (palette: Palette) => void
  setPointer: (point: Point | null) => void
  setRunning: (running: boolean) => void
  destroy: () => void
}

type Context = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D

type Field = {
  width: number
  height: number
  layout: GridLayout
  dots: Point[]
  influence: Float32Array
  grains: Float32Array
  veils: Uint8Array
  sample: DotMask
}

const maxFrameDelta = 50
const minDotSize = 0.25
const toneJitter = 0.25
const trailOnWave = 0.55
const veilGrainShift = { x: 31.7, y: -17.3 }

function createField(mask: MaskName, spacing: number, width: number, height: number): Field {
  const layout = createGridLayout(width, height, spacing)
  const dots = createGrid(layout)
  return {
    width,
    height,
    layout,
    dots,
    influence: new Float32Array(dots.length),
    grains: Float32Array.from(dots, (dot) => grain(dot.x, dot.y)),
    veils: Uint8Array.from(dots, (dot) =>
      toneLevel(grain(dot.x + veilGrainShift.x, dot.y + veilGrainShift.y), opacityLevels),
    ),
    sample: masks[mask](width, height),
  }
}

function coverage(wave: number, influence: number) {
  const trail = influence * (trailOnWave + (1 - trailOnWave) * wave)
  return 1 - (1 - wave) * (1 - trail)
}

function paintDot(
  context: Context,
  styles: string[],
  field: Field,
  index: number,
  radius: number,
  time: number,
) {
  const dot = field.dots[index]
  const wave = field.sample(dot.x, dot.y, time)
  const size = radius * coverage(wave, field.influence[index])
  if (size < minDotSize) return
  const jitter = (field.grains[index] - 0.5) * toneJitter
  const tone = toneLevel((size / radius) * 0.95 + jitter, toneLevels)
  context.fillStyle = styles[toneStyleIndex(tone, field.veils[index])]
  context.fillRect(dot.x - size, dot.y - size, size * 2, size * 2)
}

export function createDotRenderer(
  context: Context,
  options: DotFieldOptions,
  palette: Palette,
): DotFieldRenderer {
  const { spacing, radius, trailRadius, trailLifetime, animated, alpha, interactive } = options
  const trail = createPointerTrail({ radius: trailRadius, lifetime: trailLifetime })
  let field = createField(options.mask, spacing, 0, 0)
  let styles = createToneStyles(palette, alpha)
  let frame = 0
  let elapsed = 0
  let previous = 0
  let running = false

  const paint = (now: number) => {
    const time = animated ? elapsed / 1000 : 0
    if (interactive && running) trail.update(now)
    trail.stamp(field.influence, field.layout, now)
    context.clearRect(0, 0, field.width, field.height)
    for (let index = 0; index < field.dots.length; index++) {
      paintDot(context, styles, field, index, radius, time)
    }
  }

  const tick = (now: number) => {
    elapsed += Math.min(now - previous, maxFrameDelta)
    previous = now
    paint(now)
    frame = requestAnimationFrame(tick)
  }

  return {
    resize(size) {
      field = createField(options.mask, spacing, size.width, size.height)
      context.canvas.width = Math.round(size.width * size.ratio)
      context.canvas.height = Math.round(size.height * size.ratio)
      context.setTransform(size.ratio, 0, 0, size.ratio, 0, 0)
      paint(performance.now())
    },
    setPalette(next) {
      styles = createToneStyles(next, alpha)
      paint(performance.now())
    },
    setPointer: trail.setTarget,
    setRunning(next) {
      if (next === running) return
      running = next
      cancelAnimationFrame(frame)
      if (!running) return
      previous = performance.now()
      frame = requestAnimationFrame(tick)
    },
    destroy() {
      running = false
      cancelAnimationFrame(frame)
    },
  }
}
