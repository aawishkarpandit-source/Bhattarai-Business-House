import { supabase } from '@/lib/supabase'
import type { GalleryItem } from '@/types'

export const galleryService = {
  async getAll(): Promise<GalleryItem[]> {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('order_index', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching gallery items:', error)
      throw error
    }
  },

  async getById(id: string): Promise<GalleryItem | null> {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching gallery item:', error)
      throw error
    }
  },

  async getByCategory(category: string): Promise<GalleryItem[]> {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('category', category)
        .order('order_index', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching gallery items by category:', error)
      throw error
    }
  },

  async create(item: Omit<GalleryItem, 'id' | 'created_at' | 'updated_at'>): Promise<GalleryItem> {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .insert([item])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating gallery item:', error)
      throw error
    }
  },

  async update(id: string, item: Partial<GalleryItem>): Promise<GalleryItem> {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .update({ ...item, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating gallery item:', error)
      throw error
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting gallery item:', error)
      throw error
    }
  },
}
