import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LogOut, Inbox, Users, BarChart3, BookOpen, Award, Layers, Newspaper,
  CreditCard, Tag, CalendarDays, ClipboardCheck, FileCheck2, LayoutTemplate,
  Menu, X, Sun, Moon, ExternalLink, ShieldCheck, ChevronRight
} from 'lucide-react';
import Logo from '../Logo.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { isSupabaseConfigured } from '../../lib/supabaseClient.js';

const NAV_GROUPS = [
  {
    group: 'Overview',
    items: [
      { to: '/admin', label: 'Enquiries', icon: Inbox, end: true, badge: 'New' },
      { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    group: 'Academics & LMS',
    items: [
      { to: '/admin/courses', label: 'Courses', icon: BookOpen },
      { to: '/admin/course-content', label: 'Curriculum', icon: Layers },
      { to: '/admin/batches', label: 'Batches', icon: CalendarDays },
      { to: '/admin/attendance', label: 'Attendance', icon: ClipboardCheck },
      { to: '/admin/assignments', label: 'Assignments', icon: FileCheck2 },
      { to: '/admin/certificates', label: 'Certificates', icon: Award },
    ],
  },
  {
    group: 'Operations & Billing',
    items: [
      { to: '/admin/people', label: 'People', icon: Users },
      { to: '/admin/payments', label: 'Payments', icon: CreditCard },
      { to: '/admin/coupons', label: 'Coupons', icon: Tag },
    ],
  },
  {
    group: 'CMS & Content',
    items: [
      { to: '/admin/blog', label: 'Blog Articles', icon: Newspaper },
      { to: '/admin/content', label: 'Site Content', icon: LayoutTemplate },
    ],
  },
];

export default function AdminLayout() {
  const { session, role, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Find active label for breadcrumb
  let activeLabel = 'Dashboard';
  for (const group of NAV_GROUPS) {
    for (const item of group.items) {
      if (item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)) {
        activeLabel = item.label;
      }
    }
  }

  const isMukesh =
    session?.user?.email?.toLowerCase().includes('mukesh') ||
    session?.user?.user_metadata?.full_name?.toLowerCase() === 'mukesh';
  const adminDisplayName = isMukesh ? 'Mukesh' : session?.user?.user_metadata?.full_name || 'Admin User';
  const adminEmail = session?.user?.email || (isMukesh ? 'mukesh@ateknonsolutions.com' : 'admin@ateknonsolutions.com');
  const roleLabel = role === 'admin' ? 'Super Admin' : role || 'Faculty';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-800 dark:text-slate-200 flex flex-col lg:flex-row transition-colors duration-200">
      {/* Mobile Top Navbar */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/95 dark:bg-[#0d1424]/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Logo />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            title="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={signOut}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            title="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Sidebar Overlay (Mobile) */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Modern Desktop & Tablet Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-white dark:bg-[#0d1424] border-r border-slate-200 dark:border-white/10 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
          <div className="space-y-1">
            <Logo />
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-royal/10 dark:bg-accent/15 text-royal dark:text-accent">
                Admin Console
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isSupabaseConfigured ? 'bg-emerald-500' : 'bg-cyan-400'
                }`}
                title={isSupabaseConfigured ? 'Supabase Connected' : 'Preview Mode'}
              />
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Categories */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.group} className="space-y-1.5">
              <p className="px-3 text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
                {group.group}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-royal text-white shadow-sm dark:bg-accent dark:text-navy'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={16} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer: Profile, Mode & Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-white/10 space-y-3 bg-slate-50/50 dark:bg-white/[0.01]">
          {/* Admin User Card */}
          <div className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-royal to-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {(isMukesh ? 'M' : adminEmail.charAt(0)).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{adminDisplayName}</p>
                <p className="text-[10px] font-mono text-royal dark:text-accent font-semibold">{roleLabel}</p>
              </div>
            </div>

            <button
              onClick={signOut}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors shrink-0"
              title="Sign out"
            >
              <LogOut size={15} />
            </button>
          </div>

          {/* Quick utility controls */}
          <div className="flex items-center justify-between text-xs px-1">
            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors"
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
              <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
            </button>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-royal dark:text-accent hover:underline font-medium"
            >
              <span>Live Site</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Top Workspace Bar */}
        <header className="hidden lg:flex sticky top-0 z-30 bg-white/80 dark:bg-[#070b14]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10 h-16 items-center justify-between px-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>ATS Console</span>
            <ChevronRight size={14} />
            <span className="text-slate-900 dark:text-white font-bold">{activeLabel}</span>
          </div>

          <div className="flex items-center gap-4">
            {/* System Status Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <span
                className={`w-2 h-2 rounded-full ${
                  isSupabaseConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-cyan-400'
                }`}
              />
              <span className="text-slate-600 dark:text-slate-300">
                {isSupabaseConfigured ? 'Supabase Live' : 'Interactive Preview'}
              </span>
            </div>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              <ExternalLink size={13} /> View Website
            </a>
          </div>
        </header>

        {/* Nested Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
