import { cookies } from 'next/headers'
import { getAllContent, getPublishedGallery } from '@/lib/content'
import { FALLBACK_IMAGES } from '@/lib/content-types'
import { LanguageProvider } from '@/components/site/language-provider'
import { SiteHeader } from '@/components/site/site-header'
import { Hero } from '@/components/site/hero'
import { StorySection } from '@/components/site/story-section'
import { GallerySection } from '@/components/site/gallery-section'
import { ContactSection } from '@/components/site/contact-section'
import { SiteFooter } from '@/components/site/site-footer'

export default async function HomePage() {
  const [{ site, farm, contact }, gallery, cookieStore] = await Promise.all([
    getAllContent(),
    getPublishedGallery(),
    cookies(),
  ])
  const lang = cookieStore.get('lang')?.value === 'en' ? 'en' : 'ne'

  return (
    <LanguageProvider initial={lang}>
      <SiteHeader farmName={site.farmName} />
      <main>
        <Hero site={site} />
        <StorySection id="about" titleKey="aboutTitle" body={farm.about} image={farm.aboutImage || FALLBACK_IMAGES.about} />
        <StorySection
          id="poultry"
          titleKey="poultryTitle"
          body={farm.poultry}
          image={farm.poultryImage || FALLBACK_IMAGES.poultry}
          reverse
          tone="cream"
        />
        <StorySection id="fish" titleKey="fishTitle" body={farm.fish} image={farm.fishImage || FALLBACK_IMAGES.fish} />
        <GallerySection items={gallery} />
        <ContactSection contact={contact} />
      </main>
      <SiteFooter farmName={site.farmName} contact={contact} />
    </LanguageProvider>
  )
}
