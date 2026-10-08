export type DotMask = (x: number, y: number, time: number) => number
export type MaskFactory = (width: number, height: number) => DotMask

type Sheet = { center: number; halfWidth: number; weight: number }
type Column = { main: Sheet; echo: Sheet }

const cutoff = 0.02
const sampleReach = 1.4

function overlap(first: number, second: number) {
  return 1 - (1 - first) * (1 - second)
}

function createSheet(center: number, spread: number, twist: number, weight: number): Sheet {
  const facing = Math.cos(twist) ** 2
  return {
    center,
    halfWidth: spread * (0.3 + 0.7 * facing),
    weight: weight * (0.7 + 0.3 * (1 - facing)),
  }
}

function sample({ center, halfWidth, weight }: Sheet, ny: number) {
  const distance = (ny - center) / halfWidth
  if (distance > sampleReach || distance < -sampleReach) return 0
  return Math.exp(-distance * distance * 2.2) * weight
}

function createColumn(nx: number, time: number): Column {
  const center = 0.98 - 0.85 * nx ** 1.8 + Math.sin(nx * 3.2 + time * 0.45) * 0.05
  const spread = 0.05 + 0.3 * nx ** 1.5
  const twist = nx * 3.4 + time * 0.35 + Math.sin(nx * 1.7 - time * 0.25) * 0.9
  const crest = 0.68 + Math.sin(time * 0.18) * 0.22
  const envelope = 0.3 + 0.7 * Math.exp(-(((nx - crest) / 0.3) ** 2))
  const echoOffset = 0.06 + Math.sin(nx * 2.4 - time * 0.3) * 0.08
  return {
    main: createSheet(center, spread, twist, envelope),
    echo: createSheet(center + echoOffset, spread * 0.6, twist + 1.6, envelope * 0.6),
  }
}

export const waveMask: MaskFactory = (width, height) => {
  const columns = new Map<number, Column>()
  let cachedTime = Number.NaN

  return (x, y, time) => {
    if (width <= 0 || height <= 0) return 0
    if (time !== cachedTime) {
      columns.clear()
      cachedTime = time
    }
    let column = columns.get(x)
    if (!column) {
      column = createColumn(x / width, time)
      columns.set(x, column)
    }
    const value = overlap(sample(column.main, y / height), sample(column.echo, y / height))
    return value < cutoff ? 0 : value
  }
}

export const masks = { wave: waveMask } satisfies Record<string, MaskFactory>
export type MaskName = keyof typeof masks
