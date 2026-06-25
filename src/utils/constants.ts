export const COMPANY_NAME = 'Bhattarai Business House'
export const COMPANY_FULL_NAME = 'Bhattarai & Brothers Suppliers Pvt. Ltd.'

export const DEFAULT_PAGE_SIZE = 12

export const STORAGE_BUCKETS = {
  vehicles: 'vehicles',
  brands: 'brands',
  gallery: 'gallery',
  hero: 'hero',
  news: 'news',
  products: 'products',
} as const

export const VEHICLE_FUEL_TYPES = [
  'Petrol',
  'Diesel',
  'Electric',
  'Hybrid',
  'CNG',
] as const

export const VEHICLE_TRANSMISSIONS = [
  'Manual',
  'Automatic',
  'CVT',
  'AMT',
] as const

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
] as const
