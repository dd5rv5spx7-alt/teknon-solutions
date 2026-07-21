import React from 'react';
import { AuthProvider } from '../context/AuthContext.jsx';
import ResetPassword from '../pages/ResetPassword.jsx';

// Standalone (no sub-routes), but still needs AuthProvider — kept in its own
// lazy chunk for the same reason as AdminApp/StudentApp: keeps the Supabase
// client out of the public marketing bundle.
export default function ResetPasswordApp() {
  return (
    <AuthProvider>
      <ResetPassword />
    </AuthProvider>
  );
}
