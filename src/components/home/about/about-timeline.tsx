'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'

export function AboutTimeline() {
  const t = useTranslations('About')
  const reduced = useReducedMotion()

  return (
    <div className="pt-4" role="region" aria-labelledby="about-journey-title" data-about-journey>
      <h3 id="about-journey-title" className="heading-card mb-5">
        {t('timelineTitle')}
      </h3>

      <ol className="space-y-5 pl-6">
        {(['discover', 'build', 'share'] as const).map((step, index) => (
          <motion.li
            key={step}
            className="relative motion-reduce:!transform-none"
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : index * 0.06 }}
          >
            <span className="absolute -left-6 top-2.5 h-2 w-2 bg-accent" />

            <h4 className="font-sans text-sm font-medium leading-6 text-ink">{t(`timeline.${step}`)}</h4>
            <p className="font-sans text-sm leading-6 text-muted">{t(`timeline.${step}Text`)}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  )
}
