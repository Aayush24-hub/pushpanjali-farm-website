'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ExternalLink, Images, LogOut, Phone, Settings, Wheat } from 'lucide-react'
import { cn } from '@/lib/utils'
import { authClient } from '@/lib/auth-client'

const LINKS = [
  { href: '/admin', label: 'Gallery', icon: Images },
  { href: '/admin/farm', label: 'Farm Info', icon: Wheat },
  { href: '/admin/contact', label: 'Contact', icon: Phone },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings },
]

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname()
  const router = useRouter()

  async function signOut() {
    await authClient.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="flex shrink-0 flex-col bg-olive text-cream md:sticky md:top-0 md:h-svh md:w-64">
      <div className="flex items-center gap-3 px-5 py-5">
        <span className="relative size-10 overflow-hidden rounded-full bg-offwhite">
          <Image src="/logo.jpeg" alt="" fill sizes="40px" className="object-contain" />
        </span>
        <div className="min-w-0">
          <p className="font-serif font-semibold">Farm Admin</p>
          <p className="truncate text-xs text-sage-light">{email}</p>
        </div>
      </div>

      <nav aria-label="Admin" className="overflow-x-auto px-3 md:flex-1">
        <ul className="flex gap-1 pb-3 md:flex-col md:pb-0">
          {LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium whitespace-nowrap transition-colors',
                    active ? 'bg-cream text-olive' : 'text-cream/85 hover:bg-cream/10',
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="hidden flex-col gap-1 border-t border-cream/15 p-3 md:flex">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 items-center gap-3 rounded-md px-3 text-sm text-cream/85 hover:bg-cream/10"
        >
          <ExternalLink className="size-4" aria-hidden />
          View site
        </a>
        <button
          type="button"
          onClick={signOut}
          className="flex min-h-11 items-center gap-3 rounded-md px-3 text-left text-sm text-cream/85 hover:bg-cream/10"
        >
          <LogOut className="size-4" aria-hidden />
          Sign out
        </button>
      </div>
      <div className="flex gap-2 px-3 pb-3 md:hidden">
        <a href="/" className="text-sm text-cream/85 underline">
          View site
        </a>
        <button type="button" onClick={signOut} className="ml-auto text-sm text-cream/85 underline">
          Sign out
        </button>
      </div>
    </aside>
  )
}
