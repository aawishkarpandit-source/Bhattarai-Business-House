-- ============================================================
-- Bhattarai Business House - Complete Initial Schema Migration
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. HELPER FUNCTIONS
-- ============================================================

-- Function to automatically update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to check if user is authenticated admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN auth.role() = 'authenticated';
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- ============================================================
-- 2. HERO SLIDES
-- ============================================================
CREATE TABLE hero_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    cta_text TEXT,
    cta_url TEXT,
    background_image TEXT,
    background_video TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active hero slides"
    ON hero_slides FOR SELECT
    USING (is_active = true);

CREATE POLICY "Authenticated can manage hero slides"
    ON hero_slides FOR ALL
    USING (auth.role() = 'authenticated');

CREATE TRIGGER set_hero_slides_updated_at
    BEFORE UPDATE ON hero_slides
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_hero_slides_active ON hero_slides(is_active);
CREATE INDEX idx_hero_slides_order ON hero_slides(order_index);

-- ============================================================
-- 3. BRANDS
-- ============================================================
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    description TEXT,
    website_url TEXT,
    category TEXT,
    is_featured BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read brands"
    ON brands FOR SELECT
    USING (true);

CREATE POLICY "Authenticated can manage brands"
    ON brands FOR ALL
    USING (auth.role() = 'authenticated');

CREATE TRIGGER set_brands_updated_at
    BEFORE UPDATE ON brands
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_brands_slug ON brands(slug);
CREATE INDEX idx_brands_category ON brands(category);
CREATE INDEX idx_brands_featured ON brands(is_featured);

-- ============================================================
-- 4. VEHICLES
-- ============================================================
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    model_year INTEGER,
    price NUMERIC(12,2),
    price_currency TEXT DEFAULT 'NPR',
    description TEXT,
    short_description TEXT,
    fuel_type TEXT,
    transmission TEXT,
    seating_capacity INTEGER,
    is_ev BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    brochure_url TEXT,
    thumbnail_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active vehicles"
    ON vehicles FOR SELECT
    USING (is_active = true);

CREATE POLICY "Authenticated can manage vehicles"
    ON vehicles FOR ALL
    USING (auth.role() = 'authenticated');

CREATE TRIGGER set_vehicles_updated_at
    BEFORE UPDATE ON vehicles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_vehicles_brand_id ON vehicles(brand_id);
CREATE INDEX idx_vehicles_slug ON vehicles(slug);
CREATE INDEX idx_vehicles_fuel_type ON vehicles(fuel_type);
CREATE INDEX idx_vehicles_transmission ON vehicles(transmission);
CREATE INDEX idx_vehicles_is_ev ON vehicles(is_ev);
CREATE INDEX idx_vehicles_featured ON vehicles(is_featured);
CREATE INDEX idx_vehicles_active ON vehicles(is_active);

-- ============================================================
-- 5. VEHICLE IMAGES
-- ============================================================
CREATE TABLE vehicle_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    is_primary BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE vehicle_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read vehicle images"
    ON vehicle_images FOR SELECT
    USING (true);

CREATE POLICY "Authenticated can manage vehicle images"
    ON vehicle_images FOR ALL
    USING (auth.role() = 'authenticated');

CREATE INDEX idx_vehicle_images_vehicle_id ON vehicle_images(vehicle_id);
CREATE INDEX idx_vehicle_images_primary ON vehicle_images(is_primary);

-- ============================================================
-- 6. VEHICLE FEATURES
-- ============================================================
CREATE TABLE vehicle_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    feature_name TEXT NOT NULL,
    feature_value TEXT,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE vehicle_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read vehicle features"
    ON vehicle_features FOR SELECT
    USING (true);

CREATE POLICY "Authenticated can manage vehicle features"
    ON vehicle_features FOR ALL
    USING (auth.role() = 'authenticated');

CREATE INDEX idx_vehicle_features_vehicle_id ON vehicle_features(vehicle_id);
CREATE INDEX idx_vehicle_features_category ON vehicle_features(category);

-- ============================================================
-- 7. VEHICLE SPECS
-- ============================================================
CREATE TABLE vehicle_specs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    spec_name TEXT NOT NULL,
    spec_value TEXT,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE vehicle_specs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read vehicle specs"
    ON vehicle_specs FOR SELECT
    USING (true);

CREATE POLICY "Authenticated can manage vehicle specs"
    ON vehicle_specs FOR ALL
    USING (auth.role() = 'authenticated');

CREATE INDEX idx_vehicle_specs_vehicle_id ON vehicle_specs(vehicle_id);
CREATE INDEX idx_vehicle_specs_category ON vehicle_specs(category);

-- ============================================================
-- 8. CATEGORIES
-- ============================================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read categories"
    ON categories FOR SELECT
    USING (true);

CREATE POLICY "Authenticated can manage categories"
    ON categories FOR ALL
    USING (auth.role() = 'authenticated');

CREATE TRIGGER set_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);

-- ============================================================
-- 9. PRODUCTS
-- ============================================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    price NUMERIC(12,2),
    image_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active products"
    ON products FOR SELECT
    USING (is_active = true);

CREATE POLICY "Authenticated can manage products"
    ON products FOR ALL
    USING (auth.role() = 'authenticated');

CREATE TRIGGER set_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_brand_id ON products(brand_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_active ON products(is_active);

-- ============================================================
-- 10. NEWS
-- ============================================================
CREATE TABLE news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    featured_image TEXT,
    author TEXT,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    meta_title TEXT,
    meta_description TEXT,
    tags jsonb DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published news"
    ON news FOR SELECT
    USING (is_published = true);

CREATE POLICY "Authenticated can manage news"
    ON news FOR ALL
    USING (auth.role() = 'authenticated');

CREATE TRIGGER set_news_updated_at
    BEFORE UPDATE ON news
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_news_slug ON news(slug);
CREATE INDEX idx_news_published ON news(is_published);
CREATE INDEX idx_news_published_at ON news(published_at);
CREATE INDEX idx_news_tags ON news USING gin(tags);

-- ============================================================
-- 11. TESTIMONIALS
-- ============================================================
CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    client_title TEXT,
    client_image TEXT,
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active testimonials"
    ON testimonials FOR SELECT
    USING (is_active = true);

CREATE POLICY "Authenticated can manage testimonials"
    ON testimonials FOR ALL
    USING (auth.role() = 'authenticated');

CREATE TRIGGER set_testimonials_updated_at
    BEFORE UPDATE ON testimonials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_testimonials_featured ON testimonials(is_featured);
CREATE INDEX idx_testimonials_active ON testimonials(is_active);
CREATE INDEX idx_testimonials_order ON testimonials(order_index);

-- ============================================================
-- 12. GALLERY
-- ============================================================
CREATE TABLE gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    description TEXT,
    media_url TEXT NOT NULL,
    media_type TEXT DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
    category TEXT,
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active gallery"
    ON gallery FOR SELECT
    USING (is_active = true);

CREATE POLICY "Authenticated can manage gallery"
    ON gallery FOR ALL
    USING (auth.role() = 'authenticated');

CREATE TRIGGER set_gallery_updated_at
    BEFORE UPDATE ON gallery
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_gallery_category ON gallery(category);
CREATE INDEX idx_gallery_media_type ON gallery(media_type);
CREATE INDEX idx_gallery_active ON gallery(is_active);

-- ============================================================
-- 13. TEAM MEMBERS
-- ============================================================
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    position TEXT,
    bio TEXT,
    image_url TEXT,
    email TEXT,
    phone TEXT,
    social_linkedin TEXT,
    social_facebook TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active team members"
    ON team_members FOR SELECT
    USING (is_active = true);

CREATE POLICY "Authenticated can manage team members"
    ON team_members FOR ALL
    USING (auth.role() = 'authenticated');

CREATE TRIGGER set_team_members_updated_at
    BEFORE UPDATE ON team_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_team_members_active ON team_members(is_active);
CREATE INDEX idx_team_members_order ON team_members(order_index);

-- ============================================================
-- 14. CONTACT DETAILS
-- ============================================================
CREATE TABLE contact_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_name TEXT NOT NULL,
    address TEXT,
    city TEXT,
    province TEXT,
    phone jsonb DEFAULT '[]',
    email jsonb DEFAULT '[]',
    google_maps_url TEXT,
    business_hours jsonb DEFAULT '{}',
    is_headquarters BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE contact_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active contact details"
    ON contact_details FOR SELECT
    USING (is_active = true);

CREATE POLICY "Authenticated can manage contact details"
    ON contact_details FOR ALL
    USING (auth.role() = 'authenticated');

CREATE TRIGGER set_contact_details_updated_at
    BEFORE UPDATE ON contact_details
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_contact_details_active ON contact_details(is_active);
CREATE INDEX idx_contact_details_headquarters ON contact_details(is_headquarters);

-- ============================================================
-- 15. COMPANY SETTINGS
-- ============================================================
CREATE TABLE company_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    type TEXT DEFAULT 'text',
    grp TEXT DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read company settings"
    ON company_settings FOR SELECT
    USING (true);

CREATE POLICY "Authenticated can manage company settings"
    ON company_settings FOR ALL
    USING (auth.role() = 'authenticated');

CREATE TRIGGER set_company_settings_updated_at
    BEFORE UPDATE ON company_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_company_settings_key ON company_settings(key);
CREATE INDEX idx_company_settings_group ON company_settings(grp);

-- ============================================================
-- 16. SEO SETTINGS
-- ============================================================
CREATE TABLE seo_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_path TEXT UNIQUE NOT NULL,
    meta_title TEXT,
    meta_description TEXT,
    og_image TEXT,
    canonical_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read SEO settings"
    ON seo_settings FOR SELECT
    USING (true);

CREATE POLICY "Authenticated can manage SEO settings"
    ON seo_settings FOR ALL
    USING (auth.role() = 'authenticated');

CREATE TRIGGER set_seo_settings_updated_at
    BEFORE UPDATE ON seo_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_seo_settings_page_path ON seo_settings(page_path);

-- ============================================================
-- 17. TEST DRIVE REQUESTS
-- ============================================================
CREATE TABLE test_drive_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
    preferred_date DATE,
    preferred_time TIME,
    notes TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'confirmed', 'completed', 'cancelled')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE test_drive_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can manage test drive requests"
    ON test_drive_requests FOR ALL
    USING (auth.role() = 'authenticated');

CREATE TRIGGER set_test_drive_requests_updated_at
    BEFORE UPDATE ON test_drive_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_test_drive_requests_vehicle_id ON test_drive_requests(vehicle_id);
CREATE INDEX idx_test_drive_requests_status ON test_drive_requests(status);

-- ============================================================
-- 18. SITE SETTINGS
-- ============================================================
CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site settings"
    ON site_settings FOR SELECT
    USING (true);

CREATE POLICY "Authenticated can manage site settings"
    ON site_settings FOR ALL
    USING (auth.role() = 'authenticated');

CREATE TRIGGER set_site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_site_settings_key ON site_settings(key);

-- ============================================================
-- 19. HOME SECTIONS
-- ============================================================
CREATE TABLE home_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_type TEXT NOT NULL,
    title TEXT,
    subtitle TEXT,
    content TEXT,
    settings jsonb DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE home_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active home sections"
    ON home_sections FOR SELECT
    USING (is_active = true);

CREATE POLICY "Authenticated can manage home sections"
    ON home_sections FOR ALL
    USING (auth.role() = 'authenticated');

CREATE TRIGGER set_home_sections_updated_at
    BEFORE UPDATE ON home_sections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_home_sections_type ON home_sections(section_type);
CREATE INDEX idx_home_sections_active ON home_sections(is_active);
CREATE INDEX idx_home_sections_order ON home_sections(order_index);
