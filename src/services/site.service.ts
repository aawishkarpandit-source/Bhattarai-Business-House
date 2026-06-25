import { supabase } from '@/lib/supabase'
import type { SiteSetting } from '@/types'

export const siteService = {
  async get(key: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', key)
        .single()

      if (error) throw error
      return data?.value || null
    } catch (error) {
      console.error('Error fetching site setting:', error)
      throw error
    }
  },

  async getAll(): Promise<SiteSetting[]> {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('key', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching site settings:', error)
      throw error
    }
  },

  async upsert(key: string, value: string): Promise<SiteSetting> {
    try {
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .eq('key', key)
        .single()

      if (existing) {
        const { data, error } = await supabase
          .from('site_settings')
          .update({ value, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
          .select()
          .single()

        if (error) throw error
        return data
      } else {
        const { data, error } = await supabase
          .from('site_settings')
          .insert([{ key, value }])
          .select()
          .single()

        if (error) throw error
        return data
      }
    } catch (error) {
      console.error('Error upserting site setting:', error)
      throw error
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('site_settings')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting site setting:', error)
      throw error
    }
  },
}
