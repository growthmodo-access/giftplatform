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

    // Get current user's company
    const { data: currentUser } = await supabase
      .from('users')
      .select('company_id, role')
      .eq('id', user.id)
      .single()

    if (!currentUser?.company_id) {
      return { data: [], error: null }
    }

    // Get all campaigns for the company
    // MANAGER can see all campaigns but cannot delete (filtered in UI)
    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select(`
        *,
        products:product_id (
          id,
          name,
          price
        )
      `)
      .eq('company_id', currentUser.company_id)
      .order('created_at', { ascending: false })

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

    // Get current user's company
    const { data: currentUser } = await supabase
      .from('users')
      .select('company_id, role')
      .eq('id', user.id)
      .single()

    if (!currentUser?.company_id) {
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

    const campaign = {
      name: name.trim(),
      company_id: currentUser.company_id,
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
