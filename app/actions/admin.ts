'use server'

import { revalidatePath } from 'next/cache'
import { del } from '@vercel/blob'
import { eq, sql } from 'drizzle-orm'
import { getAdminSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { galleryItems, siteContent } from '@/lib/db/schema'
import {
  GALLERY_CATEGORIES,
  type ContactInfo,
  type FarmInfo,
  type GalleryCategory,
  type Localized,
  type SiteSettings,
} from '@/lib/content-types'

type Result = { ok: true } | { ok: false; error: string }

async function requireAdmin() {
  const session = await getAdminSession()
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

const str = (v: unknown, max = 5000) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const loc = (v: unknown, max = 5000): Localized => {
  const o = (v ?? {}) as Record<string, unknown>
  return { ne: str(o.ne, max), en: str(o.en, max) }
}

function isBlobUrl(url: unknown): url is string {
  if (typeof url !== 'string') return false
  try {
    const u = new URL(url)
    return u.protocol === 'https:' && u.hostname.endsWith('.public.blob.vercel-storage.com')
  } catch {
    return false
  }
}
const imageOrNull = (v: unknown) => (isBlobUrl(v) ? v : null)

function httpUrl(v: unknown) {
  const s = str(v, 2000)
  if (!s) return ''
  try {
    const u = new URL(s)
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.toString() : ''
  } catch {
    return ''
  }
}

async function saveContent(key: string, value: unknown) {
  await db
    .insert(siteContent)
    .values({ key, value })
    .onConflictDoUpdate({ target: siteContent.key, set: { value, updatedAt: new Date() } })
  revalidatePath('/')
}

export async function saveSiteSettings(input: SiteSettings): Promise<Result> {
  try {
    await requireAdmin()
    const farmName = loc(input.farmName, 120)
    if (!farmName.ne && !farmName.en) return { ok: false, error: 'Farm name is required.' }
    await saveContent('site', {
      farmName,
      heroDescription: loc(input.heroDescription, 600),
      heroImage: imageOrNull(input.heroImage),
    } satisfies SiteSettings)
    return { ok: true }
  } catch (e) {
    console.error('saveSiteSettings', e)
    return { ok: false, error: 'Could not save. Please try again.' }
  }
}

export async function saveFarmInfo(input: FarmInfo): Promise<Result> {
  try {
    await requireAdmin()
    await saveContent('farm', {
      about: loc(input.about),
      aboutImage: imageOrNull(input.aboutImage),
      poultry: loc(input.poultry),
      poultryImage: imageOrNull(input.poultryImage),
      fish: loc(input.fish),
      fishImage: imageOrNull(input.fishImage),
    } satisfies FarmInfo)
    return { ok: true }
  } catch (e) {
    console.error('saveFarmInfo', e)
    return { ok: false, error: 'Could not save. Please try again.' }
  }
}

export async function saveContactInfo(input: ContactInfo): Promise<Result> {
  try {
    await requireAdmin()
    const email = str(input.email, 200)
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: 'Email looks invalid.' }
    await saveContent('contact', {
      address: loc(input.address, 500),
      phone: str(input.phone, 40),
      email,
      mapUrl: httpUrl(input.mapUrl),
      facebook: httpUrl(input.facebook),
      instagram: httpUrl(input.instagram),
      youtube: httpUrl(input.youtube),
      whatsapp: str(input.whatsapp, 30),
    } satisfies ContactInfo)
    return { ok: true }
  } catch (e) {
    console.error('saveContactInfo', e)
    return { ok: false, error: 'Could not save. Please try again.' }
  }
}

const category = (v: unknown): GalleryCategory =>
  GALLERY_CATEGORIES.includes(v as GalleryCategory) ? (v as GalleryCategory) : 'farm'
const dim = (v: unknown) => (Number.isInteger(v) && (v as number) > 0 && (v as number) < 20000 ? (v as number) : null)

export async function addGalleryItem(input: {
  url: string
  width?: number | null
  height?: number | null
  category: string
}): Promise<Result> {
  try {
    await requireAdmin()
    if (!isBlobUrl(input.url)) return { ok: false, error: 'Invalid upload.' }
    const [{ max }] = await db
      .select({ max: sql<number>`coalesce(max(${galleryItems.displayOrder}), 0)` })
      .from(galleryItems)
    await db.insert(galleryItems).values({
      pathname: input.url,
      width: dim(input.width),
      height: dim(input.height),
      category: category(input.category),
      displayOrder: Number(max) + 1,
    })
    revalidatePath('/')
    revalidatePath('/admin')
    return { ok: true }
  } catch (e) {
    console.error('addGalleryItem', e)
    return { ok: false, error: 'Could not add photo.' }
  }
}

export async function updateGalleryItem(input: {
  id: number
  category: string
  caption: Localized
  published: boolean
}): Promise<Result> {
  try {
    await requireAdmin()
    const caption = loc(input.caption, 200)
    await db
      .update(galleryItems)
      .set({
        category: category(input.category),
        captionNe: caption.ne,
        captionEn: caption.en,
        published: Boolean(input.published),
      })
      .where(eq(galleryItems.id, Number(input.id)))
    revalidatePath('/')
    revalidatePath('/admin')
    return { ok: true }
  } catch (e) {
    console.error('updateGalleryItem', e)
    return { ok: false, error: 'Could not save photo.' }
  }
}

export async function reorderGallery(ids: number[]): Promise<Result> {
  try {
    await requireAdmin()
    const clean = ids.map(Number).filter((n) => Number.isInteger(n))
    await db.transaction(async (tx) => {
      for (const [i, id] of clean.entries()) {
        await tx.update(galleryItems).set({ displayOrder: i + 1 }).where(eq(galleryItems.id, id))
      }
    })
    revalidatePath('/')
    revalidatePath('/admin')
    return { ok: true }
  } catch (e) {
    console.error('reorderGallery', e)
    return { ok: false, error: 'Could not reorder.' }
  }
}

export async function deleteGalleryItem(id: number): Promise<Result> {
  try {
    await requireAdmin()
    const [row] = await db.delete(galleryItems).where(eq(galleryItems.id, Number(id))).returning()
    if (row && isBlobUrl(row.pathname)) {
      await del(row.pathname).catch((e) => console.error('blob delete', e))
    }
    revalidatePath('/')
    revalidatePath('/admin')
    return { ok: true }
  } catch (e) {
    console.error('deleteGalleryItem', e)
    return { ok: false, error: 'Could not delete photo.' }
  }
}
