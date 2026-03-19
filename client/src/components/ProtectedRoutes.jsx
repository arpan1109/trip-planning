// ProtectedRoutes.jsx
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isCheckingAuth, isVerified } = useAuth();

  // 1. If still checking, show nothing (or your loading screen)
  if (isCheckingAuth) return null; 

  // 2. If not logged in, send to login
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // 3. If logged in but NOT verified, send to verification
  if (!isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // 4. Otherwise, allow access
  return children;
};

export default ProtectedRoute