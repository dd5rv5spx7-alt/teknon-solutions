import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/admin/ProtectedRoute.jsx';
import MarketingSite from './pages/MarketingSite.jsx';

const VerifyCertificate = lazy(() => import('./pages/VerifyCertificate.jsx'));
const BlogList = lazy(() => import('./pages/BlogList.jsx'));
const BlogPost = lazy(() => import('./pages/BlogPost.jsx'));

// Everything below is only ever needed behind a login (or on the login page
// itself) — lazy-loading it keeps recharts, and the whole admin/student
// bundle, out of the page every ordinary visitor downloads.
const AdminLayout = lazy(() => import('./components/admin/AdminLayout.jsx'));
const AdminLogin = lazy(() => import('./pages/AdminLogin.jsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));
const AdminPeople = lazy(() => import('./pages/AdminPeople.jsx'));
const AdminAnalytics = lazy(() => import('./pages/AdminAnalytics.jsx'));
const AdminCourses = lazy(() => import('./pages/AdminCourses.jsx'));
const AdminCourseContent = lazy(() => import('./pages/AdminCourseContent.jsx'));
const AdminCertificates = lazy(() => import('./pages/AdminCertificates.jsx'));
const AdminPayments = lazy(() => import('./pages/AdminPayments.jsx'));
const AdminBlog = lazy(() => import('./pages/AdminBlog.jsx'));
const StudentLogin = lazy(() => import('./pages/StudentLogin.jsx'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard.jsx'));
const StudentLearn = lazy(() => import('./pages/StudentLearn.jsx'));
const ResetPassword = lazy(() => import('./pages/ResetPassword.jsx'));

function RouteFallback() {
  return (
    <div className="min-h-screen grid place-items-center bg-navy text-white/50 text-sm font-mono">
      Loading…
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<MarketingSite />} />
                <Route path="/verify-certificate" element={<VerifyCertificate />} />
                <Route path="/blog" element={<BlogList />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route
                  path="/admin"
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
                  <Route path="blog" element={<AdminBlog />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                </Route>
                <Route path="/student/login" element={<StudentLogin />} />
                <Route
                  path="/student"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/learn/:courseId"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <StudentLearn />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
