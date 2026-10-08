type PointerPosition = { x: number; y: number } | null
type Listener = (position: PointerPosition) => void

const listeners = new Set<Listener>()
let position: PointerPosition = null
let frame = 0

function schedule() {
  if (frame) return
  frame = window.requestAnimationFrame(() => {
    frame = 0
    listeners.forEach((listener) => listener(position))
  })
}

function move(event: PointerEvent) {
  position = event.pointerType === 'touch' ? null : { x: event.clientX, y: event.clientY }
  schedule()
}

function leave() {
  position = null
  schedule()
}

export function subscribePointer(listener: Listener) {
  if (listeners.size === 0) {
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', move, { passive: true })
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    window.addEventListener('blur', leave)
    document.documentElement.addEventListener('pointerleave', leave)
  }
  listeners.add(listener)
  listener(position)
  return () => {
    listeners.delete(listener)
    if (listeners.size) return
    window.cancelAnimationFrame(frame)
    frame = 0
    position = null
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerdown', move)
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)
    window.removeEventListener('blur', leave)
    document.documentElement.removeEventListener('pointerleave', leave)
  }
}
