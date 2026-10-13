import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ContactInfo } from '@/lib/content-types'

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className: 'size-5',
  'aria-hidden': true,
}

function FacebookIcon() {
  return (
    <svg {...iconProps}>
      <path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V10H6.5v3.5H9V21h3.5v-7.5h2.7l.5-3.5h-3.2V7.2c0-.6.4-.9 1-.9H15z" />
    </svg>
  )
}
function InstagramIcon() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
    </svg>
  )
}
function YoutubeIcon() {
  return (
    <svg {...iconProps}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="m10 9.2 5 2.8-5 2.8z" fill="currentColor" />
    </svg>
  )
}

export function safeUrl(url: string) {
  try {
    const u = new URL(url)
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.toString() : null
  } catch {
    return null
  }
}

export function SocialLinks({ contact, className }: { contact: ContactInfo; className?: string }) {
  const whatsappDigits = contact.whatsapp.replace(/[^\d]/g, '')
  const links = [
    { label: 'Facebook', href: safeUrl(contact.facebook), icon: <FacebookIcon /> },
    { label: 'Instagram', href: safeUrl(contact.instagram), icon: <InstagramIcon /> },
    { label: 'YouTube', href: safeUrl(contact.youtube), icon: <YoutubeIcon /> },
    {
      label: 'WhatsApp',
      href: whatsappDigits ? `https://wa.me/${whatsappDigits}` : null,
      icon: <MessageCircle className="size-5" aria-hidden />,
    },
  ].filter((l) => l.href)

  if (links.length === 0) return null

  return (
    <ul className={cn('flex flex-wrap gap-2', className)}>
      {links.map((l) => (
        <li key={l.label}>
          <a
            href={l.href!}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex size-11 items-center justify-center rounded-full bg-cream/10 text-cream ring-1 ring-cream/25 transition hover:bg-cream hover:text-olive"
          >
            {l.icon}
            <span className="sr-only">{l.label}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}
