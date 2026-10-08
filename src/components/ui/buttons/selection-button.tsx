'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ActionButton, type ActionButtonProps } from './action-button'

type SelectionButtonProps = Omit<ActionButtonProps, 'tone' | 'selected' | 'aria-pressed'> & {
  selected: boolean
  layoutId: string
}

export function SelectionButton({
  selected,
  layoutId,
  children,
  size = 'sm',
  ...props
}: SelectionButtonProps) {
  const reduced = useReducedMotion()
  return (
    <ActionButton {...props} size={size} selected={selected} aria-pressed={selected}>
      {selected && (
        <motion.span
          layoutId={layoutId}
          className="absolute inset-0 bg-accent"
          transition={reduced ? { duration: 0 } : { type: 'spring', bounce: 0.15, duration: 0.4 }}
        />
      )}
      <span className="relative">{children}</span>
    </ActionButton>
  )
}
