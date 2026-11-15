import "../styles/styles.css";

function Home() {
  return (
    <main className="home-page">
      <nav className="home-nav">
        <div className="home-logo">
          <span className="home-logo-mark">✦</span>

          <div>
            <div className="home-logo-name">PSICODE</div>
            <div className="home-logo-subtitle">
              cuidado & acolhimento
            </div>
          </div>
        </div>

        <div className="home-nav-links">
          <a href="#sobre">Sobre</a>
          <a href="#atendimento">Atendimento</a>
          <a href="#contato">Contato</a>
        </div>

        <a href="/login" className="home-login">
          Entrar
        </a>
      </nav>

      <section className="home-hero">
        <div className="home-hero-content">
          <span className="home-eyebrow">
            Psicologia & bem-estar
          </span>

          <h1>
            Um espaço para
            <br />
            <span>cuidar de você.</span>
          </h1>

          <p>
            Acompanhamento psicológico com acolhimento,
            escuta e respeito à sua história.
          </p>

          <div className="home-actions">
            <a href="/login" className="home-primary-button">
              Agendar atendimento
            </a>

            <a href="#sobre" className="home-secondary-button">
              Conheça o PsiCode
            </a>
          </div>
        </div>

        <div className="home-hero-art">
          <div className="home-art-circle" />
          <div className="home-art-ring" />
          <div className="home-art-leaf">⌁</div>
        </div>
      </section>

      <section id="sobre" className="home-about">
        <span className="home-eyebrow">Sobre o atendimento</span>

        <h2>
          Um lugar seguro para
          <br />
          <span>olhar para dentro.</span>
        </h2>

        <p>
          Cada pessoa possui uma história única. O processo
          terapêutico é construído com escuta, acolhimento e
          respeito ao seu momento.
        </p>
      </section>
    </main>
  );
}

export default Home;