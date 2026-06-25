import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  User,
  Phone,
  Mail,
  MapPin,
  Car,
  Calendar,
  Clock,
  FileText,
  CheckCircle2,
  Loader2,
  ArrowLeft,
} from 'lucide-react'
import { testDriveService } from '@/services/test-drive.service'
import { vehicleService } from '@/services/vehicle.service'
import Button from '@/components/ui/Button'

const testDriveSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(
      /^(?:\+977[-\s]?)?(?:98[0-9]|97[0-9]|96[0-9]|95[0-9]|94[0-9])[-\s]?\d{3}[-\s]?\d{4}$/,
      'Please enter a valid Nepali phone number (e.g., 98XXXXXXXX or +977-98XXXXXXXX)'
    ),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  address: z
    .string()
    .min(2, 'Address is required')
    .max(200, 'Address must be less than 200 characters'),
  vehicle_id: z.string().min(1, 'Please select a vehicle'),
  preferred_date: z
    .string()
    .min(1, 'Please select a date'),
  preferred_time: z
    .string()
    .min(1, 'Please select a time slot'),
  notes: z.string().optional(),
})

type TestDriveFormData = z.infer<typeof testDriveSchema>

const TIME_SLOTS = [
  { value: '09:00', label: '9:00 AM - 10:00 AM', group: 'Morning' },
  { value: '10:00', label: '10:00 AM - 11:00 AM', group: 'Morning' },
  { value: '11:00', label: '11:00 AM - 12:00 PM', group: 'Morning' },
  { value: '12:00', label: '12:00 PM - 1:00 PM', group: 'Afternoon' },
  { value: '13:00', label: '1:00 PM - 2:00 PM', group: 'Afternoon' },
  { value: '14:00', label: '2:00 PM - 3:00 PM', group: 'Afternoon' },
  { value: '15:00', label: '3:00 PM - 4:00 PM', group: 'Evening' },
  { value: '16:00', label: '4:00 PM - 5:00 PM', group: 'Evening' },
  { value: '17:00', label: '5:00 PM - 6:00 PM', group: 'Evening' },
]

const getMinDate = () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

function SuccessState() {
  return (
    <motion.div
      className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6 rounded-full bg-green-50 p-5">
        <CheckCircle2 className="h-14 w-14 text-green-500" />
      </div>
      <h2 className="mb-3 text-3xl font-bold text-gray-900">Booking Request Received!</h2>
      <p className="mb-8 max-w-lg text-lg text-gray-600">
        Thank you for your interest. Our team will contact you within 24 hours to confirm your
        test drive appointment.
      </p>
      <div className="flex gap-3">
        <Button as="link" to="/" variant="secondary" icon={<ArrowLeft className="h-4 w-4" />}>
          Back to Home
        </Button>
        <Button as="link" to="/automotive">
          Browse Vehicles
        </Button>
      </div>
    </motion.div>
  )
}

export default function TestDrivePage() {
  const [searchParams] = useSearchParams()
  const preselectedVehicleId = searchParams.get('vehicle') || ''
  const [submitted, setSubmitted] = useState(false)

  const { data: vehicles = [], isLoading: vehiclesLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => vehicleService.getAll(),
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TestDriveFormData>({
    resolver: zodResolver(testDriveSchema),
    defaultValues: {
      full_name: '',
      phone: '',
      email: '',
      address: '',
      vehicle_id: preselectedVehicleId,
      preferred_date: '',
      preferred_time: '',
      notes: '',
    },
  })

  useEffect(() => {
    if (preselectedVehicleId) {
      setValue('vehicle_id', preselectedVehicleId)
    }
  }, [preselectedVehicleId, setValue])

  useEffect(() => {
    document.title = 'Book a Test Drive | Bhattarai Business House'
    return () => {
      document.title = 'Bhattarai Business House'
    }
  }, [])

  const onSubmit = async (data: TestDriveFormData) => {
    try {
      await testDriveService.create({
        full_name: data.full_name,
        phone: data.phone,
        email: data.email,
        address: data.address,
        vehicle_id: data.vehicle_id,
        preferred_date: data.preferred_date,
        preferred_time: data.preferred_time,
        notes: data.notes || undefined,
      })
      setSubmitted(true)
    } catch (err) {
      console.error('Test drive submission failed:', err)
      throw err
    }
  }

  if (submitted) return <SuccessState />

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-20">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-primary-300"
          >
            Experience the Drive
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif text-4xl font-bold tracking-tight text-white sm:text-5xl"
          >
            Book a Test Drive
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-4 h-1 w-16 origin-left rounded-full bg-gradient-to-r from-accent-400 to-accent-500"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mx-auto mt-5 max-w-xl text-lg text-primary-200"
          >
            Fill in the form below and we'll arrange a test drive at your convenience.
          </motion.p>
        </div>
      </div>

      {/* Form Section */}
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8"
          initial="initial"
          animate="animate"
          variants={{
            animate: { transition: { staggerChildren: 0.06 } },
          }}
        >
          {/* Personal Information */}
          <motion.fieldset variants={fadeInUp} className="space-y-6">
            <legend className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <User className="h-5 w-5 text-primary-600" />
              Personal Information
            </legend>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Full Name */}
              <div>
                <label htmlFor="full_name" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="full_name"
                    type="text"
                    placeholder="Ram Bahadur Shrestha"
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
                    placeholder="ram@example.com"
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

              {/* Address */}
              <div>
                <label htmlFor="address" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <MapPin className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="address"
                    type="text"
                    placeholder="Kathmandu, Nepal"
                    className={`block w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                      errors.address ? 'border-red-300' : 'border-gray-200'
                    }`}
                    {...register('address')}
                  />
                </div>
                {errors.address && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.address.message}</p>
                )}
              </div>
            </div>
          </motion.fieldset>

          {/* Vehicle Selection */}
          <motion.fieldset variants={fadeInUp} className="space-y-6">
            <legend className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <Car className="h-5 w-5 text-primary-600" />
              Vehicle & Schedule
            </legend>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Preferred Vehicle */}
              <div className="sm:col-span-2">
                <label htmlFor="vehicle_id" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Preferred Vehicle
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Car className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    id="vehicle_id"
                    className={`block w-full appearance-none rounded-xl border bg-white py-3 pl-10 pr-10 text-sm text-gray-900 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                      errors.vehicle_id ? 'border-red-300' : 'border-gray-200'
                    }`}
                    {...register('vehicle_id')}
                    disabled={vehiclesLoading}
                  >
                    <option value="">
                      {vehiclesLoading ? 'Loading vehicles...' : 'Select a vehicle'}
                    </option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.brand?.name} {vehicle.name} ({vehicle.model_year})
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.vehicle_id && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.vehicle_id.message}</p>
                )}
              </div>

              {/* Preferred Date */}
              <div>
                <label htmlFor="preferred_date" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Preferred Date
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="preferred_date"
                    type="date"
                    min={getMinDate()}
                    className={`block w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm text-gray-900 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                      errors.preferred_date ? 'border-red-300' : 'border-gray-200'
                    }`}
                    {...register('preferred_date')}
                  />
                </div>
                {errors.preferred_date && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.preferred_date.message}</p>
                )}
              </div>

              {/* Preferred Time */}
              <div>
                <label htmlFor="preferred_time" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Preferred Time
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Clock className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    id="preferred_time"
                    className={`block w-full appearance-none rounded-xl border bg-white py-3 pl-10 pr-10 text-sm text-gray-900 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                      errors.preferred_time ? 'border-red-300' : 'border-gray-200'
                    }`}
                    {...register('preferred_time')}
                  >
                    <option value="">Select a time slot</option>
                    {Object.entries(
                      TIME_SLOTS.reduce(
                        (acc, slot) => {
                          if (!acc[slot.group]) acc[slot.group] = []
                          acc[slot.group].push(slot)
                          return acc
                        },
                        {} as Record<string, typeof TIME_SLOTS>
                      )
                    ).map(([group, slots]) => (
                      <optgroup key={group} label={group}>
                        {slots.map((slot) => (
                          <option key={slot.value} value={slot.value}>
                            {slot.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.preferred_time && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.preferred_time.message}</p>
                )}
              </div>
            </div>
          </motion.fieldset>

          {/* Additional Notes */}
          <motion.fieldset variants={fadeInUp}>
            <legend className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
              <FileText className="h-5 w-5 text-primary-600" />
              Additional Notes
            </legend>
            <div className="relative">
              <textarea
                id="notes"
                rows={4}
                placeholder="Any specific requirements or questions about the vehicle..."
                className="block w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                {...register('notes')}
              />
            </div>
          </motion.fieldset>

          {/* Submit */}
          <motion.div variants={fadeInUp} className="flex items-center justify-between pt-4">
            <p className="text-sm text-gray-500">
              Fields marked with * are required
            </p>
            <Button
              type="submit"
              size="lg"
              loading={isSubmitting}
              icon={isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : undefined}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
            </Button>
          </motion.div>
        </motion.form>
      </div>
    </motion.div>
  )
}
