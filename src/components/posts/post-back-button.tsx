'use client'

import { useTranslations } from 'next-intl'
import { HistoryBackButton } from '@/components/ui/buttons/history-back-button'

export function PostBackButton() {
  const t = useTranslations('Posts')
  return <HistoryBackButton label={t('back')} fallback="/posts" />
}
