/**
 * Returns a URL to track a shipment by tracking number.
 * Uses 17track which supports many carriers; can be replaced with carrier-specific URLs if needed.
 */
export function getTrackingUrl(trackingNumber: string): string {
  const num = encodeURIComponent(trackingNumber.trim())
  return `https://www.17track.net/en/track?nums=${num}`
}
