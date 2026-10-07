'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV, t } from '@/lib/i18n'
import { pick, type Localized } from '@/lib/content-types'
import { useLang } from './language-provider'

export function SiteHeader({ farmName }: { farmName: Localized }) {
  const { lang, setLang } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[]
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const solid = scrolled || open

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-colors duration-300',
        solid ? 'bg-offwhite/95 shadow-soft backdrop-blur' : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:h-20 md:px-6">
        <a href="#home" className="flex min-w-0 items-center gap-3" aria-label={pick(farmName, lang)}>
          <span className="relative size-10 shrink-0 overflow-hidden rounded-full bg-offwhite ring-1 ring-sage/60 md:size-12">
            <Image src="/logo.jpeg" alt="" fill sizes="48px" className="object-contain" priority />
          </span>
          <span
            className={cn(
              'truncate font-serif text-lg font-semibold transition-colors md:text-xl',
              solid ? 'text-olive' : 'text-cream',
            )}
          >
            {pick(farmName, lang)}
          </span>
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  aria-current={active === n.id ? 'true' : undefined}
                  className={cn(
                    'relative rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    solid ? 'text-ink hover:text-olive' : 'text-cream/90 hover:text-cream',
                    'after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-earth after:transition-transform',
                    active === n.id && 'after:scale-x-100',
                  )}
                >
                  {n[lang]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LangToggle lang={lang} setLang={setLang} solid={solid} />
          <button
            type="button"
            className={cn(
              'inline-flex size-11 items-center justify-center rounded-md lg:hidden',
              solid ? 'text-olive' : 'text-cream',
            )}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
            <span className="sr-only">{open ? t('close', lang) : t('menu', lang)}</span>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-sage-light bg-offwhite lg:hidden"
      >
        <nav aria-label="Mobile">
          <ul className="flex flex-col px-4 py-4">
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex min-h-12 items-center border-b border-sage-light px-2 font-serif text-lg',
                    active === n.id ? 'text-earth' : 'text-ink',
                  )}
                >
                  {n[lang]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

function LangToggle({
  lang,
  setLang,
  solid,
}: {
  lang: 'ne' | 'en'
  setLang: (l: 'ne' | 'en') => void
  solid: boolean
}) {
  return (
    <div
      role="group"
      aria-label="Language / भाषा"
      className={cn(
        'flex items-center rounded-full p-0.5 text-sm font-medium ring-1',
        solid ? 'ring-sage' : 'ring-cream/50',
      )}
    >
      {(['ne', 'en'] as const).map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={lang === l}
          onClick={() => setLang(l)}
          className={cn(
            'min-h-9 rounded-full px-3 transition-colors',
            lang === l
              ? 'bg-olive text-cream'
              : solid
                ? 'text-ink hover:text-olive'
                : 'text-cream hover:text-cream/80',
          )}
        >
          {l === 'ne' ? 'नेपाली' : 'English'}
        </button>
      ))}
    </div>
  )
}
