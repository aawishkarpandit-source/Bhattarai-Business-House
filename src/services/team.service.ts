import { supabase } from '@/lib/supabase'
import type { TeamMember } from '@/types'

export const teamService = {
  async getAll(): Promise<TeamMember[]> {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('order_index', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching team members:', error)
      throw error
    }
  },

  async getById(id: string): Promise<TeamMember | null> {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching team member:', error)
      throw error
    }
  },

  async getActive(): Promise<TeamMember[]> {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching active team members:', error)
      throw error
    }
  },

  async create(member: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>): Promise<TeamMember> {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert([member])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating team member:', error)
      throw error
    }
  },

  async update(id: string, member: Partial<TeamMember>): Promise<TeamMember> {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .update({ ...member, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating team member:', error)
      throw error
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting team member:', error)
      throw error
    }
  },
}
