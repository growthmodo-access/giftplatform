import Link from 'next/link'
import Image from 'next/image'
import { siteConfig } from '@/lib/site'
import { Button } from '@/components/ui/button'
import { ArrowRight, Gift, Globe, Shield, Heart, Mail, Instagram, Facebook } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <header className="border-b border-border/20 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
            aria-label={`${siteConfig.name} home`}
          >
            <Image
              src="/logogoodies.png"
              alt={siteConfig.name}
              width={180}
              height={90}
              className="h-8 sm:h-10 w-auto object-contain"
              unoptimized
            />
          </Link>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-4">
            <Link href="/#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded px-2 py-1">
              Pricing
            </Link>
            <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded px-2 py-1">
              Contact
            </Link>
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded px-2 py-1">
              Login
            </Link>
            <Button asChild className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2.5 text-sm font-semibold">
              <Link href="/contact">Talk to sales</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 w-full min-w-0">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
        >
          ← Back to home
        </Link>

        {/* Hero */}
        <section className="mb-14 sm:mb-18">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
            About us
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
            We&apos;re building the simplest way for companies to send gifts at scale—without spreadsheets, vendor chaos, or last-minute panic.
          </p>
        </section>

        {/* What we do */}
        <section className="mb-14 sm:mb-18">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-6">What we do</h2>
          <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed mb-6">
            {siteConfig.name} is a corporate gifting platform that helps HR and operations teams send gifts to employees, clients, and partners—globally. We handle selection, customization, storage, shipping, and tracking in one place so you can focus on your team and your business.
          </p>
          <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed">
            We&apos;re built in India and ship to 100+ locations. Whether you&apos;re sending welcome kits to new hires, rewards to top performers, or thank-you gifts to clients, we make it predictable and visible.
          </p>
        </section>

        {/* Why we exist */}
        <section className="mb-14 sm:mb-18">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-6">Why we exist</h2>
          <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed mb-8">
            Corporate gifting should be simple. In practice it often means outdated address lists, endless vendor coordination, and zero visibility. We built {siteConfig.name} so that sending 10 gifts or 10,000 feels the same—one platform, one workflow, full control.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="list">
            {[
              { icon: Gift, title: 'One platform', text: 'Gifting, swag, addresses, approvals, and delivery in one place.' },
              { icon: Globe, title: 'Global reach', text: 'Ship to 100+ countries with tracking and customs handled.' },
              { icon: Shield, title: 'Brand control', text: 'Your branding, your rules—consistent and on time.' },
              { icon: Heart, title: 'Built for people', text: 'Gifts people actually want, with a experience that scales.' },
            ].map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4 p-4 rounded-xl bg-muted/40 border border-border/50">
                <Icon className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Get in touch + social */}
        <section className="rounded-2xl bg-muted/30 border border-border/50 p-8 sm:p-10">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">Get in touch</h2>
          <p className="text-muted-foreground mb-6 max-w-xl">
            Questions, want a demo, or ready to simplify your gifting? We&apos;d love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3.5 text-base font-medium w-full sm:w-auto">
              <Link href="/contact" className="inline-flex items-center gap-2">
                Contact us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <a
                href={`mailto:${siteConfig.supportEmail}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
                {siteConfig.supportEmail}
              </a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-border/50 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Follow us:</span>
            <a
              href={siteConfig.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-background border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href={siteConfig.links.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-background border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}
