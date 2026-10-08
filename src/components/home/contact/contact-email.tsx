'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { EmailIcon } from '@/data/social'
import { AnimatedArrow } from '@/components/ui/icons/animated-arrow'
import { LinkLabel } from '@/components/ui/typography/link-label'
import { Tooltip } from '@/components/ui/tooltip/tooltip'

const email = 'mateus.fneiva@gmail.com'

export function ContactEmail() {
  const t = useTranslations('Contact')
  const reduced = useReducedMotion()

  return (
    <Tooltip label={t('email')} description={email} icon={<EmailIcon size={22} />}>
      <motion.a
        href={`mailto:${email}`}
        className="interactive-link group/link inline-flex items-center gap-2 text-accent hover:text-ink focus-visible:text-ink"
        initial="rest"
        animate="rest"
        whileHover="active"
        whileFocus="active"
      >
        <motion.span
          variants={{ rest: { y: 0 }, active: { y: reduced ? 0 : -2 } }}
          transition={{ type: 'spring', stiffness: 360, damping: 24 }}
        >
          <LinkLabel className="break-all">{email}</LinkLabel>
        </motion.span>
        <AnimatedArrow />
      </motion.a>
    </Tooltip>
  )
}
