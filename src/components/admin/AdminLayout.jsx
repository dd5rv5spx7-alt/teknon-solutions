import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LogOut, Inbox, Users, BarChart3, BookOpen, Award, Layers, Newspaper, CreditCard } from 'lucide-react';
import Logo from '../Logo.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const ADMIN_NAV = [
  { to: '/admin', label: 'Enquiries', icon: Inbox, end: true },
  { to: '/admin/people', label: 'People', icon: Users },
  { to: '/admin/courses', label: 'Courses', icon: BookOpen },
  { to: '/admin/course-content', label: 'Curriculum', icon: Layers },
  { to: '/admin/certificates', label: 'Certificates', icon: Award },
  { to: '/admin/payments', label: 'Payments', icon: CreditCard },
  { to: '/admin/blog', label: 'Blog', icon: Newspaper },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function AdminLayout() {
  const { session, role, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-mist dark:bg-navy-deep">
      <header className="bg-white dark:bg-navy border-b border-navy/8 dark:border-white/10">
        <div className="container-px mx-auto max-w-8xl h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo />
            <nav className="hidden sm:flex items-center gap-1">
              {ADMIN_NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-royal/10 dark:bg-accent/15 text-royal dark:text-accent'
                        : 'text-slatesoft dark:text-white/60 hover:text-navy dark:hover:text-white'
                    }`
                  }
                >
                  <item.icon size={15} /> {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-sm text-slatesoft dark:text-white/60">
              {session?.user?.email} <span className="font-mono text-xs">· {role}</span>
            </span>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 text-sm font-semibold text-navy dark:text-white hover:text-royal dark:hover:text-accent transition-colors"
            >
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </div>
        <nav className="sm:hidden flex items-center gap-1 px-4 pb-3">
          {ADMIN_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-royal/10 dark:bg-accent/15 text-royal dark:text-accent'
                    : 'text-slatesoft dark:text-white/60'
                }`
              }
            >
              <item.icon size={13} /> {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="container-px mx-auto max-w-8xl py-12">
        <Outlet />
      </main>
    </div>
  );
}
