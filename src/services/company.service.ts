import { supabase } from '@/lib/supabase'
import type { CompanySetting } from '@/types'

export const companyService = {
  async get(key: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('company_settings')
        .select('value')
        .eq('key', key)
        .single()

      if (error) throw error
      return data?.value || null
    } catch (error) {
      console.error('Error fetching company setting:', error)
      throw error
    }
  },

  async getAll(): Promise<CompanySetting[]> {
    try {
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .order('group', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching company settings:', error)
      throw error
    }
  },

  async getByGroup(group: string): Promise<CompanySetting[]> {
    try {
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .eq('group', group)
        .order('key', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching company settings by group:', error)
      throw error
    }
  },

  async upsert(key: string, value: string): Promise<CompanySetting> {
    try {
      const { data: existing } = await supabase
        .from('company_settings')
        .select('id')
        .eq('key', key)
        .single()

      if (existing) {
        const { data, error } = await supabase
          .from('company_settings')
          .update({ value, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
          .select()
          .single()

        if (error) throw error
        return data
      } else {
        const { data, error } = await supabase
          .from('company_settings')
          .insert([{ key, value }])
          .select()
          .single()

        if (error) throw error
        return data
      }
    } catch (error) {
      console.error('Error upserting company setting:', error)
      throw error
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('company_settings')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting company setting:', error)
      throw error
    }
  },
}
