/**
 * Get time-based greeting
 */
export function getTimeGreeting(): string {
  const hour = new Date().getHours()
  
  if (hour < 12) {
    return 'Good morning'
  } else if (hour < 17) {
    return 'Good afternoon'
  } else {
    return 'Good evening'
  }
}

/**
 * Get formatted date string
 */
export function getFormattedDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Generate initials from name or email
 */
export function getInitials(name: string | null, email: string): string {
  if (name) {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  return email[0]?.toUpperCase() || 'U'
}
