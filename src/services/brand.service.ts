import { supabase } from '@/lib/supabase'
import type { Brand } from '@/types'

export const brandService = {
  async getAll(): Promise<Brand[]> {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('order_index', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching brands:', error)
      throw error
    }
  },

  async getByCategory(category: string): Promise<Brand[]> {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('category', category)
        .order('order_index', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching brands by category:', error)
      throw error
    }
  },

  async getBySlug(slug: string): Promise<Brand | null> {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching brand by slug:', error)
      throw error
    }
  },

  async getFeatured(): Promise<Brand[]> {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('is_featured', true)
        .order('order_index', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching featured brands:', error)
      throw error
    }
  },

  async create(brand: Omit<Brand, 'id' | 'created_at' | 'updated_at'>): Promise<Brand> {
    try {
      const { data, error } = await supabase
        .from('brands')
        .insert([brand])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating brand:', error)
      throw error
    }
  },

  async update(id: string, brand: Partial<Brand>): Promise<Brand> {
    try {
      const { data, error } = await supabase
        .from('brands')
        .update({ ...brand, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating brand:', error)
      throw error
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('brands')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting brand:', error)
      throw error
    }
  },
}
