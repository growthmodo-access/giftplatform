/**
 * Indian GST invoice data and HTML generation for a campaign (consolidated).
 * Company GSTIN/tax_id and billing address from companies table.
 */

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const HSN = '999799' // Gifts / promotional material
const CGST_RATE = 9
const SGST_RATE = 9
const PLACE_OF_SUPPLY = 'India'

export type CampaignInvoiceData = {
  campaign: { id: string; name: string }
  company: { name: string; tax_id: string | null; billing_address: unknown }
  invoiceNumber: string
  invoiceDate: string
  placeOfSupply: string
  lineItems: {
    order_number: string
    recipient: string
    product: string
    quantity: number
    rate: number
    amount: number
    hsn: string
  }[]
  subtotal: number
  cgstRate: number
  sgstRate: number
  cgstAmount: number
  sgstAmount: number
  total: number
  currency: string
}

export async function getCampaignInvoiceData(campaignId: string): Promise<{ data: CampaignInvoiceData | null; error: string }> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) redirect('/login')

    const { data: u } = await supabase.from('users').select('role, company_id').eq('id', user.id).single()
    const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'HR', 'MANAGER']
    if (!u || !allowedRoles.includes(u.role ?? '')) {
      return { data: null, error: 'Forbidden' }
    }

    const { data: campaign, error: cErr } = await supabase
      .from('campaigns')
      .select('id, name, company_id')
      .eq('id', campaignId)
      .single()
    if (cErr || !campaign) return { data: null, error: 'Campaign not found' }
    if (u.role !== 'SUPER_ADMIN' && campaign.company_id !== u.company_id) {
      return { data: null, error: 'Forbidden' }
    }

    const { data: company, error: coErr } = await supabase
      .from('companies')
      .select('name, tax_id, billing_address')
      .eq('id', campaign.company_id)
      .single()
    if (coErr || !company) return { data: null, error: 'Company not found' }

    const { data: recipients } = await supabase
      .from('campaign_recipients')
      .select('id, name, email, order_id')
      .eq('campaign_id', campaignId)
    const orderIds = [...new Set((recipients ?? []).map((r) => r.order_id).filter(Boolean))] as string[]
    if (orderIds.length === 0) {
      return {
        data: {
          campaign: { id: campaign.id, name: campaign.name },
          company: { name: company.name, tax_id: company.tax_id, billing_address: company.billing_address },
          invoiceNumber: `INV-C-${campaignId.slice(0, 8)}-${Date.now().toString(36).toUpperCase()}`,
          invoiceDate: new Date().toISOString().slice(0, 10),
          placeOfSupply: PLACE_OF_SUPPLY,
          lineItems: [],
          subtotal: 0,
          cgstRate: CGST_RATE,
          sgstRate: SGST_RATE,
          cgstAmount: 0,
          sgstAmount: 0,
          total: 0,
          currency: 'INR',
        },
        error: '',
      }
    }

    const { data: orders } = await supabase.from('orders').select('id, order_number, total, currency').in('id', orderIds)
    const { data: orderItems } = await supabase
      .from('order_items')
      .select('order_id, product_id, quantity, price')
      .in('order_id', orderIds)
    const productIds = [...new Set((orderItems ?? []).map((i) => i.product_id))]
    const { data: products } = await supabase.from('products').select('id, name').in('id', productIds)
    const productMap = new Map((products ?? []).map((p) => [p.id, p.name]))
    const recipientByOrder = new Map((recipients ?? []).filter((r) => r.order_id).map((r) => [r.order_id, r]))

    const lineItems: CampaignInvoiceData['lineItems'] = []
    let subtotal = 0
    const currency = (orders ?? [])[0]?.currency ?? 'INR'
    for (const order of orders ?? []) {
      const rec = recipientByOrder.get(order.id)
      const items = (orderItems ?? []).filter((i) => i.order_id === order.id)
      for (const item of items) {
        const amount = item.quantity * item.price
        subtotal += amount
        lineItems.push({
          order_number: order.order_number,
          recipient: rec?.name ?? rec?.email ?? '—',
          product: productMap.get(item.product_id) ?? 'Product',
          quantity: item.quantity,
          rate: item.price,
          amount,
          hsn: HSN,
        })
      }
    }
    const cgstAmount = (subtotal * CGST_RATE) / 100
    const sgstAmount = (subtotal * SGST_RATE) / 100
    const total = subtotal + cgstAmount + sgstAmount

    const data: CampaignInvoiceData = {
      campaign: { id: campaign.id, name: campaign.name },
      company: { name: company.name, tax_id: company.tax_id, billing_address: company.billing_address },
      invoiceNumber: `INV-C-${campaignId.slice(0, 8)}-${Date.now().toString(36).toUpperCase()}`,
      invoiceDate: new Date().toISOString().slice(0, 10),
      placeOfSupply: PLACE_OF_SUPPLY,
      lineItems,
      subtotal,
      cgstRate: CGST_RATE,
      sgstRate: SGST_RATE,
      cgstAmount,
      sgstAmount,
      total,
      currency,
    }
    return { data, error: '' }
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : 'Failed to generate invoice data' }
  }
}

function formatAddress(addr: unknown): string {
  if (!addr || typeof addr !== 'object') return '—'
  const a = addr as Record<string, unknown>
  const parts = [
    a.street,
    a.city,
    a.state,
    a.country,
    a.zip_code,
  ].filter(Boolean)
  return parts.join(', ') || '—'
}

export function renderCampaignInvoiceHtml(d: CampaignInvoiceData): string {
  const gstin = d.company.tax_id || '—'
  const billingAddr = formatAddress(d.company.billing_address)
  const symbol = d.currency === 'INR' ? '₹' : '$'

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Invoice - ${d.campaign.name}</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12px; color: #222; max-width: 800px; margin: 24px auto; padding: 0 16px; }
    h1 { font-size: 18px; margin-bottom: 8px; }
    .meta { margin-bottom: 20px; color: #555; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background: #f5f5f5; font-weight: 600; }
    .text-right { text-align: right; }
    .totals { margin-top: 16px; margin-left: auto; width: 280px; }
    .totals tr { border: none; }
    .totals td { border: none; padding: 4px 0; }
    .totals .total-row { font-weight: 700; font-size: 14px; border-top: 1px solid #222; padding-top: 8px; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <h1>Tax Invoice</h1>
  <div class="meta">
    <strong>Invoice No:</strong> ${d.invoiceNumber} &nbsp;|&nbsp;
    <strong>Date:</strong> ${d.invoiceDate} &nbsp;|&nbsp;
    <strong>Place of supply:</strong> ${d.placeOfSupply}
  </div>
  <p><strong>Seller / Billed by</strong><br/>
  ${d.company.name}<br/>
  ${billingAddr}<br/>
  <strong>GSTIN:</strong> ${gstin}
  </p>
  <table>
    <thead>
      <tr>
        <th>Order #</th>
        <th>Recipient</th>
        <th>Product</th>
        <th>HSN</th>
        <th class="text-right">Qty</th>
        <th class="text-right">Rate</th>
        <th class="text-right">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${d.lineItems.map((row) => `
      <tr>
        <td>${row.order_number}</td>
        <td>${row.recipient}</td>
        <td>${row.product}</td>
        <td>${row.hsn}</td>
        <td class="text-right">${row.quantity}</td>
        <td class="text-right">${symbol}${row.rate.toLocaleString()}</td>
        <td class="text-right">${symbol}${row.amount.toLocaleString()}</td>
      </tr>
      `).join('')}
    </tbody>
  </table>
  <table class="totals">
    <tr><td>Subtotal</td><td class="text-right">${symbol}${d.subtotal.toLocaleString()}</td></tr>
    <tr><td>CGST @ ${d.cgstRate}%</td><td class="text-right">${symbol}${d.cgstAmount.toLocaleString()}</td></tr>
    <tr><td>SGST @ ${d.sgstRate}%</td><td class="text-right">${symbol}${d.sgstAmount.toLocaleString()}</td></tr>
    <tr class="total-row"><td>Total</td><td class="text-right">${symbol}${d.total.toLocaleString()}</td></tr>
  </table>
  <p style="margin-top: 24px; font-size: 11px; color: #666;">
    Campaign: ${d.campaign.name}. This is a consolidated invoice for the above orders.
  </p>
</body>
</html>
  `.trim()
}
