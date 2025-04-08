
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute() {
  const { currentUser, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  return currentUser?.role === 'admin' ? <Outlet /> : <Navigate to="/user/dashboard" replace />;
}