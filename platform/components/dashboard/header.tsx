'use client'

import { Search, Bell, User, Settings } from 'lucide-react'
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

interface HeaderProps {
  userName: string
  userEmail: string
  userInitials: string
}

export function Header({ userName, userEmail, userInitials }: HeaderProps) {
  const handleSearchFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Could add search functionality here
  }

  return (
    <header className="h-14 lg:h-16 bg-background/95 backdrop-blur-sm border-b border-border/50 sticky top-0 z-30">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
        {/* Search - hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none group-focus-within:text-foreground transition-colors" />
              <Input
              type="search"
              placeholder="Search products, orders, employees..."
              className="pl-10 pr-16 h-9 bg-muted/50 border-border/50 focus:bg-background focus:border-border transition-all placeholder:text-muted-foreground"
              onFocus={handleSearchFocus}
            />
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium text-muted-foreground bg-background border border-border/50 rounded">
              <span className="text-[10px]">⌘</span>K
            </kbd>
          </div>
        </div>
        
        {/* Mobile search button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-9 w-9 hover:bg-muted"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </Button>
        
        {/* Right side actions */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 hover:bg-muted"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-background animate-pulse"></span>
          </Button>
          
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
                  <User className="w-4 h-4 mr-2.5 text-muted-foreground" />
                  <span className="text-sm">Profile</span>
                </Link>
              </DropdownMenuItem>
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
