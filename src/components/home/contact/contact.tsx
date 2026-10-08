import { useTranslations } from 'next-intl'
import { Section } from '@/components/ui/motion/animated-section'
import { HomeSocialLinks } from '../social-links'
import { ContactForm } from './form/contact-form'
import { ContactEmail } from './contact-email'
import { ConstructionFrame } from '@/components/layout/construction/construction-frame'
import { TextGuides } from '@/components/layout/construction/text-guides'
import { ParallaxTitle } from '@/components/ui/typography/parallax-title'
import { FadeIn } from '@/components/ui/motion/fade-in'

export function Contact() {
  const t = useTranslations('Contact')
  return (
    <Section id="contact" className="pb-16">
      <div className="relative isolate grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
        <ConstructionFrame variant="cards" columns="split-lg" />
        <FadeIn>
          <p className="eyebrow mb-5">{t('eyebrow')}</p>
          <ParallaxTitle title={t('title')} highlight={t('highlight')} />
          <TextGuides className="mb-7 mt-5 max-w-md leading-7 text-muted"><p>
            {t('description')}
          </p></TextGuides>
          <ContactEmail />
          <HomeSocialLinks className="mt-6" />
        </FadeIn>
        <FadeIn delay={0.08}><ContactForm /></FadeIn>
      </div>
    </Section>
  )
}
