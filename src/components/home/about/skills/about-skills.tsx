'use client'

import { useId, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { LinkLabel } from '@/components/ui/typography/link-label'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { AboutSkillsContent } from './about-skills-content'

export function AboutSkills() {
  const t = useTranslations('About.skillsView')
  const [expanded, setExpanded] = useState(false)
  const reduced = useReducedMotion()

  const contentId = `skills-view-${useId().replace(/:/g, '')}`

  return (
    <div data-skills-matrix data-skills-view={expanded ? 'complete' : 'summary'}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="font-mono text-[11px] text-muted" aria-live="polite">
          {t(expanded ? 'complete' : 'summary')}
        </p>

        <ActionButton
          tone="link"
          size="inline"
          aria-expanded={expanded}
          aria-controls={contentId}
          onClick={() => setExpanded((current) => !current)}
        >
          <LinkLabel>{t(expanded ? 'collapse' : 'expand')}</LinkLabel>
        </ActionButton>
      </div>

      <div id={contentId}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={expanded ? 'complete' : 'summary'}
            initial={{ opacity: 0, y: reduced ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : -6 }}
            transition={{ duration: reduced ? 0 : 0.15 }}
          >
            <AboutSkillsContent expanded={expanded} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
