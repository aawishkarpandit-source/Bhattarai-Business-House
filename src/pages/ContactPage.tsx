import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Building,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Globe,
  MessageCircle,
  Share2,
  Link as LinkIcon,
} from 'lucide-react'
import { contactService } from '@/services/contact.service'
import { Skeleton } from '@/components/ui/Skeleton'
import Button from '@/components/ui/Button'
import SectionHeading from '@/components/ui/SectionHeading'
import type { ContactDetail } from '@/types'

const contactFormSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(
      /^(?:\+977[-\s]?)?(?:98[0-9]|97[0-9]|96[0-9]|95[0-9]|94[0-9])[-\s]?\d{3}[-\s]?\d{4}$/,
      'Please enter a valid Nepali phone number (e.g., 98XXXXXXXX or +977-98XXXXXXXX)'
    ),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(200, 'Subject must be less than 200 characters'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters'),
})

type ContactFormData = z.infer<typeof contactFormSchema>

const WEEKDAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

function formatBusinessHours(hours: Record<string, string>): string[] {
  return WEEKDAY_ORDER.filter((day) => hours[day]).map(
    (day) => `${day.charAt(0).toUpperCase() + day.slice(1)}: ${hours[day]}`
  )
}

function BranchCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <Skeleton className="mb-3 h-6 w-3/4" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="mb-4 h-4 w-2/3" />
      <Skeleton className="mb-2 h-4 w-1/2" />
      <Skeleton className="mb-4 h-4 w-2/5" />
      <Skeleton className="h-10 w-32 rounded-xl" />
    </div>
  )
}

function ContactSuccessState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center"
    >
      <div className="mx-auto mb-4 rounded-full bg-green-100 p-3 w-fit">
        <CheckCircle2 className="h-8 w-8 text-green-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900">Message Sent Successfully!</h3>
      <p className="mt-2 text-sm text-gray-600">
        Thank you for reaching out. We'll get back to you within 24 hours.
      </p>
    </motion.div>
  )
}

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false)

  const { data: contactDetails = [], isLoading: contactLoading } = useQuery<ContactDetail[]>({
    queryKey: ['contact-details'],
    queryFn: () => contactService.getAll(),
  })

  const headquarters = contactDetails.find((c) => c.is_headquarters)
  const otherBranches = contactDetails.filter((c) => !c.is_headquarters)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  })

  useEffect(() => {
    document.title = 'Contact Us | Bhattarai Business House'
    return () => {
      document.title = 'Bhattarai Business House'
    }
  }, [])

  const onSubmit = async (_data: ContactFormData) => {
    // Simulate API call - replace with actual contact submission service
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setFormSubmitted(true)
    reset()
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
              Get in Touch
            </span>
            <h1 className="font-serif text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Contact Us
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-200">
              We'd love to hear from you. Reach out to us for inquiries, partnerships, or any assistance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Contact Info Bar */}
      <section className="border-b border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="rounded-xl bg-primary-50 p-3">
                <Phone className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Call Us</p>
                <a href="tel:+977-1-4XXXXXX" className="text-base font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                  +977-1-4XXXXXX
                </a>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-4"
            >
              <div className="rounded-xl bg-primary-50 p-3">
                <Mail className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email Us</p>
                <a href="mailto:info@bhattaraibusiness.com" className="text-base font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                  info@bhattaraibusiness.com
                </a>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center gap-4"
            >
              <div className="rounded-xl bg-primary-50 p-3">
                <Clock className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Working Hours</p>
                <p className="text-base font-semibold text-gray-900">Sun - Fri: 9AM - 5PM</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form & Branch Locations */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeading
              label="Send a Message"
              title="Get in Touch"
              description="Fill out the form below and our team will respond to you shortly."
            />

            {formSubmitted ? (
              <ContactSuccessState />
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <label htmlFor="full_name" className="mb-1.5 block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                        <Send className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        id="full_name"
                        type="text"
                        placeholder="Your full name"
                        className={`block w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                          errors.full_name ? 'border-red-300' : 'border-gray-200'
                        }`}
                        {...register('full_name')}
                      />
                    </div>
                    {errors.full_name && (
                      <p className="mt-1.5 text-xs text-red-500">{errors.full_name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                        <Mail className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className={`block w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                          errors.email ? 'border-red-300' : 'border-gray-200'
                        }`}
                        {...register('email')}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                        <Phone className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="98XXXXXXXX"
                        className={`block w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                          errors.phone ? 'border-red-300' : 'border-gray-200'
                        }`}
                        {...register('phone')}
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1.5 text-xs text-red-500">{errors.phone.message}</p>
                    )}
                  </div>

                  {/* Subject */}
                  <div className="sm:col-span-2">
                    <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-gray-700">
                      Subject
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                        <Building className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        id="subject"
                        type="text"
                        placeholder="How can we help?"
                        className={`block w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                          errors.subject ? 'border-red-300' : 'border-gray-200'
                        }`}
                        {...register('subject')}
                      />
                    </div>
                    {errors.subject && (
                      <p className="mt-1.5 text-xs text-red-500">{errors.subject.message}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="sm:col-span-2">
                    <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Write your message here..."
                      className={`block w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                        errors.message ? 'border-red-300' : 'border-gray-200'
                      }`}
                      {...register('message')}
                    />
                    {errors.message && (
                      <p className="mt-1.5 text-xs text-red-500">{errors.message.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-sm text-gray-500">Fields marked with * are required</p>
                  <Button
                    type="submit"
                    size="lg"
                    loading={isSubmitting}
                    icon={isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-4 w-4" />}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>

          {/* Branch Locations */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeading
              label="Our Locations"
              title="Branch Offices"
              description="Visit us at any of our conveniently located offices across Nepal."
            />

            {contactLoading ? (
              <div className="space-y-4">
                <BranchCardSkeleton />
                <BranchCardSkeleton />
              </div>
            ) : contactDetails.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white py-12 text-center">
                <Building className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-3 text-sm text-gray-500">No branch information available yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Headquarters first */}
                {headquarters && (
                  <BranchCard branch={headquarters} isHeadquarters />
                )}
                {/* Other branches */}
                {otherBranches.map((branch) => (
                  <BranchCard key={branch.id} branch={branch} />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      {headquarters?.google_maps_url && (
        <section className="border-t border-gray-200 bg-white py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              label="Find Us"
              title="Our Location"
              description="Visit our headquarters for in-person consultations and demonstrations."
              centered
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm"
            >
              <iframe
                title="Bhattarai Business House Location"
                src={headquarters.google_maps_url}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Working Hours Summary */}
      <section className="border-t border-gray-200 bg-gray-50 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Hours"
            title="Working Hours"
            centered
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl"
          >
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="space-y-4">
                {headquarters?.business_hours
                  ? formatBusinessHours(headquarters.business_hours).map((line) => {
                      const [day, ...timeParts] = line.split(':')
                      const time = timeParts.join(':').trim()
                      return (
                        <div key={day} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <span className="text-sm font-medium text-gray-700">{day}</span>
                          <span className="text-sm text-gray-900">{time}</span>
                        </div>
                      )
                    })
                  : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                      <div key={day} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <span className="text-sm font-medium text-gray-700">{day}</span>
                        <span className="text-sm text-gray-900">9:00 AM - 5:00 PM</span>
                      </div>
                    ))}
                <div className="flex items-center justify-between py-2 text-gray-400">
                  <span className="text-sm font-medium">Saturday</span>
                  <span className="text-sm">Closed</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Media & Additional Info */}
      <section className="border-t border-gray-200 bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2">
            {/* Social Media */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="font-serif text-2xl font-bold text-gray-900">Connect With Us</h3>
              <p className="mt-3 text-gray-500">
                Follow us on social media for the latest updates, news, and promotions.
              </p>
              <div className="mt-6 flex gap-4">
                {[
                  { icon: Globe, label: 'Facebook', href: '#' },
                  { icon: MessageCircle, label: 'Twitter', href: '#' },
                  { icon: Share2, label: 'Instagram', href: '#' },
                  { icon: LinkIcon, label: 'LinkedIn', href: '#' },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-all duration-300 hover:bg-primary-600 hover:text-white hover:shadow-lg hover:shadow-primary-600/25"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Additional Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="font-serif text-2xl font-bold text-gray-900">Other Ways to Reach Us</h3>
              <div className="mt-6 space-y-4">
                <a
                  href="tel:+977-1-4XXXXXX"
                  className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 transition-all hover:border-primary-200 hover:bg-primary-50"
                >
                  <div className="rounded-lg bg-primary-100 p-2.5">
                    <Phone className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-base font-semibold text-gray-900">+977-1-4XXXXXX</p>
                  </div>
                </a>
                <a
                  href="mailto:info@bhattaraibusiness.com"
                  className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 transition-all hover:border-primary-200 hover:bg-primary-50"
                >
                  <div className="rounded-lg bg-primary-100 p-2.5">
                    <Mail className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-base font-semibold text-gray-900">info@bhattaraibusiness.com</p>
                  </div>
                </a>
                {headquarters?.google_maps_url && (
                  <a
                    href={headquarters.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 transition-all hover:border-primary-200 hover:bg-primary-50"
                  >
                    <div className="rounded-lg bg-primary-100 p-2.5">
                      <MapPin className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Address</p>
                      <p className="text-base font-semibold text-gray-900">
                        {headquarters.address}, {headquarters.city}
                      </p>
                    </div>
                    <ExternalLink className="ml-auto h-4 w-4 text-gray-400" />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

function BranchCard({
  branch,
  isHeadquarters = false,
}: {
  branch: ContactDetail
  isHeadquarters?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={`rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md ${
        isHeadquarters ? 'border-primary-200 ring-1 ring-primary-100' : 'border-gray-100'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`rounded-xl p-2.5 ${isHeadquarters ? 'bg-primary-100' : 'bg-gray-100'}`}>
          <Building className={`h-5 w-5 ${isHeadquarters ? 'text-primary-600' : 'text-gray-600'}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-gray-900">{branch.branch_name}</h4>
            {isHeadquarters && (
              <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-semibold text-primary-700">
                HQ
              </span>
            )}
          </div>
          <p className="mt-1.5 text-sm text-gray-600">
            {branch.address}, {branch.city}, {branch.province}
          </p>

          {/* Phone Numbers */}
          {branch.phone && branch.phone.length > 0 && (
            <div className="mt-3 space-y-1">
              {branch.phone.map((p) => (
                <a
                  key={p}
                  href={`tel:${p}`}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 text-gray-400" />
                  {p}
                </a>
              ))}
            </div>
          )}

          {/* Email Addresses */}
          {branch.email && branch.email.length > 0 && (
            <div className="mt-2 space-y-1">
              {branch.email.map((e) => (
                <a
                  key={e}
                  href={`mailto:${e}`}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 text-gray-400" />
                  {e}
                </a>
              ))}
            </div>
          )}

          {/* Business Hours */}
          {branch.business_hours && Object.keys(branch.business_hours).length > 0 && (
            <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                <Clock className="h-3.5 w-3.5" />
                Business Hours
              </div>
              <div className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-0.5">
                {WEEKDAY_ORDER.filter((day) => branch.business_hours[day]).map((day) => (
                  <div key={day} className="flex justify-between text-xs">
                    <span className="text-gray-600 capitalize">{day.slice(0, 3)}</span>
                    <span className="font-medium text-gray-900">{branch.business_hours[day]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Map Link */}
          {branch.google_maps_url && (
            <a
              href={branch.google_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-100"
            >
              <MapPin className="h-4 w-4" />
              View on Map
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}
