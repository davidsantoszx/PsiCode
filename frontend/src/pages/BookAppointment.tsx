import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/booking.css";

const API_URL = "http://localhost:5000/api";

type Service = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  duration: number;
};

function BookAppointment() {
  const navigate = useNavigate();

  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [modality, setModality] = useState<
    "ONLINE" | "IN_PERSON" 
    
  >("ONLINE");

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadServices() {
      try {
        const response = await fetch(
          `${API_URL}/services`,
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Erro ao buscar servicos",
          );
        }

        setServices(data);
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Erro ao carregar servicos",
        );
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setMessage("");
    setBooking(true);

    const token =
      localStorage.getItem("psicode_token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const appointmentDate = `${date}T${time}:00`;

      const response = await fetch(
        `${API_URL}/appointments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            serviceId,
            date: appointmentDate,
            modality,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Erro ao agendar consulta",
        );
      }

      navigate("/dashboard");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Erro ao agendar consulta",
      );
    } finally {
      setBooking(false);
    }
  }

  const selectedService = services.find(
    (service) => service.id === serviceId,
  );

  return (
    <main className="booking-page">
      <div className="booking-container">
        <button
          className="booking-back"
          onClick={() => navigate("/dashboard")}
        >
          ← Voltar
        </button>

        <div className="booking-header">
          <span>Agendamento</span>

          <h1>
            Cuide de você
            <br />
            com calma.
          </h1>

          <p>
            Escolha o atendimento que melhor se
            encaixa na sua rotina.
          </p>
        </div>

        <form
          className="booking-form"
          onSubmit={handleSubmit}
        >
          <section className="booking-section">
            <span>01</span>

            <div>
              <h2>Escolha o atendimento</h2>

              {loading ? (
                <p>Carregando serviços...</p>
              ) : (
                <div className="booking-services">
                  {services.map((service) => (
                    <button
                      type="button"
                      key={service.id}
                      className={
                        serviceId === service.id
                          ? "selected"
                          : ""
                      }
                      onClick={() =>
                        setServiceId(service.id)
                      }
                    >
                      <strong>
                        {service.name}
                      </strong>

                      {service.description && (
                        <small>
                          {service.description}
                        </small>
                      )}

                      <span>
                        R${" "}
                        {Number(
                          service.price,
                        ).toFixed(2).replace(".", ",")}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="booking-section">
            <span>02</span>

            <div>
              <h2>Escolha a modalidade</h2>

              <div className="booking-options">
                <button
                  type="button"
                  className={
                    modality === "ONLINE"
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setModality("ONLINE")
                  }
                >
                  <strong>Online</strong>
                  <small>
                    Atendimento por videochamada
                  </small>
                </button>

                <button
                  type="button"
                  className={
                    modality === "IN_PERSON"
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setModality("IN_PERSON")
                  }
                >
                  <strong>Presencial</strong>
                  <small>
                    Atendimento no consultório
                  </small>
                </button>
              </div>
            </div>
          </section>

          <section className="booking-section">
            <span>03</span>

            <div className="booking-date-fields">
              <div>
                <label htmlFor="date">
                  Data
                </label>

                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(event) =>
                    setDate(event.target.value)
                  }
                  required
                />
              </div>

              <div>
                <label htmlFor="time">
                  Horário
                </label>

                <input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(event) =>
                    setTime(event.target.value)
                  }
                  required
                />
              </div>
            </div>
          </section>

          {selectedService && (
            <div className="booking-summary">
              <div>
                <span>Atendimento</span>
                <strong>
                  {selectedService.name}
                </strong>
              </div>

              <div>
                <span>Duração</span>
                <strong>
                  {selectedService.duration} min
                </strong>
              </div>

              <div>
                <span>Valor</span>
                <strong>
                  R${" "}
                  {Number(
                    selectedService.price,
                  )
                    .toFixed(2)
                    .replace(".", ",")}
                </strong>
              </div>
            </div>
          )}

          {message && (
            <div className="booking-message">
              {message}
            </div>
          )}

          <button
            className="booking-submit"
            type="submit"
            disabled={
              booking ||
              loading ||
              !serviceId ||
              !date ||
              !time
            }
          >
            {booking
              ? "Agendando..."
              : "Confirmar agendamento"}
          </button>

          <p className="booking-payment-info">
            O pagamento será realizado após a confirmação
            do horário.
          </p>
        </form>
      </div>
    </main>
  );
}

export default BookAppointment;