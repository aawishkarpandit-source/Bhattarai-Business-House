import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Search, ArrowRight, Calendar, User, Newspaper } from 'lucide-react'
import { format } from 'date-fns'
import { newsService } from '@/services/news.service'
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton'
import type { NewsArticle } from '@/types'

const ARTICLES_PER_PAGE = 9

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    document.title = 'News & Updates | Bhattarai Business House'
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, selectedTag])

  const { data: allArticles = [], isLoading } = useQuery<NewsArticle[]>({
    queryKey: ['news'],
    queryFn: () => newsService.getAll(true),
  })

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    allArticles.forEach((article) => {
      article.tags?.forEach((tag) => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [allArticles])

  const filteredArticles = useMemo(() => {
    let result = allArticles
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt?.toLowerCase().includes(q)
      )
    }
    if (selectedTag) {
      result = result.filter((a) => a.tags?.includes(selectedTag))
    }
    return result
  }, [allArticles, debouncedSearch, selectedTag])

  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE)
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE
  )

  const featuredArticle = paginatedArticles[0]
  const remainingArticles = paginatedArticles.slice(1)

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return ''
    try {
      return format(new Date(dateStr), 'MMM dd, yyyy')
    } catch {
      return dateStr
    }
  }

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
              Stay Informed
            </span>
            <h1 className="font-serif text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              News & Updates
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-200">
              Stay up to date with the latest news, product launches, and company updates from Bhattarai Business House.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <div className="relative mx-auto max-w-xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-gray-900 shadow-sm transition-shadow focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:shadow-md"
            />
          </div>
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-10"
        >
          <div className="flex flex-wrap items-center gap-2 justify-center">
            <button
              onClick={() => setSelectedTag(null)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
                selectedTag === null
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All Topics
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  selectedTag === tag
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading ? (
          <>
            {/* Featured Skeleton */}
            <div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
              <Skeleton className="h-80 rounded-2xl" />
              <div className="flex flex-col justify-center space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </>
        ) : filteredArticles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-gray-200 bg-white py-16 text-center"
          >
            <Newspaper className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No articles found</h3>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedTag(null)
              }}
              className="mt-6 rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <>
            {/* Featured Article */}
            {featuredArticle && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-10"
              >
                <Link
                  to={`/news/${featuredArticle.slug}`}
                  className="group grid grid-cols-1 gap-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg lg:grid-cols-2"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={featuredArticle.featured_image || '/placeholder-news.jpg'}
                      alt={featuredArticle.title}
                      className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                      Featured
                    </span>
                  </div>
                  <div className="flex flex-col justify-center p-6 lg:p-8">
                    <div className="mb-3 flex flex-wrap gap-2">
                      {featuredArticle.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-block rounded-md bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-gray-900 transition-colors group-hover:text-primary-600 sm:text-3xl">
                      {featuredArticle.title}
                    </h2>
                    {featuredArticle.excerpt && (
                      <p className="mt-4 text-gray-500 line-clamp-3">{featuredArticle.excerpt}</p>
                    )}
                    <div className="mt-6 flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <User className="h-4 w-4" />
                        {featuredArticle.author}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        {formatDate(featuredArticle.published_at || featuredArticle.created_at)}
                      </span>
                    </div>
                    <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600">
                      Read Article
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Articles Grid */}
            {remainingArticles.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {remainingArticles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                  >
                    <Link
                      to={`/news/${article.slug}`}
                      className="group block h-full rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    >
                      <div className="relative overflow-hidden rounded-t-2xl">
                        <img
                          src={article.featured_image || '/placeholder-news.jpg'}
                          alt={article.title}
                          className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-5">
                        {article.tags && article.tags.length > 0 && (
                          <div className="mb-3 flex flex-wrap gap-1.5">
                            {article.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="inline-block rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                          {article.title}
                        </h3>
                        {article.excerpt && (
                          <p className="mt-2 text-sm text-gray-500 line-clamp-2">{article.excerpt}</p>
                        )}
                        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5" />
                            {article.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(article.published_at || article.created_at)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-10 w-10 rounded-xl text-sm font-medium transition-all ${
                      currentPage === page
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                        : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
