import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function RoleRoute({ children, role }) {
  const { hasRole } = useAuth();

  if (!hasRole(role)) {
    return <Navigate to="/my-tickets" replace />;
  }

  return children;
}
