'use client'

import { useTranslations } from 'next-intl'
import { motion, useReducedMotion } from 'framer-motion'
import { socialIconLinks } from '@/data/social'
import { Tooltip } from '@/components/ui/tooltip/tooltip'
import { cn } from '@/lib/cn'

export function HomeSocialLinks({ className }: { className?: string }) {
  const t = useTranslations('Social')
  const contact = useTranslations('Contact')
  const reduced = useReducedMotion()

  return (
    <nav
      aria-label={t('label')}
      className={cn('mt-6 flex flex-wrap gap-1 sm:gap-2', className)}
      data-social-links
    >
      {socialIconLinks.map((link) => {
        const { label, href, icon: Icon } = link
        const resume = href === '/resume.pdf'
        const name = resume ? contact('resume') : label
        const description = 'username' in link ? link.username : t('resumeDescription')
        return (
          <Tooltip key={href} label={name} description={description} icon={<Icon size={22} />}>
            <motion.a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              className="group/social inline-flex h-10 w-10 items-center justify-center"
              initial="rest"
              animate="rest"
              whileHover="active"
              whileFocus="active"
            >
              <motion.span
                aria-hidden="true"
                data-social-icon
                className="block h-[18px] w-[18px] text-muted transition-colors duration-200 group-hover/social:text-ink group-focus-visible/social:text-ink motion-reduce:transition-none"
                variants={{ rest: { y: 0 }, active: { y: reduced ? 0 : -3 } }}
                transition={{ type: 'spring', stiffness: 360, damping: 24 }}
              >
                <Icon size={18} />
              </motion.span>
            </motion.a>
          </Tooltip>
        )
      })}
    </nav>
  )
}
