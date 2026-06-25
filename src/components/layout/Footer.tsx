import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  Share2,
  LinkIcon,
  PlayCircle,
  ArrowRight,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/utils/cn';

const FOOTER_LINKS = {
  automotive: {
    title: 'Automotive',
    links: [
      { label: 'All Vehicles', path: '/automotive' },
      { label: 'Electric Vehicles', path: '/automotive?fuel=electric' },
      { label: 'Book Test Drive', path: '/test-drive' },
    ],
  },
  products: {
    title: 'Products & Brands',
    links: [
      { label: 'All Products', path: '/products' },
      { label: 'Batteries', path: '/products?category=batteries' },
      { label: 'Solar Solutions', path: '/products?category=solar' },
      { label: 'Lubricants', path: '/products?category=lubricants' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { label: 'About Us', path: '/about' },
      { label: 'Our Team', path: '/about#team' },
      { label: 'News', path: '/news' },
      { label: 'Gallery', path: '/gallery' },
    ],
  },
  support: {
    title: 'Support',
    links: [
      { label: 'Contact Us', path: '/contact' },
      { label: 'Testimonials', path: '/about#testimonials' },
    ],
  },
};

const SOCIAL_LINKS = [
  { icon: Globe, href: '#', label: 'Facebook' },
  { icon: Share2, href: '#', label: 'Instagram' },
  { icon: LinkIcon, href: '#', label: 'LinkedIn' },
  { icon: PlayCircle, href: '#', label: 'YouTube' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#0f172a] text-white">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-3 group mb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white font-serif text-base font-bold shadow-lg shadow-primary-600/30 transition-transform duration-300 group-hover:scale-110">
                BBH
              </div>
              <div>
                <div className="font-serif text-lg font-bold text-white leading-tight">
                  Bhattarai Business House
                </div>
                <div className="text-[10px] uppercase tracking-[0.15em] text-primary-400 font-medium">
                  Premium Enterprise
                </div>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 max-w-sm mb-6">
              A trusted name in Nepal's automotive and business landscape. We deliver
              premium vehicles, world-class products, and exceptional service across
              multiple industries.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-gray-400 transition-all duration-300 hover:bg-primary-600 hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-primary-600/25"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {Object.entries(FOOTER_LINKS).map(([key, section]) => (
              <div key={key}>
                <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                  {section.title}
                </h3>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className="group flex items-center gap-1.5 text-sm text-gray-400 transition-colors duration-200 hover:text-primary-400"
                      >
                        <span className="inline-block h-px w-0 bg-primary-400 transition-all duration-300 group-hover:w-2" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact & Newsletter */}
          <div className="lg:col-span-12">
            <div className="border-t border-white/10 pt-10 mt-2 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Contact Info */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                  Contact
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-gray-400">
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary-400" />
                    <span>Kathmandu, Nepal</span>
                  </li>
                  <li>
                    <a
                      href="tel:+97714567890"
                      className="flex items-center gap-3 text-sm text-gray-400 transition-colors hover:text-primary-400"
                    >
                      <Phone className="h-4 w-4 shrink-0 text-primary-400" />
                      +977-1-4567890
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:info@bhattaraibusinesshouse.com"
                      className="flex items-center gap-3 text-sm text-gray-400 transition-colors hover:text-primary-400"
                    >
                      <Mail className="h-4 w-4 shrink-0 text-primary-400" />
                      info@bhattaraibusinesshouse.com
                    </a>
                  </li>
                </ul>
              </div>

              {/* Working Hours */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                  Working Hours
                </h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex justify-between">
                    <span>Sun - Thu</span>
                    <span className="text-gray-300">9:00 AM - 6:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Friday</span>
                    <span className="text-gray-300">9:00 AM - 5:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Saturday</span>
                    <span className="text-red-400">Closed</span>
                  </li>
                </ul>
              </div>

              {/* Newsletter */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                  Newsletter
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  Subscribe for the latest updates and offers.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 pr-10 text-sm text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 focus:bg-white/10"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-md bg-primary-600 text-white transition-all duration-300 hover:bg-primary-500 hover:scale-110"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
                {isSubscribed && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-xs text-green-400"
                  >
                    Thanks for subscribing!
                  </motion.p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Bhattarai Business House. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </a>
            <span className="text-gray-700">|</span>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className={cn(
          'fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full',
          'bg-primary-600 text-white shadow-xl shadow-primary-600/30',
          'transition-all duration-300 hover:bg-primary-500 hover:scale-110 hover:shadow-2xl',
          'active:scale-95'
        )}
      >
        <ChevronUp className="h-5 w-5" />
      </button>
    </footer>
  );
}
