'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getTeams() {
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
      .maybeSingle()

    if (!currentUser) {
      return { data: [], error: 'User profile not found' }
    }

    // Build query
    let query = supabase
      .from('teams')
      .select(`
        *,
        team_members (
          user_id,
          users:user_id (
            id,
            name,
            email
          )
        )
      `)
      .order('created_at', { ascending: false })

    // SUPER_ADMIN can see all teams
    if (currentUser.role !== 'SUPER_ADMIN' && currentUser.company_id) {
      query = query.eq('company_id', currentUser.company_id)
    }

    const { data: teams, error } = await query

    if (error) {
      return { data: [], error: error.message }
    }

    // Format team data with member counts
    const formattedTeams = teams?.map(team => ({
      id: team.id,
      name: team.name,
      description: team.description,
      company_id: team.company_id,
      member_count: team.team_members?.length || 0,
      members: team.team_members?.map((tm: any) => tm.users) || [],
    })) || []

    return { data: formattedTeams, error: null }
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

export async function createTeam(formData: FormData) {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      redirect('/login')
    }

    const { data: currentUser } = await supabase
      .from('users')
      .select('company_id, role')
      .eq('id', user.id)
      .maybeSingle()

    if (!currentUser) {
      return { error: 'User profile not found' }
    }

    // Check permissions
    const { isCompanyHRDb } = await import('@/lib/roles')
    if (currentUser.role !== 'SUPER_ADMIN' && !isCompanyHRDb(currentUser.role)) {
      return { error: 'You do not have permission to create teams' }
    }

    if (currentUser.role !== 'SUPER_ADMIN' && !currentUser.company_id) {
      return { error: 'You must be part of a company to create teams' }
    }

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const memberIds = formData.get('member_ids') as string

    if (!name) {
      return { error: 'Team name is required' }
    }

    // Create team
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .insert({
        name: name.trim(),
        description: description?.trim() || null,
        company_id: currentUser.company_id,
        created_by: user.id,
      })
      .select()
      .single()

    if (teamError || !team) {
      return { error: teamError?.message || 'Failed to create team' }
    }

    // Add team members if provided
    if (memberIds) {
      try {
        const memberIdsArray = JSON.parse(memberIds) as string[]
        if (memberIdsArray.length > 0) {
          const teamMembers = memberIdsArray.map(userId => ({
            team_id: team.id,
            user_id: userId,
          }))

          const { error: membersError } = await supabase
            .from('team_members')
            .insert(teamMembers)

          if (membersError) {
            // Team created but members failed - still return success
            console.error('Failed to add team members:', membersError)
          }
        }
      } catch (e) {
        // Invalid JSON - continue without members
      }
    }

    revalidatePath('/employees')
    return { success: true, data: team }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

export async function updateTeam(teamId: string, formData: FormData) {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      redirect('/login')
    }

    const { data: currentUser } = await supabase
      .from('users')
      .select('company_id, role')
      .eq('id', user.id)
      .maybeSingle()

    if (!currentUser) {
      return { error: 'User profile not found' }
    }

    // Check permissions
    const { isCompanyHRDb } = await import('@/lib/roles')
    if (currentUser.role !== 'SUPER_ADMIN' && !isCompanyHRDb(currentUser.role)) {
      return { error: 'You do not have permission to update teams' }
    }

    const name = formData.get('name') as string
    const description = formData.get('description') as string

    if (!name) {
      return { error: 'Team name is required' }
    }

    // Build update query
    let query = supabase
      .from('teams')
      .update({
        name: name.trim(),
        description: description?.trim() || null,
      })
      .eq('id', teamId)

    if (currentUser.role !== 'SUPER_ADMIN' && currentUser.company_id) {
      query = query.eq('company_id', currentUser.company_id)
    }

    const { data, error } = await query.select().single()

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/employees')
    return { success: true, data }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

export async function deleteTeam(teamId: string) {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      redirect('/login')
    }

    const { data: currentUser } = await supabase
      .from('users')
      .select('company_id, role')
      .eq('id', user.id)
      .maybeSingle()

    if (!currentUser) {
      return { error: 'User profile not found' }
    }

    // Only ADMIN and SUPER_ADMIN can delete teams
    const { isCompanyHRDb } = await import('@/lib/roles')
    if (currentUser.role !== 'SUPER_ADMIN' && !isCompanyHRDb(currentUser.role)) {
      return { error: 'You do not have permission to delete teams' }
    }

    // Build delete query
    let query = supabase
      .from('teams')
      .delete()
      .eq('id', teamId)

    if (currentUser.role !== 'SUPER_ADMIN' && currentUser.company_id) {
      query = query.eq('company_id', currentUser.company_id)
    }

    const { error } = await query

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/employees')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

export async function addTeamMembers(teamId: string, userIds: string[]) {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      redirect('/login')
    }

    const { data: currentUser } = await supabase
      .from('users')
      .select('company_id, role')
      .eq('id', user.id)
      .maybeSingle()

    if (!currentUser) {
      return { error: 'User profile not found' }
    }

    // Check permissions
    const { isCompanyHRDb } = await import('@/lib/roles')
    if (currentUser.role !== 'SUPER_ADMIN' && !isCompanyHRDb(currentUser.role)) {
      return { error: 'You do not have permission to manage team members' }
    }

    const teamMembers = userIds.map(userId => ({
      team_id: teamId,
      user_id: userId,
    }))

    const { error } = await supabase
      .from('team_members')
      .upsert(teamMembers, { onConflict: 'team_id,user_id' })

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/employees')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

export async function removeTeamMember(teamId: string, userId: string) {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      redirect('/login')
    }

    const { data: currentUser } = await supabase
      .from('users')
      .select('company_id, role')
      .eq('id', user.id)
      .maybeSingle()

    if (!currentUser) {
      return { error: 'User profile not found' }
    }

    // Check permissions
    const { isCompanyHRDb } = await import('@/lib/roles')
    if (currentUser.role !== 'SUPER_ADMIN' && !isCompanyHRDb(currentUser.role)) {
      return { error: 'You do not have permission to manage team members' }
    }

    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId)
      .eq('user_id', userId)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/employees')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}
