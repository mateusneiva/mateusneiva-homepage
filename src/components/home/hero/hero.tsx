'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { DotFieldCanvas } from '@/components/ui/dots/dot-field-canvas'
import { AnimatedArrow } from '@/components/ui/icons/animated-arrow'
import { ActionLink } from '@/components/ui/buttons/action-link'
import { LinkLabel } from '@/components/ui/typography/link-label'
import { ConstructionFrame } from '@/components/layout/construction/construction-frame'
import { TextGuides } from '@/components/layout/construction/text-guides'
import { TextHighlight } from '@/components/ui/typography/text-highlight'
import { HomeSocialLinks } from '../social-links'
import { ParallaxTitle } from '@/components/ui/typography/parallax-title'
import { usePageReady } from '@/components/layout/loading/initial-loading-provider'

export function Hero() {
  const t = useTranslations('Hero')
  const reduced = useReducedMotion()
  const ready = usePageReady()

  return (
    <section className="relative isolate flex min-h-[calc(100svh-5rem)] flex-col pb-10 pt-16 sm:pt-20">
      <motion.div
        className="pointer-events-none absolute -top-20 bottom-0 left-[calc(50%-50cqw)] -z-10 w-[100cqw]"
        data-hero-visual
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: reduced ? 0 : 1.2, delay: reduced ? 0 : 0.2 }}
      >
        <DotFieldCanvas mask="wave" radius={4.5} spacing={12} alpha={1} trailRadius={180} />
      </motion.div>
      <div className="flex max-w-2xl flex-1 items-center">
        <motion.div
          className="motion-reduce:!transform-none"
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

      <div className="mt-14 flex items-center justify-between font-mono text-[11px] text-subtle">
        <span>{t('caption')}</span>
        <a href="#about" className="interactive-link group/link flex items-center gap-3 hover:text-accent">
          <LinkLabel className="hidden sm:inline">{t('scroll')}</LinkLabel>
          <AnimatedArrow direction="down" />
        </a>
      </div>
    </section>
  )
}
