import { supabase } from '@/lib/supabase'
import type { Vehicle, VehicleImage, VehicleSpec, VehicleFeature, Brand } from '@/types'

export interface VehicleDetails extends Vehicle {
  vehicle_images: VehicleImage[]
  vehicle_specs: VehicleSpec[]
  vehicle_features: VehicleFeature[]
  brand: Brand
}

export const vehicleDetailService = {
  async getVehicleDetails(id: string): Promise<VehicleDetails | null> {
    try {
      const { data: vehicle, error: vehicleError } = await supabase
        .from('vehicles')
        .select(`
          *,
          brand:brands(*),
          vehicle_images(*),
          vehicle_specs(*),
          vehicle_features(*)
        `)
        .eq('id', id)
        .single()

      if (vehicleError) throw vehicleError
      return vehicle as VehicleDetails
    } catch (error) {
      console.error('Error fetching vehicle details:', error)
      throw error
    }
  },

  async getVehicleDetailsBySlug(slug: string): Promise<VehicleDetails | null> {
    try {
      const { data: vehicle, error: vehicleError } = await supabase
        .from('vehicles')
        .select(`
          *,
          brand:brands(*),
          vehicle_images(*),
          vehicle_specs(*),
          vehicle_features(*)
        `)
        .eq('slug', slug)
        .single()

      if (vehicleError) throw vehicleError
      return vehicle as VehicleDetails
    } catch (error) {
      console.error('Error fetching vehicle details by slug:', error)
      throw error
    }
  },

  async getVehicleImages(vehicleId: string): Promise<VehicleImage[]> {
    try {
      const { data, error } = await supabase
        .from('vehicle_images')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('order_index', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching vehicle images:', error)
      throw error
    }
  },

  async getVehicleSpecs(vehicleId: string): Promise<VehicleSpec[]> {
    try {
      const { data, error } = await supabase
        .from('vehicle_specs')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('category', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching vehicle specs:', error)
      throw error
    }
  },

  async getVehicleFeatures(vehicleId: string): Promise<VehicleFeature[]> {
    try {
      const { data, error } = await supabase
        .from('vehicle_features')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('category', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching vehicle features:', error)
      throw error
    }
  },

  async addVehicleImage(image: Omit<VehicleImage, 'id' | 'created_at'>): Promise<VehicleImage> {
    try {
      const { data, error } = await supabase
        .from('vehicle_images')
        .insert([image])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error adding vehicle image:', error)
      throw error
    }
  },

  async removeVehicleImage(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('vehicle_images')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error removing vehicle image:', error)
      throw error
    }
  },

  async addVehicleSpec(spec: Omit<VehicleSpec, 'id' | 'created_at'>): Promise<VehicleSpec> {
    try {
      const { data, error } = await supabase
        .from('vehicle_specs')
        .insert([spec])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error adding vehicle spec:', error)
      throw error
    }
  },

  async removeVehicleSpec(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('vehicle_specs')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error removing vehicle spec:', error)
      throw error
    }
  },

  async addVehicleFeature(feature: Omit<VehicleFeature, 'id' | 'created_at'>): Promise<VehicleFeature> {
    try {
      const { data, error } = await supabase
        .from('vehicle_features')
        .insert([feature])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error adding vehicle feature:', error)
      throw error
    }
  },

  async removeVehicleFeature(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('vehicle_features')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error removing vehicle feature:', error)
      throw error
    }
  },
}
