'use client'

import { useRouter } from '@/i18n/navigation'
import { AnimatedArrow } from '../icons/animated-arrow'
import { LinkLabel } from '../typography/link-label'
import { ActionButton } from './action-button'

export function HistoryBackButton({ label, fallback }: { label: string; fallback: string }) {
  const router = useRouter()
  function goBack() {
    const navigation = (window as Window & { navigation?: { canGoBack: boolean } }).navigation
    if (navigation?.canGoBack ?? window.history.length > 1) router.back()
    else router.replace(fallback)
  }
  return (
    <ActionButton tone="link" size="inline" onClick={goBack} className="mb-12">
      <AnimatedArrow direction="left" />
      <LinkLabel>{label}</LinkLabel>
    </ActionButton>
  )
}
