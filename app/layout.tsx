import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Noto_Sans_Devanagari, Noto_Serif_Devanagari, Playfair_Display } from 'next/font/google'
import { cookies } from 'next/headers'
import { getAllContent } from '@/lib/content'
import { DEFAULT_LOGO, DEFAULT_SITE } from '@/lib/content-types'
import './globals.css'

const notoSans = Noto_Sans_Devanagari({
  subsets: ['devanagari', 'latin'],
  weight: ['400', '500', '600'],
  variable: '--font-noto-sans',
  display: 'swap',
})
const notoSerif = Noto_Serif_Devanagari({
  subsets: ['devanagari', 'latin'],
  weight: ['500', '600', '700'],
  variable: '--font-noto-serif',
  display: 'swap',
})
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  // Falls back to the official defaults if the database is unreachable.
  const { site } = await getAllContent().catch(() => ({ site: DEFAULT_SITE }))
  const ne = site.siteTitle.ne || site.farmName.ne
  const en = site.siteTitle.en || site.farmName.en
  const icon = site.logo || DEFAULT_LOGO

  return {
    title: `${ne} | ${en}`,
    description: `${en} — poultry and fish farming in Kailali, Nepal. ${ne}, कैलाली — कुखुरा पालन र माछा पालन।`,
    icons: { icon, apple: icon },
    openGraph: {
      title: `${en} | ${ne}`,
      description: 'Poultry and fish farming in Kailali, Nepal.',
      images: [site.heroImage || '/images/hero.jpg'],
    },
  }
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#4a5527',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const lang = (await cookies()).get('lang')?.value === 'en' ? 'en' : 'ne'
  return (
    <html
      lang={lang}
      className={`${notoSans.variable} ${notoSerif.variable} ${inter.variable} ${playfair.variable} bg-offwhite`}
    >
      <body className="font-sans text-ink antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
