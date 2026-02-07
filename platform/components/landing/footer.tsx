import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-muted/40 border-t border-border/60 py-6 sm:py-10 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 w-full max-w-full box-border min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 w-full">
          <div className="flex items-center gap-2">
            <Image
              src="/logogoodies.png"
              alt="Goodies"
              width={200}
              height={100}
              className="h-9 sm:h-10 w-auto max-w-[120px] sm:max-w-[140px] object-contain"
              unoptimized
            />
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-1 text-sm justify-center sm:justify-end">
            <a href="#solutions" className="text-muted-foreground hover:text-foreground transition-colors">Solutions</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</a>
          </nav>
        </div>
        <p className="text-muted-foreground text-xs sm:text-sm mt-6 pt-6 border-t border-border/60 text-center sm:text-left">
          © {new Date().getFullYear()} Goodies.so. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
