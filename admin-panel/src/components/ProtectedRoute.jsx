import { Navigate } from 'react-router-dom';
import { getAdminToken } from '../services/auth';

export default function ProtectedRoute({ children }) {
  const token = getAdminToken();
  if (!token) return <Navigate to="/" replace />;
  return children;
}
