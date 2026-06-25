import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { brandService } from '@/services/brand.service';
import SectionHeading from '@/components/ui/SectionHeading';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/utils/cn';
import type { Brand } from '@/types';

const CATEGORY_COLORS: Record<string, string> = {
  automotive: 'bg-blue-100 text-blue-700',
  electronics: 'bg-purple-100 text-purple-700',
  batteries: 'bg-amber-100 text-amber-700',
  solar: 'bg-green-100 text-green-700',
  lubricants: 'bg-orange-100 text-orange-700',
  networking: 'bg-cyan-100 text-cyan-700',
  other: 'bg-gray-100 text-gray-700',
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.05, duration: 0.4 },
  }),
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

export default function AuthorizedBrandsGrid() {
  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['all-brands'],
    queryFn: brandService.getAll,
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = Array.from(new Set(brands.map((b) => b.category))).sort();

  const filteredBrands =
    activeCategory === 'all'
      ? brands
      : brands.filter((b) => b.category === activeCategory);

  if (isLoading) {
    return (
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading label="Partners" title="Authorized Brands & Partners" centered />
          <div className="flex justify-center gap-3 mb-10">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-full" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (brands.length === 0) return null;

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Partners"
          title="Authorized Brands & Partners"
          description="We proudly represent a diverse portfolio of world-class brands across multiple categories."
          centered
        />

        {/* Category Filter Pills */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-wrap justify-center gap-3"
        >
          <button
            onClick={() => setActiveCategory('all')}
            className={cn(
              'rounded-full px-5 py-2 text-sm font-medium transition-all duration-300',
              activeCategory === 'all'
                ? 'bg-primary-600 text-white shadow-md shadow-primary-600/25'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            All Brands ({brands.length})
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                'rounded-full px-5 py-2 text-sm font-medium capitalize transition-all duration-300',
                activeCategory === category
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/25'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {category} ({brands.filter((b) => b.category === category).length})
            </button>
          ))}
        </motion.div>

        {/* Brands Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          >
            {filteredBrands.map((brand, index) => (
              <motion.div
                key={brand.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
              >
                <div className="group relative flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-900/5">
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gray-50 p-3 transition-all duration-300 group-hover:bg-primary-50">
                    <img
                      src={brand.logo_url}
                      alt={brand.name}
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm font-bold text-gray-900 transition-colors group-hover:text-primary-600">
                      {brand.name}
                    </h3>
                    <span
                      className={cn(
                        'mt-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                        CATEGORY_COLORS[brand.category] || CATEGORY_COLORS.other
                      )}
                    >
                      {brand.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
