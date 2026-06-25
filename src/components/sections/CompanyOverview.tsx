import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { companyService } from '@/services/company.service';
import { cn } from '@/utils/cn';

interface CounterProps {
  end: number;
  suffix?: string;
  duration?: number;
}

function AnimatedCounter({ end, suffix = '', duration = 2 }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [end, duration, isInView]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

const STATS = [
  { label: 'Years of Experience', value: 35, suffix: '+' },
  { label: 'Trusted Brands', value: 15, suffix: '+' },
  { label: 'Happy Customers', value: 5000, suffix: '+' },
];

export default function CompanyOverview() {
  const { data: overview } = useQuery({
    queryKey: ['company-overview'],
    queryFn: () => companyService.get('overview'),
  });

  const { data: tagline } = useQuery({
    queryKey: ['company-tagline'],
    queryFn: () => companyService.get('tagline'),
  });

  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-28">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-white to-accent-50/30" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
              About Us
            </span>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              {tagline || 'A Legacy of Trust & Excellence'}
            </h2>
            <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-primary-600 to-primary-400" />
            <p className="mt-6 max-w-lg text-base leading-relaxed text-gray-500 lg:text-lg">
              {overview ||
                'For over three decades, Bhattarai Business House has been a cornerstone of Nepal\'s automotive and consumer goods industry. We bring world-class brands to your doorstep with unwavering commitment to quality, service, and customer satisfaction.'}
            </p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-8"
            >
              <Link
                to="/about"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700"
              >
                Learn More About Us
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats & Decorative Element */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative rounded-3xl bg-gradient-to-br from-primary-900 to-primary-800 p-8 shadow-2xl shadow-primary-900/20 sm:p-10">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-2xl bg-accent-400/20 blur-2xl" />
              <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-2xl bg-primary-400/20 blur-2xl" />

              <div className="grid grid-cols-3 gap-6">
                {STATS.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                    className="text-center"
                  >
                    <div className="font-serif text-3xl font-bold text-white sm:text-4xl">
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="mt-1 text-xs font-medium uppercase tracking-wider text-primary-200">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 -z-10 h-full w-full rounded-3xl border-2 border-primary-200" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
