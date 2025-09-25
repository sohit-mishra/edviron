import React from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthProvider";

interface PrivateRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

export default function PrivateRoute({ children, roles }: PrivateRouteProps) {
  const { user, authentication } = React.useContext(AuthContext);

  if (!authentication) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0 && user?.role && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
