import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

function ProtectedRoute() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function validateSession() {
      const token = localStorage.getItem("psicode_token");

      if (!token) {
        setAuthenticated(false);
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

          setAuthenticated(false);
          return;
        }

        const user = await response.json();

        localStorage.setItem(
          "psicode_user",
          JSON.stringify(user),
        );

        setAuthenticated(true);
      } catch {
        localStorage.removeItem("psicode_token");
        localStorage.removeItem("psicode_user");

        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }

    validateSession();
  }, []);

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8f9f6",
          color: "#6d7f76",
        }}
      >
        Carregando...
      </main>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;