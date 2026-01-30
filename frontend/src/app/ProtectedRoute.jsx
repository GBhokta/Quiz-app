import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function ProtectedRoute({ children, requireRole }) {
  const { user, loading } = useAuth();

  // Wait until auth state is resolved
  if (loading) return null;

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role mismatch (if role is required)
  if (requireRole && user.role !== requireRole) {
    return <Navigate to="/" replace />;
  }

  // Authorized
  return children;
}
