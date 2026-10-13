'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import { t, type StringKey } from '@/lib/i18n'
import { pick, type Localized } from '@/lib/content-types'
import { useLang } from './language-provider'
import { Reveal } from './reveal'

export function StorySection({
  id,
  titleKey,
  body,
  image,
  reverse = false,
  tone = 'light',
}: {
  id: string
  titleKey: StringKey
  body: Localized
  image: string
  reverse?: boolean
  tone?: 'light' | 'cream'
}) {
  const { lang } = useLang()
  const text = pick(body, lang)
  const paragraphs = text.split(/\n{2,}/).filter(Boolean)

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn('scroll-mt-20 py-20 md:py-28', tone === 'cream' ? 'bg-cream' : 'bg-offwhite')}
    >
      <div
        className={cn(
          'mx-auto flex max-w-6xl flex-col gap-10 px-4 md:items-center md:gap-16 md:px-6',
          reverse ? 'md:flex-row-reverse' : 'md:flex-row',
        )}
      >
        <Reveal className="md:w-1/2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] shadow-lift">
            <Image
              src={image}
              alt={t(titleKey, lang)}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <Reveal className="md:w-1/2" delay={100}>
          <SectionTitle id={`${id}-title`}>{t(titleKey, lang)}</SectionTitle>
          <div className="mt-6 flex max-w-[65ch] flex-col gap-4 text-lg leading-relaxed text-ink/85">
            {paragraphs.map((p, i) => (
              <p key={i} className="whitespace-pre-line text-pretty">
                {p}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function SectionTitle({
  id,
  children,
  light = false,
  center = false,
}: {
  id?: string
  children: React.ReactNode
  light?: boolean
  center?: boolean
}) {
  return (
    <div className={cn('flex flex-col gap-3', center && 'items-center text-center')}>
      <span aria-hidden className="h-1 w-12 rounded-full bg-earth" />
      <h2
        id={id}
        className={cn(
          'text-balance font-serif text-3xl leading-snug font-semibold md:text-4xl',
          light ? 'text-cream' : 'text-olive',
        )}
      >
        {children}
      </h2>
    </div>
  )
}
