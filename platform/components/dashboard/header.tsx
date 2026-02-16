'use client'

import { useState } from 'react'
import { Search, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchDialog } from './search-dialog'
import { cn } from '@/lib/utils'

interface HeaderProps {
  onOpenMobileMenu?: () => void
}

export function Header({ onOpenMobileMenu }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="h-14 lg:h-16 bg-white/95 backdrop-blur-sm sm:bg-white sm:backdrop-blur-none border-b border-border/20 sticky top-0 z-30 shrink-0">
      <div className="h-full pl-3 pr-3 sm:pl-5 sm:pr-6 lg:px-6 flex items-center justify-between gap-3 min-w-0">
        {/* Mobile: menu button (opens sidebar) - in header so it doesn't overlay content */}
        {onOpenMobileMenu && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenMobileMenu}
            className="lg:hidden h-10 w-10 rounded-none hover:bg-muted/50 shrink-0"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}
        {/* Search - opens command palette */}
        <div className={cn('max-w-md', onOpenMobileMenu ? 'hidden md:flex flex-1' : 'flex-1')}>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="relative w-full flex items-center gap-2 pl-10 pr-4 py-2.5 h-10 rounded-none border border-border/50 bg-muted/40 text-left text-sm text-muted-foreground hover:bg-muted/60 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-w-0"
            aria-label="Search pages (opens with ⌘K)"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none shrink-0" />
            <span className="truncate">Search products, orders, employees...</span>
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
          className="md:hidden h-10 w-10 rounded-none hover:bg-muted/60"
          aria-label="Search pages"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="w-5 h-5" />
        </Button>
      </div>
    </header>
  )
}
