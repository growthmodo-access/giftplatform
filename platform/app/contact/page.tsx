'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production: send to API or email service (e.g. Resend, SendGrid)
    setSubmitted(true)
    setName('')
    setEmail('')
    setCompany('')
    setMessage('')
  }

  return (
    <div className="min-h-screen gradient-landing overflow-x-hidden">
      <header className="border-b border-[#F8F3EC]/50 bg-white/60 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">
            <Image src="/logogoodies.png" alt="Goodies Logo" width={180} height={90} className="h-8 sm:h-10 w-auto object-contain" unoptimized />
          </Link>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-4">
            <Link href="/#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">
              Pricing
            </Link>
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">
              Login
            </Link>
            <Button asChild className="gradient-button text-white">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <Card className="border border-[#F8F3EC]/50 gradient-card shadow-primary-lg">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl sm:text-3xl font-semibold text-foreground">Contact us</CardTitle>
            <CardDescription className="text-muted-foreground">
              Have a question or want to talk about your gifting needs? We&apos;d love to hear from you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="py-8 text-center">
                <p className="text-foreground font-medium mb-2">Thanks for reaching out!</p>
                <p className="text-sm text-muted-foreground mb-6">We&apos;ll get back to you within 1–2 business days.</p>
                <Button variant="outline" asChild>
                  <Link href="/">Back to home</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="border-border/50 focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-border/50 focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company (optional)</Label>
                  <Input
                    id="company"
                    type="text"
                    placeholder="Company name"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="border-border/50 focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="How can we help?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={4}
                    className="border-border/50 focus-visible:ring-2 focus-visible:ring-primary resize-none"
                  />
                </div>
                <Button type="submit" className="w-full gradient-button text-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                  Send message
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
        <p className="text-center text-sm text-muted-foreground mt-8">
          Prefer email? Reach us at{' '}
          <a href="mailto:hello@goodies.so" className="text-foreground font-medium hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">
            hello@goodies.so
          </a>
        </p>
      </main>
    </div>
  )
}
