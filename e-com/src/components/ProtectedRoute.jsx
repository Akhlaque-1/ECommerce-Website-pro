import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useSelector((s) => s.auth);

  if (loading) {
    return <LoadingSpinner text="Verifying authentication..." />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;