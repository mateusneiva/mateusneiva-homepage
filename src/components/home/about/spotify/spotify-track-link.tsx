'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { SiSpotify } from 'react-icons/si'
import type { SpotifyTrack } from '@/lib/spotify/schema'
import { AnimatedArrow } from '@/components/ui/icons/animated-arrow'
import { LinkLabel } from '@/components/ui/typography/link-label'
import { Tooltip } from '@/components/ui/tooltip/tooltip'

export function SpotifyTrackLink({ track }: { track: SpotifyTrack }) {
  const t = useTranslations('About.spotify')
  const reduced = useReducedMotion()

  return (
    <Tooltip label={t('open')} description={`${track.title} — ${track.artist}`} icon={<SiSpotify size={22} />}>
      <motion.a
        href={track.songUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group/link interactive-link inline-flex min-h-7 items-center text-xs leading-4 text-accent hover:text-ink focus-visible:text-ink"
        initial="rest"
        animate="rest"
        whileHover="active"
        whileFocus="active"
      >
        <motion.span
          className="inline-flex items-center gap-1.5"
          variants={{ rest: { y: 0 }, active: { y: reduced ? 0 : -2 } }}
          transition={{ type: 'spring', stiffness: 360, damping: 24 }}
        >
          <LinkLabel className="pt-1">{t('open')}</LinkLabel>
          <AnimatedArrow size={14} />
        </motion.span>
      </motion.a>
    </Tooltip>
  )
}
