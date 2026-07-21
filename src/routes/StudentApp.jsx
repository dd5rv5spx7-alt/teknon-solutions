import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.jsx';
import ProtectedRoute from '../components/admin/ProtectedRoute.jsx';

// See the matching comment in src/routes/AdminApp.jsx — same reasoning,
// mirrored for the student portal.
const StudentLogin = lazy(() => import('../pages/StudentLogin.jsx'));
const StudentDashboard = lazy(() => import('../pages/StudentDashboard.jsx'));
const StudentLearn = lazy(() => import('../pages/StudentLearn.jsx'));

function RouteFallback() {
  return (
    <div className="min-h-screen grid place-items-center bg-navy text-white/50 text-sm font-mono">
      Loading…
    </div>
  );
}

// Mounted at "/student/*" — every path below is relative to that prefix.
export default function StudentApp() {
  return (
    <AuthProvider>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="login" element={<StudentLogin />} />
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="learn/:courseId"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentLearn />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}
