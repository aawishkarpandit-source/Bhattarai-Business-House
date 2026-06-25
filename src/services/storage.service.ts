import { supabase } from '@/lib/supabase'

export const storageService = {
  async uploadFile(bucket: string, path: string, file: File): Promise<string> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) throw error

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(path)

      return urlData.publicUrl
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  },

  async uploadFileWithReplace(bucket: string, path: string, file: File): Promise<string> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true,
        })

      if (error) throw error

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(path)

      return urlData.publicUrl
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  },

  async deleteFile(bucket: string, path: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path])

      if (error) throw error
    } catch (error) {
      console.error('Error deleting file:', error)
      throw error
    }
  },

  async deleteFiles(bucket: string, paths: string[]): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove(paths)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting files:', error)
      throw error
    }
  },

  getPublicUrl(bucket: string, path: string): string {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return data.publicUrl
  },

  async listFiles(bucket: string, folder?: string): Promise<string[]> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(folder || '', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' },
        })

      if (error) throw error
      return (data || []).map((file) => file.name)
    } catch (error) {
      console.error('Error listing files:', error)
      throw error
    }
  },

  async moveFile(bucket: string, fromPath: string, toPath: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .move(fromPath, toPath)

      if (error) throw error
    } catch (error) {
      console.error('Error moving file:', error)
      throw error
    }
  },
}
