import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role, status, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div
        role="status"
        className="min-h-screen grid place-items-center bg-navy text-white/50 text-sm font-mono"
      >
        Checking session…
      </div>
    );
  }

  if (!isAuthenticated) {
    const loginPath = allowedRoles?.length === 1 && allowedRoles[0] === 'student' ? '/student/login' : '/admin/login';
    return <Navigate to={loginPath} replace />;
  }

  const isDeactivated = allowedRoles?.includes(role) && status !== 'active';
  const isWrongRole = allowedRoles && !allowedRoles.includes(role);

  if (isDeactivated || isWrongRole) {
    const homePath = role === 'admin' || role === 'faculty' ? '/admin' : role === 'student' ? '/student' : null;
    return (
      <div className="min-h-screen grid place-items-center bg-navy text-white text-center px-6">
        <div>
          <h1 className="font-display font-bold text-xl">Not authorized</h1>
          <p className="mt-2 text-white/55 text-sm">
            {isDeactivated
              ? 'Your account has been deactivated. Contact an admin if you believe this is a mistake.'
              : `Your account doesn't have access to this area (role: ${role ?? 'unknown'}).`}
          </p>
          <div className="mt-6 flex items-center justify-center gap-5 text-sm">
            {homePath && !isDeactivated && (
              <Link to={homePath} className="font-semibold text-accent hover:underline">
                Go to your portal
              </Link>
            )}
            <button type="button" onClick={signOut} className="text-white/60 hover:text-white transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
