# Bhattarai Business House

**Bhattarai & Brothers Suppliers Pvt. Ltd.** — Premium enterprise website for a multi-brand authorized dealer and distributor in Nepal.

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Routing:** React Router v7
- **State/Data:** TanStack Query (React Query)
- **Forms:** React Hook Form + Zod
- **Backend:** Supabase (Auth, Database, Storage, Edge Functions)
- **Icons:** Lucide React
- **Deployment:** Vercel

## Features

### Public Website
- **Home Page** — Cinematic hero slider, company overview, featured brands, vehicle showcase, testimonials, news, CTA
- **Automotive** — Full vehicle catalogue with search, brand/fuel/transmission/price filters, EV filter, pagination
- **Vehicle Details** — Image gallery, specs, features, brochure download, enquiry form
- **Test Drive Booking** — Full registration form with validation, date/time selection
- **Products & Brands** — Category-based product listing, brand showcase
- **News & Updates** — CMS-powered articles with rich text, tags, SEO
- **About** — Company history timeline, mission/vision, team members
- **Gallery** — Masonry photo/video gallery with lightbox
- **Contact** — Multi-branch locations, contact form, Google Maps, business hours

### Admin Dashboard (`/admin`)
- Password-protected (via `VITE_ADMIN_PASSWORD` env var)
- Full CRUD for all entities:
  - Hero Slides, Vehicles, Brands, Products, Categories
  - News Articles, Testimonials, Team Members
  - Gallery, Contact Details
  - Company Settings, Site Settings, SEO Settings
  - Test Drive Requests (approve/reject/complete)

## Project Structure

```
src/
├── components/
│   ├── layout/        # Header, Footer, MainLayout, AdminLayout
│   ├── sections/      # Home page sections (HeroSlider, FeaturedBrands, etc.)
│   ├── ui/            # Reusable UI components (Button, Skeleton, SectionHeading)
├── pages/             # Public pages
│   └── admin/         # Admin pages (login, dashboard)
├── services/          # Supabase API service layer (17 services)
├── hooks/             # Custom React hooks
├── contexts/          # React contexts (Auth)
├── types/             # TypeScript type definitions
├── utils/             # Utility functions (cn, format, constants)
├── lib/               # Supabase client configuration
supabase/
└── migrations/        # SQL schema migrations
```

## Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd bhattarai-business-house
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in your Supabase credentials:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_ADMIN_PASSWORD=your-secure-admin-password
```

### 3. Supabase Setup

1. Create a new Supabase project
2. Run the SQL migration from `supabase/migrations/001_initial_schema.sql` in the Supabase SQL Editor
3. Create the following storage buckets (set to public):
   - `vehicles`
   - `brands`
   - `gallery`
   - `hero`
   - `news`
   - `products`

### 4. Development

```bash
npm run dev
```

### 5. Build

```bash
npm run build
```

## Deployment to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Set environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_PASSWORD`
4. Deploy

Vercel will automatically detect the Vite project and configure the build.

## Supabase Schema

The database schema includes 18 tables:

| Table | Purpose |
|-------|---------|
| `hero_slides` | Homepage hero carousel slides |
| `brands` | All authorized brands |
| `vehicles` | Vehicle catalogue |
| `vehicle_images` | Vehicle photo gallery |
| `vehicle_features` | Vehicle feature list |
| `vehicle_specs` | Vehicle specifications |
| `categories` | Product categories |
| `products` | Product catalogue |
| `news` | News articles |
| `testimonials` | Client testimonials |
| `gallery` | Photo/video gallery |
| `team_members` | Management team |
| `contact_details` | Branch locations |
| `company_settings` | Company information (CMS) |
| `seo_settings` | Per-page SEO configuration |
| `test_drive_requests` | Test drive bookings |
| `site_settings` | Global site settings |
| `home_sections` | Dynamic home page sections |

## Admin Access

Navigate to `/admin` and enter the password set in `VITE_ADMIN_PASSWORD`.

## License

Private — Bhattarai & Brothers Suppliers Pvt. Ltd.
