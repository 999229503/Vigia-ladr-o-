import { useState, useRef, type TouchEvent as ReactTouchEvent } from "react";
import { 
  Menu, User, Check, Clock, XCircle, TrendingUp, Heart, 
  GraduationCap, ShieldCheck, Home, Users, CheckSquare, Grid 
} from "lucide-react";

type Section = "Início" | "Presidentes" | "Promessas" | "Mais";
const pages: Section[] = ["Início", "Presidentes", "Promessas", "Mais"];

export default function App() {
  const [section, setSection] = useState<Section>("Início");
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  function navigateToIndex(newIndex: number) {
    if (newIndex >= 0 && newIndex < pages.length) {
      setSection(pages[newIndex]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // Lógica para deslizar a tela pro lado (Swipe)
  function handleTouchStart(e: ReactTouchEvent<HTMLDivElement>) {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }

  function handleTouchEnd(e: ReactTouchEvent<HTMLDivElement>) {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;

    // Se o movimento for predominantemente horizontal e longo o suficiente (>60px)
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      const currentIndex = pages.indexOf(section);
      if (dx < 0) {
        // Deslizou para a esquerda -> Próxima página
        navigateToIndex(currentIndex + 1);
      } else {
        // Deslizou para a direita -> Página anterior
        navigateToIndex(currentIndex - 1);
      }
    }
  }

  return (
    <div className="app-shell">
      {/* Top Header */}
      <header className="site-header">
        <div className="site-header-inner">
          <button className="header-icon-btn" aria-label="Menu">
            <Menu size={20} />
          </button>

          <div className="brand">
            <div className="brand-mark">
              <svg viewBox="0 0 100 100" width="28" height="28">
                <path d="M15 35 Q50 15 85 35 Q90 65 50 85 Q10 65 15 35 Z" fill="#00c853" />
                <circle cx="50" cy="50" r="20" fill="#0047bb" />
              </svg>
            </div>
            <div className="brand-copy">
              <strong>Observa</strong>
              <small>Brasil</small>
            </div>
          </div>

          <button className="header-icon-btn user-avatar-btn" aria-label="Perfil">
            <User size={20} />
          </button>
        </div>
      </header>

      {/* Main Container com suporte a Swipe Gesture */}
      <main className="main-area" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <div className="content">
          {section === "Início" && (
            <>
              {/* Card Hero */}
              <section className="hero-card">
                <div className="hero-overlay" />
                <div className="hero-content">
                  <h1>Olá, Cidadão!</h1>
                  <p>Aqui você acompanha o governo de forma simples e visual.</p>
                </div>
              </section>

              {/* Card Promessas Cumpriadas (Ring + Stats) */}
              <section className="dashboard-promises-card">
                <div className="ring-container">
                  <div className="ring-inner">
                    <strong>67%</strong>
                    <span>Promessas<br/>Cumpridas</span>
                    <div className="ring-check-icon">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  </div>
                </div>

                <div className="promises-stats-list">
                  <div className="stat-item">
                    <div className="stat-icon-wrapper green">
                      <Check size={16} strokeWidth={3} />
                    </div>
                    <div className="stat-info">
                      <strong>1.020</strong>
                      <span>Cumpridas</span>
                    </div>
                  </div>

                  <div className="stat-item">
                    <div className="stat-icon-wrapper orange">
                      <Clock size={16} strokeWidth={3} />
                    </div>
                    <div className="stat-info">
                      <strong>498</strong>
                      <span>Em andamento</span>
                    </div>
                  </div>

                  <div className="stat-item">
                    <div className="stat-icon-wrapper red">
                      <XCircle size={16} strokeWidth={3} />
                    </div>
                    <div className="stat-info">
                      <strong>503</strong>
                      <span>Não cumpridas</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Grid 2x2 com Indicadores e Sparklines */}
              <section className="indicators-grid">
                {/* Economia */}
                <div className="indicator-card-v3">
                  <div className="indicator-head">
                    <div className="indicator-icon-bg gold">💰</div>
                    <div className="indicator-title-group">
                      <span>Economia</span>
                      <strong>+4,5%</strong>
                      <small>PIB 2025</small>
                    </div>
                  </div>
                  <svg className="sparkline-svg" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path d="M0,25 Q25,20 50,22 T100,5 L100,30 L0,30 Z" fill="#fff8e1" opacity="0.6" />
                    <path d="M0,25 Q25,20 50,22 T100,5" fill="none" stroke="#ffa000" strokeWidth="2.5" />
                  </svg>
                </div>

                {/* Saúde */}
                <div className="indicator-card-v3">
                  <div className="indicator-head">
                    <div className="indicator-icon-bg pink">
                      <Heart size={20} />
                    </div>
                    <div className="indicator-title-group">
                      <span>Saúde</span>
                      <strong>92%</strong>
                      <small>SUS</small>
                    </div>
                  </div>
                  <svg className="sparkline-svg" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path d="M0,28 Q30,25 60,15 T100,8 L100,30 L0,30 Z" fill="#e8eaf6" opacity="0.6" />
                    <path d="M0,28 Q30,25 60,15 T100,8" fill="none" stroke="#3f51b5" strokeWidth="2.5" />
                  </svg>
                </div>

                {/* Educação */}
                <div className="indicator-card-v3">
                  <div className="indicator-head">
                    <div className="indicator-icon-bg blue">
                      <GraduationCap size={20} />
                    </div>
                    <div className="indicator-title-group">
                      <span>Educação</span>
                      <strong>6,4%</strong>
                      <small>IDEB</small>
                    </div>
                  </div>
                  <svg className="sparkline-svg" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path d="M0,25 L25,22 L50,18 L75,12 L100,5 L100,30 L0,30 Z" fill="#e8eaf6" opacity="0.6" />
                    <path d="M0,25 L25,22 L50,18 L75,12 L100,5" fill="none" stroke="#5c6bc0" strokeWidth="2.5" />
                  </svg>
                </div>

                {/* Segurança */}
                <div className="indicator-card-v3">
                  <div className="indicator-head">
                    <div className="indicator-icon-bg shield">
                      <ShieldCheck size={20} />
                    </div>
                    <div className="indicator-title-group">
                      <span>Segurança</span>
                      <strong>-12%</strong>
                      <small>Crimes</small>
                    </div>
                  </div>
                  <svg className="sparkline-svg" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path d="M0,10 Q40,25 70,18 T100,28 L100,30 L0,30 Z" fill="#ffebee" opacity="0.6" />
                    <path d="M0,10 Q40,25 70,18 T100,28" fill="none" stroke="#e91e63" strokeWidth="2.5" />
                  </svg>
                </div>
              </section>

              {/* Banner de Obras */}
              <section className="works-banner-card">
                <div className="works-banner-icon">🇧🇷</div>
                <div className="works-banner-text">
                  <strong>O que está sendo feito?</strong>
                  <p>Novo PAC impulsiona obras em todo o Brasil!</p>
                </div>
              </section>
            </>
          )}

          {section !== "Início" && (
            <div style={{ padding: "40px 0", textAlignment: "center" }}>
              <h2>Página: {section}</h2>
              <p style={{ marginTop: 8, color: "#64748b" }}>
                Deslize para o lado para retornar à página inicial.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Floating Bottom Navigation */}
      <nav className="bottom-floating-nav" aria-label="Navegação inferior">
        <button 
          className={`nav-tab-btn ${section === "Início" ? "active" : ""}`} 
          onClick={() => setSection("Início")}
        >
          <Home size={20} />
          <span>Início</span>
        </button>

        <button 
          className={`nav-tab-btn ${section === "Presidentes" ? "active" : ""}`} 
          onClick={() => setSection("Presidentes")}
        >
          <Users size={20} />
          <span>Presidentes</span>
        </button>

        <button className="nav-tab-main-btn" aria-label="Dashboard Central">
          <TrendingUp size={24} />
        </button>

        <button 
          className={`nav-tab-btn ${section === "Promessas" ? "active" : ""}`} 
          onClick={() => setSection("Promessas")}
        >
          <CheckSquare size={20} />
          <span>Promessas</span>
        </button>

        <button 
          className={`nav-tab-btn ${section === "Mais" ? "active" : ""}`} 
          onClick={() => setSection("Mais")}
        >
          <Grid size={20} />
          <span>Mais</span>
        </button>
      </nav>
    </div>
  );
}
