import { useEffect, useState, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { Image, Video, X, ChevronLeft, ChevronRight, Grid } from 'lucide-react'
import { galleryService } from '@/services/gallery.service'
import { Skeleton } from '@/components/ui/Skeleton'
import type { GalleryItem } from '@/types'

const CATEGORIES = ['All', 'Events', 'Vehicles', 'Office', 'Team', 'Products'] as const
type CategoryFilter = (typeof CATEGORIES)[number]

const MEDIA_TYPES = ['all', 'image', 'video'] as const
type MediaTypeFilter = (typeof MEDIA_TYPES)[number]

function GallerySkeleton() {
  return (
    <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="mb-4 break-inside-avoid">
          <Skeleton className="w-full rounded-2xl" style={{ height: `${180 + (i % 3) * 60}px` }} />
          <Skeleton className="mt-2 h-4 w-3/4" />
          <Skeleton className="mt-1 h-3 w-1/2" />
        </div>
      ))}
    </div>
  )
}

function MediaBadge({ type }: { type: 'image' | 'video' }) {
  return (
    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-lg bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
      {type === 'video' ? <Video className="h-3 w-3" /> : <Image className="h-3 w-3" />}
      {type === 'video' ? 'Video' : 'Photo'}
    </span>
  )
}

function LightboxModal({
  items,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  items: GalleryItem[]
  currentIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const item = items[currentIndex]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose, onPrev, onNext])

  if (!item) return null

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        onClick={onClose}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Previous button */}
        {items.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onPrev()
            }}
            className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        {/* Next button */}
        {items.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onNext()
            }}
            className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 sm:right-20"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}

        {/* Content */}
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative max-h-[85vh] max-w-5xl"
          onClick={(e) => e.stopPropagation()}
        >
          {item.media_type === 'video' ? (
            <video
              src={item.media_url}
              controls
              autoPlay
              className="max-h-[75vh] w-full rounded-xl object-contain"
            />
          ) : (
            <img
              src={item.media_url}
              alt={item.title}
              className="max-h-[75vh] w-full rounded-xl object-contain"
            />
          )}

          <div className="mt-4 text-center">
            <h3 className="text-lg font-bold text-white">{item.title}</h3>
            {item.description && (
              <p className="mt-1 text-sm text-gray-300">{item.description}</p>
            )}
            <p className="mt-2 text-xs text-gray-400">
              {currentIndex + 1} / {items.length}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All')
  const [selectedMediaType, setSelectedMediaType] = useState<MediaTypeFilter>('all')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    document.title = 'Gallery | Bhattarai Business House'
    return () => {
      document.title = 'Bhattarai Business House'
    }
  }, [])

  const { data: galleryItems = [], isLoading } = useQuery<GalleryItem[]>({
    queryKey: ['gallery'],
    queryFn: () => galleryService.getAll(),
  })

  const filteredItems = useMemo(() => {
    return galleryItems.filter((item) => {
      if (!item.is_active) return false
      const categoryMatch =
        selectedCategory === 'All' || item.category === selectedCategory
      const mediaMatch =
        selectedMediaType === 'all' || item.media_type === selectedMediaType
      return categoryMatch && mediaMatch
    })
  }, [galleryItems, selectedCategory, selectedMediaType])

  const categoriesWithData = useMemo(() => {
    const cats = new Set(galleryItems.filter((i) => i.is_active).map((i) => i.category))
    return CATEGORIES.filter((c) => c === 'All' || cats.has(c))
  }, [galleryItems])

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
  }, [])

  const prevItem = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? null : prev > 0 ? prev - 1 : filteredItems.length - 1))
  }, [filteredItems.length])

  const nextItem = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null ? null : prev < filteredItems.length - 1 ? prev + 1 : 0
    )
  }, [filteredItems.length])

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
              Our Collection
            </span>
            <h1 className="font-serif text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Gallery
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-200">
              Explore moments, milestones, and the essence of Bhattarai Business House.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Gallery */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 space-y-4"
        >
          {/* Media Type Toggle */}
          <div className="flex items-center gap-3">
            <Grid className="h-4 w-4 text-gray-500" />
            <div className="flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
              {([
                { key: 'all' as const, label: 'All Media' },
                { key: 'image' as const, label: 'Images', icon: <Image className="h-3.5 w-3.5" /> },
                { key: 'video' as const, label: 'Videos', icon: <Video className="h-3.5 w-3.5" /> },
              ]).map((mt) => (
                <button
                  key={mt.key}
                  onClick={() => setSelectedMediaType(mt.key)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    selectedMediaType === mt.key
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-600/25'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {mt.icon}
                  {mt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categoriesWithData.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-500">
            {isLoading ? (
              <Skeleton className="inline-block h-4 w-32" />
            ) : (
              <>
                Showing{' '}
                <span className="font-semibold text-gray-900">{filteredItems.length}</span>{' '}
                {filteredItems.length === 1 ? 'item' : 'items'}
              </>
            )}
          </p>
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <GallerySkeleton />
        ) : filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-gray-200 bg-white py-16 text-center"
          >
            <Image className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No items found</h3>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your filter criteria or check back later.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All')
                setSelectedMediaType('all')
              }}
              className="mt-6 rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <LayoutGroup>
            <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    className="mb-4 break-inside-avoid"
                  >
                    <button
                      onClick={() => openLightbox(index)}
                      className="group relative block w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    >
                      <div className="relative overflow-hidden">
                        {item.media_type === 'video' ? (
                          <div className="relative">
                            <video
                              src={item.media_url}
                              className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              style={{ aspectRatio: index % 5 === 0 ? '3/4' : index % 3 === 0 ? '4/5' : '16/10' }}
                              muted
                              preload="metadata"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
                              <div className="rounded-full bg-white/90 p-3 shadow-lg transition-transform group-hover:scale-110">
                                <Video className="h-6 w-6 text-primary-700" />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <img
                            src={item.media_url}
                            alt={item.title}
                            className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            style={{ aspectRatio: index % 5 === 0 ? '3/4' : index % 3 === 0 ? '4/5' : '16/10' }}
                            loading="lazy"
                          />
                        )}
                        <MediaBadge type={item.media_type} />
                      </div>
                      <div className="p-3.5">
                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-xs text-gray-500 capitalize">{item.category}</p>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </LayoutGroup>
        )}
      </section>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && filteredItems.length > 0 && (
        <LightboxModal
          items={filteredItems}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevItem}
          onNext={nextItem}
        />
      )}
    </div>
  )
}
