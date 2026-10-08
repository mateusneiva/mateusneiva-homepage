import { useTranslations } from 'next-intl'
import { ConstructionFrame } from '@/components/layout/construction/construction-frame'
import { Reveal } from '@/components/ui/motion/reveal'
import { LinkLabel } from '@/components/ui/typography/link-label'
import { Link } from '@/i18n/navigation'

export function AboutPrinciples() {
  const t = useTranslations('About.principles')
  return (
    <section aria-labelledby="about-principles-title" className="pt-4" data-about-principles>
      <p className="eyebrow mb-3">{t('eyebrow')}</p>
      <div className="relative isolate mb-6">
        <ConstructionFrame variant="title" />

        <h3 id="about-principles-title" className="heading-feature">
          {t('title')}
        </h3>
      </div>

      <ol className="space-y-5">
        {(['clarity', 'care', 'continuity'] as const).map((principle, index) => (
          <li key={principle}>
            <Reveal delay={index * 0.08} className="flex gap-4">
              <span aria-hidden="true" className="shrink-0 pt-1 font-mono text-[11px] text-accent">
                0{index + 1}
              </span>

              <div className="min-w-0">
                <h4 className="mb-1 font-sans text-sm font-medium leading-6 text-ink">
                  {t(`${principle}.title`)}
                </h4>
                <p className="font-sans text-sm leading-6 text-muted">{t(`${principle}.description`)}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>

      <Link href="/#projects" className="group/link interactive-link mt-6 inline-flex text-sm text-accent">
        <LinkLabel>{t('projects')}</LinkLabel>
      </Link>
    </section>
  )
}
