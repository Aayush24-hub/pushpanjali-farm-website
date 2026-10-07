'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { saveContactInfo, saveFarmInfo, saveSiteSettings } from '@/app/actions/admin'
import { FALLBACK_IMAGES, type ContactInfo, type FarmInfo, type SiteSettings } from '@/lib/content-types'
import { BilingualField, ImageField, Panel, SaveBar, TextField } from './fields'

function useSave<T>(action: (v: T) => Promise<{ ok: boolean; error?: string }>) {
  const [pending, start] = useTransition()
  return {
    pending,
    save: (value: T) =>
      start(async () => {
        const res = await action(value)
        if (res.ok) toast.success('Saved')
        else toast.error(res.error ?? 'Could not save')
      }),
  }
}

export function SiteSettingsEditor({ initial }: { initial: SiteSettings }) {
  const [v, setV] = useState(initial)
  const { pending, save } = useSave(saveSiteSettings)
  return (
    <>
      <div className="flex flex-col gap-6">
        <Panel title="Branding">
          <BilingualField label="Farm name" value={v.farmName} onChange={(farmName) => setV({ ...v, farmName })} />
        </Panel>
        <Panel title="Hero">
          <BilingualField
            label="Hero description"
            value={v.heroDescription}
            onChange={(heroDescription) => setV({ ...v, heroDescription })}
            multiline
            rows={3}
          />
          <ImageField
            label="Hero image"
            value={v.heroImage}
            fallback={FALLBACK_IMAGES.hero}
            onChange={(heroImage) => setV({ ...v, heroImage })}
          />
        </Panel>
      </div>
      <SaveBar pending={pending} onSave={() => save(v)} />
    </>
  )
}

export function FarmInfoEditor({ initial }: { initial: FarmInfo }) {
  const [v, setV] = useState(initial)
  const { pending, save } = useSave(saveFarmInfo)
  const sections = [
    { key: 'about', img: 'aboutImage', title: 'About us', fallback: FALLBACK_IMAGES.about },
    { key: 'poultry', img: 'poultryImage', title: 'Poultry farming', fallback: FALLBACK_IMAGES.poultry },
    { key: 'fish', img: 'fishImage', title: 'Fish farming', fallback: FALLBACK_IMAGES.fish },
  ] as const

  return (
    <>
      <div className="flex flex-col gap-6">
        {sections.map((s) => (
          <Panel key={s.key} title={s.title}>
            <BilingualField
              label="Text (leave a blank line between paragraphs)"
              value={v[s.key]}
              onChange={(text) => setV({ ...v, [s.key]: text })}
              multiline
              rows={7}
            />
            <ImageField
              label="Section image"
              value={v[s.img]}
              fallback={s.fallback}
              onChange={(url) => setV({ ...v, [s.img]: url })}
            />
          </Panel>
        ))}
      </div>
      <SaveBar pending={pending} onSave={() => save(v)} />
    </>
  )
}

export function ContactEditor({ initial }: { initial: ContactInfo }) {
  const [v, setV] = useState(initial)
  const { pending, save } = useSave(saveContactInfo)
  const set = (k: keyof ContactInfo) => (val: string) => setV({ ...v, [k]: val })

  return (
    <>
      <div className="flex flex-col gap-6">
        <Panel title="Contact details">
          <BilingualField
            label="Address"
            value={v.address}
            onChange={(address) => setV({ ...v, address })}
            multiline
            rows={3}
          />
          <div className="grid gap-5 md:grid-cols-2">
            <TextField label="Phone" type="tel" value={v.phone} onChange={set('phone')} />
            <TextField label="Email" type="email" value={v.email} onChange={set('email')} />
          </div>
          <TextField
            label="Google Maps embed URL"
            value={v.mapUrl}
            onChange={set('mapUrl')}
            placeholder="https://www.google.com/maps/embed?pb=..."
          />
          <p className="-mt-3 text-xs text-ink/60">
            {'In Google Maps: Share → Embed a map → copy only the URL inside src="…".'}
          </p>
        </Panel>
        <Panel title="Social links">
          <div className="grid gap-5 md:grid-cols-2">
            <TextField label="Facebook URL" value={v.facebook} onChange={set('facebook')} />
            <TextField label="Instagram URL" value={v.instagram} onChange={set('instagram')} />
            <TextField label="YouTube URL" value={v.youtube} onChange={set('youtube')} />
            <TextField
              label="WhatsApp number"
              type="tel"
              value={v.whatsapp}
              onChange={set('whatsapp')}
              placeholder="+977 98XXXXXXXX"
            />
          </div>
        </Panel>
      </div>
      <SaveBar pending={pending} onSave={() => save(v)} />
    </>
  )
}
