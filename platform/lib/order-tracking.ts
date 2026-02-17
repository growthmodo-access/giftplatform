/**
 * Returns the tracking URL: use custom trackingUrl if provided and valid, else build from tracking number via 17track.
 */
export function getOrderTrackingLink(trackingNumber: string | null | undefined, trackingUrl: string | null | undefined): string | null {
  if (trackingUrl && trackingUrl.trim().startsWith('http')) return trackingUrl.trim()
  if (trackingNumber && trackingNumber.trim()) {
    const num = encodeURIComponent(trackingNumber.trim())
    return `https://www.17track.net/en/track?nums=${num}`
  }
  return null
}

/** @deprecated Use getOrderTrackingLink for orders that may have tracking_url */
export function getTrackingUrl(trackingNumber: string): string {
  const num = encodeURIComponent(trackingNumber.trim())
  return `https://www.17track.net/en/track?nums=${num}`
}
