'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { HeroDiorama } from '@/components/three/scenes/hero-diorama'
import { SceneBoundary } from '@/components/three/scene-boundary'
import { useViewportActivity } from '@/components/ui/motion/use-viewport-activity'
import { useWebglSupport } from '@/components/three/hooks/use-webgl-support'

export function HeroScene() {
  const t = useTranslations('Hero')
  const container = useRef<HTMLDivElement>(null)
  const active = useViewportActivity(container)
  const supported = useWebglSupport()

  const fallback = (
    <div className="flex h-full items-center justify-center p-8 text-center text-muted">
      {t('sceneFallback')}
    </div>
  )

  return (
    <div ref={container} className="h-full" role="img" aria-label={t('scene')}>
      <SceneBoundary fallback={fallback}>
        {supported ? <HeroDiorama active={active} /> : fallback}
      </SceneBoundary>
    </div>
  )
}
