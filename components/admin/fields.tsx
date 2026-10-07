'use client'

import Image from 'next/image'
import { useId, useRef, useState } from 'react'
import { ImagePlus, Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { uploadImage } from '@/lib/upload-image'
import type { Localized } from '@/lib/content-types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className="mb-8">
      <h1 className="font-serif text-3xl font-semibold text-olive">{title}</h1>
      {description && <p className="mt-1 text-ink/70">{description}</p>}
    </header>
  )
}

export function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[var(--radius-card)] bg-offwhite p-5 shadow-soft md:p-6">
      <h2 className="mb-5 font-serif text-lg font-semibold text-olive">{title}</h2>
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  )
}

export function TextField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
}) {
  const id = useId()
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 bg-white"
      />
    </div>
  )
}

export function BilingualField({
  label,
  value,
  onChange,
  multiline = false,
  rows = 5,
}: {
  label: string
  value: Localized
  onChange: (v: Localized) => void
  multiline?: boolean
  rows?: number
}) {
  const id = useId()
  const Field = multiline ? Textarea : Input
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-sm font-medium">{label}</legend>
      <div className="grid gap-3 md:grid-cols-2">
        {(['ne', 'en'] as const).map((l) => (
          <div key={l} className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-${l}`} className="text-xs text-ink/60">
              {l === 'ne' ? 'नेपाली' : 'English'}
            </Label>
            <Field
              id={`${id}-${l}`}
              lang={l}
              value={value[l]}
              rows={multiline ? rows : undefined}
              onChange={(e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) =>
                onChange({ ...value, [l]: e.target.value })
              }
              className={multiline ? 'bg-white leading-relaxed' : 'h-11 bg-white'}
            />
          </div>
        ))}
      </div>
    </fieldset>
  )
}

export function ImageField({
  label,
  value,
  fallback,
  onChange,
}: {
  label: string
  value: string | null
  fallback: string
  onChange: (url: string | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)

  async function onFile(file: File | undefined) {
    if (!file) return
    setBusy(true)
    try {
      const { url } = await uploadImage(file, 'site')
      onChange(url)
      toast.success('Image uploaded — remember to save.')
    } catch (e) {
      console.error(e)
      toast.error('Upload failed.')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-sage-light sm:w-48">
          <Image src={value || fallback} alt="" fill sizes="192px" className="object-cover" />
          {!value && (
            <span className="absolute bottom-1 left-1 rounded bg-ink/70 px-1.5 py-0.5 text-[11px] text-cream">
              Default
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="sr-only"
            tabIndex={-1}
            onChange={(e) => onFile(e.target.files?.[0])}
          />
          <Button type="button" variant="outline" disabled={busy} onClick={() => inputRef.current?.click()}>
            {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <ImagePlus className="size-4" aria-hidden />}
            {value ? 'Replace' : 'Upload'}
          </Button>
          {value && (
            <Button type="button" variant="ghost" onClick={() => onChange(null)}>
              <Trash2 className="size-4" aria-hidden />
              Use default
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export function SaveBar({ pending, onSave }: { pending: boolean; onSave: () => void }) {
  return (
    <div className="sticky bottom-0 -mx-4 mt-6 flex justify-end border-t border-sage-light bg-cream/95 px-4 py-4 backdrop-blur md:-mx-10 md:px-10">
      <Button type="button" onClick={onSave} disabled={pending} className="h-11 min-w-32">
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
        Save changes
      </Button>
    </div>
  )
}
