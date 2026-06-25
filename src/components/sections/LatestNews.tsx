import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { newsService } from '@/services/news.service';
import SectionHeading from '@/components/ui/SectionHeading';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { formatDate } from '@/utils/format';
import type { NewsArticle } from '@/types';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6 },
  }),
};

export default function LatestNews() {
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['latest-news'],
    queryFn: () => newsService.getAll(true),
  });

  const latestArticles = articles.slice(0, 3);

  if (isLoading) {
    return (
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading label="News" title="Latest News & Updates" centered />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (latestArticles.length === 0) return null;

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="News"
          title="Latest News & Updates"
          description="Stay informed with the latest developments from Bhattarai Business House and our partner brands."
          centered
        />

        <div className="mt-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {latestArticles.map((article, index) => (
            <motion.div
              key={article.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              <Link
                to={`/news/${article.slug}`}
                className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-900/5 hover:border-primary-200"
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <div className="aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200">
                    <img
                      src={article.featured_image}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  {article.tags.length > 0 && (
                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-700 backdrop-blur-sm">
                      {article.tags[0]}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {formatDate(article.published_at || article.created_at)}
                    </span>
                  </div>

                  <h3 className="mt-3 font-serif text-lg font-bold text-gray-900 transition-colors group-hover:text-primary-600 line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
                    {article.excerpt}
                  </p>

                  <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-primary-600 transition-all duration-300 group-hover:gap-3">
                    Read More
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
            to="/news"
            className="group inline-flex items-center gap-2 rounded-xl border-2 border-primary-600 px-8 py-3.5 text-sm font-semibold text-primary-600 transition-all duration-300 hover:bg-primary-600 hover:text-white hover:shadow-lg hover:shadow-primary-600/20"
          >
            View All News
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
