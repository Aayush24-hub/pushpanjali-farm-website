'use client'

import Image from 'next/image'
import { t } from '@/lib/i18n'
import { FALLBACK_IMAGES, pick, type SiteSettings } from '@/lib/content-types'
import { useLang } from './language-provider'

export function Hero({ site }: { site: SiteSettings }) {
  const { lang } = useLang()
  const description = pick(site.heroDescription, lang)

  return (
    <section id="home" className="relative isolate flex min-h-[92svh] items-end overflow-hidden md:items-center">
      <Image
        src={site.heroImage || FALLBACK_IMAGES.hero}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-dark/85 via-forest-dark/50 to-forest-dark/30" />

      <div className="mx-auto w-full max-w-6xl px-4 pt-28 pb-16 md:px-6 md:pb-24">
        <div className="max-w-2xl animate-fade-up">
          <p className="mb-4 inline-flex items-center gap-2 text-sm font-medium tracking-wide text-sage-light uppercase">
            <span aria-hidden className="h-px w-8 bg-earth-light" />
            {t('eyebrow', lang)}
          </p>
          <h1 className="text-balance font-serif text-4xl leading-tight font-semibold text-cream md:text-6xl">
            {pick(site.farmName, lang)}
          </h1>
          {description && (
            <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-cream/90 md:text-xl">
              {description}
            </p>
          )}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#gallery"
              className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-btn)] bg-cream px-6 font-medium text-olive shadow-soft transition hover:-translate-y-0.5 hover:bg-offwhite hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth-light"
            >
              {t('viewGallery', lang)}
            </a>
            <a
              href="#contact"
              className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-btn)] border border-cream/70 px-6 font-medium text-cream transition hover:-translate-y-0.5 hover:bg-cream/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth-light"
            >
              {t('contactUs', lang)}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
