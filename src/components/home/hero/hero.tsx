'use client'

import dynamic from 'next/dynamic'
import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { AnimatedArrow } from '@/components/ui/icons/animated-arrow'
import { ActionLink } from '@/components/ui/buttons/action-link'
import { LinkLabel } from '@/components/ui/typography/link-label'
import { ConstructionFrame } from '@/components/layout/construction/construction-frame'
import { TextGuides } from '@/components/layout/construction/text-guides'
import { TextHighlight } from '@/components/ui/typography/text-highlight'
import { HomeSocialLinks } from '../social-links'
import { ParallaxTitle } from '@/components/ui/typography/parallax-title'
import { usePageReady } from '@/components/layout/loading/initial-loading-provider'

const HeroScene = dynamic(() => import('./hero-scene').then((module) => module.HeroScene), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center font-mono text-xs text-subtle" aria-hidden="true">
      loading scene…
    </div>
  ),
})

export function Hero() {
  const t = useTranslations('Hero')
  const reduced = useReducedMotion()
  const ready = usePageReady()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const workspaceOffset = useTransform(scrollYProgress, [0, 1], [0, 64])
  const workspaceY = useSpring(workspaceOffset, { stiffness: 140, damping: 28 })

  return (
    <section ref={ref} className="relative pb-16 pt-16 sm:pb-24 sm:pt-24">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-6">
        <motion.div
          className="relative isolate motion-reduce:!transform-none lg:col-start-2 lg:row-start-1"
          data-hero-workspace
          style={{ y: workspaceY }}
        >
          <ConstructionFrame variant="cards" caption="Voxel workspace / 01" />
          <div className="h-[320px] sm:h-[390px]">
            <HeroScene />
          </div>
        </motion.div>
        <motion.div
          className="motion-reduce:!transform-none lg:col-start-1 lg:row-start-1"
          data-hero-copy
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: reduced ? 0 : 0.65 }}
        >
          <p className="eyebrow mb-7 flex items-center gap-3">
            <span className="h-2 w-2 bg-accent" />
            {t('eyebrow')}
          </p>

          <ParallaxTitle title={t('title')} highlight={t('highlight')} level={1} variant="hero" />

          <TextGuides leading="relaxed" className="mt-7 max-w-lg text-lg leading-relaxed text-muted">
            <p>
              {t.rich('description', {
                name: (chunks) => <TextHighlight tone="ink">{chunks}</TextHighlight>,
                highlight: (chunks) => <TextHighlight>{chunks}</TextHighlight>,
              })}
            </p>
          </TextGuides>
          <div className="relative isolate mt-9 flex w-full max-w-full flex-col gap-4 sm:w-fit sm:flex-row sm:flex-wrap" data-hero-actions>
            <ConstructionFrame variant="controls" />
            <ActionLink href="/#projects" tone="primary" className="w-full justify-between sm:w-auto sm:justify-center">
              <span>{t('projects')}</span>
              <AnimatedArrow />
            </ActionLink>
            <ActionLink href="/#contact" className="w-full justify-between sm:w-auto sm:justify-center">
              <span>{t('contact')}</span>
              <AnimatedArrow />
            </ActionLink>
          </div>
          <HomeSocialLinks />
        </motion.div>
      </div>

      <div className="mt-14 flex items-center justify-between pt-6 font-mono text-[11px] text-subtle">
        <span>{t('caption')}</span>
        <a href="#about" className="interactive-link group/link flex items-center gap-3 hover:text-accent">
          <LinkLabel className="hidden sm:inline">{t('scroll')}</LinkLabel>
          <AnimatedArrow direction="down" />
        </a>
      </div>
    </section>
  )
}
