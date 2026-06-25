import { supabase } from '@/lib/supabase'
import type { HomeSection } from '@/types'

export const homeSectionsService = {
  async getAll(): Promise<HomeSection[]> {
    try {
      const { data, error } = await supabase
        .from('home_sections')
        .select('*')
        .order('order_index', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching home sections:', error)
      throw error
    }
  },

  async getActive(): Promise<HomeSection[]> {
    try {
      const { data, error } = await supabase
        .from('home_sections')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching active home sections:', error)
      throw error
    }
  },

  async getById(id: string): Promise<HomeSection | null> {
    try {
      const { data, error } = await supabase
        .from('home_sections')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching home section:', error)
      throw error
    }
  },

  async getByType(sectionType: string): Promise<HomeSection[]> {
    try {
      const { data, error } = await supabase
        .from('home_sections')
        .select('*')
        .eq('section_type', sectionType)
        .order('order_index', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching home sections by type:', error)
      throw error
    }
  },

  async create(section: Omit<HomeSection, 'id' | 'created_at' | 'updated_at'>): Promise<HomeSection> {
    try {
      const { data, error } = await supabase
        .from('home_sections')
        .insert([section])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating home section:', error)
      throw error
    }
  },

  async update(id: string, section: Partial<HomeSection>): Promise<HomeSection> {
    try {
      const { data, error } = await supabase
        .from('home_sections')
        .update({ ...section, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating home section:', error)
      throw error
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('home_sections')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting home section:', error)
      throw error
    }
  },

  async reorder(ids: string[]): Promise<void> {
    try {
      const updates = ids.map((id, index) =>
        supabase
          .from('home_sections')
          .update({ order_index: index, updated_at: new Date().toISOString() })
          .eq('id', id)
      )

      await Promise.all(updates)
    } catch (error) {
      console.error('Error reordering home sections:', error)
      throw error
    }
  },
}
