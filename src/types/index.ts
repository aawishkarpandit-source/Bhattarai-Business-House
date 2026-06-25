// Database entity types

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_url: string;
  background_image: string;
  background_video?: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  description: string;
  website_url?: string;
  category: string; // 'automotive' | 'electronics' | 'batteries' | 'solar' | 'lubricants' | 'networking' | 'other'
  is_featured: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  brand_id: string;
  brand?: Brand;
  name: string;
  slug: string;
  model_year: number;
  price: number;
  price_currency: string;
  description: string;
  short_description: string;
  fuel_type: string; // 'electric' | 'petrol' | 'diesel'
  transmission: string; // 'automatic' | 'manual'
  seating_capacity: number;
  is_ev: boolean;
  is_featured: boolean;
  is_active: boolean;
  brochure_url?: string;
  thumbnail_url: string;
  created_at: string;
  updated_at: string;
}

export interface VehicleImage {
  id: string;
  vehicle_id: string;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  order_index: number;
  created_at: string;
}

export interface VehicleFeature {
  id: string;
  vehicle_id: string;
  feature_name: string;
  feature_value: string;
  category: string;
  created_at: string;
}

export interface VehicleSpec {
  id: string;
  vehicle_id: string;
  spec_name: string;
  spec_value: string;
  category: string;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  category?: Category;
  brand_id: string;
  brand?: Brand;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price?: number;
  image_url: string;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url?: string;
  parent_id?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  author: string;
  is_published: boolean;
  published_at?: string;
  meta_title?: string;
  meta_description?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_title: string;
  client_image?: string;
  content: string;
  rating: number;
  is_featured: boolean;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  media_url: string;
  media_type: 'image' | 'video';
  category: string;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image_url: string;
  email?: string;
  phone?: string;
  social_linkedin?: string;
  social_facebook?: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactDetail {
  id: string;
  branch_name: string;
  address: string;
  city: string;
  province: string;
  phone: string[];
  email: string[];
  google_maps_url?: string;
  business_hours: Record<string, string>;
  is_headquarters: boolean;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface CompanySetting {
  id: string;
  key: string;
  value: string;
  type: 'text' | 'textarea' | 'image' | 'json' | 'boolean';
  group: string;
  created_at: string;
  updated_at: string;
}

export interface SeoSetting {
  id: string;
  page_path: string;
  meta_title: string;
  meta_description: string;
  og_image?: string;
  canonical_url?: string;
  created_at: string;
  updated_at: string;
}

export interface TestDriveRequest {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  address: string;
  vehicle_id: string;
  vehicle?: Vehicle;
  preferred_date: string;
  preferred_time: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface HomeSection {
  id: string;
  section_type: string;
  title: string;
  subtitle?: string;
  content?: string;
  settings: Record<string, unknown>;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

// UI Types
export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface FilterOptions {
  search?: string;
  brand_id?: string;
  fuel_type?: string;
  transmission?: string;
  min_price?: number;
  max_price?: number;
  is_ev?: boolean;
  category?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}
