/**
 * Email notification utilities
 * Integrates with Supabase Edge Functions or external email service
 */

export interface EmailNotification {
  to: string
  subject: string
  html: string
  text?: string
}

const RESEND_API_URL = 'https://api.resend.com/emails'
const FROM_EMAIL = process.env.EMAIL_FROM ?? 'Goodies <onboarding@resend.dev>'
const REPLY_TO = process.env.REPLY_TO ?? undefined

function getAppUrl(): string {
  const { getAppBaseUrl } = require('@/lib/site')
  return getAppBaseUrl()
}

/**
 * Send email notification via Resend when RESEND_API_KEY is set; otherwise log in dev.
 */
export async function sendEmailNotification(notification: EmailNotification): Promise<{ success: boolean; error?: string }> {
  try {
    const apiKey = process.env.RESEND_API_KEY
    if (apiKey) {
      const response = await fetch(RESEND_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: notification.to,
          subject: notification.subject,
          html: notification.html,
          text: notification.text,
          ...(REPLY_TO && { reply_to: REPLY_TO }),
        }),
      })
      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        return {
          success: false,
          error: (err as { message?: string }).message ?? response.statusText,
        }
      }
      return { success: true }
    }
    if (process.env.NODE_ENV === 'development') {
      console.log('Email notification (no RESEND_API_KEY):', notification)
    }
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    }
  }
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(
  email: string,
  orderNumber: string,
  orderDetails: { product: string; amount: string; status: string }
): Promise<{ success: boolean; error?: string }> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Order Confirmation</h2>
      <p>Your order has been placed successfully!</p>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>Product:</strong> ${orderDetails.product}</p>
        <p><strong>Amount:</strong> ${orderDetails.amount}</p>
        <p><strong>Status:</strong> ${orderDetails.status}</p>
      </div>
      <p>You will receive another email when your order ships.</p>
    </div>
  `

  return sendEmailNotification({
    to: email,
    subject: `Order Confirmation - ${orderNumber}`,
    html,
  })
}

/**
 * Send campaign notification email
 */
export async function sendCampaignNotificationEmail(
  email: string,
  campaignName: string,
  giftDetails: { product: string; message?: string }
): Promise<{ success: boolean; error?: string }> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>You've Received a Gift! 🎁</h2>
      <p>You've been selected to receive a gift from the <strong>${campaignName}</strong> campaign!</p>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Gift:</strong> ${giftDetails.product}</p>
        ${giftDetails.message ? `<p><strong>Message:</strong> ${giftDetails.message}</p>` : ''}
      </div>
      <p><a href="${getAppUrl()}/gifts">View your gift</a></p>
    </div>
  `

  return sendEmailNotification({
    to: email,
    subject: `You've Received a Gift from ${campaignName}`,
    html,
  })
}

/**
 * Send gift link email to a campaign recipient (CSV flow). Link is valid until campaign's link_valid_until.
 */
export async function sendGiftLinkEmail(
  email: string,
  recipientName: string,
  campaignName: string,
  giftLinkUrl: string,
  expiresText?: string
): Promise<{ success: boolean; error?: string }> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>You've been selected for a gift! 🎁</h2>
      <p>Hi ${recipientName || 'there'},</p>
      <p>You've been invited to choose a gift from the <strong>${campaignName}</strong> campaign.</p>
      <div style="text-align: center; margin: 28px 0;">
        <a href="${giftLinkUrl}" style="background: #7B61FF; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600;">
          Choose your gift
        </a>
      </div>
      ${expiresText ? `<p style="color: #666; font-size: 14px;">${expiresText}</p>` : ''}
      <p style="color: #666; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:<br/><a href="${giftLinkUrl}">${giftLinkUrl}</a></p>
    </div>
  `
  return sendEmailNotification({
    to: email,
    subject: `Choose your gift from ${campaignName}`,
    html,
  })
}

/**
 * Send gift selection confirmation email after recipient submits their choice.
 */
export async function sendGiftConfirmationEmail(
  email: string,
  recipientName: string,
  orderNumber: string,
  productName: string
): Promise<{ success: boolean; error?: string }> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Your gift selection is confirmed</h2>
      <p>Hi ${recipientName || 'there'},</p>
      <p>We've received your gift selection.</p>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Order:</strong> ${orderNumber}</p>
        <p><strong>Gift:</strong> ${productName}</p>
      </div>
      <p>We'll process your order and notify you when it ships.</p>
    </div>
  `
  return sendEmailNotification({
    to: email,
    subject: `Gift confirmed - ${orderNumber}`,
    html,
  })
}

/**
 * Send employee invitation email
 */
export async function sendEmployeeInvitationEmail(
  email: string,
  inviterName: string,
  companyName: string,
  resetLink: string
): Promise<{ success: boolean; error?: string }> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>You've Been Invited!</h2>
      <p><strong>${inviterName}</strong> has invited you to join <strong>${companyName}</strong> on Goodies.so.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Accept Invitation & Set Password
        </a>
      </div>
      <p style="color: #666; font-size: 14px;">This link will expire in 24 hours.</p>
    </div>
  `

  return sendEmailNotification({
    to: email,
    subject: `You've been invited to join ${companyName}`,
    html,
  })
}
