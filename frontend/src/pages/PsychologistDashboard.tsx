import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/psychologist.css";

const API_URL = "http://localhost:3000/api";

type Appointment = {
  id: string;
  date: string;
  modality: "ONLINE" | "IN_PERSON";
  status: string;
  service: {
    name: string;
    price: string;
  };
  patient: {
    name: string;
  };
};

function PsychologistDashboard() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState<
    Appointment[]
  >([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(
    localStorage.getItem("psicode_user") || "{}",
  );

  useEffect(() => {
    async function loadAppointments() {
      const token = localStorage.getItem("psicode_token");

      try {
        const response = await fetch(
          `${API_URL}/appointments/psychologist`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setAppointments(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadAppointments();
  }, []);

  function logout() {
    localStorage.removeItem("psicode_token");
    localStorage.removeItem("psicode_user");

    navigate("/login");
  }

  const today = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date);
    const currentDate = new Date();

    return (
      appointmentDate.toDateString() ===
      currentDate.toDateString()
    );
  });

  const confirmed = appointments.filter(
    (appointment) =>
      appointment.status === "CONFIRMED",
  );

  const pending = appointments.filter(
    (appointment) =>
      appointment.status === "PENDING",
  );

  function formatTime(date: string) {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    }).format(new Date(date));
  }

  return (
    <main className="psychologist-page">
      <aside className="psychologist-sidebar">
        <div className="psychologist-brand">
          <div className="psychologist-brand-mark">
            ✦
          </div>

          <div>
            <strong>PSICODE</strong>
            <span>Sistema clínico</span>
          </div>
        </div>

        <nav className="psychologist-nav">
          <div className="psychologist-nav-group">
            <span>Principal</span>

            <button className="active">
              Dashboard
            </button>

            <button onClick={() => navigate("/psicologa/agenda")}>
              Agenda
            </button>

            <button onClick={() => navigate("/psicologa/pacientes")}>
              Pacientes
            </button>

            <button onClick={() => navigate("/psicologa/sessoes")}>
              Sessões
            </button>

            <button onClick={() => navigate("/psicologa/prontuarios")}>
              Prontuários
            </button>
          </div>

          <div className="psychologist-nav-group">
            <span>Financeiro</span>

            <button onClick={() => navigate("/psicologa/consultorio")}>
              Consultório
            </button>

            <button onClick={() => navigate("/psicologa/financeiro")}>
              Financeiro
            </button>
          </div>

          <div className="psychologist-nav-group">
            <span>Análise</span>

            <button onClick={() => navigate("/psicologa/relatorios")}>
              Relatórios
            </button>

            <button onClick={() => navigate("/psicologa/configuracoes")}>
              Configurações
            </button>
          </div>
        </nav>

        <div className="psychologist-sidebar-bottom">
          <div className="psychologist-user">
            <div className="psychologist-avatar">
              {user.name?.charAt(0) || "P"}
            </div>

            <div>
              <strong>{user.name || "Psicóloga"}</strong>
              <span>Psicóloga</span>
            </div>
          </div>

          <button
            className="psychologist-logout"
            onClick={logout}
          >
            Sair
          </button>
        </div>
      </aside>

      <section className="psychologist-content">
        <header className="psychologist-topbar">
          <div>
            <span>Visão geral</span>
            <h1>Dashboard</h1>
            <p>
              Acompanhe os principais dados do seu
              consultório.
            </p>
          </div>

          <button
            className="psychologist-primary-button"
            onClick={() =>
              navigate("/psicologa/agenda")
            }
          >
            + Novo atendimento
          </button>
        </header>

        <section className="psychologist-stats">
          <article>
            <span>Atendimentos hoje</span>
            <strong>{today.length}</strong>
            <small>
              {today.length === 1
                ? "1 sessão agendada"
                : `${today.length} sessões agendadas`}
            </small>
          </article>

          <article>
            <span>Consultas confirmadas</span>
            <strong>{confirmed.length}</strong>
            <small>Agendamentos confirmados</small>
          </article>

          <article>
            <span>Aguardando confirmação</span>
            <strong>{pending.length}</strong>
            <small>Precisam de atenção</small>
          </article>

          <article>
            <span>Pacientes</span>
            <strong>—</strong>
            <small>Em breve</small>
          </article>
        </section>

        <section className="psychologist-panel">
          <div className="psychologist-panel-header">
            <div>
              <span>Agenda</span>
              <h2>Próximos atendimentos</h2>
            </div>

            <button
              onClick={() =>
                navigate("/psicologa/agenda")
              }
            >
              Ver agenda completa
            </button>
          </div>

          {loading ? (
            <div className="psychologist-empty">
              Carregando atendimentos...
            </div>
          ) : appointments.length === 0 ? (
            <div className="psychologist-empty">
              <strong>Nenhum atendimento encontrado</strong>
              <p>
                Os próximos agendamentos aparecerão
                aqui.
              </p>
            </div>
          ) : (
            <div className="psychologist-table-wrapper">
              <table className="psychologist-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Paciente</th>
                    <th>Tipo</th>
                    <th>Serviço</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {appointments
                    .slice(0, 8)
                    .map((appointment) => (
                      <tr key={appointment.id}>
                        <td>
                          <strong>
                            {formatDate(
                              appointment.date,
                            )}
                          </strong>
                          <span>
                            {formatTime(
                              appointment.date,
                            )}
                          </span>
                        </td>

                        <td>
                          {appointment.patient.name}
                        </td>

                        <td>
                          <span className="psychologist-badge">
                            {appointment.modality ===
                            "ONLINE"
                              ? "Online"
                              : "Presencial"}
                          </span>
                        </td>

                        <td>
                          {appointment.service.name}
                        </td>

                        <td>
                          <span className="psychologist-status">
                            {appointment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default PsychologistDashboard;