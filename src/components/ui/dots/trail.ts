import { cellsWithin, type GridLayout, type Point } from './grid'

export type TrailPoint = Point & { time: number }

export type TrailStamp = {
  points: readonly TrailPoint[]
  live: Point | null
  now: number
  radius: number
  lifetime: number
}

export type TrailOptions = { radius: number; lifetime: number }

const reachInRadii = 2
const falloff = 1.6
const pointerEasing = 0.25
const sampleSpacingInRadii = 0.15

export function stampTrail(influence: Float32Array, layout: GridLayout, stamp: TrailStamp) {
  influence.fill(0)
  const { points, live, now } = stamp
  for (const point of points) stampPoint(influence, layout, point, now - point.time, stamp)
  if (live) stampPoint(influence, layout, live, 0, stamp)
}

function stampPoint(
  influence: Float32Array,
  layout: GridLayout,
  point: Point,
  age: number,
  { radius, lifetime }: TrailStamp,
) {
  const life = age / lifetime
  if (life < 0 || life >= 1) return
  const fade = (1 - life) ** 2
  const { firstColumn, lastColumn, firstRow, lastRow } = cellsWithin(layout, point, radius * reachInRadii)
  for (let row = firstRow; row <= lastRow; row++) {
    const dy = (layout.offsetY + row * layout.spacing - point.y) / radius
    for (let column = firstColumn; column <= lastColumn; column++) {
      const dx = (layout.offsetX + column * layout.spacing - point.x) / radius
      const distance = dx * dx + dy * dy
      if (distance >= reachInRadii ** 2) continue
      const index = row * layout.columns + column
      influence[index] = Math.max(influence[index], Math.exp(-distance * falloff) * fade)
    }
  }
}

export function createPointerTrail({ radius, lifetime }: TrailOptions) {
  const points: TrailPoint[] = []
  let target: Point | null = null
  let pointer: Point | null = null

  const ease = () => {
    if (!target || !pointer) return target
    return {
      x: pointer.x + (target.x - pointer.x) * pointerEasing,
      y: pointer.y + (target.y - pointer.y) * pointerEasing,
    }
  }

  const dropExpired = (now: number) => {
    while (points.length && now - points[0].time >= lifetime) points.shift()
  }

  const sample = (now: number) => {
    if (!pointer) return
    const last = points.at(-1)
    const moved = !last || Math.hypot(pointer.x - last.x, pointer.y - last.y) > radius * sampleSpacingInRadii
    if (moved) points.push({ ...pointer, time: now })
  }

  return {
    setTarget(point: Point | null) {
      target = point
    },
    update(now: number) {
      pointer = ease()
      dropExpired(now)
      sample(now)
    },
    stamp(influence: Float32Array, layout: GridLayout, now: number) {
      stampTrail(influence, layout, { points, live: pointer, now, radius, lifetime })
    },
  }
}

export type PointerTrail = ReturnType<typeof createPointerTrail>
