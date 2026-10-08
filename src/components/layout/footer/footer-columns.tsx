import { useTranslations } from 'next-intl'
import { socialLinks, ResumeIcon, EmailIcon } from '@/data/social'
import { Wordmark } from '../navigation/wordmark'
import { FooterGroup } from './footer-group'
import { FooterLink } from './footer-link'

export function FooterColumns() {
  const t = useTranslations('Footer')
  const navigation = useTranslations('Navigation')
  const contact = useTranslations('Contact')
  const pages = [
    { href: '/', label: t('home') },
    { href: '/#about', label: navigation('about') },
    { href: '/#projects', label: navigation('projects') },
    { href: '/posts', label: navigation('posts') },
  ]

  return (
    <div className="grid gap-10 lg:grid-cols-[1.35fr_3.2fr]">
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:col-start-2 lg:row-start-1" data-footer-links>
        <FooterGroup title={t('navigation')}>
          {pages.map(({ href, label }) => (
            <li key={href}>
              <FooterLink href={href} internal>
                {label}
              </FooterLink>
            </li>
          ))}
        </FooterGroup>
        <FooterGroup title={t('social')}>
          {socialLinks.map(({ href, label, icon }) => (
            <li key={label}>
              <FooterLink href={href} icon={icon}>
                {label}
              </FooterLink>
            </li>
          ))}
        </FooterGroup>
        <FooterGroup title={t('contact')} className="col-span-2 sm:col-span-1">
          <li>
            <FooterLink href="mailto:mateus.fneiva@gmail.com" icon={EmailIcon}>
              {contact('email')}
            </FooterLink>
          </li>
          <li>
            <FooterLink href="/resume.pdf" icon={ResumeIcon}>
              {contact('resume')}
            </FooterLink>
          </li>
        </FooterGroup>
      </div>
      <div className="lg:col-start-1 lg:row-start-1" data-footer-identity>
        <Wordmark />
        <p className="heading-feature mt-5">Mateus Neiva</p>
        <p className="mt-1 font-serif text-sm text-muted">{t('role')}</p>
        <p className="mt-5 max-w-xs font-serif text-sm leading-6 text-muted">{t('note')}</p>
      </div>
    </div>
  )
}
