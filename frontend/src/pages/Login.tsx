import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";
import "../styles/login.css";

const API_URL = "http://localhost:5000/api";

type Mode = "login" | "register";

function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (mode === "register") {
        const response = await fetch(`${API_URL}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            phone: phone || undefined,
            birthDate: birthDate || undefined,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Erro ao criar conta");
        }

        setMessage(
          "Conta criada com sucesso. Agora faca seu login.",
        );

        setMode("login");
        setPassword("");
        return;
      }

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Erro ao realizar login",
        );
      }

      localStorage.setItem("psicode_token", data.token);
      localStorage.setItem(
        "psicode_user",
        JSON.stringify(data.user),
      );

      navigate("/dashboard");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro inesperado",
      );
    } finally {
      setLoading(false);
    }
  }

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setMessage("");
  }

  return (
    <main className="login-page">
      <div className="login-layout">

        {/* AREA VISUAL */}
        <section className="login-visual">
          <div className="login-decoration login-decoration-circle" />
          <div className="login-decoration login-decoration-ring" />
          <div className="login-decoration login-decoration-small-ring" />
          <div className="login-decoration login-decoration-dot" />
          <div className="login-decoration login-decoration-dot-small" />

          <div className="login-visual-content">

            <div className="login-logo">
              <div className="login-logo-mark">
                ✦
              </div>

              <div>
                <div className="login-logo-name">
                  PSICODE
                </div>

                <div className="login-logo-subtitle">
                  cuidado & acolhimento
                </div>
              </div>
            </div>

            <div className="login-eyebrow">
              Um espaço para você
            </div>

            <h1 className="login-title">
              Cuidar de si
              <br />
              também é
              <br />
              <span className="login-title-highlight">
                uma prioridade.
              </span>
            </h1>

            <p className="login-description">
              Um ambiente acolhedor para acompanhar sua jornada
              de autoconhecimento, equilíbrio e bem-estar.
            </p>

            <div className="login-illustration">
              <div className="login-illustration-circle" />
              <div className="login-illustration-ring" />
              <div className="login-illustration-center" />
              <div className="login-illustration-leaf" />
              <div className="login-illustration-stem" />
              <div className="login-illustration-block" />
            </div>

            <p className="login-service">
              Atendimento online e presencial
            </p>
          </div>
        </section>

        {/* AREA DE LOGIN */}
        <section className="login-auth">
          <div className="login-auth-decoration login-auth-decoration-top" />
          <div className="login-auth-decoration login-auth-decoration-bottom" />

          <div className="login-auth-content">

            <div className="login-auth-eyebrow">
              {mode === "login" ? "Acesso" : "Cadastro"}
            </div>

            <h2 className="login-auth-title">
              {mode === "login"
                ? "Bem-vindo de volta."
                : "Crie seu espaço."}
            </h2>

            <p className="login-auth-description">
              {mode === "login"
                ? "Entre para continuar sua jornada."
                : "Cadastre-se para acompanhar seus atendimentos."}
            </p>

            <form
              onSubmit={handleSubmit}
              className="login-form"
            >

              {mode === "register" && (
                <div className="login-register-fields">

                  <div className="login-field">
                    <label htmlFor="name">
                      Nome completo
                    </label>

                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                      required
                      placeholder="Seu nome"
                    />
                  </div>

                  <div className="login-field">
                    <label htmlFor="phone">
                      Telefone
                    </label>

                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(event) =>
                        setPhone(event.target.value)
                      }
                      placeholder="(61) 99999-9999"
                    />
                  </div>

                  <div className="login-field">
                    <label htmlFor="birthDate">
                      Data de nascimento
                    </label>

                    <input
                      id="birthDate"
                      type="date"
                      value={birthDate}
                      onChange={(event) =>
                        setBirthDate(event.target.value)
                      }
                    />
                  </div>

                </div>
              )}

              <div className="login-field">
                <label htmlFor="email">
                  E-mail
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                  placeholder="voce@email.com"
                />
              </div>

              <div className="login-field">
                <label htmlFor="password">
                  Senha
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                  minLength={6}
                  placeholder="••••••••"
                />
              </div>

              {message && (
                <div className="login-message">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="login-submit"
              >
                {loading
                  ? "Aguarde..."
                  : mode === "login"
                    ? "Entrar"
                    : "Criar minha conta"}
              </button>

            </form>

            <div className="login-switch">
              {mode === "login" ? (
                <>
                  Ainda não possui uma conta?{" "}

                  <button
                    type="button"
                    onClick={() => switchMode("register")}
                  >
                    Criar conta
                  </button>
                </>
              ) : (
                <>
                  Já possui uma conta?{" "}

                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                  >
                    Fazer login
                  </button>
                </>
              )}
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}

export default Login;