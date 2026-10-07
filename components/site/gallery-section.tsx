'use client'

import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { ChevronLeft, ChevronRight, ImageOff, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CATEGORY_LABEL_KEY, t } from '@/lib/i18n'
import { GALLERY_CATEGORIES, pick, type GalleryCategory, type GalleryItem } from '@/lib/content-types'
import { useLang } from './language-provider'
import { SectionTitle } from './story-section'
import { Reveal } from './reveal'

type Filter = 'all' | GalleryCategory

export function GallerySection({ items }: { items: GalleryItem[] }) {
  const { lang } = useLang()
  const [filter, setFilter] = useState<Filter>('all')
  const [index, setIndex] = useState<number | null>(null)

  const available = useMemo(
    () => GALLERY_CATEGORIES.filter((c) => items.some((i) => i.category === c)),
    [items],
  )
  const visible = useMemo(
    () => (filter === 'all' ? items : items.filter((i) => i.category === filter)),
    [items, filter],
  )

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="scroll-mt-20 bg-offwhite py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <SectionTitle id="gallery-title" center>
            {t('galleryTitle', lang)}
          </SectionTitle>
        </Reveal>

        {available.length > 1 && (
          <div role="group" aria-label={t('galleryTitle', lang)} className="mt-8 flex flex-wrap justify-center gap-2">
            {(['all', ...available] as Filter[]).map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={cn(
                  'min-h-11 rounded-full px-5 text-sm font-medium transition-colors',
                  filter === f ? 'bg-olive text-cream' : 'bg-sage-light text-olive hover:bg-sage/50',
                )}
              >
                {f === 'all' ? t('catAll', lang) : t(CATEGORY_LABEL_KEY[f], lang)}
              </button>
            ))}
          </div>
        )}

        {visible.length === 0 ? (
          <div className="mt-12 flex flex-col items-center gap-3 rounded-[var(--radius-card)] border border-dashed border-sage py-16 text-ink/60">
            <ImageOff className="size-8" aria-hidden />
            <p>{t('galleryEmpty', lang)}</p>
          </div>
        ) : (
          <ul className="mt-10 columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4">
            {visible.map((item, i) => {
              const caption = pick(item.caption, lang)
              return (
                <li key={item.id} className="mb-3 break-inside-avoid md:mb-4">
                  <button
                    type="button"
                    onClick={() => setIndex(i)}
                    className="group relative block w-full overflow-hidden rounded-[var(--radius-card)] bg-sage-light shadow-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth"
                  >
                    <Image
                      src={item.url}
                      alt={caption || t(CATEGORY_LABEL_KEY[item.category], lang)}
                      width={item.width ?? 800}
                      height={item.height ?? 600}
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                      className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    {caption && (
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-dark/85 to-transparent p-3 pt-8 text-left text-sm text-cream opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                        {caption}
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <Lightbox items={visible} index={index} onIndex={setIndex} />
    </section>
  )
}

function Lightbox({
  items,
  index,
  onIndex,
}: {
  items: GalleryItem[]
  index: number | null
  onIndex: (i: number | null) => void
}) {
  const { lang } = useLang()
  const touchX = useRef<number | null>(null)
  const open = index !== null && items[index] !== undefined
  const item = open ? items[index] : null

  const go = useCallback(
    (dir: 1 | -1) => {
      if (index === null) return
      onIndex((index + dir + items.length) % items.length)
    },
    [index, items.length, onIndex],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, go])

  const caption = item ? pick(item.caption, lang) : ''

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => !o && onIndex(null)}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-forest-dark/95 transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <DialogPrimitive.Popup
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 outline-none md:p-10"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return
            const dx = e.changedTouches[0].clientX - touchX.current
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
            touchX.current = null
          }}
        >
          <DialogPrimitive.Title className="sr-only">{caption || t('galleryTitle', lang)}</DialogPrimitive.Title>
          {item && (
            <figure className="flex max-h-full w-full max-w-5xl flex-col items-center gap-4">
              <div className="relative h-[75svh] w-full">
                <Image
                  key={item.id}
                  src={item.url}
                  alt={caption || t(CATEGORY_LABEL_KEY[item.category], lang)}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
              <figcaption className="flex items-center gap-3 text-center text-cream">
                {caption && <span>{caption}</span>}
                <span className="text-sm text-cream/60">
                  {index! + 1} / {items.length}
                </span>
              </figcaption>
            </figure>
          )}

          <DialogPrimitive.Close className="absolute top-3 right-3 inline-flex size-12 items-center justify-center rounded-full text-cream hover:bg-cream/10">
            <X className="size-6" aria-hidden />
            <span className="sr-only">{t('close', lang)}</span>
          </DialogPrimitive.Close>
          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                className="absolute top-1/2 left-2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-forest-dark/60 text-cream hover:bg-cream/10 md:left-6"
              >
                <ChevronLeft className="size-7" aria-hidden />
                <span className="sr-only">{t('previous', lang)}</span>
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="absolute top-1/2 right-2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-forest-dark/60 text-cream hover:bg-cream/10 md:right-6"
              >
                <ChevronRight className="size-7" aria-hidden />
                <span className="sr-only">{t('next', lang)}</span>
              </button>
            </>
          )}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
