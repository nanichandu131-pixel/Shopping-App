import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ roles }) {
  const { user, accessToken, status } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!accessToken) return <Navigate to="/login" replace state={{ from: location }} />;
  if (!user && ['idle', 'loading'].includes(status)) return <main className="mx-auto max-w-7xl px-4 py-10 text-sm">Loading your session...</main>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (roles?.length && user && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
