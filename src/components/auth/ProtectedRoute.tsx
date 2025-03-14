import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireIntegration?: boolean;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireIntegration = true,
  requireAdmin = false,
}) => {
  const { isAuthenticated, user } = useAuth();
  const whatsappConfigured =
    localStorage.getItem("whatsappConfigured") === "true";
  const instagramConfigured =
    localStorage.getItem("instagramConfigured") === "true";

  // At least one integration is configured
  const hasIntegration = whatsappConfigured || instagramConfigured;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireIntegration && !hasIntegration) {
    return <Navigate to="/integrations" replace />;
  }

  if (requireAdmin && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
