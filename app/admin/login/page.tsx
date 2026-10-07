import type { Metadata } from 'next'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { getAdminSession, hasAdminAccount } from '@/lib/auth'
import { LoginForm } from '@/components/admin/login-form'

export const metadata: Metadata = { title: 'Admin login | Pushpanjali Farm', robots: { index: false } }

export default async function AdminLoginPage() {
  const session = await getAdminSession()
  if (session?.user) redirect('/admin')
  const exists = await hasAdminAccount()

  return (
    <main className="flex min-h-svh items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-sm rounded-[var(--radius-card)] bg-offwhite p-8 shadow-lift">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="relative size-20 overflow-hidden rounded-full ring-1 ring-sage">
            <Image src="/logo.jpeg" alt="Farm logo" fill sizes="80px" className="object-contain" priority />
          </span>
          <h1 className="font-serif text-2xl font-semibold text-olive">
            {exists ? 'Admin login' : 'Create admin account'}
          </h1>
          <p className="text-sm text-ink/70">
            {exists
              ? 'Sign in to manage the website.'
              : 'No admin exists yet. The first account created becomes the only admin.'}
          </p>
        </div>
        <LoginForm mode={exists ? 'sign-in' : 'sign-up'} />
      </div>
    </main>
  )
}
