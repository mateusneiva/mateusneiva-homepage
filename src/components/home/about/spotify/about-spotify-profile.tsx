'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { tv } from 'tailwind-variants'
import { SiSpotify } from 'react-icons/si'
import type { SpotifyProfile } from '@/lib/spotify/schema'
import { Tooltip } from '@/components/ui/tooltip/tooltip'

const profileStyle = tv({
  slots: {
    root: 'ml-auto min-w-0 max-w-full',
    link: 'flex w-fit max-w-full items-center gap-2 text-muted',
    name: 'min-w-0 truncate font-sans text-xs font-medium leading-4',
    avatar: 'flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-raised',
  },
  variants: {
    interactive: {
      true: {
        link: 'group/profile transition-colors duration-200 hover:text-ink focus-visible:text-ink motion-reduce:transition-none',
        avatar: [
          'transition-[transform,filter] duration-200 ease-out',
          'group-hover/profile:scale-110 group-hover/profile:brightness-110',
          'group-focus-visible/profile:scale-110 group-focus-visible/profile:brightness-110',
          'motion-reduce:transform-none motion-reduce:transition-none',
        ],
      },
    },
  },
})

export function AboutSpotifyProfile({ profile }: { profile: SpotifyProfile | null }) {
  const t = useTranslations('About.spotify')
  const name = profile?.name ?? 'Mateus Neiva'
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
  const styles = profileStyle({ interactive: Boolean(profile) })
  const identity = (
    <>
      <span className={styles.name()}>{name}</span>
      <span className={styles.avatar()}>
        {profile?.avatarUrl ? (
          <Image
            src={profile.avatarUrl}
            width={28}
            height={28}
            alt={t('avatar', { name })}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <span aria-hidden="true" className="font-mono text-[11px] text-muted">
            {initials}
          </span>
        )}
      </span>
    </>
  )

  return (
    <div className={styles.root()} data-spotify-profile>
      {profile ? (
        <Tooltip label={t('openProfile')} description={name} icon={<SiSpotify size={22} />}>
          <a
            href={profile.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('profile', { name })}
            className={styles.link()}
          >
            {identity}
          </a>
        </Tooltip>
      ) : (
        <div className={styles.link()}>{identity}</div>
      )}
    </div>
  )
}
