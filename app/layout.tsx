import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Noto_Sans_Devanagari, Noto_Serif_Devanagari, Playfair_Display } from 'next/font/google'
import { cookies } from 'next/headers'
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

export const metadata: Metadata = {
  title: 'पुष्पाञ्जली फार्म | Pushpanjali Farm — Kailali, Nepal',
  description:
    'Pushpanjali Farm — poultry and fish farming in Kailali, Nepal. पुष्पाञ्जली फार्म, कैलाली — कुखुरा पालन र माछा पालन।',
  generator: 'v0.app',
  icons: { icon: '/logo.jpeg', apple: '/logo.jpeg' },
  openGraph: {
    title: 'Pushpanjali Farm | पुष्पाञ्जली फार्म',
    description: 'Poultry and fish farming in Kailali, Nepal.',
    images: ['/images/hero.png'],
  },
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
