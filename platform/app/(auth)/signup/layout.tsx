import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Sign up',
  description: 'Create your GiftPro account. Start sending corporate gifts and swag globally in minutes.',
  path: 'signup',
  noIndex: true,
})

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
