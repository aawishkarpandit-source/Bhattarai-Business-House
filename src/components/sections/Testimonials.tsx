import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { testimonialService } from '@/services/testimonial.service';
import SectionHeading from '@/components/ui/SectionHeading';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/utils/cn';
import type { Testimonial } from '@/types';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={cn('h-4 w-4', i < rating ? 'text-amber-400' : 'text-gray-200')}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['featured-testimonials'],
    queryFn: testimonialService.getFeatured,
  });

  const [[current, direction], setCurrent] = useState([0, 0]);

  const paginate = useCallback(
    (dir: number) => {
      if (testimonials.length === 0) return;
      setCurrent(([prev]) => {
        const next = (prev + dir + testimonials.length) % testimonials.length;
        return [next, dir];
      });
    },
    [testimonials.length]
  );

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => paginate(1), 7000);
    return () => clearInterval(timer);
  }, [testimonials.length, paginate]);

  if (isLoading) {
    return (
      <section className="bg-gray-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading label="Testimonials" title="What Our Clients Say" centered />
          <div className="mx-auto max-w-3xl">
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  const active: Testimonial = testimonials[current];

  return (
    <section className="bg-gray-50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Testimonials"
          title="What Our Clients Say"
          description="Hear from our satisfied clients who have experienced the Bhattarai Business House difference."
          centered
        />

        <div className="relative mx-auto mt-4 max-w-4xl">
          {/* Quote Card */}
          <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg shadow-primary-900/5 sm:p-12">
            <Quote className="absolute left-8 top-8 h-16 w-16 text-primary-100 sm:left-12 sm:top-10 sm:h-20 sm:w-20" />

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active.id}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10"
              >
                <blockquote className="relative">
                  <p className="text-lg leading-relaxed text-gray-600 sm:text-xl sm:leading-relaxed">
                    &ldquo;{active.content}&rdquo;
                  </p>
                </blockquote>

                <div className="mt-8 flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="h-14 w-14 overflow-hidden rounded-full bg-gradient-to-br from-primary-400 to-primary-600 p-[2px]">
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                        {active.client_image ? (
                          <img
                            src={active.client_image}
                            alt={active.client_name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="font-serif text-lg font-bold text-primary-600">
                            {active.client_name.charAt(0)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="font-serif text-base font-bold text-gray-900">
                      {active.client_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {active.client_title}
                    </div>
                    <div className="mt-1">
                      <StarRating rating={active.rating} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => paginate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-300 hover:border-primary-300 hover:text-primary-600 hover:shadow-md"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent([index, index > current ? 1 : -1])}
                  aria-label={`Go to testimonial ${index + 1}`}
                  className={cn(
                    'rounded-full transition-all duration-300',
                    index === current
                      ? 'h-2.5 w-2.5 bg-primary-600'
                      : 'h-2 w-2 bg-gray-300 hover:bg-gray-400'
                  )}
                />
              ))}
            </div>

            <button
              onClick={() => paginate(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-300 hover:border-primary-300 hover:text-primary-600 hover:shadow-md"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
