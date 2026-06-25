import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { brandService } from '@/services/brand.service';
import SectionHeading from '@/components/ui/SectionHeading';
import { SkeletonCard } from '@/components/ui/Skeleton';
import type { Brand } from '@/types';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6 },
  }),
};

export default function FeaturedBrands() {
  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['featured-brands'],
    queryFn: brandService.getFeatured,
  });

  const automotiveBrands = brands.filter((b) => b.category === 'automotive').slice(0, 3);

  if (isLoading) {
    return (
      <section className="bg-gray-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading label="Our Partners" title="Our Automotive Brands" centered />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (automotiveBrands.length === 0) return null;

  return (
    <section className="bg-gray-50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Our Partners"
          title="Our Automotive Brands"
          description="Representing world-class automotive brands committed to quality and innovation."
          centered
        />

        <div className="mt-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {automotiveBrands.map((brand, index) => (
            <motion.div
              key={brand.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              <Link
                to={`/brands/${brand.slug}`}
                className="group relative block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-900/5 hover:border-primary-200"
              >
                <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 p-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-600/0 to-primary-600/0 transition-all duration-500 group-hover:from-primary-600/5 group-hover:to-primary-600/10" />
                  <img
                    src={brand.logo_url}
                    alt={brand.name}
                    className="relative h-20 w-auto object-contain transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>

                <div className="p-6">
                  <div className="mb-2 inline-block rounded-full bg-primary-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-600">
                    {brand.category}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-gray-900 transition-colors group-hover:text-primary-600">
                    {brand.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
                    {brand.description}
                  </p>

                  <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-primary-600 transition-all duration-300 group-hover:gap-3">
                    View Details
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <Link
            to="/products"
            className="group inline-flex items-center gap-2 rounded-xl border-2 border-primary-600 px-8 py-3.5 text-sm font-semibold text-primary-600 transition-all duration-300 hover:bg-primary-600 hover:text-white hover:shadow-lg hover:shadow-primary-600/20"
          >
            View All Brands
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
