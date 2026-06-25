import { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Automotive', path: '/automotive' },
  { label: 'Products & Brands', path: '/products' },
  { label: 'News', path: '/news' },
  { label: 'About', path: '/about' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' },
];

const TOP_BAR_LINKS = [
  { icon: Phone, label: '+977-1-4567890', href: 'tel:+97714567890' },
  { icon: Mail, label: 'info@bhattaraibusinesshouse.com', href: 'mailto:info@bhattaraibusinesshouse.com' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100 transition-shadow duration-300',
          isScrolled && 'shadow-md'
        )}
      >
        {/* Top Bar */}
        <div className="hidden lg:block border-b border-gray-100 bg-primary-900 text-white">
          <div className="mx-auto max-w-7xl px-6 py-2 flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              {TOP_BAR_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-1.5 hover:text-accent-400 transition-colors"
                >
                  <link.icon className="h-3.5 w-3.5" />
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span>Sun-Fri: 9:00 AM - 6:00 PM</span>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-18 lg:h-20 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white font-serif text-lg font-bold shadow-md shadow-primary-600/30">
                  BBH
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold leading-tight tracking-tight text-primary-900">
                  Bhattarai Business House
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-gray-400">
                  Premium Enterprise
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    cn(
                      'relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg',
                      isActive
                        ? 'text-primary-600'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="relative z-10">{link.label}</span>
                      {isActive && (
                        <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary-600" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <Link
                to="/test-drive"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-600/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary-600/30"
              >
                Book Test Drive
              </Link>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden inline-flex items-center justify-center rounded-lg p-2 text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-200',
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] bg-white shadow-2xl lg:hidden transition-transform duration-300 ease-in-out',
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white font-serif text-sm font-bold">
                BBH
              </div>
              <span className="font-serif text-sm font-bold text-primary-900">
                Menu
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Nav Links */}
          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <ul className="space-y-1">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    end={link.path === '/'}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-primary-50 text-primary-600 border border-primary-100'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )
                    }
                  >
                    {link.label}
                    {link.path === '/automotive' && (
                      <ChevronDown className="ml-auto h-4 w-4 rotate-[-90deg]" />
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Drawer Footer */}
          <div className="border-t border-gray-100 px-6 py-5">
            <Link
              to="/test-drive"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:shadow-xl"
            >
              Book Test Drive
            </Link>
            <div className="mt-4 space-y-2 text-xs text-gray-400">
              <a
                href="tel:+97714567890"
                className="flex items-center gap-2 hover:text-primary-600 transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                +977-1-4567890
              </a>
              <a
                href="mailto:info@bhattaraibusinesshouse.com"
                className="flex items-center gap-2 hover:text-primary-600 transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                info@bhattaraibusinesshouse.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
