import { supabase } from '@/lib/supabase'
import type { HeroSlide } from '@/types'

export const heroService = {
  async getAll(): Promise<HeroSlide[]> {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('order_index', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching hero slides:', error)
      throw error
    }
  },

  async getActive(): Promise<HeroSlide[]> {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching active hero slides:', error)
      throw error
    }
  },

  async getById(id: string): Promise<HeroSlide | null> {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching hero slide:', error)
      throw error
    }
  },

  async create(slide: Omit<HeroSlide, 'id' | 'created_at' | 'updated_at'>): Promise<HeroSlide> {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .insert([slide])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating hero slide:', error)
      throw error
    }
  },

  async update(id: string, slide: Partial<HeroSlide>): Promise<HeroSlide> {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .update({ ...slide, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating hero slide:', error)
      throw error
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('hero_slides')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting hero slide:', error)
      throw error
    }
  },

  async reorder(ids: string[]): Promise<void> {
    try {
      const updates = ids.map((id, index) =>
        supabase
          .from('hero_slides')
          .update({ order_index: index, updated_at: new Date().toISOString() })
          .eq('id', id)
      )

      await Promise.all(updates)
    } catch (error) {
      console.error('Error reordering hero slides:', error)
      throw error
    }
  },
}
