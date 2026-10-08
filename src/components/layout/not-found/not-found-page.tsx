import { useTranslations } from 'next-intl'
import { ActionLink } from '@/components/ui/buttons/action-link'
import { AnimatedArrow } from '@/components/ui/icons/animated-arrow'
import { ConstructionFrame } from '@/components/layout/construction/construction-frame'
import { Reveal } from '@/components/ui/motion/reveal'

export function NotFoundPage() {
  const t = useTranslations('NotFound')
  return (
    <main id="content" className="page-container grid min-h-[65svh] items-center gap-12 py-16 sm:py-24 lg:grid-cols-[0.9fr_1.1fr]" data-not-found-page>
      <div className="relative isolate px-4 py-8 text-center" aria-hidden="true">
        <ConstructionFrame variant="cards" caption="404 / route" />
        <Reveal>
          <p className="font-serif text-[clamp(7rem,20vw,14rem)] leading-none tracking-[-0.08em] text-accent">404</p>
          <div className="mx-auto mt-6 h-px w-24 bg-accent/40" />
        </Reveal>
      </div>
      <div>
        <p className="eyebrow mb-5">{t('eyebrow')}</p>
        <div className="relative isolate">
          <ConstructionFrame variant="title" />
          <h1 className="heading-section">{t('title')}</h1>
        </div>
        <p className="mt-6 max-w-lg leading-7 text-muted">{t('description')}</p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <ActionLink href="/" tone="primary" className="justify-between">
            {t('back')}<AnimatedArrow direction="left" />
          </ActionLink>
          <ActionLink href="/#projects" className="justify-between">
            {t('projects')}<AnimatedArrow />
          </ActionLink>
        </div>
      </div>
    </main>
  )
}
