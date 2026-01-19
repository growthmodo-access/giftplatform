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

/**
 * Send email notification
 * In production, this should call Supabase Edge Function or external service (SendGrid, Resend, etc.)
 */
export async function sendEmailNotification(notification: EmailNotification): Promise<{ success: boolean; error?: string }> {
  try {
    // TODO: Implement actual email sending
    // Option 1: Supabase Edge Function
    // const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-email`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    //   },
    //   body: JSON.stringify(notification),
    // })

    // Option 2: External service (Resend, SendGrid, etc.)
    // const response = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     from: 'noreply@goodies.so',
    //     to: notification.to,
    //     subject: notification.subject,
    //     html: notification.html,
    //   }),
    // })

    // For now, just log (in production, implement actual sending)
    if (process.env.NODE_ENV === 'development') {
      console.log('Email notification:', notification)
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
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://goodies.so'}/gifts">View your gift</a></p>
    </div>
  `

  return sendEmailNotification({
    to: email,
    subject: `You've Received a Gift from ${campaignName}`,
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
