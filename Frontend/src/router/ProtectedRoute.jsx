import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";

function ProtectedRoute({ allowedRoles }) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user = useAuthStore((state) => state.user);

  const location = useLocation(); // Get the current location

  console.log(isLoggedIn);
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. If logged in, check for role permission IF allowedRoles are specified
  if (allowedRoles && allowedRoles.length > 0) {
    if (!user?.role || !allowedRoles.includes(user.role)) {
      console.warn(
        `User with role '${
          user?.role
        }' tried to access a route restricted to roles: ${allowedRoles.join(
          ", "
        )}`
      );
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
}

export default ProtectedRoute;
