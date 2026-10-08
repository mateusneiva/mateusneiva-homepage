'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { AnimatedArrow } from '@/components/ui/icons/animated-arrow'
import { contactSchema, type ContactValues } from '@/lib/contact/schema'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { ContactField } from './contact-field'
import { ConstructionFrame } from '@/components/layout/construction/construction-frame'

export function ContactForm() {
  const t = useTranslations('Contact')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', message: '' },
  })
  const invalid = Object.keys(errors).length > 0

  async function sendMessage(values: ContactValues) {
    setStatus('idle')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!response.ok) throw new Error('Contact request failed')
      const result: unknown = await response.json()
      if (!result || typeof result !== 'object' || !('success' in result) || result.success !== true) {
        throw new Error('Invalid contact response')
      }
      reset()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form
      onSubmit={handleSubmit(sendMessage)}
      noValidate
      aria-label={t('formLabel')}
      aria-busy={isSubmitting}
      className="relative isolate w-full min-w-0 space-y-4 sm:bg-surface sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <ContactField
          registration={register('name')}
          error={errors.name ? t('validation.name') : undefined}
          label={t('name')}
          autoComplete="name"
          placeholder={t('namePlaceholder')}
          minLength={2}
          maxLength={100}
        />

        <ContactField
          registration={register('email')}
          error={errors.email ? t('validation.email') : undefined}
          type="email"
          label={t('address')}
          autoComplete="email"
          placeholder={t('emailPlaceholder')}
          maxLength={254}
        />
      </div>

      <ContactField
        registration={register('message')}
        error={errors.message ? t('validation.message') : undefined}
        label={t('message')}
        placeholder={t('messagePlaceholder')}
        minLength={10}
        maxLength={5000}
        multiline
      />

      {invalid && (
        <p role="alert" className="text-sm text-danger">
          {t('invalid')}
        </p>
      )}

      {status === 'success' && (
        <p role="status" className="text-sm text-accent">
          {t('success')}
        </p>
      )}
      {status === 'error' && (
        <p role="alert" className="text-sm text-danger">
          {t('error')}
        </p>
      )}

      <div className="relative isolate">
        <ConstructionFrame variant="controls" />
        <ActionButton type="submit" tone="primary" disabled={isSubmitting} className="w-full justify-between">
          {t(isSubmitting ? 'sending' : 'submit')}
          <AnimatedArrow />
        </ActionButton>
      </div>

      <p className="text-xs leading-relaxed text-subtle">{t('hint')}</p>
      <ConstructionFrame variant="cards" />
    </form>
  )
}
