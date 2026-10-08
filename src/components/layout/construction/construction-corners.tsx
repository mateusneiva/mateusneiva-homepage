const corners = [
  { x: '0', y: '0' },
  { x: '100%', y: '0' },
  { x: '0', y: '100%' },
  { x: '100%', y: '100%' },
]

export function ConstructionCorners() {
  return (
    <>
      {corners.map(({ x, y }) => (
        <svg key={`${x}-${y}`} x={x} y={y} width="1" height="1" className="overflow-visible">
          <path d="M-4 0H4M0 -4V4" stroke="currentColor" strokeWidth="1" className="opacity-[0.15]" />
        </svg>
      ))}
    </>
  )
}
