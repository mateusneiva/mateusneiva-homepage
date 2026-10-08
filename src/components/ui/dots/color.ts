export type Rgb = readonly [number, number, number]

export type Palette = { canvas: Rgb; accent: Rgb; ink: Rgb }

const minOpacity = 0.08
const opacityCurve = 1.2
const accentStop = 0.7
const mutedAccentShare = 0.18
const highlightInkShare = 0.55

export function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

export function parseRgb(value: string): Rgb {
  const [red = 0, green = 0, blue = 0] = value
    .trim()
    .split(/[\s,]+/)
    .map(Number)
  return [red, green, blue]
}

export function mixRgb(from: Rgb, to: Rgb, amount: number): Rgb {
  const share = clamp01(amount)
  const mix = (start: number, end: number) => Math.round(start + (end - start) * share)
  return [mix(from[0], to[0]), mix(from[1], to[1]), mix(from[2], to[2])]
}

export function toneRamp({ canvas, accent, ink }: Palette, position: number): Rgb {
  const tone = clamp01(position)
  if (tone <= accentStop) {
    const mutedAccent = mixRgb(canvas, accent, mutedAccentShare)
    return mixRgb(mutedAccent, accent, tone / accentStop)
  }
  const highlight = (tone - accentStop) / (1 - accentStop)
  return mixRgb(accent, ink, highlight * highlightInkShare)
}

export function toneOpacity(position: number) {
  return minOpacity + (1 - minOpacity) * clamp01(position) ** opacityCurve
}

export function toneLevel(position: number, levels: number) {
  return Math.round(clamp01(position) * (levels - 1))
}

export const toneLevels = 32
export const opacityLevels = 16
const minVeil = 0.3

export function createToneStyles(palette: Palette, alpha: number) {
  const styles: string[] = []

  for (let tone = 0; tone < toneLevels; tone++) {
    const position = tone / (toneLevels - 1)
    const opacity = toneOpacity(position) * alpha
    const [red, green, blue] = toneRamp(palette, position)

    for (let veil = 0; veil < opacityLevels; veil++) {
      const share = minVeil + (1 - minVeil) * (veil / (opacityLevels - 1))
      styles.push(`rgba(${red}, ${green}, ${blue}, ${opacity * share})`)
    }
  }
  
  return styles
}

export function toneStyleIndex(tone: number, veil: number) {
  return tone * opacityLevels + veil
}
