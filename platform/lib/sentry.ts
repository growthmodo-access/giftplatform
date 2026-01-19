/**
 * Sentry error tracking setup
 * Install: npm install @sentry/nextjs
 * Then run: npx @sentry/wizard@latest -i nextjs
 */

// Uncomment and configure when Sentry is installed
/*
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  debug: process.env.NODE_ENV === 'development',
})
*/

// Helper function to capture errors
export function captureException(error: Error, context?: Record<string, any>) {
  // Uncomment when Sentry is installed
  // Sentry.captureException(error, { extra: context })
  
  // Fallback: log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error captured:', error, context)
  }
}

// Helper function to capture messages
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  // Uncomment when Sentry is installed
  // Sentry.captureMessage(message, level)
  
  // Fallback: log to console in development
  if (process.env.NODE_ENV === 'development') {
    console[level === 'error' ? 'error' : level === 'warning' ? 'warn' : 'log'](message)
  }
}
