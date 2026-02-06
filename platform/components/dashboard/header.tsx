'use client'

import { useState } from 'react'
import { Search, Settings } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { SearchDialog } from './search-dialog'

interface HeaderProps {
  userName: string
  userEmail: string
  userInitials: string
}

export function Header({ userName, userEmail, userInitials }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="h-14 lg:h-16 bg-white/95 backdrop-blur-md border-b border-black/[0.06] sticky top-0 z-30">
      <div className="h-full pl-2 pr-4 sm:px-4 lg:px-6 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
        {/* Search - opens command palette */}
        <div className="hidden md:flex flex-1 max-w-md">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="relative w-full flex items-center gap-2 pl-10 pr-4 py-2 h-9 rounded-md border border-border/50 bg-muted/50 text-left text-sm text-muted-foreground hover:bg-muted transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Search pages (opens with ⌘K)"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
            <span>Search products, orders, employees...</span>
            <kbd className="hidden lg:inline-flex ml-auto items-center gap-0.5 px-1.5 py-0.5 text-xs font-medium text-muted-foreground bg-background border border-border/50 rounded">
              ⌘K
            </kbd>
          </button>
        </div>
        <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
        
        {/* Mobile search button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-9 w-9 hover:bg-muted"
          aria-label="Search pages"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="w-5 h-5" />
        </Button>
        
        {/* Right side actions */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-9 px-2 gap-2 hover:bg-muted"
              >
                <Avatar className="w-8 h-8 border border-border">
                  <AvatarFallback className="bg-muted text-foreground text-sm font-medium">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden lg:inline text-sm font-medium text-foreground truncate max-w-[120px]">
                  {userName}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border-border/50">
              <div className="px-3 py-2.5 border-b border-border/50">
                <p className="text-sm font-semibold text-foreground truncate">{userName}</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{userEmail}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer focus:bg-muted">
                <Link href="/settings" className="flex items-center w-full">
                  <Settings className="w-4 h-4 mr-2.5 text-muted-foreground" />
                  <span className="text-sm">Settings</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
