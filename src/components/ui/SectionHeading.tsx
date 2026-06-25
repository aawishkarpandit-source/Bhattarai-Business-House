import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  centered?: boolean;
  light?: boolean;
  className?: string;
}

export default function SectionHeading({
  label,
  title,
  description,
  centered = false,
  light = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'mb-10 lg:mb-14',
        centered && 'text-center',
        className
      )}
    >
      {label && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className={cn(
            'inline-block text-xs font-semibold uppercase tracking-[0.2em] mb-3',
            light ? 'text-primary-300' : 'text-primary-600'
          )}
        >
          {label}
        </motion.span>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={cn(
          'font-serif text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]',
          light ? 'text-white' : 'text-gray-900'
        )}
      >
        {title}
      </motion.h2>

      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'mt-4 h-1 w-16 origin-left rounded-full',
          centered && 'mx-auto',
          light
            ? 'bg-gradient-to-r from-accent-400 to-accent-500'
            : 'bg-gradient-to-r from-primary-600 to-primary-400'
        )}
      />

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={cn(
            'mt-5 max-w-2xl text-base leading-relaxed',
            centered && 'mx-auto',
            light ? 'text-gray-300' : 'text-gray-500'
          )}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
