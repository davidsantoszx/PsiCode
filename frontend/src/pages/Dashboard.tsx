import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const API_URL = "http://localhost:5000/api";

type Appointment = {
  id: string;
  date: string;
  modality: "ONLINE" | "IN_PERSON";
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  service: {
    name: string;
    duration: number;
    price: string;
  };
  payment: {
    status: "PENDING" | "PAID" | "CANCELLED";
  } | null;
};

function Dashboard() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("psicode_user") || "{}");

  useEffect(() => {
    async function loadAppointments() {
      const token = localStorage.getItem("psicode_token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/appointments/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("psicode_token");
            localStorage.removeItem("psicode_user");
            navigate("/login");
            return;
          }

          throw new Error("Erro ao buscar consultas");
        }

        const data = await response.json();

        setAppointments(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadAppointments();
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("psicode_token");
    localStorage.removeItem("psicode_user");

    navigate("/login");
  }

  const nextAppointment = appointments.find(
    (appointment) =>
      appointment.status === "PENDING" || appointment.status === "CONFIRMED",
  );

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  }

  function formatTime(date: string) {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }

  function formatModality(modality: Appointment["modality"]) {
    return modality === "ONLINE"
      ? "Atendimento online"
      : "Atendimento presencial";
  }

  function formatStatus(status: Appointment["status"]) {
    const labels = {
      PENDING: "Aguardando confirmação",
      CONFIRMED: "Confirmada",
      COMPLETED: "Concluída",
      CANCELLED: "Cancelada",
    };

    return labels[status];
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <div className="dashboard-logo">✦</div>

          <div>
            <span>PSICODE</span>
            <small>Cuidado & acolhimento</small>
          </div>
        </div>

        <button
          type="button"
          className="dashboard-logout"
          onClick={handleLogout}
        >
          Sair
        </button>
      </header>

      <section className="dashboard-main">
        <div className="dashboard-intro">
          <span className="dashboard-eyebrow">Seu espaço</span>

          <h1>Olá, {user.name || "Paciente"}.</h1>

          <p>
            Acompanhe seus atendimentos e cuide do seu bem-estar com
            tranquilidade.
          </p>
        </div>

        <section className="dashboard-next">
          <div className="dashboard-section-title">
            <div>
              <span>Próximo atendimento</span>
              <h2>Minha consulta</h2>
            </div>

            <button
              type="button"
              onClick={() => navigate("/dashboard/agendar")}
            >
              Agendar consulta
            </button>
          </div>

          {loading ? (
            <div className="dashboard-empty">Carregando suas consultas...</div>
          ) : nextAppointment ? (
            <div className="dashboard-appointment">
              <div className="appointment-date">
                <span>{formatDate(nextAppointment.date)}</span>

                <strong>{formatTime(nextAppointment.date)}</strong>
              </div>

              <div className="appointment-info">
                <strong>{nextAppointment.service.name}</strong>

                <span>{formatModality(nextAppointment.modality)}</span>

                <small>{formatStatus(nextAppointment.status)}</small>
              </div>
            </div>
          ) : (
            <div className="dashboard-empty">
              <strong>Nenhuma consulta agendada</strong>

              <p>
                Quando você tiver um atendimento agendado, ele aparecerá aqui.
              </p>

              <button
                type="button"
                onClick={() => navigate("/dashboard/agendar")}
              >
                Agendar minha primeira consulta
              </button>
            </div>
          )}
        </section>

        <section className="dashboard-cards">
          <article className="dashboard-card">
            <span>Consultas</span>

            <strong>{appointments.length}</strong>

            <p>
              {appointments.length === 1
                ? "atendimento registrado"
                : "atendimentos registrados"}
            </p>
          </article>

          <article className="dashboard-card">
            <span>Histórico</span>

            <strong>
              {
                appointments.filter(
                  (appointment) => appointment.status === "COMPLETED",
                ).length
              }
            </strong>

            <p>atendimentos concluídos</p>
          </article>

          <article className="dashboard-card">
            <span>Perfil</span>

            <strong>Dados</strong>

            <p>Seus dados pessoais</p>

            <button type="button">Ver meu perfil</button>
          </article>
        </section>
      </section>
    </main>
  );
}

export default Dashboard;
