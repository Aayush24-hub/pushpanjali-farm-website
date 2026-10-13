import { getAllGallery } from '@/lib/content'
import { PageHeader } from '@/components/admin/fields'
import { GalleryManager } from '@/components/admin/gallery-manager'

export default async function AdminGalleryPage() {
  const items = await getAllGallery()
  return (
    <>
      <PageHeader title="Gallery" description="Upload, caption, reorder, hide or delete photos." />
      <GalleryManager items={items} />
    </>
  )
}
