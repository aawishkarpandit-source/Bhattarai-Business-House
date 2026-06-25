import { supabase } from '@/lib/supabase'
import type { Product, FilterOptions } from '@/types'

export const productService = {
  async getAll(filters?: FilterOptions): Promise<Product[]> {
    try {
      let query = supabase
        .from('products')
        .select('*, category:categories(*), brand:brands(*)')

      if (filters) {
        if (filters.brand_id) {
          query = query.eq('brand_id', filters.brand_id)
        }
        if (filters.category) {
          query = query.eq('category_id', filters.category)
        }
        if (filters.search) {
          query = query.ilike('name', `%${filters.search}%`)
        }
        if (filters.min_price !== undefined) {
          query = query.gte('price', filters.min_price)
        }
        if (filters.max_price !== undefined) {
          query = query.lte('price', filters.max_price)
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
      console.error('Error fetching products:', error)
      throw error
    }
  },

  async getByCategory(categoryId: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*), brand:brands(*)')
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching products by category:', error)
      throw error
    }
  },

  async getByBrand(brandId: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*), brand:brands(*)')
        .eq('brand_id', brandId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching products by brand:', error)
      throw error
    }
  },

  async getFeatured(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*), brand:brands(*)')
        .eq('is_featured', true)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching featured products:', error)
      throw error
    }
  },

  async getById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*), brand:brands(*)')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching product:', error)
      throw error
    }
  },

  async getBySlug(slug: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*), brand:brands(*)')
        .eq('slug', slug)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching product by slug:', error)
      throw error
    }
  },

  async create(product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'category' | 'brand'>): Promise<Product> {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select('*, category:categories(*), brand:brands(*)')
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  },

  async update(id: string, product: Partial<Product>): Promise<Product> {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({ ...product, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('*, category:categories(*), brand:brands(*)')
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  },
}
