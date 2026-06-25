import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  ArrowRight,
  Target,
  Eye,
  History,
  Users,
  Award,
  CheckCircle,
} from 'lucide-react'
import { companyService } from '@/services/company.service'
import { teamService } from '@/services/team.service'
import { brandService } from '@/services/brand.service'
import SectionHeading from '@/components/ui/SectionHeading'
import { Skeleton, SkeletonText } from '@/components/ui/Skeleton'
import type { TeamMember, Brand } from '@/types'

const milestones = [
  {
    year: '1995',
    title: 'Founded',
    description: 'Bhattarai Business House was established with a vision to bring world-class automotive and electronic products to Nepal.',
  },
  {
    year: '2002',
    title: 'First Major Partnership',
    description: 'Secured first international brand authorization, marking the beginning of our journey as an authorized distributor.',
  },
  {
    year: '2010',
    title: 'Expansion into Solar',
    description: 'Expanded our product portfolio to include renewable energy solutions, becoming a pioneer in solar distribution.',
  },
  {
    year: '2015',
    title: 'Nationwide Network',
    description: 'Established distribution channels across all provinces of Nepal, ensuring nationwide product availability.',
  },
  {
    year: '2020',
    title: 'Digital Transformation',
    description: 'Embraced digital technologies to enhance customer experience and streamline our supply chain operations.',
  },
  {
    year: '2024',
    title: '25 Years of Excellence',
    description: 'Celebrated a quarter-century of trusted partnerships, innovation, and commitment to quality.',
  },
]

function TimelineItem({
  milestone,
  index,
}: {
  milestone: (typeof milestones)[0]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <div ref={ref} className="relative flex gap-8 pb-12 last:pb-0">
      {/* Line */}
      <div className="absolute left-[23px] top-10 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-primary-200 last:hidden" />

      {/* Dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-600 shadow-lg shadow-primary-600/30"
      >
        <span className="text-sm font-bold text-white">{milestone.year.slice(-2)}</span>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
        className="flex-1 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        <span className="text-sm font-bold text-primary-600">{milestone.year}</span>
        <h3 className="mt-1 font-serif text-xl font-bold text-gray-900">{milestone.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">{milestone.description}</p>
      </motion.div>
    </div>
  )
}

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="relative overflow-hidden">
          <img
            src={member.image_url || '/placeholder-avatar.jpg'}
            alt={member.name}
            className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="flex gap-2">
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-gray-700 backdrop-blur-sm transition-colors hover:bg-primary-600 hover:text-white"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              )}
              {member.social_linkedin && (
                <a
                  href={member.social_linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-gray-700 backdrop-blur-sm transition-colors hover:bg-primary-600 hover:text-white"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              )}
              {member.social_facebook && (
                <a
                  href={member.social_facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-gray-700 backdrop-blur-sm transition-colors hover:bg-primary-600 hover:text-white"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-serif text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
            {member.name}
          </h3>
          <p className="mt-1 text-sm font-medium text-primary-600">{member.position}</p>
          {member.bio && (
            <p className="mt-2 text-sm text-gray-500 line-clamp-2">{member.bio}</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function AboutPage() {
  useEffect(() => {
    document.title = 'About Us | Bhattarai Business House'
  }, [])

  const { data: companyData, isLoading: companyLoading } = useQuery<string | null>({
    queryKey: ['company', 'overview'],
    queryFn: () => companyService.get('overview'),
  })

  const { data: mission, isLoading: missionLoading } = useQuery<string | null>({
    queryKey: ['company', 'mission'],
    queryFn: () => companyService.get('mission'),
  })

  const { data: vision, isLoading: visionLoading } = useQuery<string | null>({
    queryKey: ['company', 'vision'],
    queryFn: () => companyService.get('vision'),
  })

  const { data: teamMembers = [], isLoading: teamLoading } = useQuery<TeamMember[]>({
    queryKey: ['team', 'active'],
    queryFn: () => teamService.getActive(),
  })

  const { data: brands = [], isLoading: brandsLoading } = useQuery<Brand[]>({
    queryKey: ['brands'],
    queryFn: () => brandService.getAll(),
  })

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
              Our Story
            </span>
            <h1 className="font-serif text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              About Us
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-200">
              Discover the story behind Nepal's trusted distributor of automotive, electronics, and renewable energy products.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeading
              label="Who We Are"
              title="Nepal's Premier Authorized Distributor"
            />
            {companyLoading ? (
              <div className="space-y-4">
                <SkeletonText lines={6} />
              </div>
            ) : (
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {companyData || 'Bhattarai Business House is a leading authorized distributor of automotive vehicles, electronic products, batteries, solar solutions, networking equipment, and lubricants in Nepal. With over two decades of experience, we have built strong partnerships with world-renowned brands to deliver quality products and services across the nation.'}
                </p>
              </div>
            )}
            <div className="mt-8 grid grid-cols-3 gap-6">
              {[
                { icon: Award, value: '25+', label: 'Years Experience' },
                { icon: Users, value: '50+', label: 'Team Members' },
                { icon: CheckCircle, value: '30+', label: 'Brand Partners' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="text-center"
                >
                  <stat.icon className="mx-auto h-8 w-8 text-primary-600" />
                  <p className="mt-2 font-serif text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-2xl shadow-2xl">
              <img
                src="/placeholder-about.jpg"
                alt="Bhattarai Business House Office"
                className="w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 rounded-2xl bg-primary-600 p-6 shadow-xl">
              <p className="font-serif text-3xl font-bold text-white">25+</p>
              <p className="text-sm text-primary-200">Years of Trust</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Our Purpose"
            title="Mission & Vision"
            centered
          />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-8 shadow-sm"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-600">
                <Target className="h-7 w-7" />
              </div>
              <h3 className="mt-6 font-serif text-2xl font-bold text-gray-900">Our Mission</h3>
              {missionLoading ? (
                <SkeletonText lines={4} className="mt-4" />
              ) : (
                <p className="mt-4 text-gray-600 leading-relaxed">
                  {mission || 'To provide exceptional products and services by connecting world-class brands with the Nepali market, while building lasting relationships based on trust, quality, and mutual growth.'}
                </p>
              )}
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-8 shadow-sm"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-600">
                <Eye className="h-7 w-7" />
              </div>
              <h3 className="mt-6 font-serif text-2xl font-bold text-gray-900">Our Vision</h3>
              {visionLoading ? (
                <SkeletonText lines={4} className="mt-4" />
              ) : (
                <p className="mt-4 text-gray-600 leading-relaxed">
                  {vision || 'To be Nepal\'s most trusted and preferred distributor, recognized for our commitment to quality, innovation, and sustainable business practices that enrich the lives of our customers and communities.'}
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline / History */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_2fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="sticky top-24"
            >
              <SectionHeading
                label="Our Journey"
                title="History & Milestones"
                description="From a humble beginning to becoming one of Nepal's leading distributors."
              />
              <div className="flex items-center gap-3 rounded-xl bg-primary-50 p-4">
                <History className="h-6 w-6 text-primary-600" />
                <p className="text-sm font-medium text-primary-700">
                  Over 25 years of trusted partnerships and growth.
                </p>
              </div>
            </motion.div>
          </div>

          <div className="relative">
            {milestones.map((milestone, index) => (
              <TimelineItem key={milestone.year} milestone={milestone} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Management Team */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Our People"
            title="Leadership Team"
            description="Meet the experienced professionals driving our success."
            centered
          />

          {teamLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <Skeleton className="aspect-square w-full rounded-xl" />
                  <Skeleton className="mt-4 h-5 w-3/4" />
                  <Skeleton className="mt-2 h-4 w-1/2" />
                  <SkeletonText lines={2} className="mt-3" />
                </div>
              ))}
            </div>
          ) : teamMembers.length === 0 ? (
            <p className="text-center text-gray-500">Team information coming soon.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {teamMembers.map((member, index) => (
                <TeamCard key={member.id} member={member} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Authorized Brands Showcase */}
      <section className="border-t border-gray-200 bg-gray-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Our Partners"
            title="Authorized Brands"
            description="We represent the world's most trusted brands in Nepal."
            centered
          />

          {brandsLoading ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {brands.map((brand, index) => (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: index * 0.04 }}
                  className="group"
                >
                  <div className="flex h-24 items-center justify-center rounded-xl border border-gray-100 bg-white p-4 transition-all duration-300 hover:border-primary-200 hover:bg-primary-50 hover:shadow-md">
                    <img
                      src={brand.logo_url}
                      alt={brand.name}
                      className="max-h-14 max-w-full object-contain opacity-70 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                    />
                  </div>
                  <p className="mt-2 text-center text-xs font-medium text-gray-500 group-hover:text-primary-600 transition-colors">
                    {brand.name}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
              Partner With Us
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-200">
              Interested in becoming a dealer or exploring business opportunities? We'd love to hear from you.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-primary-700 shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl"
              >
                Get in Touch
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
              >
                View Products
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
