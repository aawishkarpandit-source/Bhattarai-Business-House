import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Calendar,
  User,
  Tag,
  Share2,
  Globe,
  MessageCircle,
  LinkIcon,
  ChevronRight,
} from 'lucide-react'
import { format } from 'date-fns'
import { newsService } from '@/services/news.service'
import { Skeleton, SkeletonText } from '@/components/ui/Skeleton'
import type { NewsArticle } from '@/types'

export default function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>()

  const { data: article, isLoading, error } = useQuery<NewsArticle | null>({
    queryKey: ['news', slug],
    queryFn: () => (slug ? newsService.getBySlug(slug) : null),
    enabled: !!slug,
  })

  const { data: relatedArticles = [] } = useQuery<NewsArticle[]>({
    queryKey: ['news', 'related', article?.id],
    queryFn: () => newsService.getAll(true),
    enabled: !!article,
  })

  const related = relatedArticles
    .filter((a) => a.id !== article?.id)
    .slice(0, 3)

  useEffect(() => {
    if (article) {
      document.title = `${article.meta_title || article.title} | Bhattarai Business House`

      const metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc) {
        metaDesc.setAttribute('content', article.meta_description || article.excerpt || '')
      }
    }
  }, [article])

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return ''
    try {
      return format(new Date(dateStr), 'MMMM dd, yyyy')
    } catch {
      return dateStr
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="mb-4 h-4 w-48" />
          <Skeleton className="mb-6 h-10 w-3/4" />
          <div className="mb-6 flex gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="mb-8 aspect-[2/1] w-full rounded-2xl" />
          <SkeletonText lines={12} />
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Article Not Found</h2>
          <p className="mt-2 text-gray-500">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/news"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to News
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="transition-colors hover:text-primary-600">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/news" className="transition-colors hover:text-primary-600">
              News
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-900 font-medium line-clamp-1">{article.title}</span>
          </nav>
        </div>
      </div>

      {/* Article */}
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-lg bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="font-serif text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4 text-gray-400" />
              {article.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-gray-400" />
              {formatDate(article.published_at || article.created_at)}
            </span>
          </div>
        </motion.div>

        {/* Featured Image */}
        {article.featured_image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 overflow-hidden rounded-2xl"
          >
            <img
              src={article.featured_image}
              alt={article.title}
              className="w-full object-cover"
            />
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="prose prose-lg prose-gray max-w-none mt-10
            prose-headings:font-serif prose-headings:text-gray-900
            prose-p:text-gray-600 prose-p:leading-relaxed
            prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl
            prose-strong:text-gray-900
            prose-blockquote:border-primary-500 prose-blockquote:text-gray-600"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Share Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 border-t border-gray-200 pt-8"
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <Share2 className="h-4 w-4" />
              Share this article
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                    '_blank'
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-all hover:bg-blue-600 hover:text-white"
                aria-label="Share on Facebook"
              >
                <Globe className="h-4 w-4" />
              </button>
              <button
                onClick={() =>
                  window.open(
                    `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`,
                    '_blank'
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-all hover:bg-sky-500 hover:text-white"
                aria-label="Share on Twitter"
              >
                <MessageCircle className="h-4 w-4" />
              </button>
              <button
                onClick={() =>
                  window.open(
                    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
                    '_blank'
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-all hover:bg-blue-700 hover:text-white"
                aria-label="Share on LinkedIn"
              >
                <LinkIcon className="h-4 w-4" />
              </button>
              <button
                onClick={copyLink}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-all hover:bg-primary-600 hover:text-white"
                aria-label="Copy link"
              >
                <LinkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Back Link */}
        <div className="mt-10">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All News
          </Link>
        </div>
      </article>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="border-t border-gray-200 bg-white py-14 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rel, index) => (
                <motion.div
                  key={rel.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link
                    to={`/news/${rel.slug}`}
                    className="group block h-full rounded-2xl border border-gray-100 bg-gray-50 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="relative overflow-hidden rounded-t-2xl">
                      <img
                        src={rel.featured_image || '/placeholder-news.jpg'}
                        alt={rel.title}
                        className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {rel.title}
                      </h3>
                      {rel.excerpt && (
                        <p className="mt-2 text-sm text-gray-500 line-clamp-2">{rel.excerpt}</p>
                      )}
                      <div className="mt-3 text-xs text-gray-400">
                        {formatDate(rel.published_at || rel.created_at)}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
