'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchDialog } from './search-dialog'

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="h-14 lg:h-16 bg-white/95 backdrop-blur-sm sm:bg-white sm:backdrop-blur-none border-b border-transparent sm:border-border/50 sticky top-0 z-30 shrink-0">
      <div className="h-full pl-[58px] pr-4 sm:pl-5 sm:pr-6 lg:px-6 flex items-center justify-between gap-3 min-w-0">
        {/* Search - opens command palette */}
        <div className="hidden md:flex flex-1 max-w-md">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="relative w-full flex items-center gap-2 pl-10 pr-4 py-2.5 h-10 rounded-lg border border-border/60 bg-muted/40 text-left text-sm text-muted-foreground hover:bg-muted/60 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Search pages (opens with ⌘K)"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
            <span>Search products, orders, employees...</span>
            <kbd className="hidden lg:inline-flex ml-auto items-center gap-0.5 px-1.5 py-0.5 text-xs font-medium text-muted-foreground bg-background border border-border/60 rounded">
              ⌘K
            </kbd>
          </button>
        </div>
        <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />

        {/* Mobile search button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-10 w-10 rounded-lg hover:bg-muted/60"
          aria-label="Search pages"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="w-5 h-5" />
        </Button>
      </div>
    </header>
  )
}
