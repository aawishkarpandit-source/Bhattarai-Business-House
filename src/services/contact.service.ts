import { supabase } from '@/lib/supabase'
import type { ContactDetail } from '@/types'

export const contactService = {
  async getAll(): Promise<ContactDetail[]> {
    try {
      const { data, error } = await supabase
        .from('contact_details')
        .select('*')
        .order('order_index', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching contact details:', error)
      throw error
    }
  },

  async getById(id: string): Promise<ContactDetail | null> {
    try {
      const { data, error } = await supabase
        .from('contact_details')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching contact detail:', error)
      throw error
    }
  },

  async getHeadquarters(): Promise<ContactDetail | null> {
    try {
      const { data, error } = await supabase
        .from('contact_details')
        .select('*')
        .eq('is_headquarters', true)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching headquarters:', error)
      throw error
    }
  },

  async create(contact: Omit<ContactDetail, 'id' | 'created_at' | 'updated_at'>): Promise<ContactDetail> {
    try {
      const { data, error } = await supabase
        .from('contact_details')
        .insert([contact])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating contact detail:', error)
      throw error
    }
  },

  async update(id: string, contact: Partial<ContactDetail>): Promise<ContactDetail> {
    try {
      const { data, error } = await supabase
        .from('contact_details')
        .update({ ...contact, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating contact detail:', error)
      throw error
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('contact_details')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting contact detail:', error)
      throw error
    }
  },
}
