'use client'

import { cloneElement, useEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode, type ReactElement } from 'react'
import { createPortal, flushSync } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useTooltipPosition } from './use-tooltip-position'
import { ConstructionFrame } from '@/components/layout/construction/construction-frame'

const subscribe = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

export function Tooltip({ label, description, icon, children }: {
  label: string
  description?: string
  icon?: ReactNode
  children: ReactElement<{ 'aria-describedby'?: string }>
}) {
  const [open, setOpen] = useState(false)
  const [immediate, setImmediate] = useState(false)
  const popup = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLSpanElement>(null)
  const focused = useRef(false)
  const dismissed = useRef(false)
  const id = `tooltip-${useId().replace(/:/g, '')}`
  const reduced = useReducedMotion()
  const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
  const { x, y, move } = useTooltipPosition(popup, open && mounted)

  useEffect(() => {
    const hide = () => {
      if (!open && !dismissed.current && !trigger.current?.contains(document.activeElement)) return
      dismissed.current = true
      flushSync(() => {
        setImmediate(true)
        setOpen(false)
      })
    }
    const visibility = () => { if (document.hidden) hide() }
    window.addEventListener('blur', hide)
    document.addEventListener('visibilitychange', visibility)
    return () => {
      window.removeEventListener('blur', hide)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    const onViewportChange = () => {
      if (focused.current && trigger.current) {
        const bounds = trigger.current.getBoundingClientRect()
        move(bounds.left + bounds.width / 2, bounds.top, true)
      } else {
        close()
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('scroll', onViewportChange, true)
    window.addEventListener('resize', onViewportChange)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('scroll', onViewportChange, true)
      window.removeEventListener('resize', onViewportChange)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, move])

  return (
    <span
      ref={trigger}
      className="inline-flex min-w-0 max-w-full"
      onPointerEnter={(event) => {
        if (event.pointerType === 'touch' || dismissed.current) return
        setImmediate(false)
        move(event.clientX, event.clientY)
        setOpen(true)
      }}
      onPointerMove={(event) => {
        if (event.pointerType !== 'touch') move(event.clientX, event.clientY)
      }}
      onPointerLeave={() => {
        dismissed.current = false
        if (!focused.current) setOpen(false)
      }}
      onFocusCapture={(event) => {
        focused.current = true
        if (dismissed.current) return
        setImmediate(false)
        const bounds = event.currentTarget.getBoundingClientRect()
        move(bounds.left + bounds.width / 2, bounds.top, true)
        setOpen(true)
      }}
      onBlurCapture={() => {
        focused.current = false
        dismissed.current = false
        setOpen(false)
      }}
      onClickCapture={() => {
        dismissed.current = true
        flushSync(() => {
          setImmediate(true)
          setOpen(false)
        })
      }}
    >
      {cloneElement(children, { 'aria-describedby': open ? id : undefined })}
      {mounted && !immediate && createPortal(
        <AnimatePresence>
          {open && (
            <motion.div key="tooltip" ref={popup} className="pointer-events-none fixed left-0 top-0 z-50" style={{ x, y }}>
              <motion.div
                id={id}
                role="tooltip"
                data-custom-tooltip
                className="relative isolate max-w-[calc(100vw-2rem)] bg-[linear-gradient(135deg,rgb(var(--color-surface)),rgb(var(--color-canvas)))] px-4 py-3 text-ink shadow-[0_6px_12px_rgb(0_0_0/0.08),0_16px_32px_rgb(0_0_0/0.12)] [[data-theme=dark]_&]:shadow-[0_4px_12px_rgb(0_0_0/0.08)]"
                initial={{ opacity: 0, y: reduced ? 0 : 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced ? 0 : 2 }}
                transition={{ duration: reduced ? 0 : 0.16, ease: [0.22, 1, 0.36, 1] }}
              >
                <ConstructionFrame variant="tooltip" />
                <div className="flex items-center gap-3">
                  {icon && <span aria-hidden="true" className="flex shrink-0 items-center justify-center text-ink">{icon}</span>}
                  <div className="min-w-0">
                    <p className="break-words font-sans text-[13px] font-medium leading-5 tracking-tight [overflow-wrap:anywhere]">{label}</p>
                    {description && <p className="mt-0.5 break-words font-mono text-[10px] leading-4 text-muted [overflow-wrap:anywhere]">{description}</p>}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </span>
  )
}
