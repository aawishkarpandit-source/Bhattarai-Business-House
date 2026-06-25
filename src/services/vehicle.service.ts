import { supabase } from '@/lib/supabase'
import type { Vehicle, FilterOptions } from '@/types'

export const vehicleService = {
  async getAll(filters?: FilterOptions): Promise<Vehicle[]> {
    try {
      let query = supabase
        .from('vehicles')
        .select('*, brand:brands(*)')

      if (filters) {
        if (filters.brand_id) {
          query = query.eq('brand_id', filters.brand_id)
        }
        if (filters.fuel_type) {
          query = query.eq('fuel_type', filters.fuel_type)
        }
        if (filters.transmission) {
          query = query.eq('transmission', filters.transmission)
        }
        if (filters.is_ev !== undefined) {
          query = query.eq('is_ev', filters.is_ev)
        }
        if (filters.min_price !== undefined) {
          query = query.gte('price', filters.min_price)
        }
        if (filters.max_price !== undefined) {
          query = query.lte('price', filters.max_price)
        }
        if (filters.search) {
          query = query.ilike('name', `%${filters.search}%`)
        }
        if (filters.category) {
          query = query.eq('category', filters.category)
        }
      }

      const sortBy = filters?.sort_by || 'created_at'
      const sortOrder = filters?.sort_order || 'desc'
      query = query.order(sortBy, { ascending: sortOrder === 'asc' })

      if (filters?.page && filters?.per_page) {
        const from = (filters.page - 1) * filters.per_page
        const to = from + filters.per_page - 1
        query = query.range(from, to)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching vehicles:', error)
      throw error
    }
  },

  async getById(id: string): Promise<Vehicle | null> {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*, brand:brands(*)')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching vehicle:', error)
      throw error
    }
  },

  async getBySlug(slug: string): Promise<Vehicle | null> {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*, brand:brands(*)')
        .eq('slug', slug)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching vehicle by slug:', error)
      throw error
    }
  },

  async getByBrand(brandId: string): Promise<Vehicle[]> {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*, brand:brands(*)')
        .eq('brand_id', brandId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching vehicles by brand:', error)
      throw error
    }
  },

  async getFeatured(): Promise<Vehicle[]> {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*, brand:brands(*)')
        .eq('is_featured', true)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching featured vehicles:', error)
      throw error
    }
  },

  async getEVehicles(): Promise<Vehicle[]> {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*, brand:brands(*)')
        .eq('is_ev', true)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching electric vehicles:', error)
      throw error
    }
  },

  async create(vehicle: Omit<Vehicle, 'id' | 'created_at' | 'updated_at' | 'brand'>): Promise<Vehicle> {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .insert([vehicle])
        .select('*, brand:brands(*)')
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating vehicle:', error)
      throw error
    }
  },

  async update(id: string, vehicle: Partial<Vehicle>): Promise<Vehicle> {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .update({ ...vehicle, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('*, brand:brands(*)')
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating vehicle:', error)
      throw error
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      throw error
    }
  },
}
