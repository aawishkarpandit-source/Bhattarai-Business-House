import { supabase } from '@/lib/supabase'
import type { SeoSetting } from '@/types'

export const seoService = {
  async getByPage(path: string): Promise<SeoSetting | null> {
    try {
      const { data, error } = await supabase
        .from('seo_settings')
        .select('*')
        .eq('page_path', path)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data
    } catch (error) {
      console.error('Error fetching SEO settings:', error)
      throw error
    }
  },

  async getAll(): Promise<SeoSetting[]> {
    try {
      const { data, error } = await supabase
        .from('seo_settings')
        .select('*')
        .order('page_path', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching all SEO settings:', error)
      throw error
    }
  },

  async upsert(setting: Omit<SeoSetting, 'id' | 'created_at' | 'updated_at'>): Promise<SeoSetting> {
    try {
      const { data: existing } = await supabase
        .from('seo_settings')
        .select('id')
        .eq('page_path', setting.page_path)
        .single()

      if (existing) {
        const { data, error } = await supabase
          .from('seo_settings')
          .update({ ...setting, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
          .select()
          .single()

        if (error) throw error
        return data
      } else {
        const { data, error } = await supabase
          .from('seo_settings')
          .insert([setting])
          .select()
          .single()

        if (error) throw error
        return data
      }
    } catch (error) {
      console.error('Error upserting SEO setting:', error)
      throw error
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('seo_settings')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting SEO setting:', error)
      throw error
    }
  },
}
