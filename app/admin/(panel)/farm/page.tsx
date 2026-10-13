import { getAllContent } from '@/lib/content'
import { PageHeader } from '@/components/admin/fields'
import { FarmInfoEditor } from '@/components/admin/content-editors'

export default async function AdminFarmPage() {
  const { farm } = await getAllContent()
  return (
    <>
      <PageHeader title="Farm Info" description="Text and images for the About, Poultry and Fish sections." />
      <FarmInfoEditor initial={farm} />
    </>
  )
}
