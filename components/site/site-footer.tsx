'use client'

import Image from 'next/image'
import { NAV, t } from '@/lib/i18n'
import { pick, type ContactInfo, type Localized } from '@/lib/content-types'
import { useLang } from './language-provider'
import { SocialLinks } from './social-links'

export function SiteFooter({ farmName, contact }: { farmName: Localized; contact: ContactInfo }) {
  const { lang } = useLang()
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-forest-dark text-cream">
      <div aria-hidden className="paper-grain pointer-events-none absolute inset-0" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-14 md:flex-row md:justify-between md:px-6">
        <div className="flex items-center gap-4">
          <span className="relative size-16 shrink-0 overflow-hidden rounded-full bg-offwhite">
            <Image src="/logo.jpeg" alt="" fill sizes="64px" className="object-contain" />
          </span>
          <div>
            <p className="font-serif text-xl font-semibold">{pick(farmName, lang)}</p>
            <p className="text-sm text-sage-light">{t('eyebrow', lang)}</p>
          </div>
        </div>

        <nav aria-label={t('quickLinks', lang)}>
          <p className="mb-3 text-sm font-medium text-sage-light">{t('quickLinks', lang)}</p>
          <ul className="grid grid-cols-2 gap-x-8 gap-y-2">
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} className="text-cream/85 hover:text-cream">
                  {n[lang]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <SocialLinks contact={contact} />
        </div>
      </div>
      <div className="relative border-t border-cream/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-sm text-cream/60 md:px-6">
          {'© '}
          {year} {pick(farmName, lang)}
        </p>
      </div>
    </footer>
  )
}
