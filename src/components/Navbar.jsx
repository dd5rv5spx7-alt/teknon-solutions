import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon, GraduationCap } from 'lucide-react';
import Logo from './Logo.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { NAV_LINKS } from '../data/siteData.js';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHref, setActiveHref] = useState('#home');
  const { isDark, toggleTheme } = useTheme();
  const mobileMenuRef = useRef(null);
  const menuToggleRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the nav link for whichever section is currently centered in view.
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveHref('#' + entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Make the slide-out menu behave like the dialog it's marked as: removed
  // from the tab order while closed, focus trapped inside while open, and
  // closable/returns focus via Escape.
  useEffect(() => {
    const menu = mobileMenuRef.current;
    if (!menu) return;
    menu.inert = !mobileOpen;
    if (!mobileOpen) return;

    const focusable = menu.querySelectorAll('a, button, [href], [tabindex]:not([tabindex="-1"])');
    focusable[0]?.focus();

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        menuToggleRef.current?.focus();
        return;
      }
      if (e.key === 'Tab' && focusable.length > 0) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  // aria-modal="true" alone isn't reliably enough to keep a screen-reader's
  // virtual cursor out of content behind an open dialog — inert on every
  // sibling of the menu (main content, footer) is what actually enforces it,
  // on top of the existing Tab-trap above.
  useEffect(() => {
    const siblings = document.querySelectorAll('#site-root > main, #site-root > footer, #site-root > a');
    siblings.forEach((el) => {
      el.inert = mobileOpen;
    });
    return () => {
      siblings.forEach((el) => {
        el.inert = false;
      });
    };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-navy-deep/80 backdrop-blur-lg shadow-soft border-b border-navy/5 dark:border-white/5'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="container-px mx-auto max-w-8xl flex items-center justify-between h-20">
        <Logo variant={scrolled ? 'dark' : 'light'} />

        <div className="hidden lg:flex items-center gap-9">
          {NAV_LINKS.map((link) => {
            const isActive = activeHref === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'true' : undefined}
                className={`relative pb-1 text-sm font-medium transition-colors ${
                  isActive
                    ? scrolled
                      ? 'text-royal dark:text-accent'
                      : 'text-white'
                    : scrolled
                    ? 'text-navy/80 dark:text-white/75 hover:text-royal dark:hover:text-accent'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {link.label}
                <span
                  className={`absolute left-0 -bottom-0.5 h-[2px] bg-current rounded-full transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0'
                  }`}
                />
              </a>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`w-10 h-10 grid place-items-center rounded-full border transition-colors ${
              scrolled
                ? 'border-navy/10 dark:border-white/15 text-navy dark:text-white hover:border-royal/40 hover:text-royal dark:hover:text-accent'
                : 'border-white/25 text-white/80 hover:border-white/60 hover:text-white'
            }`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link
            to="/student/login"
            className={`hidden lg:inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${
              scrolled
                ? 'text-navy/70 dark:text-white/60 hover:text-royal dark:hover:text-accent'
                : 'text-white/75 hover:text-white'
            }`}
          >
            <GraduationCap size={15} /> Student Login
          </Link>
          <a
            href="#contact"
            className="btn-glow bg-grad-primary text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:brightness-110 transition-all"
          >
            Enroll Now
          </a>
        </div>

        <div className="flex lg:hidden items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`w-10 h-10 grid place-items-center rounded-full border transition-colors ${
              scrolled
                ? 'border-navy/10 dark:border-white/15 text-navy dark:text-white'
                : 'border-white/25 text-white'
            }`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            type="button"
            ref={menuToggleRef}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className={`w-10 h-10 grid place-items-center rounded-full border transition-colors ${
              scrolled
                ? 'border-navy/10 dark:border-white/15 text-navy dark:text-white'
                : 'border-white/25 text-white'
            }`}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        ref={mobileMenuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!mobileOpen}
        className={`lg:hidden fixed inset-x-0 top-20 bottom-0 bg-white dark:bg-navy-deep transition-transform duration-300 ease-out ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-1 p-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-lg font-medium text-navy dark:text-white py-3.5 border-b border-navy/5 dark:border-white/10"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/student/login"
            onClick={() => setMobileOpen(false)}
            className="inline-flex items-center gap-2 text-navy dark:text-white py-3.5 border-b border-navy/5 dark:border-white/10 text-lg font-medium"
          >
            <GraduationCap size={18} /> Student Login
          </Link>
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="mt-6 text-center bg-grad-primary text-white font-semibold px-6 py-3.5 rounded-xl"
          >
            Enroll Now
          </a>
        </div>
      </div>
    </header>
  );
}
