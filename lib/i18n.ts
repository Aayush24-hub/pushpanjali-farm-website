import type { Lang } from '@/lib/content-types'

export const NAV = [
  { id: 'home', ne: 'होम', en: 'Home' },
  { id: 'about', ne: 'हाम्रो बारेमा', en: 'About Us' },
  { id: 'poultry', ne: 'कुखुरा पालन', en: 'Poultry Farming' },
  { id: 'fish', ne: 'माछा पालन', en: 'Fish Farming' },
  { id: 'gallery', ne: 'फोटो ग्यालरी', en: 'Gallery' },
  { id: 'contact', ne: 'सम्पर्क', en: 'Contact' },
] as const

const STRINGS = {
  eyebrow: { ne: 'कैलाली, नेपाल', en: 'Kailali, Nepal' },
  viewGallery: { ne: 'फोटो ग्यालरी हेर्नुहोस्', en: 'View Gallery' },
  contactUs: { ne: 'सम्पर्क गर्नुहोस्', en: 'Contact Us' },
  aboutTitle: { ne: 'हाम्रो बारेमा', en: 'About Us' },
  poultryTitle: { ne: 'कुखुरा पालन', en: 'Poultry Farming' },
  fishTitle: { ne: 'माछा पालन', en: 'Fish Farming' },
  galleryTitle: { ne: 'फोटो ग्यालरी', en: 'Photo Gallery' },
  galleryEmpty: { ne: 'अहिलेसम्म कुनै फोटो छैन।', en: 'No photos yet.' },
  contactTitle: { ne: 'सम्पर्क', en: 'Contact' },
  address: { ne: 'ठेगाना', en: 'Address' },
  phone: { ne: 'फोन', en: 'Phone' },
  email: { ne: 'इमेल', en: 'Email' },
  follow: { ne: 'हामीलाई पछ्याउनुहोस्', en: 'Follow us' },
  quickLinks: { ne: 'छिटो लिंकहरू', en: 'Quick links' },
  menu: { ne: 'मेनु', en: 'Menu' },
  close: { ne: 'बन्द गर्नुहोस्', en: 'Close' },
  previous: { ne: 'अघिल्लो', en: 'Previous' },
  next: { ne: 'अर्को', en: 'Next' },
  mapTitle: { ne: 'नक्सा', en: 'Map' },
  contactPending: {
    ne: 'सम्पर्क विवरण चाँडै थपिनेछ।',
    en: 'Contact details will be added soon.',
  },
  catAll: { ne: 'सबै', en: 'All' },
  catPoultry: { ne: 'कुखुरा पालन', en: 'Poultry' },
  catFish: { ne: 'माछा पालन', en: 'Fish Farming' },
  catFarm: { ne: 'फार्म', en: 'Farm' },
  catOther: { ne: 'अन्य', en: 'Other' },
} satisfies Record<string, Record<Lang, string>>

export type StringKey = keyof typeof STRINGS

export function t(key: StringKey, lang: Lang) {
  return STRINGS[key][lang]
}

export const CATEGORY_LABEL_KEY = {
  poultry: 'catPoultry',
  fish: 'catFish',
  farm: 'catFarm',
  other: 'catOther',
} as const
