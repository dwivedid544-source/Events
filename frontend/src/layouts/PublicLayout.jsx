import React, { useState, useEffect } from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ToastContainer } from '../components/common/ToastContainer';
import {
  UserPlus,
  LogIn,
  Menu,
  X,
  Compass,
  Shield,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  ShoppingBag
} from 'lucide-react';

export const PublicLayout = () => {
  const { cartCount, currentUser } = useApp();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const isLoginPage = location.pathname === '/login';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'EVENTS', path: '/find-hunt' },
    { label: 'STATES', path: '/states' },
    { label: 'LOCAL CLUBS', path: '/clubs' },
    { label: 'HOUND SPORTS', path: '/sports' },
    { label: 'NEWS', path: '/news' },
    { label: 'MARKETPLACE', path: '/marketplace' },
    { label: 'MEMBERSHIP', path: '/join' },
    { label: 'RESULTS', path: '/results' },
    { label: 'AUCTIONS', path: '/auctions' },
    { label: 'EDUCATION / TRAINING', path: '/education' },
    { label: 'ABOUT UHC', path: '/about' },
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans text-charcoal selection:bg-tan-500 selection:text-forest-950">
      {/* Main Navigation Bar - Hidden on /login */}
      {!isLoginPage && (
        <header
          className={`sticky top-0 z-50 transition-all duration-300 ${
            isScrolled
              ? 'bg-forest-950/95 backdrop-blur-md border-b border-forest-800 shadow-xl py-2'
              : 'bg-forest-950 border-b border-forest-900 py-3'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <img src="/logo.png" alt="Ultimate Hound Championships Logo" className="h-12 sm:h-14 w-auto object-contain transition-transform group-hover:scale-105" />
            </Link>

            {/* Desktop Navigation Menu (xl screens 1280px+) */}
            <nav className="hidden xl:flex items-center gap-1 flex-wrap justify-center">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `px-2 py-1 rounded-md text-[11px] font-extrabold tracking-tight transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-tan-500 text-forest-950 shadow-sm font-black'
                        : 'text-tan-100/90 hover:text-white hover:bg-forest-800/60'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Action CTAs for Desktop (xl screens 1280px+) */}
            <div className="hidden xl:flex items-center gap-3">
              <Link
                to="/cart"
                className="relative p-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-tan-300 hover:text-white border border-forest-700 transition-all flex items-center justify-center"
                title="Shopping Cart"
                aria-label="View Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 rounded-full bg-tan-500 text-forest-950 font-black text-[10px] flex items-center justify-center shadow-md border border-forest-950">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                to="/login"
                className="px-3.5 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-black text-xs shadow-sm transition-all flex items-center gap-1.5 border border-forest-700 hover:border-tan-500/60"
              >
                <LogIn className="w-3.5 h-3.5 text-tan-400" />
                <span>Login</span>
              </Link>
            </div>

            {/* Mobile & Tablet Actions & Toggle (< 1280px / xl:hidden) */}
            <div className="flex items-center gap-2 xl:hidden">
              <Link
                to="/cart"
                className="relative p-2 rounded-xl bg-forest-900 text-tan-300 border border-forest-700 flex items-center justify-center"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-4.5 h-4.5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-tan-500 text-forest-950 font-black text-[9px] flex items-center justify-center border border-forest-950">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="p-2 text-tan-200 hover:text-white rounded-xl bg-forest-900 border border-forest-800"
                aria-label="Toggle Navigation"
              >
                {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Responsive Mobile / Tablet Navigation Drawer */}
          {mobileNavOpen && (
            <div className="xl:hidden bg-forest-950/98 backdrop-blur-2xl border-b border-forest-800 px-4 py-6 space-y-4 shadow-2xl animate-fade-in">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileNavOpen(false)}
                    className={({ isActive }) =>
                      `block px-3.5 py-2.5 rounded-xl text-xs font-bold text-center transition-all ${
                        isActive
                          ? 'bg-tan-500 text-forest-950 font-black shadow-md'
                          : 'text-tan-100 hover:bg-forest-900 hover:text-white border border-forest-900'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>

              <div className="pt-4 border-t border-forest-800 grid grid-cols-1 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileNavOpen(false)}
                  className="w-full py-3 text-center rounded-xl bg-forest-900 border border-forest-700 text-white font-bold text-xs flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4 text-tan-400" />
                  <span>Member / Admin Login</span>
                </Link>
              </div>
            </div>
          )}
        </header>
      )}

      {/* Main Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer - Hidden on /login */}
      {!isLoginPage && (
        <footer className="bg-forest-950 text-white border-t border-forest-900 pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            {/* Top Multi-column Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-forest-900">
              {/* Brand Column */}
              <div className="lg:col-span-1 space-y-4">
                <div className="flex items-center gap-3">
                  <img src="/logo.png" alt="UHC Logo" className="h-14 w-auto object-contain" />
                </div>
                <p className="text-xs text-tan-100/70 leading-relaxed font-normal">
                  Providing the infrastructure that makes State Associations and Local Clubs stronger while preserving every organization's unique identity.
                </p>
                {/* Social Icons */}
                <div className="flex items-center gap-3 pt-2">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-lg bg-forest-900 border border-forest-800 text-tan-300 hover:text-white hover:bg-tan-500 hover:border-tan-500 hover:text-forest-950 flex items-center justify-center transition-all"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-lg bg-forest-900 border border-forest-800 text-tan-300 hover:text-white hover:bg-tan-500 hover:border-tan-500 hover:text-forest-950 flex items-center justify-center transition-all"
                    aria-label="Twitter / X"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-lg bg-forest-900 border border-forest-800 text-tan-300 hover:text-white hover:bg-tan-500 hover:border-tan-500 hover:text-forest-950 flex items-center justify-center transition-all"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-lg bg-forest-900 border border-forest-800 text-tan-300 hover:text-white hover:bg-tan-500 hover:border-tan-500 hover:text-forest-950 flex items-center justify-center transition-all"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Organization Column */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-tan-400">Organization</h4>
                <ul className="space-y-2 text-xs text-tan-100/80 font-medium">
                  <li><Link to="/about" className="hover:text-tan-300 transition-colors">About Us</Link></li>
                  <li><Link to="/mission" className="hover:text-tan-300 transition-colors">Our Mission</Link></li>
                  <li><Link to="/leadership" className="hover:text-tan-300 transition-colors">National Leadership</Link></li>
                  <li><Link to="/states" className="hover:text-tan-300 transition-colors">State Governance</Link></li>
                  <li><Link to="/sponsors" className="hover:text-tan-300 transition-colors">Sponsors & Partners</Link></li>
                </ul>
              </div>

              {/* Resources Column */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-tan-400">Resources</h4>
                <ul className="space-y-2 text-xs text-tan-100/80 font-medium">
                  <li><Link to="/find-hunt" className="hover:text-tan-300 transition-colors">Events Search</Link></li>
                  <li><Link to="/clubs" className="hover:text-tan-300 transition-colors">Find a Club</Link></li>
                  <li><Link to="/results" className="hover:text-tan-300 transition-colors">Official Results</Link></li>
                  <li><Link to="/news" className="hover:text-tan-300 transition-colors">Latest News</Link></li>
                  <li><Link to="/store" className="hover:text-tan-300 transition-colors">National Store</Link></li>
                </ul>
              </div>

              {/* Membership Column */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-tan-400">Membership</h4>
                <ul className="space-y-2 text-xs text-tan-100/80 font-medium">
                  <li><Link to="/join" className="hover:text-tan-300 transition-colors">Join Platform</Link></li>
                  <li><Link to="/join#benefits" className="hover:text-tan-300 transition-colors">Member Benefits</Link></li>
                  <li><Link to="/join#renew" className="hover:text-tan-300 transition-colors">Renew Charter</Link></li>
                  <li><Link to="/login" className="hover:text-tan-300 transition-colors">Member Dashboard</Link></li>
                  <li><Link to="/login" className="hover:text-tan-300 transition-colors">Club Admin Login</Link></li>
                </ul>
              </div>

              {/* Support Column */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-tan-400">Support & Legal</h4>
                <ul className="space-y-2 text-xs text-tan-100/80 font-medium">
                  <li><a href="#contact" className="hover:text-tan-300 transition-colors">Contact Headquarters</a></li>
                  <li><a href="#faq" className="hover:text-tan-300 transition-colors">FAQ & Rulebook</a></li>
                  <li><a href="#privacy" className="hover:text-tan-300 transition-colors">Privacy Policy</a></li>
                  <li><a href="#terms" className="hover:text-tan-300 transition-colors">Terms of Service</a></li>
                  <li><a href="#sanctions" className="hover:text-tan-300 transition-colors">Sanction Rules</a></li>
                </ul>
              </div>
            </div>

            {/* Bottom Copyright */}
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-tan-200/60 font-medium">
              <p>© 2026 National Hunting Platform. All Rights Reserved.</p>
              <div className="flex items-center gap-6">
                <span>Sanctioned by UKC & State Associations</span>
                <span>•</span>
                <span>Protected by National Hunting Network</span>
              </div>
            </div>
          </div>
        </footer>
      )}

      <ToastContainer />
    </div>
  );
};

