import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BookAppointment from "./pages/BookAppointment";
import PsychologistDashboard from "./pages/PsychologistDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* SITE PUBLICO */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* AREA DO PACIENTE */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute allowedRole="PATIENT" />}>
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/dashboard/agendar"
              element={<BookAppointment />}
            />
          </Route>
        </Route>

        {/* AREA DA PSICOLOGA */}
        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <RoleRoute allowedRole="PSYCHOLOGIST" />
            }
          >
            <Route
              path="/psicologa"
              element={<PsychologistDashboard />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;