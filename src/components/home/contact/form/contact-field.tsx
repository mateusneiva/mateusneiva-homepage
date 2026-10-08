'use client'

import { useId } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { tv } from 'tailwind-variants'
import type { ContactValues } from '@/lib/contact/schema'

const fieldStyle = tv({
  slots: {
    label: 'group/field block font-mono text-xs text-muted transition-colors duration-300 focus-within:text-accent',
    control: [
      'mt-2 block w-full border-b border-ink/30 bg-surface px-4 py-3.5 font-sans text-base leading-relaxed text-ink sm:border-ink/20 sm:bg-canvas',
      'outline-none placeholder:text-muted placeholder:transition-colors placeholder:duration-300 sm:placeholder:text-subtle/75',
      'hover:border-ink/40 hover:bg-raised focus:border-accent focus:bg-raised focus:placeholder:text-muted sm:hover:bg-raised/40',
      'focus:shadow-[0_0_0_2px_rgb(var(--color-accent)/0.3)]',
      'transition-[background-color,border-color,box-shadow] duration-300 ease-out motion-reduce:transition-none',
    ],
    underline: 'pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-focus-within/field:scale-x-100 motion-reduce:transition-none',
  },
  variants: {
    multiline: { true: { control: 'resize-y' } },
    invalid: {
      true: {
        label: 'text-danger focus-within:text-danger',
        control: 'border-danger focus:border-danger focus:shadow-[0_0_0_2px_rgb(var(--color-danger)/0.3)]',
        underline: 'bg-danger',
      },
    },
  },
})

interface ContactFieldProps {
  registration: UseFormRegisterReturn<keyof ContactValues>
  label: string
  placeholder: string
  type?: 'text' | 'email'
  autoComplete?: string
  multiline?: boolean
  minLength?: number
  maxLength: number
  error?: string
}

export function ContactField({
  registration,
  label,
  error,
  multiline = false,
  type = 'text',
  ...props
}: ContactFieldProps) {
  const id = `contact-${useId().replace(/:/g, '')}`
  const errorId = `${id}-error`
  const styles = fieldStyle({ multiline, invalid: Boolean(error) })
  const accessibility = { id, 'aria-invalid': Boolean(error), 'aria-describedby': error ? errorId : undefined }

  return (
    <div>
      <label htmlFor={id} className={styles.label()}>
        {label}
        <span className="relative block">
          {multiline ? (
            <textarea {...props} {...registration} {...accessibility} required rows={4} className={styles.control()} />
          ) : (
            <input {...props} {...registration} {...accessibility} type={type} required className={styles.control()} />
          )}
          <span aria-hidden="true" data-field-underline className={styles.underline()} />
        </span>
      </label>
      {error && <p id={errorId} className="mt-2 text-xs leading-5 text-danger">{error}</p>}
    </div>
  )
}
