import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

export function ProtectedRoute({ children }) {
  const { user, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return (
      <div className="screen-loader">
        <div className="loader-orb" />
        <p>Loading your session…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

export function AuthRoute({ children }) {
  const { user, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return (
      <div className="screen-loader">
        <div className="loader-orb" />
        <p>Loading your session…</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to={user.role === "ADMIN" ? "/admin" : "/home"} replace />;
  }

  return children;
}

export function RoleRoute({ children, role }) {
  const { user } = useAuth();

  if (!user || user.role !== role) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
