import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'

import { Section } from '@/components/ui/motion/animated-section'
import { SectionHeading } from '@/components/ui/typography/section-heading'
import { ConstructionFrame } from '@/components/layout/construction/construction-frame'
import { TextGuides } from '@/components/layout/construction/text-guides'
import { TextHighlight } from '@/components/ui/typography/text-highlight'

import { AboutPrinciples } from './about-principles'
import { AboutSkills } from './skills/about-skills'
import { AboutTimeline } from './about-timeline'
import { AboutSpotify } from './spotify/about-spotify'
import { FadeIn } from '@/components/ui/motion/fade-in'

export function About() {
  const t = useTranslations('About')
  const highlights = {
    highlight: (chunks: ReactNode) => <TextHighlight>{chunks}</TextHighlight>,
    strong: (chunks: ReactNode) => <TextHighlight tone="ink">{chunks}</TextHighlight>,
  }

  return (
    <Section id="about">
      <SectionHeading eyebrow={t('eyebrow')} title={t('title')} />
      <div className="relative isolate grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,9fr)_minmax(0,11fr)] lg:gap-12">
        <ConstructionFrame variant="cards" columns="split-about" />

        <div className="space-y-6 lg:col-start-1 lg:row-start-1">
          <FadeIn className="space-y-5 text-base leading-7 text-muted" data-about-intro>
            <TextGuides><p>{t.rich('description', highlights)}</p></TextGuides>
            <TextGuides><p>{t.rich('detail', highlights)}</p></TextGuides>
            <TextGuides><p>{t.rich('focus', highlights)}</p></TextGuides>
            <TextGuides><p>{t.rich('personal', highlights)}</p></TextGuides>
          </FadeIn>

          <AboutTimeline />
          <FadeIn className="pt-8"><AboutPrinciples /></FadeIn>
        </div>

        <div className="space-y-8 lg:col-start-2 lg:row-start-1">
          <FadeIn><AboutSkills /></FadeIn>
          <FadeIn><AboutSpotify /></FadeIn>
        </div>
      </div>
    </Section>
  )
}
