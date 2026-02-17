'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { siteConfig } from '@/lib/site'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Phone, MapPin, Clock, Instagram, Facebook } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const inquiryTopics = [
  { value: 'sales', label: 'Sales — Get a quote or demo' },
  { value: 'support', label: 'Support — Help with my account' },
  { value: 'partnership', label: 'Partnership — Collaborate with Goodies' },
  { value: 'other', label: 'Other' },
]

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [topic, setTopic] = useState<string>('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSubmitted(true)
      setName('')
      setEmail('')
      setPhone('')
      setCompany('')
      setTopic('')
      setMessage('')
    } catch (err) {
      throw err
    }
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <header className="border-b border-black/[0.06] bg-white/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">
            <Image src="/logogoodies.png" alt={siteConfig.name} width={180} height={90} className="h-8 sm:h-10 w-auto object-contain" unoptimized />
          </Link>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-4">
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">
              About
            </Link>
            <Link href="/#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">
              Pricing
            </Link>
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">
              Login
            </Link>
            <Button asChild className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2.5 text-sm font-semibold">
              <Link href="/contact">Talk to sales</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24 w-full min-w-0">
        {/* Intro */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-3">
            Get in touch
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Have a question, need a custom quote, or want to see how {siteConfig.name} can help your team? Fill out the form below or reach us directly. We typically respond within 1–2 business days.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 w-full min-w-0">
          {/* Contact details card */}
          <div className="lg:col-span-1 space-y-6 order-2 lg:order-1">
            <Card className="border border-black/[0.06] shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Contact details</CardTitle>
                <CardDescription>Reach us by email, phone, or follow us on socials.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex gap-3">
                  <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <a href={`mailto:${siteConfig.supportEmail}`} className="text-sm text-muted-foreground hover:text-primary transition-colors break-all">
                      {siteConfig.supportEmail}
                    </a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Phone</p>
                    <a href={`tel:${siteConfig.supportPhone.replace(/\s/g, '')}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {siteConfig.supportPhone}
                    </a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Location</p>
                    <p className="text-sm text-muted-foreground">India · Shipping to 100+ countries</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Response time</p>
                    <p className="text-sm text-muted-foreground">Within 1–2 business days</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-border/50">
                  <p className="text-sm font-medium text-foreground mb-2">Follow us</p>
                  <div className="flex gap-3">
                    <a
                      href={siteConfig.links.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                    <a
                      href={siteConfig.links.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      aria-label="Facebook"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <Card className="border border-black/[0.06] shadow-xl w-full min-w-0">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">Send a message</CardTitle>
                <CardDescription>
                  Tell us what you need—we&apos;ll get back with a custom quote or next steps.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="py-10 text-center">
                    <p className="text-foreground font-semibold text-lg mb-2">Thanks for reaching out!</p>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                      We&apos;ll get back to you within 1–2 business days at the email you provided.
                    </p>
                    <Button asChild variant="outline" className="rounded-xl">
                      <Link href="/">Back to home</Link>
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone (optional)</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
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
                    </div>
                    <div className="space-y-2">
                      <Label>What&apos;s this about?</Label>
                      <Select value={topic} onValueChange={setTopic}>
                        <SelectTrigger className="border-border/50 focus:ring-2 focus:ring-primary">
                          <SelectValue placeholder="Select a topic" />
                        </SelectTrigger>
                        <SelectContent>
                          {inquiryTopics.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="How can we help? Share your gifting needs, team size, or questions."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={4}
                        className="border-border/50 focus-visible:ring-2 focus-visible:ring-primary resize-none"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full sm:w-auto rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 text-base font-medium"
                    >
                      Send message
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
