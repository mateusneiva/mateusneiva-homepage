'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { subscribePointer } from '@/components/ui/motion/pointer-tracker'
import { useViewportActivity } from '@/components/ui/motion/use-viewport-activity'
import { parseRgb, type Palette, type Rgb } from './color'
import {
  createDotRenderer,
  type DotFieldMessage,
  type DotFieldOptions,
  type DotFieldRenderer,
  type DotFieldSize,
} from './dot-field-renderer'
import type { MaskName } from './wave'
import type { Point } from './grid'

type DotFieldCanvasProps = {
  mask: MaskName
  spacing?: number
  radius?: number
  trailRadius?: number
  trailLifetime?: number
  animated?: boolean
  alpha?: number
  label?: string
  className?: string
}

const maxPixelRatio = 1.5
const canvasClassName = 'absolute inset-0 block h-full w-full'
const finePointer = '(hover: hover) and (pointer: fine)'

function readPalette(element: Element): Palette {
  const style = getComputedStyle(element)
  const read = (name: string): Rgb => parseRgb(style.getPropertyValue(name))
  return { canvas: read('--color-canvas'), accent: read('--color-wave'), ink: read('--color-ink') }
}

function fieldSize(element: Element): DotFieldSize {
  const bounds = element.getBoundingClientRect()
  return {
    width: bounds.width,
    height: bounds.height,
    ratio: Math.min(window.devicePixelRatio || 1, maxPixelRatio),
  }
}

function pointerInElement(element: Element, position: Point | null): Point | null {
  if (!position) return null
  const bounds = element.getBoundingClientRect()
  return { x: position.x - bounds.left, y: position.y - bounds.top }
}

function attachCanvas(host: HTMLElement) {
  const canvas = document.createElement('canvas')
  canvas.className = canvasClassName
  host.append(canvas)
  return canvas
}

function createWorkerRenderer(canvas: HTMLCanvasElement, options: DotFieldOptions, palette: Palette): DotFieldRenderer {
  const worker = new Worker(new URL('./dot-field.worker.ts', import.meta.url), { type: 'module' })
  const post = (message: DotFieldMessage, transfer: Transferable[] = []) => worker.postMessage(message, transfer)
  const surface = canvas.transferControlToOffscreen()
  post({ type: 'init', canvas: surface, options, palette }, [surface])
  return {
    resize: (size) => post({ type: 'resize', size }),
    setPalette: (next) => post({ type: 'palette', palette: next }),
    setPointer: (point) => post({ type: 'pointer', point }),
    setRunning: (running) => post({ type: 'running', running }),
    destroy: () => worker.terminate(),
  }
}

function createRenderer(canvas: HTMLCanvasElement, options: DotFieldOptions, palette: Palette) {
  if (typeof canvas.transferControlToOffscreen === 'function' && typeof Worker === 'function') {
    return createWorkerRenderer(canvas, options, palette)
  }
  const context = canvas.getContext('2d')
  return context ? createDotRenderer(context, options, palette) : null
}

export function DotFieldCanvas({
  mask,
  spacing = 10,
  radius = 1.6,
  trailRadius = 140,
  trailLifetime = 1400,
  animated = true,
  alpha = 1,
  label,
  className,
}: DotFieldCanvasProps) {
  const container = useRef<HTMLDivElement>(null)
  const renderer = useRef<DotFieldRenderer | null>(null)
  const active = useViewportActivity(container)
  const activeRef = useRef(active)
  const reduced = useReducedMotion()

  useEffect(() => {
    const host = container.current
    if (!host) return

    const canvas = attachCanvas(host)
    const interactive = !reduced && window.matchMedia(finePointer).matches
    const options: DotFieldOptions = {
      mask,
      spacing,
      radius,
      trailRadius,
      trailLifetime,
      animated: animated && !reduced,
      alpha,
      interactive,
    }
    const current = createRenderer(canvas, options, readPalette(host))
    if (!current) {
      canvas.remove()
      return
    }
    renderer.current = current

    const resizeObserver = new ResizeObserver(() => current.resize(fieldSize(host)))
    resizeObserver.observe(host)
    const themeObserver = new MutationObserver(() => current.setPalette(readPalette(host)))
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] })
    const unsubscribe = interactive
      ? subscribePointer((position) => {
          current.setPointer(activeRef.current ? pointerInElement(host, position) : null)
        })
      : undefined
    current.setRunning(activeRef.current && !reduced)

    return () => {
      resizeObserver.disconnect()
      themeObserver.disconnect()
      unsubscribe?.()
      current.destroy()
      renderer.current = null
      canvas.remove()
    }
  }, [alpha, animated, mask, radius, reduced, spacing, trailLifetime, trailRadius])

  useEffect(() => {
    activeRef.current = active
    renderer.current?.setRunning(active && !reduced)
  }, [active, reduced])

  return (
    <div
      ref={container}
      className={cn('relative h-full w-full', className)}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      data-dot-field
    />
  )
}
