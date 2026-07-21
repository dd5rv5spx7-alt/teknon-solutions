import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.jsx';
import ProtectedRoute from '../components/admin/ProtectedRoute.jsx';

// AuthProvider (and everything it pulls in — the Supabase client, gotrue,
// postgrest, realtime) previously wrapped the ENTIRE app from App.jsx, so
// every anonymous marketing-site visitor downloaded and executed it, and
// fired an unnecessary getSession() call, purely to support a login state
// the public site never renders. This whole file is lazy-loaded (see
// App.jsx's `<Route path="/admin/*" element={<AdminApp />} />`), so
// AuthProvider only ever loads for someone actually visiting an /admin
// route. Individual admin pages stay lazy *within* this already-lazy file
// too, so navigating between e.g. Payments and People still only downloads
// the page actually visited, not all eight at once.
const AdminLayout = lazy(() => import('../components/admin/AdminLayout.jsx'));
const AdminLogin = lazy(() => import('../pages/AdminLogin.jsx'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard.jsx'));
const AdminPeople = lazy(() => import('../pages/AdminPeople.jsx'));
const AdminAnalytics = lazy(() => import('../pages/AdminAnalytics.jsx'));
const AdminCourses = lazy(() => import('../pages/AdminCourses.jsx'));
const AdminCourseContent = lazy(() => import('../pages/AdminCourseContent.jsx'));
const AdminCertificates = lazy(() => import('../pages/AdminCertificates.jsx'));
const AdminPayments = lazy(() => import('../pages/AdminPayments.jsx'));
const AdminCoupons = lazy(() => import('../pages/AdminCoupons.jsx'));
const AdminBatches = lazy(() => import('../pages/AdminBatches.jsx'));
const AdminAttendance = lazy(() => import('../pages/AdminAttendance.jsx'));
const AdminAssignments = lazy(() => import('../pages/AdminAssignments.jsx'));
const AdminBlog = lazy(() => import('../pages/AdminBlog.jsx'));

function RouteFallback() {
  return (
    <div className="min-h-screen grid place-items-center bg-navy text-white/50 text-sm font-mono">
      Loading…
    </div>
  );
}

// Mounted at "/admin/*" — every path below is relative to that prefix.
export default function AdminApp() {
  return (
    <AuthProvider>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="login" element={<AdminLogin />} />
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={['admin', 'faculty']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="people" element={<AdminPeople />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="course-content" element={<AdminCourseContent />} />
            <Route path="certificates" element={<AdminCertificates />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="batches" element={<AdminBatches />} />
            <Route path="attendance" element={<AdminAttendance />} />
            <Route path="assignments" element={<AdminAssignments />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="analytics" element={<AdminAnalytics />} />
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}
