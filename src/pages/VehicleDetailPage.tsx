import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  ChevronRight,
  Fuel,
  Gauge,
  Users,
  Calendar,
  Zap,
  Download,
  ArrowLeft,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { vehicleDetailService } from '@/services/vehicle-detail.service'
import { vehicleService } from '@/services/vehicle.service'
import { formatCurrency } from '@/utils/format'
import { Skeleton } from '@/components/ui/Skeleton'
import Button from '@/components/ui/Button'
import SectionHeading from '@/components/ui/SectionHeading'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Skeleton className="mb-6 h-5 w-64" />
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
          <div className="mt-4 flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-24 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-10 w-48" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-28 rounded-full" />
            <Skeleton className="h-10 w-28 rounded-full" />
            <Skeleton className="h-10 w-28 rounded-full" />
          </div>
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 rounded-full bg-red-50 p-5">
        <XCircle className="h-12 w-12 text-red-500" />
      </div>
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Vehicle Not Found</h1>
      <p className="mb-8 max-w-md text-gray-500">
        The vehicle you're looking for doesn't exist or has been removed.
      </p>
      <Button as="link" to="/automotive" icon={<ArrowLeft className="h-4 w-4" />}>
        Back to Vehicles
      </Button>
    </div>
  )
}

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [selectedImage, setSelectedImage] = useState(0)

  const {
    data: vehicle,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => vehicleDetailService.getVehicleDetails(id!),
    enabled: !!id,
  })

  const { data: relatedVehicles = [] } = useQuery({
    queryKey: ['related-vehicles', vehicle?.brand_id],
    queryFn: () => vehicleService.getByBrand(vehicle!.brand_id),
    enabled: !!vehicle?.brand_id,
  })

  const filteredRelated = useMemo(
    () => relatedVehicles.filter((v) => v.id !== vehicle?.id).slice(0, 3),
    [relatedVehicles, vehicle?.id]
  )

  const sortedImages = useMemo(() => {
    if (!vehicle?.vehicle_images) return []
    return [...vehicle.vehicle_images].sort((a, b) => a.order_index - b.order_index)
  }, [vehicle?.vehicle_images])

  const groupedSpecs = useMemo(() => {
    if (!vehicle?.vehicle_specs) return {}
    const groups: Record<string, { spec_name: string; spec_value: string }[]> = {}
    for (const spec of vehicle.vehicle_specs) {
      if (!groups[spec.category]) groups[spec.category] = []
      groups[spec.category].push({ spec_name: spec.spec_name, spec_value: spec.spec_value })
    }
    return groups
  }, [vehicle?.vehicle_specs])

  const groupedFeatures = useMemo(() => {
    if (!vehicle?.vehicle_features) return {}
    const groups: Record<string, { feature_name: string; feature_value: string }[]> = {}
    for (const feat of vehicle.vehicle_features) {
      if (!groups[feat.category]) groups[feat.category] = []
      groups[feat.category].push({ feature_name: feat.feature_name, feature_value: feat.feature_value })
    }
    return groups
  }, [vehicle?.vehicle_features])

  useEffect(() => {
    if (vehicle) {
      document.title = `${vehicle.name} | Bhattarai Business House`
    }
    return () => {
      document.title = 'Bhattarai Business House'
    }
  }, [vehicle])

  if (isLoading) return <DetailSkeleton />
  if (error || !vehicle) return <NotFound />

  const fuelIcon = vehicle.is_ev ? <Zap className="h-4 w-4" /> : <Fuel className="h-4 w-4" />

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="transition-colors hover:text-primary-600">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/automotive" className="transition-colors hover:text-primary-600">
            Automotive
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-gray-900">{vehicle.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image Gallery */}
          <motion.div {...fadeInUp}>
            <div className="overflow-hidden rounded-2xl bg-gray-100">
              <motion.img
                key={selectedImage}
                src={
                  sortedImages[selectedImage]?.image_url ||
                  vehicle.thumbnail_url ||
                  '/placeholder-vehicle.jpg'
                }
                alt={sortedImages[selectedImage]?.alt_text || vehicle.name}
                className="aspect-[4/3] w-full object-cover"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            {sortedImages.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {sortedImages.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                      selectedImage === index
                        ? 'border-primary-600 ring-2 ring-primary-600/20'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.image_url}
                      alt={img.alt_text}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Vehicle Info */}
          <motion.div {...fadeInUp} className="flex flex-col">
            {/* Brand & Year */}
            <div className="mb-2 flex items-center gap-3">
              {vehicle.brand?.logo_url && (
                <img
                  src={vehicle.brand.logo_url}
                  alt={vehicle.brand.name}
                  className="h-8 w-8 rounded-full object-contain"
                />
              )}
              <span className="text-sm font-medium uppercase tracking-wider text-primary-600">
                {vehicle.brand?.name}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                {vehicle.model_year}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-serif text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {vehicle.name}
            </h1>

            {/* Price */}
            <div className="mt-4">
              <p className="text-3xl font-bold text-primary-700">
                {formatCurrency(vehicle.price, vehicle.price_currency)}
              </p>
              <p className="mt-1 text-sm text-gray-500">Price inclusive of all taxes</p>
            </div>

            {/* Key Specs */}
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                {fuelIcon}
                {vehicle.fuel_type}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700">
                <Gauge className="h-4 w-4" />
                {vehicle.transmission}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
                <Users className="h-4 w-4" />
                {vehicle.seating_capacity} Seats
              </span>
              {vehicle.is_ev && (
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                  <Zap className="h-4 w-4" />
                  Electric Vehicle
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mt-6 leading-relaxed text-gray-600">{vehicle.description}</p>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                as="link"
                to={`/test-drive?vehicle=${vehicle.id}`}
                size="lg"
                icon={<Calendar className="h-5 w-5" />}
              >
                Book Test Drive
              </Button>
              {vehicle.brochure_url && (
                <Button
                  as="button"
                  variant="secondary"
                  size="lg"
                  icon={<Download className="h-5 w-5" />}
                  onClick={() => window.open(vehicle.brochure_url, '_blank')}
                >
                  Download Brochure
                </Button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Specifications */}
        {Object.keys(groupedSpecs).length > 0 && (
          <motion.section
            className="mt-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
          >
            <SectionHeading label="Details" title="Specifications" />
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(groupedSpecs).map(([category, specs]) => (
                <motion.div
                  key={category}
                  variants={fadeInUp}
                  className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6"
                >
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary-600">
                    {category}
                  </h3>
                  <dl className="space-y-3">
                    {specs.map((spec) => (
                      <div key={spec.spec_name} className="flex items-center justify-between">
                        <dt className="text-sm text-gray-500">{spec.spec_name}</dt>
                        <dd className="text-sm font-medium text-gray-900">{spec.spec_value}</dd>
                      </div>
                    ))}
                  </dl>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Features */}
        {Object.keys(groupedFeatures).length > 0 && (
          <motion.section
            className="mt-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
          >
            <SectionHeading label="Equipment" title="Features" />
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(groupedFeatures).map(([category, features]) => (
                <motion.div
                  key={category}
                  variants={fadeInUp}
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
                >
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary-600">
                    {category}
                  </h3>
                  <ul className="space-y-2.5">
                    {features.map((feat) => (
                      <li key={feat.feature_name} className="flex items-start gap-2.5">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            {feat.feature_name}
                          </span>
                          {feat.feature_value && feat.feature_value !== 'Yes' && (
                            <span className="ml-2 text-sm text-gray-500">– {feat.feature_value}</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Related Vehicles */}
        {filteredRelated.length > 0 && (
          <motion.section
            className="mt-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
          >
            <SectionHeading
              label={`From ${vehicle.brand?.name}`}
              title="Related Vehicles"
              description="Explore more vehicles from the same brand"
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRelated.map((related) => (
                <motion.div key={related.id} variants={fadeInUp}>
                  <Link
                    to={`/vehicles/${related.id}`}
                    className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                      <img
                        src={related.thumbnail_url || '/placeholder-vehicle.jpg'}
                        alt={related.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-xs font-medium uppercase tracking-wider text-primary-600">
                          {vehicle.brand?.name}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{related.model_year}</span>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-gray-900 transition-colors group-hover:text-primary-600">
                        {related.name}
                      </h3>
                      <p className="mt-2 text-lg font-bold text-primary-700">
                        {formatCurrency(related.price, related.price_currency)}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                          {related.fuel_type}
                        </span>
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                          {related.transmission}
                        </span>
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                          {related.seating_capacity} Seats
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </motion.div>
  )
}
