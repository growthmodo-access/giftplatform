'use server'

import { headers } from 'next/headers'
import { z } from 'zod'
import { sendContactInquiryEmail } from '@/lib/email-notifications'
import { checkContactRateLimit, recordContactSubmission } from '@/lib/rate-limit-contact'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: z.string().email('Invalid email'),
  phone: z.string().max(50).optional(),
  company: z.string().max(200).optional(),
  topic: z.string().max(100).optional(),
  message: z.string().min(1, 'Message is required').max(5000),
})

export type ContactFormState = { error?: string; success?: boolean }

export async function submitContactForm(_prev: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const parsed = contactSchema.safeParse({
    name: formData.get('name')?.toString()?.trim(),
    email: formData.get('email')?.toString()?.trim(),
    phone: formData.get('phone')?.toString()?.trim() || undefined,
    company: formData.get('company')?.toString()?.trim() || undefined,
    topic: formData.get('topic')?.toString()?.trim() || undefined,
    message: formData.get('message')?.toString()?.trim(),
  })

  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors
    const msg = first.name?.[0] ?? first.email?.[0] ?? first.message?.[0] ?? 'Please check your entries.'
    return { error: msg }
  }

  const ip =
    (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() ||
    (await headers()).get('x-real-ip') ||
    'unknown'

  const rate = checkContactRateLimit(ip)
  if (!rate.allowed) {
    return {
      error: `Too many submissions. Please try again in ${Math.ceil((rate.retryAfter ?? 3600) / 60)} minutes.`,
    }
  }

  const result = await sendContactInquiryEmail({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    company: parsed.data.company,
    topic: parsed.data.topic ?? 'other',
    message: parsed.data.message,
  })

  if (!result.success) {
    return { error: result.error ?? 'Failed to send message. Please try again or email us directly.' }
  }

  recordContactSubmission(ip)
  return { success: true }
}
