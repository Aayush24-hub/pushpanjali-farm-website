import 'server-only'
import { asc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { galleryItems, siteContent } from '@/lib/db/schema'
import {
  DEFAULT_CONTACT,
  DEFAULT_FARM,
  DEFAULT_SITE,
  type ContactInfo,
  type FarmInfo,
  type GalleryCategory,
  type GalleryItem,
  type SiteSettings,
} from '@/lib/content-types'

export async function getAllContent() {
  const rows = await db.select().from(siteContent)
  const map = new Map(rows.map((r) => [r.key, r.value as Record<string, unknown>]))
  return {
    site: { ...DEFAULT_SITE, ...(map.get('site') ?? {}) } as SiteSettings,
    farm: { ...DEFAULT_FARM, ...(map.get('farm') ?? {}) } as FarmInfo,
    contact: { ...DEFAULT_CONTACT, ...(map.get('contact') ?? {}) } as ContactInfo,
  }
}

type Row = typeof galleryItems.$inferSelect

function toItem(r: Row): GalleryItem {
  return {
    id: r.id,
    url: r.pathname,
    width: r.width,
    height: r.height,
    category: r.category as GalleryCategory,
    caption: { ne: r.captionNe, en: r.captionEn },
    displayOrder: r.displayOrder,
    published: r.published,
  }
}

export async function getPublishedGallery() {
  const rows = await db
    .select()
    .from(galleryItems)
    .where(eq(galleryItems.published, true))
    .orderBy(asc(galleryItems.displayOrder), asc(galleryItems.id))
  return rows.map(toItem)
}

export async function getAllGallery() {
  const rows = await db
    .select()
    .from(galleryItems)
    .orderBy(asc(galleryItems.displayOrder), asc(galleryItems.id))
  return rows.map(toItem)
}
