import { useEffect } from 'react'
import { motion } from 'framer-motion'
import HeroSlider from '@/components/sections/HeroSlider'
import CompanyOverview from '@/components/sections/CompanyOverview'
import FeaturedBrands from '@/components/sections/FeaturedBrands'
import FeaturedVehicles from '@/components/sections/FeaturedVehicles'
import AuthorizedBrandsGrid from '@/components/sections/AuthorizedBrandsGrid'
import WhyChooseUs from '@/components/sections/WhyChooseUs'
import Testimonials from '@/components/sections/Testimonials'
import LatestNews from '@/components/sections/LatestNews'
import CallToAction from '@/components/sections/CallToAction'

export default function HomePage() {
  useEffect(() => {
    document.title = 'Bhattarai Business House | Authorized Automotive & Electronics Distributor'
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <HeroSlider />
      <CompanyOverview />
      <FeaturedBrands />
      <FeaturedVehicles />
      <AuthorizedBrandsGrid />
      <WhyChooseUs />
      <Testimonials />
      <LatestNews />
      <CallToAction />
    </motion.div>
  )
}
