import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-[#FAFAFA] border-t border-black/[0.06] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-2">
            <Image
              src="/logogoodies.png"
              alt="Goodies Logo"
              width={240}
              height={120}
              className="h-7 sm:h-8 w-auto object-contain"
              unoptimized
            />
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <a href="#solutions" className="text-muted-foreground hover:text-foreground transition-colors">Solutions</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</a>
          </nav>
        </div>
        <p className="text-muted-foreground text-xs sm:text-sm mt-6 pt-6 border-t border-black/[0.06]">
          © {new Date().getFullYear()} Goodies.so. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
