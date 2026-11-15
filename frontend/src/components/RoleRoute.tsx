import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

type Role = "PATIENT" | "PSYCHOLOGIST";

type RoleRouteProps = {
  allowedRole: Role;
};

function RoleRoute({ allowedRole }: RoleRouteProps) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function validateRole() {
      const token = localStorage.getItem("psicode_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          localStorage.removeItem("psicode_token");
          localStorage.removeItem("psicode_user");
          setLoading(false);
          return;
        }

        const user = await response.json();

        localStorage.setItem(
          "psicode_user",
          JSON.stringify(user),
        );

        setAuthorized(user.role === allowedRole);
      } catch {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    }

    validateRole();
  }, [allowedRole]);

  if (loading) {
    return (
      <main className="dashboard-loading">
        Carregando...
      </main>
    );
  }

  if (!localStorage.getItem("psicode_token")) {
    return <Navigate to="/login" replace />;
  }

  if (!authorized) {
    const user = JSON.parse(
      localStorage.getItem("psicode_user") || "{}",
    );

    if (user.role === "PSYCHOLOGIST") {
      return <Navigate to="/psicologa" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default RoleRoute;