import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

// Wrap private pages. Visitors who are not logged in are sent to /login.
export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  if (loading) return <LoadingSpinner fullScreen label="Checking your session…" />;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}

// Login/Register pages: logged-in users go straight to the dashboard.
export function GuestOnly() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
