export type Lang = 'ne' | 'en'
export type Localized = { ne: string; en: string }

export type SiteSettings = {
  farmName: Localized
  heroDescription: Localized
  heroImage: string | null
}

export type FarmInfo = {
  about: Localized
  aboutImage: string | null
  poultry: Localized
  poultryImage: string | null
  fish: Localized
  fishImage: string | null
}

export type ContactInfo = {
  address: Localized
  phone: string
  email: string
  mapUrl: string
  facebook: string
  instagram: string
  youtube: string
  whatsapp: string
}

export const GALLERY_CATEGORIES = ['poultry', 'fish', 'farm', 'other'] as const
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number]

export type GalleryItem = {
  id: number
  url: string
  width: number | null
  height: number | null
  category: GalleryCategory
  caption: Localized
  displayOrder: number
  published: boolean
}

const emptyL: Localized = { ne: '', en: '' }

export const DEFAULT_SITE: SiteSettings = {
  farmName: { ne: 'पुष्पाञ्जली फार्म', en: 'Pushpanjali Farm' },
  heroDescription: emptyL,
  heroImage: null,
}

export const DEFAULT_FARM: FarmInfo = {
  about: emptyL,
  aboutImage: null,
  poultry: emptyL,
  poultryImage: null,
  fish: emptyL,
  fishImage: null,
}

export const DEFAULT_CONTACT: ContactInfo = {
  address: emptyL,
  phone: '',
  email: '',
  mapUrl: '',
  facebook: '',
  instagram: '',
  youtube: '',
  whatsapp: '',
}

export const FALLBACK_IMAGES = {
  hero: '/images/hero.png',
  about: '/images/about.png',
  poultry: '/images/poultry.png',
  fish: '/images/fish.png',
}

export function pick(l: Localized | undefined, lang: Lang) {
  if (!l) return ''
  return l[lang] || l[lang === 'ne' ? 'en' : 'ne'] || ''
}
