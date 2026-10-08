'use client'

import Image from 'next/image'
import { useId, useRef } from 'react'
import { useFormatter, useTranslations } from 'next-intl'
import { SiSpotify } from 'react-icons/si'
import { FiMusic } from 'react-icons/fi'
import { tv } from 'tailwind-variants'
import { AboutSpotifyProfile } from './about-spotify-profile'
import { SpotifyVisualizer } from './spotify-visualizer'
import { SpotifyTrackLink } from './spotify-track-link'
import { useAboutSpotify } from './use-about-spotify'

const spotifyStyle = tv({
  slots: {
    root: 'bg-surface p-6',
    header: 'mb-2 flex items-center justify-between gap-4',
    eyebrow: 'font-mono text-[11px] uppercase tracking-[0.1em] text-muted',
    content: 'mt-4',
    row: 'flex items-start gap-4',
    cover: 'flex h-16 w-16 shrink-0 items-center justify-center bg-raised sm:h-[72px] sm:w-[72px]',
    badge: 'mb-1 flex flex-wrap items-center gap-x-2 font-mono text-[11px] leading-5 text-muted',
    actions: 'mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-3',
  },
  variants: {
    hasTrack: {
      true: { actions: 'sm:pl-[88px]' },
      false: { row: 'items-center', cover: 'text-muted' },
    },
  },
})

export function AboutSpotify() {
  const t = useTranslations('About.spotify')
  const format = useFormatter()
  const container = useRef<HTMLElement>(null)
  const titleId = `spotify-${useId().replace(/:/g, '')}`
  const { track, profile, status, timestamp, now, playbackStatus } = useAboutSpotify(container)
  const relativeTime = timestamp ? format.relativeTime(new Date(timestamp), now) : null
  const styles = spotifyStyle({ hasTrack: Boolean(track) })

  return (
    <section
      ref={container}
      aria-labelledby={titleId}
      className={styles.root()}
      data-spotify-widget
      data-spotify-status={status}
    >
      <div className={styles.header()}>
        <p className={styles.eyebrow()}>{t('eyebrow')}</p>
        <SiSpotify
          size={20}
          aria-hidden="true"
          className="shrink-0 text-[#168A3F] [[data-theme=dark]_&]:text-[#1DB954]"
        />
      </div>
      <h3 id={titleId} className="heading-card">
        {t('title')}
      </h3>
      <div
        className={styles.content()}
        aria-live="polite"
        aria-atomic="true"
        aria-busy={status === 'loading'}
      >
        {track ? (
          <div className={styles.row()}>
            <div className={styles.cover()}>
              {track.imageUrl ? (
                <Image
                  src={track.imageUrl}
                  width={72}
                  height={72}
                  alt={t('cover', { album: track.album })}
                  className="h-full w-full object-cover"
                />
              ) : (
                <FiMusic size={24} aria-hidden="true" className="text-muted" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className={styles.badge()}>
                {status === 'playing' && <SpotifyVisualizer />}
                <span>{t(status)}</span>
                {timestamp && relativeTime && (
                  <>
                    <span aria-hidden="true">·</span>
                    <time dateTime={timestamp} aria-live="off">
                      {status === 'cached' && playbackStatus !== 'recent'
                        ? t('synced', { time: relativeTime })
                        : relativeTime}
                    </time>
                  </>
                )}
              </p>
              <h4 className="break-words font-sans text-base font-medium leading-6 text-ink">
                {track.title}
              </h4>
              <p className="break-words text-sm leading-6 text-muted">{track.artist}</p>
            </div>
          </div>
        ) : (
          <div className={styles.row()}>
            <span aria-hidden="true" className={styles.cover()}>
              <FiMusic size={24} />
            </span>
            <p className="text-sm leading-6 text-muted">{t(status)}</p>
          </div>
        )}
      </div>
      <div className={styles.actions()}>
        {track && <SpotifyTrackLink track={track} />}
        <AboutSpotifyProfile profile={profile} />
      </div>
    </section>
  )
}
