import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Zap,
  Fuel,
  Settings,
  Car,
  ArrowUpDown,
  Grid3X3,
} from 'lucide-react'
import { vehicleService } from '@/services/vehicle.service'
import { brandService } from '@/services/brand.service'
import { useDebounce } from '@/hooks/useDebounce'
import { formatCurrency } from '@/utils/format'
import Button from '@/components/ui/Button'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { cn } from '@/utils/cn'
import type { Vehicle, Brand, FilterOptions } from '@/types'
import { SORT_OPTIONS, DEFAULT_PAGE_SIZE } from '@/utils/constants'

const FUEL_TYPES = ['Electric', 'Petrol', 'Diesel'] as const
const TRANSMISSIONS = ['Automatic', 'Manual'] as const
const PER_PAGE_OPTIONS = [12, 24, 48] as const

function getSortParams(sortValue: string): Pick<FilterOptions, 'sort_by' | 'sort_order'> {
  switch (sortValue) {
    case 'oldest':
      return { sort_by: 'created_at', sort_order: 'asc' }
    case 'price-asc':
      return { sort_by: 'price', sort_order: 'asc' }
    case 'price-desc':
      return { sort_by: 'price', sort_order: 'desc' }
    case 'name-asc':
      return { sort_by: 'name', sort_order: 'asc' }
    case 'name-desc':
      return { sort_by: 'name', sort_order: 'desc' }
    default:
      return { sort_by: 'created_at', sort_order: 'desc' }
  }
}

function FuelBadge({ fuelType }: { fuelType: string }) {
  const colors: Record<string, string> = {
    electric: 'bg-emerald-100 text-emerald-700',
    petrol: 'bg-blue-100 text-blue-700',
    diesel: 'bg-amber-100 text-amber-700',
  }
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium', colors[fuelType] || 'bg-gray-100 text-gray-700')}>
      {fuelType === 'electric' && <Zap className="h-3 w-3" />}
      {fuelType !== 'electric' && <Fuel className="h-3 w-3" />}
      {fuelType.charAt(0).toUpperCase() + fuelType.slice(1)}
    </span>
  )
}

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        to={`/vehicles/${vehicle.id}`}
        className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-1"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
          <img
            src={vehicle.thumbnail_url}
            alt={vehicle.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute left-3 top-3">
            <FuelBadge fuelType={vehicle.fuel_type} />
          </div>
          {vehicle.is_ev && (
            <div className="absolute right-3 top-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-semibold text-white shadow-lg">
                <Zap className="h-3 w-3" />
                EV
              </span>
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-500">
            {vehicle.brand?.name} &middot; {vehicle.model_year}
          </div>
          <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
            {vehicle.name}
          </h3>
          <p className="mb-3 line-clamp-2 text-sm text-gray-600">
            {vehicle.short_description}
          </p>
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5">
              <Settings className="h-3 w-3" />
              {vehicle.transmission}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5">
              <Car className="h-3 w-3" />
              {vehicle.seating_capacity} Seats
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <div>
              <div className="text-xs text-gray-500">Starting at</div>
              <div className="text-lg font-bold text-primary-600">
                {formatCurrency(vehicle.price, vehicle.price_currency)}
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 group-hover:gap-2 transition-all">
              View Details
              <ChevronRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function VehicleCardSkeleton() {
  return <SkeletonCard />
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 px-6 py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <Car className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">No vehicles found</h3>
      <p className="mb-6 max-w-sm text-sm text-gray-500">
        {hasFilters
          ? 'Try adjusting your search criteria or filters to find what you\'re looking for.'
          : 'No vehicles are currently available. Check back soon for new arrivals.'}
      </p>
      {hasFilters && (
        <Button as="link" to="/automotive" variant="secondary" size="sm">
          Clear All Filters
        </Button>
      )}
    </div>
  )
}

function FilterSection({
  title,
  icon,
  children,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
        {icon}
        {title}
      </div>
      {children}
    </div>
  )
}

function PriceRangeInputs({
  minPrice,
  maxPrice,
  onMinChange,
  onMaxChange,
}: {
  minPrice: string
  maxPrice: string
  onMinChange: (val: string) => void
  onMaxChange: (val: string) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">NPR</span>
        <input
          type="number"
          placeholder="Min"
          value={minPrice}
          onChange={(e) => onMinChange(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-12 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>
      <span className="text-gray-400">—</span>
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">NPR</span>
        <input
          type="number"
          placeholder="Max"
          value={maxPrice}
          onChange={(e) => onMaxChange(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-12 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>
    </div>
  )
}

function MobileFilterDrawer({
  open,
  onClose,
  children,
}: {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed inset-y-0 left-0 z-50 w-full max-w-sm overflow-y-auto bg-white shadow-2xl lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-gray-100 p-4">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-6 p-4">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default function AutomotivePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const searchQuery = searchParams.get('search') || ''
  const selectedBrand = searchParams.get('brand') || ''
  const selectedFuel = searchParams.get('fuel') || ''
  const selectedTransmission = searchParams.get('transmission') || ''
  const evOnly = searchParams.get('ev') === 'true'
  const minPrice = searchParams.get('min_price') || ''
  const maxPrice = searchParams.get('max_price') || ''
  const sortBy = searchParams.get('sort') || 'newest'
  const page = parseInt(searchParams.get('page') || '1', 10)
  const perPage = parseInt(searchParams.get('per_page') || String(DEFAULT_PAGE_SIZE), 10)

  const [searchInput, setSearchInput] = useState(searchQuery)
  const debouncedSearch = useDebounce(searchInput, 300)

  useEffect(() => {
    document.title = 'Automotive | Bhattarai Business House'
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    if (debouncedSearch) {
      params.set('search', debouncedSearch)
    } else {
      params.delete('search')
    }
    params.set('page', '1')
    setSearchParams(params, { replace: true })
  }, [debouncedSearch]) // eslint-disable-line react-hooks/exhaustive-deps

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams)
    if (value && value !== '') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.set('page', '1')
    setSearchParams(params, { replace: true })
  }

  const clearAllFilters = () => {
    setSearchParams({}, { replace: true })
    setSearchInput('')
  }

  const hasActiveFilters = selectedBrand || selectedFuel || selectedTransmission || evOnly || minPrice || maxPrice

  const sortParams = useMemo(() => getSortParams(sortBy), [sortBy])

  const vehicleFilters: FilterOptions = useMemo(
    () => ({
      search: searchQuery || undefined,
      brand_id: selectedBrand || undefined,
      fuel_type: selectedFuel || undefined,
      transmission: selectedTransmission || undefined,
      is_ev: evOnly || undefined,
      min_price: minPrice ? Number(minPrice) : undefined,
      max_price: maxPrice ? Number(maxPrice) : undefined,
      sort_by: sortParams.sort_by,
      sort_order: sortParams.sort_order,
    }),
    [searchQuery, selectedBrand, selectedFuel, selectedTransmission, evOnly, minPrice, maxPrice, sortParams]
  )

  const { data: brands = [], isLoading: brandsLoading } = useQuery({
    queryKey: ['brands', 'automotive'],
    queryFn: () => brandService.getByCategory('automotive'),
  })

  const { data: allVehicles = [], isLoading: vehiclesLoading } = useQuery({
    queryKey: ['vehicles', 'automotive', vehicleFilters],
    queryFn: () => vehicleService.getAll(vehicleFilters),
  })

  const totalCount = allVehicles.length
  const totalPages = Math.ceil(totalCount / perPage)
  const paginatedVehicles = useMemo(() => {
    const start = (page - 1) * perPage
    return allVehicles.slice(start, start + perPage)
  }, [allVehicles, page, perPage])

  const handleSortChange = (value: string) => {
    updateFilter('sort', value === 'newest' ? null : value)
  }

  const handlePerPageChange = (value: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('per_page', String(value))
    params.set('page', '1')
    setSearchParams(params, { replace: true })
  }

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(p))
    setSearchParams(params, { replace: true })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const filterContent = (
    <>
      <FilterSection title="Brands" icon={<Grid3X3 className="h-4 w-4 text-gray-500" />}>
        {brandsLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {brands.map((brand: Brand) => (
              <label
                key={brand.id}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedBrand === brand.id}
                  onChange={() => updateFilter('brand', selectedBrand === brand.id ? null : brand.id)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="flex-1">{brand.name}</span>
                {brand.logo_url && (
                  <img src={brand.logo_url} alt="" className="h-4 w-4 object-contain" />
                )}
              </label>
            ))}
            {brands.length === 0 && !brandsLoading && (
              <p className="text-xs text-gray-500">No brands available</p>
            )}
          </div>
        )}
      </FilterSection>

      <FilterSection title="Fuel Type" icon={<Fuel className="h-4 w-4 text-gray-500" />}>
        <div className="space-y-2">
          {FUEL_TYPES.map((fuel) => (
            <label
              key={fuel}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <input
                type="radio"
                name="fuel_type"
                checked={selectedFuel === fuel}
                onChange={() => updateFilter('fuel', selectedFuel === fuel ? null : fuel)}
                className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              {fuel}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Transmission" icon={<Settings className="h-4 w-4 text-gray-500" />}>
        <div className="space-y-2">
          {TRANSMISSIONS.map((trans) => (
            <label
              key={trans}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <input
                type="radio"
                name="transmission"
                checked={selectedTransmission === trans}
                onChange={() => updateFilter('transmission', selectedTransmission === trans ? null : trans)}
                className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              {trans}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Electric Vehicle" icon={<Zap className="h-4 w-4 text-gray-500" />}>
        <label className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 hover:bg-gray-50 transition-colors">
          <span className="text-sm text-gray-700">Show only EVs</span>
          <button
            type="button"
            role="switch"
            aria-checked={evOnly}
            onClick={() => updateFilter('ev', evOnly ? null : 'true')}
            className={cn(
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200',
              evOnly ? 'bg-primary-600' : 'bg-gray-200'
            )}
          >
            <span
              className={cn(
                'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition duration-200',
                evOnly ? 'translate-x-5' : 'translate-x-0'
              )}
            />
          </button>
        </label>
      </FilterSection>

      <FilterSection title="Price Range" icon={<ArrowUpDown className="h-4 w-4 text-gray-500" />}>
        <PriceRangeInputs
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinChange={(val) => updateFilter('min_price', val || null)}
          onMaxChange={(val) => updateFilter('max_price', val || null)}
        />
      </FilterSection>

      {hasActiveFilters && (
        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          onClick={clearAllFilters}
        >
          Clear All Filters
        </Button>
      )}
    </>
  )

  return (
    <div className="min-h-screen bg-gray-50/50">
      <section className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 sm:h-56 md:h-64">
        <div className="absolute inset-0 bg-[url('/automotive-hero.jpg')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Automotive
            </h1>
            <p className="mt-2 max-w-xl text-base text-gray-300 sm:text-lg">
              Explore our range of authorized vehicles from world-renowned brands
            </p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search vehicles by name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-500 shadow-sm transition-shadow focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:shadow-md"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 hover:bg-gray-100"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
                  !
                </span>
              )}
            </button>

            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-gray-500 hidden sm:inline">Sort by:</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden sm:flex items-center gap-1">
              {PER_PAGE_OPTIONS.map((pp) => (
                <button
                  key={pp}
                  onClick={() => handlePerPageChange(pp)}
                  className={cn(
                    'h-9 w-9 rounded-lg text-sm font-medium transition-colors',
                    perPage === pp
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-500 hover:bg-gray-100'
                  )}
                >
                  {pp}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            {vehiclesLoading ? (
              'Loading vehicles...'
            ) : (
              <>
                Showing <span className="font-semibold text-gray-900">{paginatedVehicles.length}</span> of{' '}
                <span className="font-semibold text-gray-900">{totalCount}</span> vehicles
              </>
            )}
          </p>
        </div>

        <div className="flex gap-8">
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 space-y-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h2 className="text-base font-bold text-gray-900">Filters</h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-medium text-primary-600 hover:text-primary-700"
                  >
                    Clear all
                  </button>
                )}
              </div>
              {filterContent}
            </div>
          </aside>

          <MobileFilterDrawer open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)}>
            {filterContent}
          </MobileFilterDrawer>

          <main className="flex-1 min-w-0">
            {vehiclesLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <VehicleCardSkeleton key={i} />
                ))}
              </div>
            ) : paginatedVehicles.length === 0 ? (
              <EmptyState hasFilters={!!hasActiveFilters || !!searchQuery} />
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {paginatedVehicles.map((vehicle: Vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </AnimatePresence>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1
                  const isCurrent = pageNum === page
                  const show = pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - page) <= 1
                  if (!show) {
                    if (pageNum === page - 2 || pageNum === page + 2) {
                      return (
                        <span key={i} className="px-1 text-gray-400">
                          ...
                        </span>
                      )
                    }
                    return null
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => goToPage(pageNum)}
                      className={cn(
                        'inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors',
                        isCurrent
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPages}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
