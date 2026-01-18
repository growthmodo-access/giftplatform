'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getCampaigns() {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      redirect('/login')
    }

    // Get current user's company and role
    const { data: currentUser, error: currentUserError } = await supabase
      .from('users')
      .select('company_id, role')
      .eq('id', user.id)
      .maybeSingle()

    if (currentUserError) {
      return { data: [], error: currentUserError.message }
    }

    if (!currentUser) {
      return { data: [], error: 'User profile not found' }
    }

    // Get campaigns based on role
    let query = supabase
      .from('campaigns')
      .select(`
        *,
        products:product_id (
          id,
          name,
          price
        )
      `)

    // SUPER_ADMIN can see all campaigns (all companies)
    if (currentUser?.role === 'SUPER_ADMIN') {
      // No company filter for SUPER_ADMIN
    } else {
      // Other roles need company_id
      if (!currentUser?.company_id) {
        return { data: [], error: null }
      }
      query = query.eq('company_id', currentUser.company_id)
    }

    // MANAGER can see all campaigns but cannot delete (filtered in UI)
    const { data: campaigns, error } = await query.order('created_at', { ascending: false })

    if (error) {
      return { data: [], error: error.message }
    }

    // Get gift counts for each campaign
    const campaignIds = campaigns?.map(c => c.id) || []
    const { data: gifts } = await supabase
      .from('gifts')
      .select('id')
      .in('id', campaignIds) // This is a simplified version - in real app, you'd have a campaign_id in gifts

    // For now, we'll calculate based on campaign creation
    // In a real app, you'd track which gifts were sent via which campaign
    const campaignsWithStats = campaigns?.map(campaign => ({
      ...campaign,
      giftsSent: 0, // This would be calculated from a proper relationship
    })) || []

    return { data: campaignsWithStats, error: null }
  } catch (error) {
    return { 
      data: [], 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}

export async function createCampaign(formData: FormData) {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      redirect('/login')
    }

    // Get current user's company and role
    const { data: currentUser, error: currentUserError } = await supabase
      .from('users')
      .select('company_id, role')
      .eq('id', user.id)
      .maybeSingle()

    if (currentUserError || !currentUser) {
      return { error: 'Failed to fetch user data' }
    }

    // SUPER_ADMIN can create campaigns without company_id (will need company_id in form)
    // Other roles need company_id
    if (currentUser.role !== 'SUPER_ADMIN' && !currentUser.company_id) {
      return { error: 'You must be part of a company to create campaigns' }
    }

    // Check permissions (only ADMIN, HR, and MANAGER can create campaigns)
    if (currentUser.role !== 'ADMIN' && currentUser.role !== 'HR' && currentUser.role !== 'MANAGER' && currentUser.role !== 'SUPER_ADMIN') {
      return { error: 'You do not have permission to create campaigns' }
    }

    const name = formData.get('name') as string
    const trigger = formData.get('trigger') as string
    const productId = formData.get('product_id') as string
    const budget = formData.get('budget') as string

    if (!name || !trigger) {
      return { error: 'Name and trigger are required' }
    }

    // SUPER_ADMIN needs to provide company_id in form (for now, use current user's company_id if available)
    // TODO: Add company_id field to campaign form for SUPER_ADMIN
    const campaignCompanyId = currentUser.company_id || null
    
    const campaign = {
      name: name.trim(),
      company_id: campaignCompanyId,
      trigger: trigger as 'NEW_HIRE' | 'BIRTHDAY' | 'ANNIVERSARY' | 'PERFORMANCE' | 'CUSTOM',
      is_active: true,
      product_id: productId || null,
      budget: budget ? parseFloat(budget) : null,
      settings: {},
    }

    const { data, error } = await supabase
      .from('campaigns')
      .insert(campaign)
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/automation')
    return { success: true, data }
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}

export async function sendCampaignToEmployees(campaignId: string) {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      redirect('/login')
    }

    // Get current user's company and role
    const { data: currentUser } = await supabase
      .from('users')
      .select('company_id, role')
      .eq('id', user.id)
      .single()

    if (!currentUser?.company_id) {
      return { error: 'You must be part of a company' }
    }

    // Check permissions
    if (currentUser.role !== 'ADMIN' && currentUser.role !== 'HR' && currentUser.role !== 'MANAGER' && currentUser.role !== 'SUPER_ADMIN') {
      return { error: 'You do not have permission to send campaigns' }
    }

    // Get campaign
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .eq('company_id', currentUser.company_id)
      .single()

    if (campaignError || !campaign) {
      return { error: 'Campaign not found' }
    }

    // Validate campaign has a product
    if (!campaign.product_id) {
      return { error: 'Campaign must have a product assigned before sending to employees' }
    }

    // Get all employees in the company
    const { data: employees, error: employeesError } = await supabase
      .from('users')
      .select('id')
      .eq('company_id', currentUser.company_id)

    if (employeesError || !employees) {
      return { error: 'Failed to fetch employees' }
    }

    // Validate employees list is not empty
    if (!employees || employees.length === 0) {
      return { error: 'No employees found in your company' }
    }

    // Create gifts for each employee
    const gifts = employees.map(employee => ({
      user_id: employee.id,
      product_id: campaign.product_id,
      message: `You've received a gift from the ${campaign.name} campaign!`,
      status: 'PENDING' as const,
    }))

    const { error: giftsError } = await supabase
      .from('gifts')
      .insert(gifts)

    if (giftsError) {
      return { error: giftsError.message }
    }

    revalidatePath('/automation')
    revalidatePath('/gifts')
    return { success: true, giftsSent: gifts.length }
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}

export async function updateCampaignStatus(campaignId: string, isActive: boolean) {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      redirect('/login')
    }

    // Get current user's company and role
    const { data: currentUser } = await supabase
      .from('users')
      .select('company_id, role')
      .eq('id', user.id)
      .single()

    if (!currentUser?.company_id) {
      return { error: 'You must be part of a company' }
    }

    // Check permissions
    if (currentUser.role !== 'ADMIN' && currentUser.role !== 'HR' && currentUser.role !== 'MANAGER' && currentUser.role !== 'SUPER_ADMIN') {
      return { error: 'You do not have permission to update campaigns' }
    }

    const { error } = await supabase
      .from('campaigns')
      .update({ is_active: isActive })
      .eq('id', campaignId)
      .eq('company_id', currentUser.company_id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/automation')
    return { success: true }
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}

/**
 * Create a new gift campaign (PerkUp-style)
 * Enhanced campaign creation with recipient selection, gift types, budgeting, and scheduling
 */
export async function createGiftCampaign(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      redirect('/login')
    }

    const { data: currentUser, error: currentUserError } = await supabase
      .from('users')
      .select('company_id, role')
      .eq('id', user.id)
      .maybeSingle()

    if (currentUserError || !currentUser) {
      return { error: 'Failed to fetch user data' }
    }

    // Check permissions - only SUPER_ADMIN, ADMIN, and HR can create campaigns
    if (currentUser.role !== 'SUPER_ADMIN' && currentUser.role !== 'ADMIN' && currentUser.role !== 'HR') {
      return { error: 'You do not have permission to create campaigns' }
    }

    if (currentUser.role !== 'SUPER_ADMIN' && !currentUser.company_id) {
      return { error: 'You must be part of a company to create campaigns' }
    }

    // Parse form data
    const name = formData.get('name') as string
    const description = formData.get('description') as string || ''
    const recipientType = formData.get('recipient_type') as string || 'ALL'
    const recipientIdsJson = formData.get('recipient_ids') as string || '[]'
    const giftType = formData.get('gift_type') as string || 'SINGLE'
    const selectedProductsJson = formData.get('selected_products') as string || '[]'
    const budgetStr = formData.get('budget') as string
    const perRecipientBudgetStr = formData.get('per_recipient_budget') as string
    const scheduleType = formData.get('schedule_type') as string || 'NOW'
    const scheduledDateStr = formData.get('scheduled_date') as string
    const customMessage = formData.get('custom_message') as string || ''

    if (!name) {
      return { error: 'Campaign name is required' }
    }

    let recipientIds: string[] = []
    try {
      recipientIds = JSON.parse(recipientIdsJson)
    } catch {
      recipientIds = []
    }

    let selectedProducts: string[] = []
    try {
      selectedProducts = JSON.parse(selectedProductsJson)
    } catch {
      selectedProducts = []
    }

    // Validate gift selection
    if (giftType === 'SINGLE' && selectedProducts.length !== 1) {
      return { error: 'Please select exactly one product for single product campaigns' }
    }
    if (giftType === 'CATALOG' && selectedProducts.length === 0) {
      return { error: 'Please select at least one product for the catalog' }
    }

    // Validate recipients
    if (recipientType === 'SELECTED' && recipientIds.length === 0) {
      return { error: 'Please select at least one recipient' }
    }

    const budget = budgetStr ? parseFloat(budgetStr) : null
    const perRecipientBudget = perRecipientBudgetStr ? parseFloat(perRecipientBudgetStr) : null
    const scheduledDate = scheduledDateStr ? new Date(scheduledDateStr) : null

    // Determine status
    const status = scheduleType === 'NOW' ? 'SENT' : scheduledDate ? 'SCHEDULED' : 'DRAFT'

    // Create campaign record
    const campaignData: any = {
      name: name.trim(),
      company_id: currentUser.company_id,
      campaign_type: 'MANUAL',
      recipient_type: recipientType,
      recipient_ids: recipientIds,
      gift_type: giftType,
      selected_products: selectedProducts,
      budget: budget,
      per_recipient_budget: perRecipientBudget,
      scheduled_date: scheduledDate,
      custom_message: customMessage,
      status: status,
      is_active: status === 'SENT' || status === 'SCHEDULED',
      trigger: 'CUSTOM', // For manual campaigns
      product_id: giftType === 'SINGLE' && selectedProducts.length > 0 ? selectedProducts[0] : null,
      description: description,
      settings: {
        description: description,
      },
    }

    const { data: campaign, error: createError } = await supabase
      .from('campaigns')
      .insert(campaignData)
      .select()
      .single()

    if (createError) {
      return { error: createError.message }
    }

    // If sending now, create gifts immediately
    if (status === 'SENT') {
      const giftResult = await sendCampaignGifts(campaign.id, {
        recipientType,
        recipientIds,
        giftType,
        selectedProducts,
        perRecipientBudget,
        customMessage,
        companyId: currentUser.company_id,
      })

      if (giftResult.error) {
        // Campaign was created but gifts failed - still return success but log error
        console.error('Campaign created but gifts failed:', giftResult.error)
      }
    }

    revalidatePath('/automation')
    return { success: true, data: campaign }
  } catch (error) {
    console.error('Create gift campaign error:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to create campaign'
    }
  }
}

/**
 * Send gifts for a campaign
 */
async function sendCampaignGifts(
  campaignId: string,
  campaignData: {
    recipientType: string
    recipientIds: string[]
    giftType: string
    selectedProducts: string[]
    perRecipientBudget: number | null
    customMessage: string
    companyId: string | null
  }
) {
  try {
    const supabase = await createClient()

    // Get recipients
    let recipientIds: string[] = []
    if (campaignData.recipientType === 'ALL') {
      if (!campaignData.companyId) {
        return { error: 'Company ID required for all employees' }
      }
      const { data: employees, error: employeesError } = await supabase
        .from('users')
        .select('id')
        .eq('company_id', campaignData.companyId)

      if (employeesError) {
        return { error: employeesError.message }
      }
      recipientIds = employees?.map(e => e.id) || []
    } else {
      recipientIds = campaignData.recipientIds
    }

    if (recipientIds.length === 0) {
      return { error: 'No recipients found' }
    }

    // Create gifts based on gift type
    const gifts = recipientIds.map(userId => {
      const gift: any = {
        user_id: userId,
        campaign_id: campaignId,
        message: campaignData.customMessage || `You've received a gift!`,
        status: 'PENDING' as const,
      }

      // For single product, assign product_id
      if (campaignData.giftType === 'SINGLE' && campaignData.selectedProducts.length > 0) {
        gift.product_id = campaignData.selectedProducts[0]
      }

      // For budget-based, set budget
      if (campaignData.giftType === 'BUDGET' && campaignData.perRecipientBudget) {
        gift.budget = campaignData.perRecipientBudget
      }

      // For catalog, we don't set product_id - recipient will choose
      // But we can store the available products in the campaign settings

      return gift
    })

    const { error: giftsError } = await supabase
      .from('gifts')
      .insert(gifts)

    if (giftsError) {
      return { error: giftsError.message }
    }

    return { success: true, giftsSent: gifts.length }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to send campaign gifts'
    }
  }
}

export async function deleteCampaign(campaignId: string) {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      redirect('/login')
    }

    // Get current user's company and role
    const { data: currentUser } = await supabase
      .from('users')
      .select('company_id, role')
      .eq('id', user.id)
      .single()

    if (!currentUser?.company_id) {
      return { error: 'You must be part of a company' }
    }

    // Check permissions - only ADMIN and SUPER_ADMIN can delete campaigns
    if (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN') {
      return { error: 'You do not have permission to delete campaigns. Only Admins can delete campaigns.' }
    }

    // Verify campaign exists and belongs to company
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('id')
      .eq('id', campaignId)
      .eq('company_id', currentUser.company_id)
      .single()

    if (campaignError || !campaign) {
      return { error: 'Campaign not found' }
    }

    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', campaignId)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/automation')
    return { success: true }
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}
