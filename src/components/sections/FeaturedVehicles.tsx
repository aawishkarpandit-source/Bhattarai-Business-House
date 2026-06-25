import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, Fuel, Settings2, Users } from 'lucide-react';
import { vehicleService } from '@/services/vehicle.service';
import SectionHeading from '@/components/ui/SectionHeading';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { formatCurrency } from '@/utils/format';
import type { Vehicle } from '@/types';

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6 },
  }),
};

export default function FeaturedVehicles() {
  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ['featured-vehicles'],
    queryFn: vehicleService.getFeatured,
  });

  if (isLoading) {
    return (
      <section className="bg-gray-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading label="Our Collection" title="Featured Vehicles" centered />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (vehicles.length === 0) return null;

  return (
    <section className="bg-gray-50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Our Collection"
          title="Featured Vehicles"
          description="Discover our handpicked selection of premium vehicles, each offering unmatched performance and style."
          centered
        />

        <div className="mt-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.slice(0, 6).map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              <Link
                to={`/vehicles/${vehicle.id}`}
                className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-900/5 hover:border-primary-200"
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <div className="aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200">
                    <img
                      src={vehicle.thumbnail_url}
                      alt={vehicle.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  {vehicle.is_ev && (
                    <span className="absolute left-4 top-4 rounded-full bg-green-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                      Electric
                    </span>
                  )}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 transition-all duration-500 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-4 py-2 text-xs font-semibold text-primary-700 backdrop-blur-sm">
                      View Details
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      {vehicle.brand && (
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
                          {vehicle.brand.name}
                        </span>
                      )}
                      <h3 className="mt-1 font-serif text-lg font-bold text-gray-900 transition-colors group-hover:text-primary-600">
                        {vehicle.name}
                      </h3>
                    </div>
                    <span className="shrink-0 rounded-lg bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700">
                      {vehicle.model_year}
                    </span>
                  </div>

                  <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                    {vehicle.short_description}
                  </p>

                  {/* Specs */}
                  <div className="mt-4 flex items-center gap-4 border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Fuel className="h-3.5 w-3.5 text-primary-500" />
                      <span className="capitalize">{vehicle.fuel_type}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Settings2 className="h-3.5 w-3.5 text-primary-500" />
                      <span className="capitalize">{vehicle.transmission}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Users className="h-3.5 w-3.5 text-primary-500" />
                      <span>{vehicle.seating_capacity} Seats</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                        Starting from
                      </span>
                      <p className="font-serif text-lg font-bold text-primary-700">
                        {formatCurrency(vehicle.price, vehicle.price_currency)}
                      </p>
                    </div>
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
            to="/vehicles"
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary-600/30 hover:scale-105 active:scale-95"
          >
            Explore All Vehicles
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
