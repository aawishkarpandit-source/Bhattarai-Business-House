import { supabase } from '@/lib/supabase'
import type { NewsArticle } from '@/types'

export const newsService = {
  async getAll(published?: boolean): Promise<NewsArticle[]> {
    try {
      let query = supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })

      if (published !== undefined) {
        query = query.eq('is_published', published)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching news:', error)
      throw error
    }
  },

  async getById(id: string): Promise<NewsArticle | null> {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching news article:', error)
      throw error
    }
  },

  async getBySlug(slug: string): Promise<NewsArticle | null> {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching news article by slug:', error)
      throw error
    }
  },

  async create(article: Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'>): Promise<NewsArticle> {
    try {
      const { data, error } = await supabase
        .from('news')
        .insert([article])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating news article:', error)
      throw error
    }
  },

  async update(id: string, article: Partial<NewsArticle>): Promise<NewsArticle> {
    try {
      const { data, error } = await supabase
        .from('news')
        .update({ ...article, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating news article:', error)
      throw error
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting news article:', error)
      throw error
    }
  },
}
