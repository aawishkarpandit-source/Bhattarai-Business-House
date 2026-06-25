import { supabase } from '@/lib/supabase'
import type { Testimonial } from '@/types'

export const testimonialService = {
  async getAll(): Promise<Testimonial[]> {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('order_index', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      throw error
    }
  },

  async getById(id: string): Promise<Testimonial | null> {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching testimonial:', error)
      throw error
    }
  },

  async getFeatured(): Promise<Testimonial[]> {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_featured', true)
        .eq('is_active', true)
        .order('order_index', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching featured testimonials:', error)
      throw error
    }
  },

  async create(testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>): Promise<Testimonial> {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .insert([testimonial])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating testimonial:', error)
      throw error
    }
  },

  async update(id: string, testimonial: Partial<Testimonial>): Promise<Testimonial> {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .update({ ...testimonial, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating testimonial:', error)
      throw error
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting testimonial:', error)
      throw error
    }
  },
}
