# Notification emails setup

Goodies uses **Resend** to send transactional emails (order confirmations, gift links, employee invitations, etc.). Configure the following for production.

## Environment variables

Add to `.env.local` (and your production env, e.g. Vercel):

```env
# Resend API key (required for sending emails in production)
RESEND_API_KEY=re_xxxxxxxxxxxx

# Sender identity — use a verified domain in Resend for production
EMAIL_FROM="Goodies <hello@goodies.so>"

# Optional: reply-to address for support
# REPLY_TO=support@goodies.so

# App URL (used in email links)
NEXT_PUBLIC_APP_URL=https://goodies.so
```

## Resend setup

1. Sign up at [resend.com](https://resend.com).
2. Create an API key in the dashboard and set `RESEND_API_KEY`.
3. **Verify your domain** (e.g. `goodies.so`) in Resend so you can send from `hello@goodies.so` or `noreply@goodies.so`. Until then, you can use Resend’s sandbox domain (`onboarding@resend.dev`) for testing only.
4. Set `EMAIL_FROM` to your verified sender (e.g. `Goodies <hello@goodies.so>`).

## Emails sent by the platform

| Event | Function | Purpose |
|-------|----------|---------|
| Order confirmation | `sendOrderConfirmationEmail` | After an order is placed |
| Gift link to recipient | `sendGiftLinkEmail` | Campaign: recipient chooses gift |
| Gift selection confirmed | `sendGiftConfirmationEmail` | After recipient submits choice |
| Employee invitation | `sendEmployeeInvitationEmail` | Invite with set-password link |
| Campaign notification | `sendCampaignNotificationEmail` | Notify recipient of a gift |

## Development

If `RESEND_API_KEY` is not set, the app still runs: email payloads are logged to the console and the functions return success so flows don’t break. Set the key in production to actually send mail.

## Optional: reply-to

To set a reply-to address for all outgoing emails, add to `lib/email-notifications.ts` in the `fetch` body:

```ts
reply_to: process.env.REPLY_TO || undefined,
```

Then set `REPLY_TO=support@goodies.so` (or your support address) in the environment.
