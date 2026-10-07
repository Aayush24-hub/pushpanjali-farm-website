import { getAllContent } from '@/lib/content'
import { PageHeader } from '@/components/admin/fields'
import { SiteSettingsEditor } from '@/components/admin/content-editors'

export default async function AdminSettingsPage() {
  const { site } = await getAllContent()
  return (
    <>
      <PageHeader title="Site Settings" description="Farm name and the hero banner." />
      <SiteSettingsEditor initial={site} />
    </>
  )
}
