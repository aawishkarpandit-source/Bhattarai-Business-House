import { supabase } from '@/lib/supabase'
import type { TestDriveRequest } from '@/types'

export const testDriveService = {
  async create(request: Omit<TestDriveRequest, 'id' | 'created_at' | 'updated_at' | 'status' | 'admin_notes'>): Promise<TestDriveRequest> {
    try {
      const { data, error } = await supabase
        .from('test_drive_requests')
        .insert([{ ...request, status: 'pending' }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating test drive request:', error)
      throw error
    }
  },

  async getAll(): Promise<TestDriveRequest[]> {
    try {
      const { data, error } = await supabase
        .from('test_drive_requests')
        .select('*, vehicle:vehicles(*)')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching test drive requests:', error)
      throw error
    }
  },

  async getById(id: string): Promise<TestDriveRequest | null> {
    try {
      const { data, error } = await supabase
        .from('test_drive_requests')
        .select('*, vehicle:vehicles(*)')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching test drive request:', error)
      throw error
    }
  },

  async updateStatus(
    id: string,
    status: TestDriveRequest['status'],
    adminNotes?: string
  ): Promise<TestDriveRequest> {
    try {
      const updateData: Partial<TestDriveRequest> = {
        status,
        updated_at: new Date().toISOString(),
      }
      if (adminNotes !== undefined) {
        updateData.admin_notes = adminNotes
      }

      const { data, error } = await supabase
        .from('test_drive_requests')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating test drive status:', error)
      throw error
    }
  },

  async getByStatus(status: TestDriveRequest['status']): Promise<TestDriveRequest[]> {
    try {
      const { data, error } = await supabase
        .from('test_drive_requests')
        .select('*, vehicle:vehicles(*)')
        .eq('status', status)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching test drive requests by status:', error)
      throw error
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('test_drive_requests')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting test drive request:', error)
      throw error
    }
  },
}
