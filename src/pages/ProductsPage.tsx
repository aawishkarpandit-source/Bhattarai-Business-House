import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ArrowRight, Package, Tag } from 'lucide-react'
import { productService } from '@/services/product.service'
import { categoryService } from '@/services/category.service'
import { brandService } from '@/services/brand.service'
import SectionHeading from '@/components/ui/SectionHeading'
import { SkeletonCard, Skeleton } from '@/components/ui/Skeleton'
import type { Product, Category, Brand } from '@/types'

export default function ProductsPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    document.title = 'Products & Brands | Bhattarai Business House'
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    setSelectedBrandId(null)
  }, [selectedCategoryId])

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
  })

  const { data: allBrands = [], isLoading: brandsLoading } = useQuery<Brand[]>({
    queryKey: ['brands'],
    queryFn: () => brandService.getAll(),
  })

  const filteredBrands = useMemo(() => {
    if (!selectedCategoryId) return allBrands
    const cat = categories.find((c) => c.id === selectedCategoryId)
    if (!cat) return allBrands
    return allBrands.filter(
      (b) => b.category?.toLowerCase() === cat.slug.toLowerCase() || b.category?.toLowerCase() === cat.name.toLowerCase()
    )
  }, [selectedCategoryId, allBrands, categories])

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['products', selectedCategoryId, selectedBrandId, debouncedSearch],
    queryFn: () =>
      productService.getAll({
        category: selectedCategoryId ?? undefined,
        brand_id: selectedBrandId ?? undefined,
        search: debouncedSearch || undefined,
        per_page: 200,
      }),
  })

  const { data: featuredBrands = [] } = useQuery<Brand[]>({
    queryKey: ['brands', 'featured'],
    queryFn: () => brandService.getAll(),
  })

  const productCount = products.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 py-24 lg:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-sm font-semibold uppercase tracking-[0.2em] text-primary-300 mb-4">
              Our Catalogue
            </span>
            <h1 className="font-serif text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Products & Brands
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-200">
              Explore our extensive range of authorized products from world-renowned brands.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative mx-auto max-w-xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-gray-900 shadow-sm transition-shadow focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:shadow-md"
            />
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCategoryId(null)}
              className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                selectedCategoryId === null
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All Categories
            </button>
            {categoriesLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-24 rounded-xl" />
                ))
              : categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                      selectedCategoryId === cat.id
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
          </div>
        </motion.div>

        {/* Brand Filter */}
        <AnimatePresence mode="wait">
          {selectedCategoryId && filteredBrands.length > 0 && (
            <motion.div
              key={selectedCategoryId}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8 overflow-hidden"
            >
              <p className="mb-3 text-sm font-medium text-gray-500">Filter by Brand:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedBrandId(null)}
                  className={`rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 ${
                    selectedBrandId === null
                      ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-500/30'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All Brands
                </button>
                {filteredBrands.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => setSelectedBrandId(brand.id)}
                    className={`rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 ${
                      selectedBrandId === brand.id
                        ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-500/30'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {productsLoading ? (
              <Skeleton className="inline-block h-4 w-32" />
            ) : (
              <>
                Showing               <span className="font-semibold text-gray-900">{productCount}</span>{' '}
                {productCount === 1 ? 'product' : 'products'}
              </>
            )}
          </p>
        </div>

        {/* Product Grid */}
        {productsLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-gray-200 bg-white py-16 text-center"
          >
            <Package className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No products found</h3>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategoryId(null)
                setSelectedBrandId(null)
              }}
              className="mt-6 rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link
                  to={`/products/${product.slug}`}
                  className="group block h-full rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden rounded-t-2xl">
                    <img
                      src={product.image_url || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.category && (
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-lg bg-white/90 px-3 py-1 text-xs font-medium text-primary-700 backdrop-blur-sm">
                        <Tag className="h-3 w-3" />
                        {product.category.name}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    {product.brand && (
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary-600">
                        {product.brand.name}
                      </p>
                    )}
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
                      {product.name}
                    </h3>
                    {product.short_description && (
                      <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                        {product.short_description}
                      </p>
                    )}
                    <div className="mt-4 flex items-center text-sm font-semibold text-primary-600">
                      Learn More
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Authorized Brands Logo Grid */}
      <section className="border-t border-gray-200 bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Our Partners"
            title="Authorized Brands"
            description="We are proud to be the authorized distributor for these world-renowned brands."
            centered
          />

          {brandsLoading ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {featuredBrands.map((brand, index) => (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group"
                >
                  <div className="flex h-24 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all duration-300 hover:border-primary-200 hover:bg-primary-50 hover:shadow-md">
                    <img
                      src={brand.logo_url}
                      alt={brand.name}
                      className="max-h-14 max-w-full object-contain opacity-70 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                    />
                  </div>
                  <p className="mt-2 text-center text-xs font-medium text-gray-500 group-hover:text-primary-600 transition-colors">
                    {brand.name}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
              Can't Find What You're Looking For?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-200">
              Contact our sales team for personalized product recommendations and bulk inquiries.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-primary-700 shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl"
              >
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
