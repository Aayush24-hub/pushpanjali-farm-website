import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/auth'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = { title: 'Admin | Pushpanjali Farm', robots: { index: false } }

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession()
  if (!session?.user) redirect('/admin/login')

  return (
    <div className="flex min-h-svh flex-col bg-cream md:flex-row">
      <AdminSidebar email={session.user.email} />
      <main className="min-w-0 flex-1 px-4 py-8 md:px-10 md:py-10">{children}</main>
      <Toaster position="top-center" />
    </div>
  )
}
