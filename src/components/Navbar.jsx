import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, GraduationCap, ChevronDown, Sparkles, Code2, Globe, Shield, Palette, Briefcase } from 'lucide-react';
import Logo from './Logo.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const EDUCATION_ITEMS = [
  { href: '/#programs', label: 'Programs', desc: 'Industry internships & career tracks', icon: GraduationCap },
  { href: '/#courses', label: 'Courses', desc: 'Hands-on tech curriculums & training', icon: Code2 },
  { href: '/#technologies', label: 'Technologies', desc: 'Modern stacks, frameworks & tools', icon: Sparkles },
  { href: '/#pricing', label: 'Internships', desc: 'Practical summer & winter internships', icon: Briefcase },
];

const DIGITAL_SOLUTIONS_ITEMS = [
  { to: '/digital-marketing', label: 'Digital Marketing', desc: 'Social, content & growth strategy', icon: Globe },
  { to: '/digital-marketing#dm-webdev', label: 'Web Development', desc: 'High-speed modern websites & apps', icon: Code2 },
  { to: '/it-solutions', label: 'IT Solutions', desc: 'Custom software & cybersecurity', icon: Shield },
  { to: '/digital-marketing#dm-services', label: 'Branding', desc: 'Visual identity & design systems', icon: Palette },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // 'education' | 'digital' | null
  const [mobileSectionOpen, setMobileSectionOpen] = useState(null); // 'education' | 'digital' | null
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const menuToggleRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdowns on outside click or escape
  useEffect(() => {
    function handleClickOutside(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Trap focus in mobile menu when open
  useEffect(() => {
    const menu = mobileMenuRef.current;
    if (!menu) return;
    menu.inert = !mobileOpen;
    if (!mobileOpen) return;

    const focusable = menu.querySelectorAll('a, button, [href], [tabindex]:not([tabindex="-1"])');
    focusable[0]?.focus();
  }, [mobileOpen]);

  return (
    <header
      ref={navRef}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-navy-deep/90 backdrop-blur-md shadow-soft border-b border-navy/5 dark:border-white/5'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="container-px mx-auto max-w-8xl flex items-center justify-between h-20">
        <div className="flex items-center gap-10">
          <Logo variant={scrolled ? (isDark ? 'light' : 'dark') : 'light'} />

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-7">
            <a
              href="/#about"
              className={`text-sm font-medium transition-colors ${
                scrolled
                  ? 'text-navy/80 dark:text-white/80 hover:text-royal dark:hover:text-accent'
                  : 'text-white/85 hover:text-white'
              }`}
            >
              About
            </a>

            {/* Education Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('education')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'education' ? null : 'education')}
                aria-expanded={openDropdown === 'education'}
                className={`inline-flex items-center gap-1 text-sm font-medium py-2 transition-colors ${
                  scrolled
                    ? 'text-navy/80 dark:text-white/80 hover:text-royal dark:hover:text-accent'
                    : 'text-white/85 hover:text-white'
                }`}
              >
                Education
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${openDropdown === 'education' ? 'rotate-180 text-royal dark:text-accent' : ''}`}
                />
              </button>

              {openDropdown === 'education' && (
                <div className="absolute top-full left-0 pt-2 w-72 z-50 animate-fadeIn">
                  <div className="rounded-2xl bg-white dark:bg-navy-deep p-3 shadow-card-lg border border-navy/10 dark:border-white/10 backdrop-blur-xl">
                    <p className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-royal dark:text-accent font-bold">
                      Training &amp; Careers
                    </p>
                    {EDUCATION_ITEMS.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpenDropdown(null)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-mist dark:hover:bg-white/5 transition-colors group"
                      >
                        <item.icon className="w-5 h-5 mt-0.5 text-royal dark:text-accent group-hover:scale-110 transition-transform" />
                        <div>
                          <p className="text-sm font-semibold text-navy dark:text-white group-hover:text-royal dark:group-hover:text-accent transition-colors">
                            {item.label}
                          </p>
                          <p className="text-xs text-slatesoft dark:text-white/50">{item.desc}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Digital Solutions Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('digital')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'digital' ? null : 'digital')}
                aria-expanded={openDropdown === 'digital'}
                className={`inline-flex items-center gap-1 text-sm font-medium py-2 transition-colors ${
                  scrolled
                    ? 'text-navy/80 dark:text-white/80 hover:text-royal dark:hover:text-accent'
                    : 'text-white/85 hover:text-white'
                }`}
              >
                Digital Solutions
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${openDropdown === 'digital' ? 'rotate-180 text-royal dark:text-accent' : ''}`}
                />
              </button>

              {openDropdown === 'digital' && (
                <div className="absolute top-full left-0 pt-2 w-72 z-50 animate-fadeIn">
                  <div className="rounded-2xl bg-white dark:bg-navy-deep p-3 shadow-card-lg border border-navy/10 dark:border-white/10 backdrop-blur-xl">
                    <p className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-royal dark:text-accent font-bold">
                      Enterprise Services
                    </p>
                    {DIGITAL_SOLUTIONS_ITEMS.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setOpenDropdown(null)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-mist dark:hover:bg-white/5 transition-colors group"
                      >
                        <item.icon className="w-5 h-5 mt-0.5 text-royal dark:text-accent group-hover:scale-110 transition-transform" />
                        <div>
                          <p className="text-sm font-semibold text-navy dark:text-white group-hover:text-royal dark:group-hover:text-accent transition-colors">
                            {item.label}
                          </p>
                          <p className="text-xs text-slatesoft dark:text-white/50">{item.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <a
              href="/#pricing"
              className={`text-sm font-medium transition-colors ${
                scrolled
                  ? 'text-navy/80 dark:text-white/80 hover:text-royal dark:hover:text-accent'
                  : 'text-white/85 hover:text-white'
              }`}
            >
              Packages
            </a>

            <a
              href="/#contact"
              className={`text-sm font-medium transition-colors ${
                scrolled
                  ? 'text-navy/80 dark:text-white/80 hover:text-royal dark:hover:text-accent'
                  : 'text-white/85 hover:text-white'
              }`}
            >
              Contact
            </a>
          </div>
        </div>

        {/* Right Action Icons & Buttons */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`w-10 h-10 rounded-xl grid place-items-center transition-colors ${
              scrolled
                ? 'text-navy/70 dark:text-white/70 hover:bg-mist dark:hover:bg-white/5'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link
            to="/student/login"
            className={`hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-colors ${
              scrolled
                ? 'text-navy dark:text-white hover:bg-mist dark:hover:bg-white/5 border border-navy/10 dark:border-white/10'
                : 'text-white bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/15'
            }`}
          >
            <GraduationCap size={15} /> Student Login
          </Link>

          <a
            href="/#contact"
            className="hidden sm:inline-flex items-center gap-2 bg-grad-primary text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-card hover:brightness-110 active:scale-[0.98] transition-all"
          >
            Enroll Now
          </a>

          {/* Mobile hamburger */}
          <button
            ref={menuToggleRef}
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className={`lg:hidden w-10 h-10 rounded-xl grid place-items-center transition-colors ${
              scrolled
                ? 'text-navy dark:text-white hover:bg-mist dark:hover:bg-white/5'
                : 'text-white hover:bg-white/10'
            }`}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div
        ref={mobileMenuRef}
        className={`lg:hidden fixed inset-x-0 top-20 bottom-0 bg-white dark:bg-navy-deep border-t border-navy/10 dark:border-white/10 overflow-y-auto transition-all duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col p-6 space-y-3 pb-24">
          <a
            href="/#about"
            onClick={() => setMobileOpen(false)}
            className="text-base font-semibold text-navy dark:text-white py-3 border-b border-navy/5 dark:border-white/10"
          >
            About
          </a>

          {/* Mobile Education Section */}
          <div className="border-b border-navy/5 dark:border-white/10 pb-2">
            <button
              type="button"
              onClick={() => setMobileSectionOpen(mobileSectionOpen === 'education' ? null : 'education')}
              className="w-full flex items-center justify-between py-3 text-base font-semibold text-navy dark:text-white"
            >
              <span>Education</span>
              <ChevronDown size={16} className={`transition-transform duration-200 ${mobileSectionOpen === 'education' ? 'rotate-180' : ''}`} />
            </button>
            {mobileSectionOpen === 'education' && (
              <div className="pl-4 pb-2 space-y-1">
                {EDUCATION_ITEMS.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 text-sm font-medium text-slatesoft dark:text-white/70 hover:text-royal dark:hover:text-accent"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Digital Solutions Section */}
          <div className="border-b border-navy/5 dark:border-white/10 pb-2">
            <button
              type="button"
              onClick={() => setMobileSectionOpen(mobileSectionOpen === 'digital' ? null : 'digital')}
              className="w-full flex items-center justify-between py-3 text-base font-semibold text-navy dark:text-white"
            >
              <span>Digital Solutions</span>
              <ChevronDown size={16} className={`transition-transform duration-200 ${mobileSectionOpen === 'digital' ? 'rotate-180' : ''}`} />
            </button>
            {mobileSectionOpen === 'digital' && (
              <div className="pl-4 pb-2 space-y-1">
                {DIGITAL_SOLUTIONS_ITEMS.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 text-sm font-medium text-slatesoft dark:text-white/70 hover:text-royal dark:hover:text-accent"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <a
            href="/#pricing"
            onClick={() => setMobileOpen(false)}
            className="text-base font-semibold text-navy dark:text-white py-3 border-b border-navy/5 dark:border-white/10"
          >
            Packages
          </a>

          <a
            href="/#contact"
            onClick={() => setMobileOpen(false)}
            className="text-base font-semibold text-navy dark:text-white py-3 border-b border-navy/5 dark:border-white/10"
          >
            Contact
          </a>

          <Link
            to="/student/login"
            onClick={() => setMobileOpen(false)}
            className="inline-flex items-center gap-2 text-base font-semibold text-navy dark:text-white py-3 border-b border-navy/5 dark:border-white/10"
          >
            <GraduationCap size={18} /> Student Login
          </Link>

          <div className="pt-4">
            <a
              href="/#contact"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center bg-grad-primary text-white font-semibold px-6 py-3.5 rounded-xl shadow-card"
            >
              Enroll Now
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
