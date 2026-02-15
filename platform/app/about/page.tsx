import Link from 'next/link'
import Image from 'next/image'
import { siteConfig } from '@/lib/site'

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
            <Link
              href="/#pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded px-2 py-1"
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded px-2 py-1"
            >
              Contact
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded px-2 py-1"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2.5 text-sm font-semibold"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 w-full min-w-0">
        <Link
          href="/"
          className="inline-block text-sm font-medium text-muted-foreground hover:text-foreground mb-8 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
        >
          ← Back to home
        </Link>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
          About us
        </h1>
        <p className="text-lg text-muted-foreground mb-10">
          We&apos;re building the simplest way for companies to send gifts at scale.
        </p>

        <div className="prose prose-neutral max-w-none space-y-6 text-foreground">
          <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed">
            {siteConfig.name} is a corporate gifting platform that helps HR and operations teams send gifts to employees, clients, and partners—globally, without the spreadsheets and vendor chaos. We handle selection, customization, storage, shipping, and tracking in one place.
          </p>
          <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed">
            We&apos;re built in India and ship to 100+ locations. Whether you&apos;re sending welcome kits to new hires, rewards to top performers, or thank-you gifts to clients, we make it predictable and visible so you can focus on your team and your business.
          </p>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mt-10 mb-3">
            Why we exist
          </h2>
          <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed">
            Corporate gifting should be simple. In practice it often means outdated address lists, endless vendor coordination, and zero visibility. We built {siteConfig.name} so that sending 10 gifts or 10,000 feels the same—one platform, one workflow, full control.
          </p>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mt-10 mb-3">
            Get in touch
          </h2>
          <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed">
            Questions or want to see how we can help your team?{' '}
            <a href={`mailto:${siteConfig.supportEmail}`} className="text-primary font-medium hover:underline">
              {siteConfig.supportEmail}
            </a>
            {' '}or{' '}
            <a href={`tel:${siteConfig.supportPhone.replace(/\s/g, '')}`} className="text-primary font-medium hover:underline">
              {siteConfig.supportPhone}
            </a>
            . Or{' '}
            <Link href="/contact" className="text-primary font-medium hover:underline">
              send us a message
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  )
}
