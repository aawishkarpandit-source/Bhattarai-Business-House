import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  LayoutDashboard,
  Images,
  Car,
  Building2,
  Package,
  FolderOpen,
  Newspaper,
  Quote,
  Users,
  Image as ImageIcon,
  Phone,
  TestTubeDiagonal,
  Settings,
  SearchCode,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  AlertCircle,
  Eye,
  Loader2,
  Star,
  ToggleLeft,
  ToggleRight,
  Save,
  ChevronRight,
  Filter,
} from 'lucide-react'
import { heroService } from '@/services/hero.service'
import { vehicleService } from '@/services/vehicle.service'
import { brandService } from '@/services/brand.service'
import { productService } from '@/services/product.service'
import { categoryService } from '@/services/category.service'
import { newsService } from '@/services/news.service'
import { testimonialService } from '@/services/testimonial.service'
import { teamService } from '@/services/team.service'
import { galleryService } from '@/services/gallery.service'
import { contactService } from '@/services/contact.service'
import { companyService } from '@/services/company.service'
import { seoService } from '@/services/seo.service'
import { testDriveService } from '@/services/test-drive.service'
import { siteService } from '@/services/site.service'
import type {
  HeroSlide,
  Vehicle,
  Brand,
  Product,
  Category,
  NewsArticle,
  Testimonial,
  TeamMember,
  GalleryItem,
  ContactDetail,
  SeoSetting,
  TestDriveRequest,
} from '@/types'

type TabKey =
  | 'dashboard'
  | 'hero'
  | 'vehicles'
  | 'brands'
  | 'products'
  | 'categories'
  | 'news'
  | 'testimonials'
  | 'team'
  | 'gallery'
  | 'contacts'
  | 'testDrives'
  | 'settings'
  | 'seo'

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { key: 'hero', label: 'Hero Slides', icon: <Images size={18} /> },
  { key: 'vehicles', label: 'Vehicles', icon: <Car size={18} /> },
  { key: 'brands', label: 'Brands', icon: <Building2 size={18} /> },
  { key: 'products', label: 'Products', icon: <Package size={18} /> },
  { key: 'categories', label: 'Categories', icon: <FolderOpen size={18} /> },
  { key: 'news', label: 'News', icon: <Newspaper size={18} /> },
  { key: 'testimonials', label: 'Testimonials', icon: <Quote size={18} /> },
  { key: 'team', label: 'Team', icon: <Users size={18} /> },
  { key: 'gallery', label: 'Gallery', icon: <ImageIcon size={18} /> },
  { key: 'contacts', label: 'Contacts', icon: <Phone size={18} /> },
  { key: 'testDrives', label: 'Test Drives', icon: <TestTubeDiagonal size={18} /> },
  { key: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  { key: 'seo', label: 'SEO', icon: <SearchCode size={18} /> },
]

function Alert({ type, message, onClose }: { type: 'success' | 'error'; message: string; onClose: () => void }) {
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
      {type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-75"><X size={14} /></button>
    </div>
  )
}

function ConfirmDialog({ open, title, message, onConfirm, onCancel }: { open: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="rounded-xl bg-white p-6 shadow-2xl w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>
  )
}

function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className={`bg-white rounded-xl shadow-2xl w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-gray-100"><X size={20} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

function EmptyState({ icon, message }: { icon?: React.ReactNode; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      {icon || <Package size={48} />}
      <p className="mt-3 text-sm">{message}</p>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  )
}

function Badge({ children, color = 'gray' }: { children: React.ReactNode; color?: 'green' | 'red' | 'yellow' | 'blue' | 'gray' }) {
  const colors: Record<string, string> = {
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    blue: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-700',
  }
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[color]}`}>{children}</span>
}

function InputField({ label, value, onChange, type = 'text', placeholder, required, rows }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean; rows?: number }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}{required && ' *'}</label>
      {rows ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
        />
      )}
    </div>
  )
}

function SelectField({ label, value, onChange, options, required }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; required?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}{required && ' *'}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <button type="button" onClick={() => onChange(!value)} className="focus:outline-none">
        {value ? <ToggleRight size={28} className="text-green-600" /> : <ToggleLeft size={28} className="text-gray-400" />}
      </button>
    </label>
  )
}

function FileUrlInput({ label, value, onChange, required }: { label: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <InputField label={label} value={value} onChange={onChange} placeholder="Enter image URL" required={required} />
  )
}

// ─── DASHBOARD OVERVIEW ───────────────────────────────────────────────────────

function DashboardOverview() {
  const { data: vehicles = [] } = useQuery({ queryKey: ['vehicles'], queryFn: () => vehicleService.getAll() })
  const { data: brands = [] } = useQuery({ queryKey: ['brands'], queryFn: () => brandService.getAll() })
  const { data: products = [] } = useQuery({ queryKey: ['products'], queryFn: () => productService.getAll() })
  const { data: news = [] } = useQuery({ queryKey: ['news'], queryFn: () => newsService.getAll() })
  const { data: testDrives = [] } = useQuery({ queryKey: ['testDrives'], queryFn: () => testDriveService.getAll() })

  const stats = [
    { label: 'Vehicles', value: vehicles.length, icon: <Car size={24} />, color: 'bg-blue-500' },
    { label: 'Brands', value: brands.length, icon: <Building2 size={24} />, color: 'bg-green-500' },
    { label: 'Products', value: products.length, icon: <Package size={24} />, color: 'bg-purple-500' },
    { label: 'News Articles', value: news.length, icon: <Newspaper size={24} />, color: 'bg-orange-500' },
    { label: 'Test Drive Requests', value: testDrives.length, icon: <TestTubeDiagonal size={24} />, color: 'bg-red-500' },
    { label: 'Pending Requests', value: testDrives.filter((r) => r.status === 'pending').length, icon: <AlertCircle size={24} />, color: 'bg-yellow-500' },
  ]

  const recentDrives = testDrives.slice(0, 5)

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-4 rounded-xl border bg-white p-5 shadow-sm">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg text-white ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="mb-4 text-lg font-semibold text-gray-900">Recent Test Drive Requests</h3>
      {recentDrives.length === 0 ? (
        <EmptyState message="No test drive requests yet" />
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Vehicle</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentDrives.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{r.full_name}</td>
                  <td className="px-4 py-3 text-gray-600">{r.vehicle?.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-gray-600">{r.preferred_date}</td>
                  <td className="px-4 py-3">
                    <Badge color={r.status === 'pending' ? 'yellow' : r.status === 'approved' ? 'green' : r.status === 'rejected' ? 'red' : 'blue'}>
                      {r.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─── HERO SLIDES ──────────────────────────────────────────────────────────────

function HeroSlidesTab() {
  const queryClient = useQueryClient()
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', subtitle: '', cta_text: '', cta_url: '', background_image: '', order_index: 0, is_active: true })

  const { data: slides = [], isLoading } = useQuery({ queryKey: ['heroSlides'], queryFn: () => heroService.getAll() })

  const createMutation = useMutation({ mutationFn: heroService.create, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['heroSlides'] }); setAlert({ type: 'success', message: 'Slide created' }); setShowModal(false); resetForm() }, onError: () => setAlert({ type: 'error', message: 'Failed to create slide' }) })
  const updateMutation = useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<HeroSlide> }) => heroService.update(id, data), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['heroSlides'] }); setAlert({ type: 'success', message: 'Slide updated' }); setShowModal(false); resetForm() }, onError: () => setAlert({ type: 'error', message: 'Failed to update slide' }) })
  const deleteMutation = useMutation({ mutationFn: heroService.delete, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['heroSlides'] }); setAlert({ type: 'success', message: 'Slide deleted' }); setConfirmDelete(null) }, onError: () => setAlert({ type: 'error', message: 'Failed to delete slide' }) })

  function resetForm() { setForm({ title: '', subtitle: '', cta_text: '', cta_url: '', background_image: '', order_index: slides.length, is_active: true }); setEditingSlide(null) }

  function openEdit(slide: HeroSlide) { setEditingSlide(slide); setForm({ title: slide.title, subtitle: slide.subtitle, cta_text: slide.cta_text, cta_url: slide.cta_url, background_image: slide.background_image, order_index: slide.order_index, is_active: slide.is_active }); setShowModal(true) }

  function handleSubmit() {
    if (editingSlide) { updateMutation.mutate({ id: editingSlide.id, data: form }) }
    else { createMutation.mutate(form as any) }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Hero Slides</h3>
        <button onClick={() => { resetForm(); setShowModal(true) }} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Plus size={16} /> Add Slide
        </button>
      </div>
      {slides.length === 0 ? <EmptyState message="No hero slides" /> : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Order</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Title</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">CTA</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Active</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {slides.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">{s.order_index}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{s.title}</td>
                  <td className="px-4 py-3 text-gray-600">{s.cta_text}</td>
                  <td className="px-4 py-3">{s.is_active ? <Badge color="green">Active</Badge> : <Badge color="red">Inactive</Badge>}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(s)} className="rounded p-1 hover:bg-gray-100"><Pencil size={16} className="text-gray-500" /></button>
                      <button onClick={() => setConfirmDelete(s.id)} className="rounded p-1 hover:bg-gray-100"><Trash2 size={16} className="text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editingSlide ? 'Edit Slide' : 'Add Slide'}>
        <div className="space-y-4">
          <InputField label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
          <InputField label="Subtitle" value={form.subtitle} onChange={(v) => setForm({ ...form, subtitle: v })} />
          <InputField label="CTA Text" value={form.cta_text} onChange={(v) => setForm({ ...form, cta_text: v })} />
          <InputField label="CTA URL" value={form.cta_url} onChange={(v) => setForm({ ...form, cta_url: v })} />
          <FileUrlInput label="Background Image URL" value={form.background_image} onChange={(v) => setForm({ ...form, background_image: v })} required />
          <InputField label="Order Index" value={String(form.order_index)} onChange={(v) => setForm({ ...form, order_index: Number(v) })} type="number" />
          <Toggle label="Active" value={form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} />
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50">Cancel</button>
            <button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {(createMutation.isPending || updateMutation.isPending) && <Loader2 size={14} className="animate-spin" />}
              {editingSlide ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!confirmDelete} title="Delete Slide" message="Are you sure you want to delete this slide?" onConfirm={() => deleteMutation.mutate(confirmDelete!)} onCancel={() => setConfirmDelete(null)} />
    </div>
  )
}

// ─── VEHICLES ─────────────────────────────────────────────────────────────────

function VehiclesTab() {
  const queryClient = useQueryClient()
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    brand_id: '', name: '', slug: '', model_year: new Date().getFullYear(), price: 0, price_currency: 'NPR', description: '', short_description: '', fuel_type: 'petrol', transmission: 'automatic', seating_capacity: 5, is_ev: false, is_featured: false, is_active: true, thumbnail_url: '', brochure_url: '',
  })

  const { data: vehicles = [], isLoading } = useQuery({ queryKey: ['vehicles'], queryFn: () => vehicleService.getAll() })
  const { data: brands = [] } = useQuery({ queryKey: ['brands'], queryFn: () => brandService.getAll() })

  const filtered = vehicles.filter((v) => v.name.toLowerCase().includes(search.toLowerCase()) || v.brand?.name?.toLowerCase().includes(search.toLowerCase()))

  const createMutation = useMutation({ mutationFn: vehicleService.create, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['vehicles'] }); setAlert({ type: 'success', message: 'Vehicle created' }); setShowModal(false); resetForm() }, onError: () => setAlert({ type: 'error', message: 'Failed to create vehicle' }) })
  const updateMutation = useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<Vehicle> }) => vehicleService.update(id, data), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['vehicles'] }); setAlert({ type: 'success', message: 'Vehicle updated' }); setShowModal(false); resetForm() }, onError: () => setAlert({ type: 'error', message: 'Failed to update vehicle' }) })
  const deleteMutation = useMutation({ mutationFn: vehicleService.delete, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['vehicles'] }); setAlert({ type: 'success', message: 'Vehicle deleted' }); setConfirmDelete(null) }, onError: () => setAlert({ type: 'error', message: 'Failed to delete vehicle' }) })

  function resetForm() { setForm({ brand_id: '', name: '', slug: '', model_year: new Date().getFullYear(), price: 0, price_currency: 'NPR', description: '', short_description: '', fuel_type: 'petrol', transmission: 'automatic', seating_capacity: 5, is_ev: false, is_featured: false, is_active: true, thumbnail_url: '', brochure_url: '' }); setEditingVehicle(null) }

  function openEdit(v: Vehicle) {
    setEditingVehicle(v)
    setForm({ brand_id: v.brand_id, name: v.name, slug: v.slug, model_year: v.model_year, price: v.price, price_currency: v.price_currency, description: v.description, short_description: v.short_description, fuel_type: v.fuel_type, transmission: v.transmission, seating_capacity: v.seating_capacity, is_ev: v.is_ev, is_featured: v.is_featured, is_active: v.is_active, thumbnail_url: v.thumbnail_url, brochure_url: v.brochure_url || '' })
    setShowModal(true)
  }

  function handleSubmit() {
    if (editingVehicle) { updateMutation.mutate({ id: editingVehicle.id, data: form as any }) }
    else { createMutation.mutate(form as any) }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
      <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-lg font-semibold">Vehicles</h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <SearchCode size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 outline-none w-48" />
          </div>
          <button onClick={() => { resetForm(); setShowModal(true) }} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            <Plus size={16} /> Add Vehicle
          </button>
        </div>
      </div>
      {filtered.length === 0 ? <EmptyState message="No vehicles found" /> : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Brand</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Year</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Price</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Fuel</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Featured</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Active</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{v.name}</td>
                  <td className="px-4 py-3 text-gray-600">{v.brand?.name || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{v.model_year}</td>
                  <td className="px-4 py-3 text-gray-600">{v.price_currency} {v.price.toLocaleString()}</td>
                  <td className="px-4 py-3"><Badge color={v.fuel_type === 'electric' ? 'green' : v.fuel_type === 'diesel' ? 'yellow' : 'blue'}>{v.fuel_type}</Badge></td>
                  <td className="px-4 py-3">{v.is_featured ? <Badge color="green">Yes</Badge> : <Badge>No</Badge>}</td>
                  <td className="px-4 py-3">{v.is_active ? <Badge color="green">Active</Badge> : <Badge color="red">Inactive</Badge>}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(v)} className="rounded p-1 hover:bg-gray-100"><Pencil size={16} className="text-gray-500" /></button>
                      <button onClick={() => setConfirmDelete(v.id)} className="rounded p-1 hover:bg-gray-100"><Trash2 size={16} className="text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editingVehicle ? 'Edit Vehicle' : 'Add Vehicle'} wide>
        <div className="space-y-4">
          <SelectField label="Brand" value={form.brand_id} onChange={(v) => setForm({ ...form, brand_id: v })} options={[{ value: '', label: 'Select brand' }, ...brands.map((b) => ({ value: b.id, label: b.name }))]} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <InputField label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField label="Model Year" value={String(form.model_year)} onChange={(v) => setForm({ ...form, model_year: Number(v) })} type="number" />
            <InputField label="Price" value={String(form.price)} onChange={(v) => setForm({ ...form, price: Number(v) })} type="number" />
            <InputField label="Currency" value={form.price_currency} onChange={(v) => setForm({ ...form, price_currency: v })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SelectField label="Fuel Type" value={form.fuel_type} onChange={(v) => setForm({ ...form, fuel_type: v })} options={[{ value: 'petrol', label: 'Petrol' }, { value: 'diesel', label: 'Diesel' }, { value: 'electric', label: 'Electric' }]} />
            <SelectField label="Transmission" value={form.transmission} onChange={(v) => setForm({ ...form, transmission: v })} options={[{ value: 'automatic', label: 'Automatic' }, { value: 'manual', label: 'Manual' }]} />
            <InputField label="Seating Capacity" value={String(form.seating_capacity)} onChange={(v) => setForm({ ...form, seating_capacity: Number(v) })} type="number" />
          </div>
          <InputField label="Short Description" value={form.short_description} onChange={(v) => setForm({ ...form, short_description: v })} />
          <InputField label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} rows={3} />
          <FileUrlInput label="Thumbnail URL" value={form.thumbnail_url} onChange={(v) => setForm({ ...form, thumbnail_url: v })} required />
          <InputField label="Brochure URL" value={form.brochure_url} onChange={(v) => setForm({ ...form, brochure_url: v })} />
          <div className="flex flex-wrap gap-4">
            <Toggle label="Electric Vehicle" value={form.is_ev} onChange={(v) => setForm({ ...form, is_ev: v })} />
            <Toggle label="Featured" value={form.is_featured} onChange={(v) => setForm({ ...form, is_featured: v })} />
            <Toggle label="Active" value={form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50">Cancel</button>
            <button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {(createMutation.isPending || updateMutation.isPending) && <Loader2 size={14} className="animate-spin" />}
              {editingVehicle ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!confirmDelete} title="Delete Vehicle" message="Are you sure you want to delete this vehicle?" onConfirm={() => deleteMutation.mutate(confirmDelete!)} onCancel={() => setConfirmDelete(null)} />
    </div>
  )
}

// ─── BRANDS ───────────────────────────────────────────────────────────────────

function BrandsTab() {
  const queryClient = useQueryClient()
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', slug: '', logo_url: '', description: '', website_url: '', category: 'automotive', is_featured: false, order_index: 0 })

  const { data: brands = [], isLoading } = useQuery({ queryKey: ['brands'], queryFn: () => brandService.getAll() })

  const createMutation = useMutation({ mutationFn: brandService.create, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['brands'] }); setAlert({ type: 'success', message: 'Brand created' }); setShowModal(false); resetForm() }, onError: () => setAlert({ type: 'error', message: 'Failed to create brand' }) })
  const updateMutation = useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<Brand> }) => brandService.update(id, data), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['brands'] }); setAlert({ type: 'success', message: 'Brand updated' }); setShowModal(false); resetForm() }, onError: () => setAlert({ type: 'error', message: 'Failed to update brand' }) })
  const deleteMutation = useMutation({ mutationFn: brandService.delete, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['brands'] }); setAlert({ type: 'success', message: 'Brand deleted' }); setConfirmDelete(null) }, onError: () => setAlert({ type: 'error', message: 'Failed to delete brand' }) })

  function resetForm() { setForm({ name: '', slug: '', logo_url: '', description: '', website_url: '', category: 'automotive', is_featured: false, order_index: brands.length }); setEditingBrand(null) }

  function openEdit(b: Brand) { setEditingBrand(b); setForm({ name: b.name, slug: b.slug, logo_url: b.logo_url, description: b.description, website_url: b.website_url || '', category: b.category, is_featured: b.is_featured, order_index: b.order_index }); setShowModal(true) }

  function handleSubmit() {
    if (editingBrand) { updateMutation.mutate({ id: editingBrand.id, data: form as any }) }
    else { createMutation.mutate(form as any) }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Brands</h3>
        <button onClick={() => { resetForm(); setShowModal(true) }} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Plus size={16} /> Add Brand
        </button>
      </div>
      {brands.length === 0 ? <EmptyState message="No brands" /> : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Order</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Category</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Featured</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {brands.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">{b.order_index}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{b.name}</td>
                  <td className="px-4 py-3"><Badge>{b.category}</Badge></td>
                  <td className="px-4 py-3">{b.is_featured ? <Badge color="green">Yes</Badge> : <Badge>No</Badge>}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(b)} className="rounded p-1 hover:bg-gray-100"><Pencil size={16} className="text-gray-500" /></button>
                      <button onClick={() => setConfirmDelete(b.id)} className="rounded p-1 hover:bg-gray-100"><Trash2 size={16} className="text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editingBrand ? 'Edit Brand' : 'Add Brand'}>
        <div className="space-y-4">
          <InputField label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <InputField label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} required />
          <FileUrlInput label="Logo URL" value={form.logo_url} onChange={(v) => setForm({ ...form, logo_url: v })} required />
          <SelectField label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} options={[{ value: 'automotive', label: 'Automotive' }, { value: 'electronics', label: 'Electronics' }, { value: 'batteries', label: 'Batteries' }, { value: 'solar', label: 'Solar' }, { value: 'lubricants', label: 'Lubricants' }, { value: 'networking', label: 'Networking' }, { value: 'other', label: 'Other' }]} />
          <InputField label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} rows={2} />
          <InputField label="Website URL" value={form.website_url} onChange={(v) => setForm({ ...form, website_url: v })} />
          <InputField label="Order Index" value={String(form.order_index)} onChange={(v) => setForm({ ...form, order_index: Number(v) })} type="number" />
          <Toggle label="Featured" value={form.is_featured} onChange={(v) => setForm({ ...form, is_featured: v })} />
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50">Cancel</button>
            <button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {(createMutation.isPending || updateMutation.isPending) && <Loader2 size={14} className="animate-spin" />}
              {editingBrand ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!confirmDelete} title="Delete Brand" message="Are you sure you want to delete this brand?" onConfirm={() => deleteMutation.mutate(confirmDelete!)} onCancel={() => setConfirmDelete(null)} />
    </div>
  )
}

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────

function ProductsTab() {
  const queryClient = useQueryClient()
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', slug: '', category_id: '', brand_id: '', description: '', short_description: '', price: 0, image_url: '', is_featured: false, is_active: true })

  const { data: products = [], isLoading } = useQuery({ queryKey: ['products'], queryFn: () => productService.getAll() })
  const { data: brands = [] } = useQuery({ queryKey: ['brands'], queryFn: () => brandService.getAll() })
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: () => categoryService.getAll() })

  const createMutation = useMutation({ mutationFn: productService.create, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['products'] }); setAlert({ type: 'success', message: 'Product created' }); setShowModal(false); resetForm() }, onError: () => setAlert({ type: 'error', message: 'Failed to create product' }) })
  const updateMutation = useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) => productService.update(id, data), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['products'] }); setAlert({ type: 'success', message: 'Product updated' }); setShowModal(false); resetForm() }, onError: () => setAlert({ type: 'error', message: 'Failed to update product' }) })
  const deleteMutation = useMutation({ mutationFn: productService.delete, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['products'] }); setAlert({ type: 'success', message: 'Product deleted' }); setConfirmDelete(null) }, onError: () => setAlert({ type: 'error', message: 'Failed to delete product' }) })

  function resetForm() { setForm({ name: '', slug: '', category_id: '', brand_id: '', description: '', short_description: '', price: 0, image_url: '', is_featured: false, is_active: true }); setEditingProduct(null) }

  function openEdit(p: Product) { setEditingProduct(p); setForm({ name: p.name, slug: p.slug, category_id: p.category_id, brand_id: p.brand_id, description: p.description, short_description: p.short_description, price: p.price || 0, image_url: p.image_url, is_featured: p.is_featured, is_active: p.is_active }); setShowModal(true) }

  function handleSubmit() {
    if (editingProduct) { updateMutation.mutate({ id: editingProduct.id, data: form as any }) }
    else { createMutation.mutate(form as any) }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Products</h3>
        <button onClick={() => { resetForm(); setShowModal(true) }} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Plus size={16} /> Add Product
        </button>
      </div>
      {products.length === 0 ? <EmptyState message="No products" /> : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Brand</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Category</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Featured</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-3 text-gray-600">{p.brand?.name || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{p.category?.name || '—'}</td>
                  <td className="px-4 py-3">{p.is_featured ? <Badge color="green">Yes</Badge> : <Badge>No</Badge>}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(p)} className="rounded p-1 hover:bg-gray-100"><Pencil size={16} className="text-gray-500" /></button>
                      <button onClick={() => setConfirmDelete(p.id)} className="rounded p-1 hover:bg-gray-100"><Trash2 size={16} className="text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editingProduct ? 'Edit Product' : 'Add Product'} wide>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <InputField label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField label="Brand" value={form.brand_id} onChange={(v) => setForm({ ...form, brand_id: v })} options={[{ value: '', label: 'Select brand' }, ...brands.map((b) => ({ value: b.id, label: b.name }))]} required />
            <SelectField label="Category" value={form.category_id} onChange={(v) => setForm({ ...form, category_id: v })} options={[{ value: '', label: 'Select category' }, ...categories.map((c) => ({ value: c.id, label: c.name }))]} required />
          </div>
          <InputField label="Short Description" value={form.short_description} onChange={(v) => setForm({ ...form, short_description: v })} />
          <InputField label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} rows={3} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Price" value={String(form.price)} onChange={(v) => setForm({ ...form, price: Number(v) })} type="number" />
            <FileUrlInput label="Image URL" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} required />
          </div>
          <div className="flex flex-wrap gap-4">
            <Toggle label="Featured" value={form.is_featured} onChange={(v) => setForm({ ...form, is_featured: v })} />
            <Toggle label="Active" value={form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50">Cancel</button>
            <button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {(createMutation.isPending || updateMutation.isPending) && <Loader2 size={14} className="animate-spin" />}
              {editingProduct ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!confirmDelete} title="Delete Product" message="Are you sure you want to delete this product?" onConfirm={() => deleteMutation.mutate(confirmDelete!)} onCancel={() => setConfirmDelete(null)} />
    </div>
  )
}

// ─── CATEGORIES ───────────────────────────────────────────────────────────────

function CategoriesTab() {
  const queryClient = useQueryClient()
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', slug: '', description: '', image_url: '', parent_id: '', order_index: 0 })

  const { data: categories = [], isLoading } = useQuery({ queryKey: ['categories'], queryFn: () => categoryService.getAll() })

  const createMutation = useMutation({ mutationFn: categoryService.create, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); setAlert({ type: 'success', message: 'Category created' }); setShowModal(false); resetForm() }, onError: () => setAlert({ type: 'error', message: 'Failed to create category' }) })
  const updateMutation = useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) => categoryService.update(id, data), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); setAlert({ type: 'success', message: 'Category updated' }); setShowModal(false); resetForm() }, onError: () => setAlert({ type: 'error', message: 'Failed to update category' }) })
  const deleteMutation = useMutation({ mutationFn: categoryService.delete, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); setAlert({ type: 'success', message: 'Category deleted' }); setConfirmDelete(null) }, onError: () => setAlert({ type: 'error', message: 'Failed to delete category' }) })

  function resetForm() { setForm({ name: '', slug: '', description: '', image_url: '', parent_id: '', order_index: categories.length }); setEditingCategory(null) }

  function openEdit(c: Category) { setEditingCategory(c); setForm({ name: c.name, slug: c.slug, description: c.description, image_url: c.image_url || '', parent_id: c.parent_id || '', order_index: c.order_index }); setShowModal(true) }

  function handleSubmit() {
    const data = { ...form, parent_id: form.parent_id || undefined, image_url: form.image_url || undefined }
    if (editingCategory) { updateMutation.mutate({ id: editingCategory.id, data }) }
    else { createMutation.mutate(data as any) }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Categories</h3>
        <button onClick={() => { resetForm(); setShowModal(true) }} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Plus size={16} /> Add Category
        </button>
      </div>
      {categories.length === 0 ? <EmptyState message="No categories" /> : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Order</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Slug</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">{c.order_index}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                  <td className="px-4 py-3 text-gray-600">{c.slug}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(c)} className="rounded p-1 hover:bg-gray-100"><Pencil size={16} className="text-gray-500" /></button>
                      <button onClick={() => setConfirmDelete(c.id)} className="rounded p-1 hover:bg-gray-100"><Trash2 size={16} className="text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editingCategory ? 'Edit Category' : 'Add Category'}>
        <div className="space-y-4">
          <InputField label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <InputField label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} required />
          <InputField label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} rows={2} />
          <FileUrlInput label="Image URL" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} />
          <SelectField label="Parent Category" value={form.parent_id} onChange={(v) => setForm({ ...form, parent_id: v })} options={[{ value: '', label: 'None (top-level)' }, ...categories.filter((c) => c.id !== editingCategory?.id).map((c) => ({ value: c.id, label: c.name }))]} />
          <InputField label="Order Index" value={String(form.order_index)} onChange={(v) => setForm({ ...form, order_index: Number(v) })} type="number" />
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50">Cancel</button>
            <button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {(createMutation.isPending || updateMutation.isPending) && <Loader2 size={14} className="animate-spin" />}
              {editingCategory ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!confirmDelete} title="Delete Category" message="Are you sure you want to delete this category?" onConfirm={() => deleteMutation.mutate(confirmDelete!)} onCancel={() => setConfirmDelete(null)} />
    </div>
  )
}

// ─── NEWS ─────────────────────────────────────────────────────────────────────

function NewsTab() {
  const queryClient = useQueryClient()
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', slug: '', excerpt: '', content: '', featured_image: '', author: '', is_published: false, meta_title: '', meta_description: '', tags: [] as string[] })

  const { data: articles = [], isLoading } = useQuery({ queryKey: ['news'], queryFn: () => newsService.getAll() })

  const createMutation = useMutation({ mutationFn: newsService.create, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['news'] }); setAlert({ type: 'success', message: 'Article created' }); setShowModal(false); resetForm() }, onError: () => setAlert({ type: 'error', message: 'Failed to create article' }) })
  const updateMutation = useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<NewsArticle> }) => newsService.update(id, data), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['news'] }); setAlert({ type: 'success', message: 'Article updated' }); setShowModal(false); resetForm() }, onError: () => setAlert({ type: 'error', message: 'Failed to update article' }) })
  const deleteMutation = useMutation({ mutationFn: newsService.delete, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['news'] }); setAlert({ type: 'success', message: 'Article deleted' }); setConfirmDelete(null) }, onError: () => setAlert({ type: 'error', message: 'Failed to delete article' }) })

  function resetForm() { setForm({ title: '', slug: '', excerpt: '', content: '', featured_image: '', author: '', is_published: false, meta_title: '', meta_description: '', tags: [] }); setEditingArticle(null) }

  function openEdit(a: NewsArticle) { setEditingArticle(a); setForm({ title: a.title, slug: a.slug, excerpt: a.excerpt, content: a.content, featured_image: a.featured_image, author: a.author, is_published: a.is_published, meta_title: a.meta_title || '', meta_description: a.meta_description || '', tags: a.tags || [] }); setShowModal(true) }

  function handleSubmit() {
    if (editingArticle) { updateMutation.mutate({ id: editingArticle.id, data: form as any }) }
    else { createMutation.mutate(form as any) }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">News</h3>
        <button onClick={() => { resetForm(); setShowModal(true) }} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Plus size={16} /> Add Article
        </button>
      </div>
      {articles.length === 0 ? <EmptyState message="No news articles" /> : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Title</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Author</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Published</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {articles.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{a.title}</td>
                  <td className="px-4 py-3 text-gray-600">{a.author}</td>
                  <td className="px-4 py-3">{a.is_published ? <Badge color="green">Published</Badge> : <Badge color="yellow">Draft</Badge>}</td>
                  <td className="px-4 py-3 text-gray-600">{new Date(a.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(a)} className="rounded p-1 hover:bg-gray-100"><Pencil size={16} className="text-gray-500" /></button>
                      <button onClick={() => setConfirmDelete(a.id)} className="rounded p-1 hover:bg-gray-100"><Trash2 size={16} className="text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editingArticle ? 'Edit Article' : 'Add Article'} wide>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
            <InputField label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Author" value={form.author} onChange={(v) => setForm({ ...form, author: v })} required />
            <FileUrlInput label="Featured Image URL" value={form.featured_image} onChange={(v) => setForm({ ...form, featured_image: v })} required />
          </div>
          <InputField label="Excerpt" value={form.excerpt} onChange={(v) => setForm({ ...form, excerpt: v })} rows={2} />
          <InputField label="Content (HTML)" value={form.content} onChange={(v) => setForm({ ...form, content: v })} rows={8} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Meta Title" value={form.meta_title} onChange={(v) => setForm({ ...form, meta_title: v })} />
            <InputField label="Meta Description" value={form.meta_description} onChange={(v) => setForm({ ...form, meta_description: v })} />
          </div>
          <Toggle label="Published" value={form.is_published} onChange={(v) => setForm({ ...form, is_published: v })} />
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50">Cancel</button>
            <button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {(createMutation.isPending || updateMutation.isPending) && <Loader2 size={14} className="animate-spin" />}
              {editingArticle ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!confirmDelete} title="Delete Article" message="Are you sure you want to delete this article?" onConfirm={() => deleteMutation.mutate(confirmDelete!)} onCancel={() => setConfirmDelete(null)} />
    </div>
  )
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

function TestimonialsTab() {
  const queryClient = useQueryClient()
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [form, setForm] = useState({ client_name: '', client_title: '', client_image: '', content: '', rating: 5, is_featured: false, is_active: true, order_index: 0 })

  const { data: testimonials = [], isLoading } = useQuery({ queryKey: ['testimonials'], queryFn: () => testimonialService.getAll() })

  const createMutation = useMutation({ mutationFn: testimonialService.create, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['testimonials'] }); setAlert({ type: 'success', message: 'Testimonial created' }); setShowModal(false); resetForm() }, onError: () => setAlert({ type: 'error', message: 'Failed to create testimonial' }) })
  const updateMutation = useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<Testimonial> }) => testimonialService.update(id, data), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['testimonials'] }); setAlert({ type: 'success', message: 'Testimonial updated' }); setShowModal(false); resetForm() }, onError: () => setAlert({ type: 'error', message: 'Failed to update testimonial' }) })
  const deleteMutation = useMutation({ mutationFn: testimonialService.delete, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['testimonials'] }); setAlert({ type: 'success', message: 'Testimonial deleted' }); setConfirmDelete(null) }, onError: () => setAlert({ type: 'error', message: 'Failed to delete testimonial' }) })

  function resetForm() { setForm({ client_name: '', client_title: '', client_image: '', content: '', rating: 5, is_featured: false, is_active: true, order_index: testimonials.length }); setEditingTestimonial(null) }

  function openEdit(t: Testimonial) { setEditingTestimonial(t); setForm({ client_name: t.client_name, client_title: t.client_title, client_image: t.client_image || '', content: t.content, rating: t.rating, is_featured: t.is_featured, is_active: t.is_active, order_index: t.order_index }); setShowModal(true) }

  function handleSubmit() {
    if (editingTestimonial) { updateMutation.mutate({ id: editingTestimonial.id, data: form as any }) }
    else { createMutation.mutate(form as any) }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Testimonials</h3>
        <button onClick={() => { resetForm(); setShowModal(true) }} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Plus size={16} /> Add Testimonial
        </button>
      </div>
      {testimonials.length === 0 ? <EmptyState message="No testimonials" /> : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Order</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Client</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Rating</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Featured</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Active</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {testimonials.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">{t.order_index}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{t.client_name}</p>
                    <p className="text-xs text-gray-500">{t.client_title}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-0.5 text-yellow-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} fill={i < t.rating ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">{t.is_featured ? <Badge color="green">Yes</Badge> : <Badge>No</Badge>}</td>
                  <td className="px-4 py-3">{t.is_active ? <Badge color="green">Active</Badge> : <Badge color="red">Inactive</Badge>}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(t)} className="rounded p-1 hover:bg-gray-100"><Pencil size={16} className="text-gray-500" /></button>
                      <button onClick={() => setConfirmDelete(t.id)} className="rounded p-1 hover:bg-gray-100"><Trash2 size={16} className="text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Client Name" value={form.client_name} onChange={(v) => setForm({ ...form, client_name: v })} required />
            <InputField label="Client Title" value={form.client_title} onChange={(v) => setForm({ ...form, client_title: v })} required />
          </div>
          <FileUrlInput label="Client Image URL" value={form.client_image} onChange={(v) => setForm({ ...form, client_image: v })} />
          <InputField label="Content" value={form.content} onChange={(v) => setForm({ ...form, content: v })} rows={3} required />
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })}>
                  <Star size={24} className={n <= form.rating ? 'text-yellow-500' : 'text-gray-300'} fill={n <= form.rating ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>
          <InputField label="Order Index" value={String(form.order_index)} onChange={(v) => setForm({ ...form, order_index: Number(v) })} type="number" />
          <div className="flex flex-wrap gap-4">
            <Toggle label="Featured" value={form.is_featured} onChange={(v) => setForm({ ...form, is_featured: v })} />
            <Toggle label="Active" value={form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50">Cancel</button>
            <button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {(createMutation.isPending || updateMutation.isPending) && <Loader2 size={14} className="animate-spin" />}
              {editingTestimonial ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!confirmDelete} title="Delete Testimonial" message="Are you sure you want to delete this testimonial?" onConfirm={() => deleteMutation.mutate(confirmDelete!)} onCancel={() => setConfirmDelete(null)} />
    </div>
  )
}

// ─── TEAM MEMBERS ─────────────────────────────────────────────────────────────

function TeamTab() {
  const queryClient = useQueryClient()
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', position: '', bio: '', image_url: '', email: '', phone: '', social_linkedin: '', social_facebook: '', order_index: 0, is_active: true })

  const { data: members = [], isLoading } = useQuery({ queryKey: ['team'], queryFn: () => teamService.getAll() })

  const createMutation = useMutation({ mutationFn: teamService.create, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['team'] }); setAlert({ type: 'success', message: 'Member added' }); setShowModal(false); resetForm() }, onError: () => setAlert({ type: 'error', message: 'Failed to add member' }) })
  const updateMutation = useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<TeamMember> }) => teamService.update(id, data), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['team'] }); setAlert({ type: 'success', message: 'Member updated' }); setShowModal(false); resetForm() }, onError: () => setAlert({ type: 'error', message: 'Failed to update member' }) })
  const deleteMutation = useMutation({ mutationFn: teamService.delete, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['team'] }); setAlert({ type: 'success', message: 'Member removed' }); setConfirmDelete(null) }, onError: () => setAlert({ type: 'error', message: 'Failed to remove member' }) })

  function resetForm() { setForm({ name: '', position: '', bio: '', image_url: '', email: '', phone: '', social_linkedin: '', social_facebook: '', order_index: members.length, is_active: true }); setEditingMember(null) }

  function openEdit(m: TeamMember) { setEditingMember(m); setForm({ name: m.name, position: m.position, bio: m.bio, image_url: m.image_url, email: m.email || '', phone: m.phone || '', social_linkedin: m.social_linkedin || '', social_facebook: m.social_facebook || '', order_index: m.order_index, is_active: m.is_active }); setShowModal(true) }

  function handleSubmit() {
    if (editingMember) { updateMutation.mutate({ id: editingMember.id, data: form as any }) }
    else { createMutation.mutate(form as any) }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Team Members</h3>
        <button onClick={() => { resetForm(); setShowModal(true) }} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Plus size={16} /> Add Member
        </button>
      </div>
      {members.length === 0 ? <EmptyState message="No team members" /> : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Order</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Position</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Active</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">{m.order_index}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{m.name}</td>
                  <td className="px-4 py-3 text-gray-600">{m.position}</td>
                  <td className="px-4 py-3">{m.is_active ? <Badge color="green">Active</Badge> : <Badge color="red">Inactive</Badge>}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(m)} className="rounded p-1 hover:bg-gray-100"><Pencil size={16} className="text-gray-500" /></button>
                      <button onClick={() => setConfirmDelete(m.id)} className="rounded p-1 hover:bg-gray-100"><Trash2 size={16} className="text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editingMember ? 'Edit Member' : 'Add Member'} wide>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <InputField label="Position" value={form.position} onChange={(v) => setForm({ ...form, position: v })} required />
          </div>
          <InputField label="Bio" value={form.bio} onChange={(v) => setForm({ ...form, bio: v })} rows={3} />
          <FileUrlInput label="Image URL" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} type="email" />
            <InputField label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="LinkedIn URL" value={form.social_linkedin} onChange={(v) => setForm({ ...form, social_linkedin: v })} />
            <InputField label="Facebook URL" value={form.social_facebook} onChange={(v) => setForm({ ...form, social_facebook: v })} />
          </div>
          <InputField label="Order Index" value={String(form.order_index)} onChange={(v) => setForm({ ...form, order_index: Number(v) })} type="number" />
          <Toggle label="Active" value={form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} />
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50">Cancel</button>
            <button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {(createMutation.isPending || updateMutation.isPending) && <Loader2 size={14} className="animate-spin" />}
              {editingMember ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!confirmDelete} title="Delete Member" message="Are you sure you want to remove this team member?" onConfirm={() => deleteMutation.mutate(confirmDelete!)} onCancel={() => setConfirmDelete(null)} />
    </div>
  )
}

// ─── GALLERY ──────────────────────────────────────────────────────────────────

function GalleryTab() {
  const queryClient = useQueryClient()
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', description: '', media_url: '', media_type: 'image' as 'image' | 'video', category: '', is_active: true, order_index: 0 })

  const { data: items = [], isLoading } = useQuery({ queryKey: ['gallery'], queryFn: () => galleryService.getAll() })

  const createMutation = useMutation({ mutationFn: galleryService.create, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['gallery'] }); setAlert({ type: 'success', message: 'Item added' }); setShowModal(false); resetForm() }, onError: () => setAlert({ type: 'error', message: 'Failed to add item' }) })
  const updateMutation = useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<GalleryItem> }) => galleryService.update(id, data), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['gallery'] }); setAlert({ type: 'success', message: 'Item updated' }); setShowModal(false); resetForm() }, onError: () => setAlert({ type: 'error', message: 'Failed to update item' }) })
  const deleteMutation = useMutation({ mutationFn: galleryService.delete, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['gallery'] }); setAlert({ type: 'success', message: 'Item deleted' }); setConfirmDelete(null) }, onError: () => setAlert({ type: 'error', message: 'Failed to delete item' }) })

  function resetForm() { setForm({ title: '', description: '', media_url: '', media_type: 'image', category: '', is_active: true, order_index: items.length }); setEditingItem(null) }

  function openEdit(g: GalleryItem) { setEditingItem(g); setForm({ title: g.title, description: g.description || '', media_url: g.media_url, media_type: g.media_type, category: g.category, is_active: g.is_active, order_index: g.order_index }); setShowModal(true) }

  function handleSubmit() {
    if (editingItem) { updateMutation.mutate({ id: editingItem.id, data: form as any }) }
    else { createMutation.mutate(form as any) }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Gallery</h3>
        <button onClick={() => { resetForm(); setShowModal(true) }} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Plus size={16} /> Add Item
        </button>
      </div>
      {items.length === 0 ? <EmptyState message="No gallery items" /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((g) => (
            <div key={g.id} className="group relative overflow-hidden rounded-xl border bg-white shadow-sm">
              <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                {g.media_type === 'video' ? (
                  <video src={g.media_url} className="h-full w-full object-cover" muted />
                ) : (
                  <img src={g.media_url} alt={g.title} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="p-3">
                <p className="font-medium text-gray-900 text-sm truncate">{g.title}</p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge>{g.media_type}</Badge>
                  {g.category && <Badge color="blue">{g.category}</Badge>}
                  {g.is_active ? <Badge color="green">Active</Badge> : <Badge color="red">Inactive</Badge>}
                </div>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(g)} className="rounded bg-white/90 p-1.5 shadow hover:bg-white"><Pencil size={14} /></button>
                <button onClick={() => setConfirmDelete(g.id)} className="rounded bg-white/90 p-1.5 shadow hover:bg-white"><Trash2 size={14} className="text-red-500" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editingItem ? 'Edit Gallery Item' : 'Add Gallery Item'}>
        <div className="space-y-4">
          <InputField label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
          <InputField label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} rows={2} />
          <FileUrlInput label="Media URL" value={form.media_url} onChange={(v) => setForm({ ...form, media_url: v })} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField label="Media Type" value={form.media_type} onChange={(v) => setForm({ ...form, media_type: v as 'image' | 'video' })} options={[{ value: 'image', label: 'Image' }, { value: 'video', label: 'Video' }]} />
            <InputField label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
          </div>
          <InputField label="Order Index" value={String(form.order_index)} onChange={(v) => setForm({ ...form, order_index: Number(v) })} type="number" />
          <Toggle label="Active" value={form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} />
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50">Cancel</button>
            <button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {(createMutation.isPending || updateMutation.isPending) && <Loader2 size={14} className="animate-spin" />}
              {editingItem ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!confirmDelete} title="Delete Gallery Item" message="Are you sure you want to delete this item?" onConfirm={() => deleteMutation.mutate(confirmDelete!)} onCancel={() => setConfirmDelete(null)} />
    </div>
  )
}

// ─── CONTACTS ─────────────────────────────────────────────────────────────────

function ContactsTab() {
  const queryClient = useQueryClient()
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingContact, setEditingContact] = useState<ContactDetail | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [form, setForm] = useState({ branch_name: '', address: '', city: '', province: '', phone: [''] as string[], email: [''] as string[], google_maps_url: '', business_hours: {} as Record<string, string>, is_headquarters: false, is_active: true, order_index: 0 })

  const { data: contacts = [], isLoading } = useQuery({ queryKey: ['contacts'], queryFn: () => contactService.getAll() })

  const createMutation = useMutation({ mutationFn: contactService.create, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['contacts'] }); setAlert({ type: 'success', message: 'Branch added' }); setShowModal(false); resetForm() }, onError: () => setAlert({ type: 'error', message: 'Failed to add branch' }) })
  const updateMutation = useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<ContactDetail> }) => contactService.update(id, data), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['contacts'] }); setAlert({ type: 'success', message: 'Branch updated' }); setShowModal(false); resetForm() }, onError: () => setAlert({ type: 'error', message: 'Failed to update branch' }) })
  const deleteMutation = useMutation({ mutationFn: contactService.delete, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['contacts'] }); setAlert({ type: 'success', message: 'Branch deleted' }); setConfirmDelete(null) }, onError: () => setAlert({ type: 'error', message: 'Failed to delete branch' }) })

  function resetForm() { setForm({ branch_name: '', address: '', city: '', province: '', phone: [''], email: [''], google_maps_url: '', business_hours: {}, is_headquarters: false, is_active: true, order_index: contacts.length }); setEditingContact(null) }

  function openEdit(c: ContactDetail) { setEditingContact(c); setForm({ branch_name: c.branch_name, address: c.address, city: c.city, province: c.province, phone: c.phone.length ? c.phone : [''], email: c.email.length ? c.email : [''], google_maps_url: c.google_maps_url || '', business_hours: c.business_hours || {}, is_headquarters: c.is_headquarters, is_active: c.is_active, order_index: c.order_index }); setShowModal(true) }

  function handleSubmit() {
    const data = { ...form, phone: form.phone.filter(Boolean), email: form.email.filter(Boolean), google_maps_url: form.google_maps_url || undefined }
    if (editingContact) { updateMutation.mutate({ id: editingContact.id, data: data as any }) }
    else { createMutation.mutate(data as any) }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Contact / Branches</h3>
        <button onClick={() => { resetForm(); setShowModal(true) }} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Plus size={16} /> Add Branch
        </button>
      </div>
      {contacts.length === 0 ? <EmptyState message="No branches" /> : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Order</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Branch</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">City</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">HQ</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Active</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {contacts.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">{c.order_index}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{c.branch_name}</td>
                  <td className="px-4 py-3 text-gray-600">{c.city}</td>
                  <td className="px-4 py-3">{c.is_headquarters ? <Badge color="blue">HQ</Badge> : null}</td>
                  <td className="px-4 py-3">{c.is_active ? <Badge color="green">Active</Badge> : <Badge color="red">Inactive</Badge>}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(c)} className="rounded p-1 hover:bg-gray-100"><Pencil size={16} className="text-gray-500" /></button>
                      <button onClick={() => setConfirmDelete(c.id)} className="rounded p-1 hover:bg-gray-100"><Trash2 size={16} className="text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editingContact ? 'Edit Branch' : 'Add Branch'} wide>
        <div className="space-y-4">
          <InputField label="Branch Name" value={form.branch_name} onChange={(v) => setForm({ ...form, branch_name: v })} required />
          <InputField label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} required />
            <InputField label="Province" value={form.province} onChange={(v) => setForm({ ...form, province: v })} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Phone Numbers</label>
            {form.phone.map((p, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input value={p} onChange={(e) => { const arr = [...form.phone]; arr[i] = e.target.value; setForm({ ...form, phone: arr }) }} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 outline-none" placeholder="Phone number" />
                {form.phone.length > 1 && <button type="button" onClick={() => setForm({ ...form, phone: form.phone.filter((_, idx) => idx !== i) })} className="rounded-lg border px-2 hover:bg-gray-50"><X size={14} /></button>}
              </div>
            ))}
            <button type="button" onClick={() => setForm({ ...form, phone: [...form.phone, ''] })} className="text-sm text-blue-600 hover:underline">+ Add phone</button>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email Addresses</label>
            {form.email.map((e, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input value={e} onChange={(ev) => { const arr = [...form.email]; arr[i] = ev.target.value; setForm({ ...form, email: arr }) }} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 outline-none" placeholder="Email address" />
                {form.email.length > 1 && <button type="button" onClick={() => setForm({ ...form, email: form.email.filter((_, idx) => idx !== i) })} className="rounded-lg border px-2 hover:bg-gray-50"><X size={14} /></button>}
              </div>
            ))}
            <button type="button" onClick={() => setForm({ ...form, email: [...form.email, ''] })} className="text-sm text-blue-600 hover:underline">+ Add email</button>
          </div>
          <InputField label="Google Maps URL" value={form.google_maps_url} onChange={(v) => setForm({ ...form, google_maps_url: v })} />
          <InputField label="Order Index" value={String(form.order_index)} onChange={(v) => setForm({ ...form, order_index: Number(v) })} type="number" />
          <div className="flex flex-wrap gap-4">
            <Toggle label="Headquarters" value={form.is_headquarters} onChange={(v) => setForm({ ...form, is_headquarters: v })} />
            <Toggle label="Active" value={form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50">Cancel</button>
            <button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {(createMutation.isPending || updateMutation.isPending) && <Loader2 size={14} className="animate-spin" />}
              {editingContact ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!confirmDelete} title="Delete Branch" message="Are you sure you want to delete this branch?" onConfirm={() => deleteMutation.mutate(confirmDelete!)} onCancel={() => setConfirmDelete(null)} />
    </div>
  )
}

// ─── TEST DRIVES ──────────────────────────────────────────────────────────────

function TestDrivesTab() {
  const queryClient = useQueryClient()
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [viewingRequest, setViewingRequest] = useState<TestDriveRequest | null>(null)

  const { data: requests = [], isLoading } = useQuery({ queryKey: ['testDrives'], queryFn: () => testDriveService.getAll() })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TestDriveRequest['status'] }) => testDriveService.updateStatus(id, status),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['testDrives'] }); setAlert({ type: 'success', message: 'Status updated' }); setViewingRequest(null) },
    onError: () => setAlert({ type: 'error', message: 'Failed to update status' }),
  })

  const deleteMutation = useMutation({
    mutationFn: testDriveService.delete,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['testDrives'] }); setAlert({ type: 'success', message: 'Request deleted' }) },
    onError: () => setAlert({ type: 'error', message: 'Failed to delete request' }),
  })

  const filtered = filter === 'all' ? requests : requests.filter((r) => r.status === filter)

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
      <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-lg font-semibold">Test Drive Requests</h3>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 outline-none">
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      {filtered.length === 0 ? <EmptyState message="No test drive requests found" /> : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Phone</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Vehicle</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{r.full_name}</td>
                  <td className="px-4 py-3 text-gray-600">{r.phone}</td>
                  <td className="px-4 py-3 text-gray-600">{r.vehicle?.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-gray-600">{r.preferred_date} {r.preferred_time}</td>
                  <td className="px-4 py-3">
                    <Badge color={r.status === 'pending' ? 'yellow' : r.status === 'approved' ? 'green' : r.status === 'rejected' ? 'red' : 'blue'}>{r.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setViewingRequest(r)} className="rounded p-1 hover:bg-gray-100"><Eye size={16} className="text-gray-500" /></button>
                      {r.status === 'pending' && (
                        <>
                          <button onClick={() => updateStatusMutation.mutate({ id: r.id, status: 'approved' })} className="rounded bg-green-100 p-1 hover:bg-green-200"><Check size={16} className="text-green-700" /></button>
                          <button onClick={() => updateStatusMutation.mutate({ id: r.id, status: 'rejected' })} className="rounded bg-red-100 p-1 hover:bg-red-200"><X size={16} className="text-red-700" /></button>
                        </>
                      )}
                      {r.status === 'approved' && (
                        <button onClick={() => updateStatusMutation.mutate({ id: r.id, status: 'completed' })} className="rounded bg-blue-100 p-1 hover:bg-blue-200"><Check size={16} className="text-blue-700" /></button>
                      )}
                      <button onClick={() => deleteMutation.mutate(r.id)} className="rounded p-1 hover:bg-gray-100"><Trash2 size={16} className="text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!viewingRequest} onClose={() => setViewingRequest(null)} title="Test Drive Details">
        {viewingRequest && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-gray-500">Name</p><p className="font-medium">{viewingRequest.full_name}</p></div>
              <div><p className="text-gray-500">Phone</p><p className="font-medium">{viewingRequest.phone}</p></div>
              <div><p className="text-gray-500">Email</p><p className="font-medium">{viewingRequest.email}</p></div>
              <div><p className="text-gray-500">Address</p><p className="font-medium">{viewingRequest.address}</p></div>
            </div>
            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-gray-500">Vehicle</p><p className="font-medium">{viewingRequest.vehicle?.name || 'N/A'}</p></div>
                <div><p className="text-gray-500">Status</p><Badge color={viewingRequest.status === 'pending' ? 'yellow' : viewingRequest.status === 'approved' ? 'green' : viewingRequest.status === 'rejected' ? 'red' : 'blue'}>{viewingRequest.status}</Badge></div>
                <div><p className="text-gray-500">Preferred Date</p><p className="font-medium">{viewingRequest.preferred_date}</p></div>
                <div><p className="text-gray-500">Preferred Time</p><p className="font-medium">{viewingRequest.preferred_time}</p></div>
              </div>
            </div>
            {viewingRequest.notes && (
              <div className="border-t pt-4"><p className="text-gray-500">Notes</p><p className="font-medium">{viewingRequest.notes}</p></div>
            )}
            {viewingRequest.admin_notes && (
              <div className="border-t pt-4"><p className="text-gray-500">Admin Notes</p><p className="font-medium">{viewingRequest.admin_notes}</p></div>
            )}
            <div className="border-t pt-4 flex justify-end gap-2">
              {viewingRequest.status === 'pending' && (
                <>
                  <button onClick={() => updateStatusMutation.mutate({ id: viewingRequest.id, status: 'approved' })} className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700">
                    <Check size={14} /> Approve
                  </button>
                  <button onClick={() => updateStatusMutation.mutate({ id: viewingRequest.id, status: 'rejected' })} className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700">
                    <X size={14} /> Reject
                  </button>
                </>
              )}
              {viewingRequest.status === 'approved' && (
                <button onClick={() => updateStatusMutation.mutate({ id: viewingRequest.id, status: 'completed' })} className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  <Check size={14} /> Mark Completed
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────

function SettingsTab() {
  const queryClient = useQueryClient()
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [activeGroup, setActiveGroup] = useState<'company' | 'site'>('company')

  const { data: companySettings = [], isLoading: loadingCompany } = useQuery({ queryKey: ['companySettings'], queryFn: () => companyService.getAll() })
  const { data: siteSettings = [], isLoading: loadingSite } = useQuery({ queryKey: ['siteSettings'], queryFn: () => siteService.getAll() })

  const upsertCompanyMutation = useMutation({ mutationFn: ({ key, value }: { key: string; value: string }) => companyService.upsert(key, value), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['companySettings'] }); setAlert({ type: 'success', message: 'Setting saved' }) }, onError: () => setAlert({ type: 'error', message: 'Failed to save setting' }) })
  const upsertSiteMutation = useMutation({ mutationFn: ({ key, value }: { key: string; value: string }) => siteService.upsert(key, value), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['siteSettings'] }); setAlert({ type: 'success', message: 'Setting saved' }) }, onError: () => setAlert({ type: 'error', message: 'Failed to save setting' }) })

  const deleteCompanyMutation = useMutation({ mutationFn: companyService.delete, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['companySettings'] }); setAlert({ type: 'success', message: 'Setting deleted' }) }, onError: () => setAlert({ type: 'error', message: 'Failed to delete setting' }) })
  const deleteSiteMutation = useMutation({ mutationFn: siteService.delete, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['siteSettings'] }); setAlert({ type: 'success', message: 'Setting deleted' }) }, onError: () => setAlert({ type: 'error', message: 'Failed to delete setting' }) })

  const [editKey, setEditKey] = useState('')
  const [editValue, setEditValue] = useState('')

  function startEdit(key: string, value: string) { setEditKey(key); setEditValue(value) }

  function saveSetting() {
    if (activeGroup === 'company') { upsertCompanyMutation.mutate({ key: editKey, value: editValue }) }
    else { upsertSiteMutation.mutate({ key: editKey, value: editValue }) }
    setEditKey(''); setEditValue('')
  }

  const isLoading = activeGroup === 'company' ? loadingCompany : loadingSite
  const settings = activeGroup === 'company' ? companySettings : siteSettings

  return (
    <div>
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
      <h3 className="mb-4 text-lg font-semibold">Settings</h3>

      <div className="mb-4 flex gap-2">
        <button onClick={() => setActiveGroup('company')} className={`rounded-lg px-4 py-2 text-sm font-medium ${activeGroup === 'company' ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}>Company</button>
        <button onClick={() => setActiveGroup('site')} className={`rounded-lg px-4 py-2 text-sm font-medium ${activeGroup === 'site' ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}>Site</button>
      </div>

      <div className="mb-4 rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex gap-3">
          <InputField label="Key" value={editKey} onChange={setEditKey} placeholder="setting_key" />
          <div className="flex-1">
            <InputField label="Value" value={editValue} onChange={setEditValue} placeholder="setting value" />
          </div>
          <div className="flex items-end">
            <button onClick={saveSetting} disabled={!editKey} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              <Save size={14} /> Save
            </button>
          </div>
        </div>
      </div>

      {isLoading ? <LoadingSpinner /> : settings.length === 0 ? <EmptyState message="No settings yet" /> : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Key</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Value</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {settings.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{s.key}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{s.value}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => startEdit(s.key, s.value)} className="rounded p-1 hover:bg-gray-100"><Pencil size={16} className="text-gray-500" /></button>
                      <button onClick={() => activeGroup === 'company' ? deleteCompanyMutation.mutate(s.id) : deleteSiteMutation.mutate(s.id)} className="rounded p-1 hover:bg-gray-100"><Trash2 size={16} className="text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─── SEO ──────────────────────────────────────────────────────────────────────

function SeoTab() {
  const queryClient = useQueryClient()
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingSeo, setEditingSeo] = useState<SeoSetting | null>(null)
  const [form, setForm] = useState({ page_path: '', meta_title: '', meta_description: '', og_image: '', canonical_url: '' })

  const { data: seoSettings = [], isLoading } = useQuery({ queryKey: ['seoSettings'], queryFn: () => seoService.getAll() })

  const upsertMutation = useMutation({ mutationFn: seoService.upsert, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['seoSettings'] }); setAlert({ type: 'success', message: 'SEO setting saved' }); setShowModal(false); resetForm() }, onError: () => setAlert({ type: 'error', message: 'Failed to save SEO setting' }) })
  const deleteMutation = useMutation({ mutationFn: seoService.delete, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['seoSettings'] }); setAlert({ type: 'success', message: 'SEO setting deleted' }) }, onError: () => setAlert({ type: 'error', message: 'Failed to delete SEO setting' }) })

  function resetForm() { setForm({ page_path: '', meta_title: '', meta_description: '', og_image: '', canonical_url: '' }); setEditingSeo(null) }

  function openEdit(s: SeoSetting) { setEditingSeo(s); setForm({ page_path: s.page_path, meta_title: s.meta_title, meta_description: s.meta_description, og_image: s.og_image || '', canonical_url: s.canonical_url || '' }); setShowModal(true) }

  function handleSubmit() {
    upsertMutation.mutate({ page_path: form.page_path, meta_title: form.meta_title, meta_description: form.meta_description, og_image: form.og_image || undefined, canonical_url: form.canonical_url || undefined })
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">SEO Settings</h3>
        <button onClick={() => { resetForm(); setShowModal(true) }} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Plus size={16} /> Add SEO
        </button>
      </div>
      {seoSettings.length === 0 ? <EmptyState message="No SEO settings" /> : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Page Path</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Meta Title</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Meta Description</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {seoSettings.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{s.page_path}</td>
                  <td className="px-4 py-3 text-gray-600">{s.meta_title}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{s.meta_description}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(s)} className="rounded p-1 hover:bg-gray-100"><Pencil size={16} className="text-gray-500" /></button>
                      <button onClick={() => deleteMutation.mutate(s.id)} className="rounded p-1 hover:bg-gray-100"><Trash2 size={16} className="text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editingSeo ? 'Edit SEO' : 'Add SEO'}>
        <div className="space-y-4">
          <InputField label="Page Path" value={form.page_path} onChange={(v) => setForm({ ...form, page_path: v })} placeholder="/page-path" required />
          <InputField label="Meta Title" value={form.meta_title} onChange={(v) => setForm({ ...form, meta_title: v })} required />
          <InputField label="Meta Description" value={form.meta_description} onChange={(v) => setForm({ ...form, meta_description: v })} rows={2} required />
          <FileUrlInput label="OG Image URL" value={form.og_image} onChange={(v) => setForm({ ...form, og_image: v })} />
          <InputField label="Canonical URL" value={form.canonical_url} onChange={(v) => setForm({ ...form, canonical_url: v })} />
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50">Cancel</button>
            <button onClick={handleSubmit} disabled={upsertMutation.isPending} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {upsertMutation.isPending && <Loader2 size={14} className="animate-spin" />}
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const renderContent = useCallback(() => {
    switch (activeTab) {
      case 'dashboard': return <DashboardOverview />
      case 'hero': return <HeroSlidesTab />
      case 'vehicles': return <VehiclesTab />
      case 'brands': return <BrandsTab />
      case 'products': return <ProductsTab />
      case 'categories': return <CategoriesTab />
      case 'news': return <NewsTab />
      case 'testimonials': return <TestimonialsTab />
      case 'team': return <TeamTab />
      case 'gallery': return <GalleryTab />
      case 'contacts': return <ContactsTab />
      case 'testDrives': return <TestDrivesTab />
      case 'settings': return <SettingsTab />
      case 'seo': return <SeoTab />
      default: return <DashboardOverview />
    }
  }, [activeTab])

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} flex flex-col border-r bg-white transition-all duration-200`}>
        <div className="flex h-14 items-center justify-between border-b px-4">
          {sidebarOpen && <span className="text-sm font-bold text-gray-900">Admin Panel</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded p-1 hover:bg-gray-100">
            <ChevronRight size={18} className={`transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              title={tab.label}
            >
              {tab.icon}
              {sidebarOpen && <span>{tab.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {TABS.find((t) => t.key === activeTab)?.label || 'Dashboard'}
            </h1>
          </div>
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
