'use client'

import { Mail, MapPin, Phone } from 'lucide-react'
import { t } from '@/lib/i18n'
import { pick, type ContactInfo } from '@/lib/content-types'
import { useLang } from './language-provider'
import { SectionTitle } from './story-section'
import { Reveal } from './reveal'
import { SocialLinks } from './social-links'

function mapEmbedUrl(url: string) {
  try {
    const u = new URL(url)
    if (u.protocol !== 'https:') return null
    if (!/(^|\.)google\.[a-z.]+$/.test(u.hostname)) return null
    return u.toString()
  } catch {
    return null
  }
}

export function ContactSection({ contact }: { contact: ContactInfo }) {
  const { lang } = useLang()
  const address = pick(contact.address, lang)
  const map = mapEmbedUrl(contact.mapUrl)
  const hasAny = address || contact.phone || contact.email

  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-20 bg-olive py-20 text-cream md:py-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 md:flex-row md:gap-16 md:px-6">
        <Reveal className="md:w-5/12">
          <SectionTitle id="contact-title" light>
            {t('contactTitle', lang)}
          </SectionTitle>

          {hasAny ? (
            <dl className="mt-8 flex flex-col gap-6">
              {address && (
                <ContactRow icon={<MapPin className="size-5" aria-hidden />} label={t('address', lang)}>
                  <span className="whitespace-pre-line">{address}</span>
                </ContactRow>
              )}
              {contact.phone && (
                <ContactRow icon={<Phone className="size-5" aria-hidden />} label={t('phone', lang)}>
                  <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="underline-offset-4 hover:underline">
                    {contact.phone}
                  </a>
                </ContactRow>
              )}
              {contact.email && (
                <ContactRow icon={<Mail className="size-5" aria-hidden />} label={t('email', lang)}>
                  <a href={`mailto:${contact.email}`} className="break-all underline-offset-4 hover:underline">
                    {contact.email}
                  </a>
                </ContactRow>
              )}
            </dl>
          ) : (
            <p className="mt-8 text-cream/75">{t('contactPending', lang)}</p>
          )}

          <SocialLinks contact={contact} className="mt-8" />
        </Reveal>

        <Reveal className="md:w-7/12" delay={100}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-olive-dark ring-1 ring-cream/15">
            {map ? (
              <iframe
                src={map}
                title={t('mapTitle', lang)}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 size-full border-0"
              />
            ) : (
              <div className="flex size-full flex-col items-center justify-center gap-3 text-cream/60">
                <MapPin className="size-10" aria-hidden />
                <span>{t('eyebrow', lang)}</span>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function ContactRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-cream/10 text-earth-light">
        {icon}
      </span>
      <div>
        <dt className="text-sm text-sage-light">{label}</dt>
        <dd className="mt-0.5 text-lg">{children}</dd>
      </div>
    </div>
  )
}
