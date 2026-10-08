export type Point = { x: number; y: number }

export type GridLayout = {
  columns: number
  rows: number
  offsetX: number
  offsetY: number
  spacing: number
}

export type CellRange = { firstColumn: number; lastColumn: number; firstRow: number; lastRow: number }

export function createGridLayout(width: number, height: number, spacing: number): GridLayout {
  if (width <= 0 || height <= 0 || spacing <= 0) {
    return { columns: 0, rows: 0, offsetX: 0, offsetY: 0, spacing }
  }
  const columns = Math.floor(width / spacing)
  const rows = Math.floor(height / spacing)
  return {
    columns,
    rows,
    offsetX: (width - (columns - 1) * spacing) / 2,
    offsetY: (height - (rows - 1) * spacing) / 2,
    spacing,
  }
}

export function createGrid({ columns, rows, offsetX, offsetY, spacing }: GridLayout): Point[] {
  const points: Point[] = []
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      points.push({ x: offsetX + column * spacing, y: offsetY + row * spacing })
    }
  }
  return points
}

export function cellsWithin(
  { columns, rows, offsetX, offsetY, spacing }: GridLayout,
  center: Point,
  reach: number,
): CellRange {
  return {
    firstColumn: Math.max(0, Math.ceil((center.x - reach - offsetX) / spacing)),
    lastColumn: Math.min(columns - 1, Math.floor((center.x + reach - offsetX) / spacing)),
    firstRow: Math.max(0, Math.ceil((center.y - reach - offsetY) / spacing)),
    lastRow: Math.min(rows - 1, Math.floor((center.y + reach - offsetY) / spacing)),
  }
}

export function grain(x: number, y: number) {
  const value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
  return value - Math.floor(value)
}
