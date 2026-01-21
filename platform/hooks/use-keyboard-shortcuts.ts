'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useKeyboardShortcuts() {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger shortcuts when not typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return
      }

      // Cmd/Ctrl + K for search (common pattern)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        // Focus search if available, or navigate to search page
        const searchInput = document.querySelector('input[type="search"], input[placeholder*="Search" i]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      }

      // Cmd/Ctrl + N for new/create (context-aware)
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault()
        const pathname = window.location.pathname
        
        // Context-aware navigation
        if (pathname.includes('/products')) {
          const button = document.querySelector('button:has-text("Add Product"), button[aria-label*="Add Product" i]') as HTMLButtonElement
          button?.click()
        } else if (pathname.includes('/employees')) {
          const button = document.querySelector('button:has-text("Add Employee"), button[aria-label*="Add Employee" i]') as HTMLButtonElement
          button?.click()
        } else if (pathname.includes('/campaigns')) {
          const button = document.querySelector('button:has-text("Create Campaign"), button[aria-label*="Create Campaign" i]') as HTMLButtonElement
          button?.click()
        } else if (pathname.includes('/orders')) {
          const button = document.querySelector('button:has-text("New Order"), button[aria-label*="New Order" i]') as HTMLButtonElement
          button?.click()
        }
      }

      // Escape to close modals/dialogs
      if (e.key === 'Escape') {
        // This will be handled by individual dialogs
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router])
}
