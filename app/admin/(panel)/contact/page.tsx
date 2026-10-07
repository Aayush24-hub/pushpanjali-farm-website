import { getAllContent } from '@/lib/content'
import { PageHeader } from '@/components/admin/fields'
import { ContactEditor } from '@/components/admin/content-editors'

export default async function AdminContactPage() {
  const { contact } = await getAllContent()
  return (
    <>
      <PageHeader title="Contact" description="Address, phone, email, map and social links." />
      <ContactEditor initial={contact} />
    </>
  )
}
