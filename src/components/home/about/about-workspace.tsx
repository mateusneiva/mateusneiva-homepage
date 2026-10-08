'use client'

import dynamic from 'next/dynamic'
import { useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { SelectionButton } from '@/components/ui/buttons/selection-button'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import { ConstructionFrame } from '@/components/layout/construction/construction-frame'
import { SceneBoundary } from '@/components/three/scene-boundary'
import { useViewportActivity } from '@/components/ui/motion/use-viewport-activity'
import { useWebglSupport } from '@/components/three/hooks/use-webgl-support'

const CompanionDiorama = dynamic(
  () => import('@/components/three/scenes/companion-diorama').then((module) => module.CompanionDiorama),
  { ssr: false },
)

const companions = ['allay', 'bee', 'axolotl'] as const

export function AboutWorkspace() {
  const t = useTranslations('About.workspace')
  const reduced = useReducedMotion()
  const container = useRef<HTMLDivElement>(null)
  const active = useViewportActivity(container)
  const supported = useWebglSupport()
  const [index, setIndex] = useState(0)
  const id = companions[index]
  const name = t(`${id}.name`)
  const fallback = (
    <div className="flex h-full items-center justify-center px-8 text-center font-mono text-xs text-subtle">
      {t('fallback')}
    </div>
  )
  const step = (direction: number) =>
    setIndex((current) => (current + direction + companions.length) % companions.length)

  return (
    <div ref={container} className="relative isolate" data-voxel-workspace="02">
      <ConstructionFrame variant="cards" caption="Voxel workspace / 02" />

      <div className="flex items-start justify-between gap-4 pt-4 font-mono text-[11px] uppercase leading-5 tracking-[0.1em] text-subtle">
        <span>{t('collection')}</span>
        <span className="shrink-0 tabular-nums">{String(index + 1).padStart(2, '0')} / 03</span>
      </div>

      <div className="relative h-[260px] sm:h-[300px]" role="img" aria-label={t('scene', { name })}>
        <SceneBoundary fallback={fallback}>
          {supported ? <CompanionDiorama id={id} active={active} loading={t('loading')} /> : fallback}
        </SceneBoundary>
      </div>

      <div className="flex items-center justify-between gap-4 py-4">
        <div className="min-w-0" aria-live="polite" aria-atomic="true">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={id}
              initial={{ opacity: 0, y: reduced ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : -6 }}
              transition={{ duration: reduced ? 0 : 0.16 }}
            >
              <p className="heading-feature leading-tight">{name}</p>
              <p className="mt-1 font-sans text-[13px] leading-5 text-muted">{t(`${id}.description`)}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative isolate flex shrink-0 gap-2">
          <ActionButton size="icon" onClick={() => step(-1)} aria-label={t('previous')}>
            <FiArrowLeft size={16} aria-hidden="true" focusable="false" />
          </ActionButton>

          <ActionButton size="icon" onClick={() => step(1)} aria-label={t('next')}>
            <FiArrowRight size={16} aria-hidden="true" focusable="false" />
          </ActionButton>
        </div>
      </div>

      <div
        className="relative isolate flex w-fit max-w-full flex-wrap gap-2 py-3"
        role="group"
        aria-label={t('select')}
      >
        {companions.map((companion, option) => (
          <SelectionButton
            key={companion}
            selected={id === companion}
            layoutId="companion-selection"
            onClick={() => setIndex(option)}
          >
            {t(`${companion}.name`)}
          </SelectionButton>
        ))}
      </div>

      <p className="pb-3 text-center font-mono text-[11px] leading-5 text-muted">{t('hint')}</p>
    </div>
  )
}
