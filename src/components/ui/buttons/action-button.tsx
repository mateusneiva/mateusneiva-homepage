'use client'

import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { buttonClassName, type ButtonVariants } from './button-styles'

export type ActionButtonProps = ComponentPropsWithoutRef<'button'> & ButtonVariants

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(function ActionButton(
  { tone, size, selected, className, type = 'button', ...props },
  ref,
) {
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      className={buttonClassName({ tone, size, selected, className })}
    />
  )
})
