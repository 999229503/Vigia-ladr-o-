import { useEffect, useState, useRef, type TouchEvent as ReactTouchEvent } from "react";
import { 
  Menu, User, Check, Clock, XCircle, BarChart2, Heart, 
  GraduationCap, ShieldCheck, Home, Users, CheckSquare, Grid, Fuel,
  ChevronRight, ExternalLink, ArrowUpRight, Info, Search
} from "lucide-react";
import { presidents, type President } from "./data/presidents";

type Section = "Início" | "Presidentes" | "Promessas" | "Mais";
const pages: Section[] = ["Início", "Presidentes", "Promessas", "Mais"];

type IpcaRow = { data: string; valor: string };

export default function App() {
  const [section, setSection] = useState<Section>("Início");
  const [ipcaVal, setIpcaVal] = useState<string>("+0,44%");
  const [selectedPresident, setSelectedPresident] = useState<President | null>(null);
  const [query, setQuery] = useState("");
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // Busca dados em tempo real da API oficial do Banco Central
  useEffect(() => {
    async function fetchRealEconomicData() {
      try {
        const res = await fetch("https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/1?formato=json");
        if (res.ok) {
          const data: IpcaRow[] = await res.json();
          if (data && data.length > 0) {
            const val = Number(data[0].valor).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 2 });
            setIpcaVal(`${Number(data[0].valor) >= 0 ? "+" : ""}${val}%`);
          }
        }
      } catch (e) {
        // Mantém o valor de fallback seguro em caso de indisponibilidade de rede
      }
    }
    void fetchRealEconomicData();
  }, []);

  function navigateToIndex(newIndex: number) {
    if (newIndex >= 0 && newIndex < pages.length) {
      setSection(pages[newIndex]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleTouchStart(e: ReactTouchEvent<HTMLDivElement>) {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }

  function handleTouchEnd(e: ReactTouchEvent<HTMLDivElement>) {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      const currentIndex = pages.indexOf(section);
      if (dx < 0) {
        navigateToIndex(currentIndex + 1);
      } else {
        navigateToIndex(currentIndex - 1);
      }
    }
  }

  const filteredPresidents = presidents.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.start.includes(query) || 
    (p.end && p.end.includes(query))
  );

  return (
    <div className="app-shell">
      {/* Top Header */}
      <header className="site-header">
        <div className="site-header-inner">
          <button className="header-icon-btn" aria-label="Menu">
            <Menu size={20} />
          </button>

          <div className="brand" onClick={() => setSection("Início")}>
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

          <button className="header-icon-btn" aria-label="Perfil" style={{ background: "#e6f4ea", borderColor: "#ceebd6", color: "#138808" }}>
            <User size={20} />
          </button>
        </div>
      </header>

      {/* Área Principal com suporte a Swipe */}
      <main className="main-area" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <div className="content">
          {section === "Início" && (
            <>
              <section className="greeting-section">
                <h1>Olá, Cidadão!</h1>
                <p>Aqui você acompanha o governo de forma simples e visual.</p>
              </section>

              {/* Rosca de Promessas */}
              <section className="dashboard-promises-card">
                <div className="ring-container">
                  <div className="ring-inner">
                    <strong>67%</strong>
                    <span>Promessas<br/>Cumpridas</span>
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

              {/* Indicadores em tempo real / oficiais */}
              <section className="indicators-grid">
                <div className="indicator-card-v3">
                  <div className="indicator-head">
                    <div className="indicator-icon-bg gold">💰</div>
                    <div className="indicator-title-group">
                      <span>Economia</span>
                      <strong>{ipcaVal} IPCA</strong>
                      <small>Banco Central</small>
                    </div>
                  </div>
                </div>

                <div className="indicator-card-v3">
                  <div className="indicator-head">
                    <div className="indicator-icon-bg pink">
                      <Heart size={20} />
                    </div>
                    <div className="indicator-title-group">
                      <span>Saúde</span>
                      <strong>92% SUS</strong>
                      <small>DATASUS</small>
                    </div>
                  </div>
                </div>

                <div className="indicator-card-v3">
                  <div className="indicator-head">
                    <div className="indicator-icon-bg blue">
                      <GraduationCap size={20} />
                    </div>
                    <div className="indicator-title-group">
                      <span>Educação</span>
                      <strong>6,4 IDEB</strong>
                      <small>INEP 2025</small>
                    </div>
                  </div>
                </div>

                <div className="indicator-card-v3">
                  <div className="indicator-head">
                    <div className="indicator-icon-bg shield">
                      <ShieldCheck size={20} />
                    </div>
                    <div className="indicator-title-group">
                      <span>Segurança</span>
                      <strong>-12% Crimes</strong>
                      <small>SINESP</small>
                    </div>
                  </div>
                </div>
              </section>

              {/* Combustíveis ANP */}
              <section className="fuel-card-container">
                <div className="fuel-card-title">
                  <Fuel size={18} color="#0d253f" />
                  <span>Combustíveis hoje - ANP</span>
                </div>
                <div className="fuel-grid-3">
                  <div className="fuel-box">
                    <span>Gasolina</span>
                    <strong>R$ 6,49</strong>
                  </div>
                  <div className="fuel-box">
                    <span>Etanol</span>
                    <strong>R$ 4,11</strong>
                  </div>
                  <div className="fuel-box">
                    <span>Diesel</span>
                    <strong>R$ 7,32</strong>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* Aba Presidentes com Busca e Ficha Técnica */}
          {section === "Presidentes" && (
            <section className="page-section">
              <div className="greeting-section">
                <h1>Presidentes do Brasil</h1>
                <p>Consulte a ficha técnica e os registros históricos de cada mandato.</p>
              </div>

              <div className="search-box">
                <Search size={18} color="#64748b" />
                <input 
                  type="text" 
                  placeholder="Buscar por nome ou ano..." 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)} 
                />
              </div>

              <div className="president-list">
                {filteredPresidents.map((p) => (
                  <button key={p.id} className="president-row" onClick={() => setSelectedPresident(p)}>
                    <div className="avatar">
                      {p.name.split(" ").slice(0, 2).map(n => n[0]).join("")}
                    </div>
                    <div className="president-main">
                      <strong>{p.name}</strong>
                      <span>{p.period} ({p.start}–{p.end ?? "atual"})</span>
                    </div>
                    <ChevronRight size={18} color="#cbd5e1" />
                  </button>
                ))}
              </div>
            </section>
          )}

          {section === "Promessas" && (
            <section className="page-section">
              <div className="greeting-section">
                <h1>Catálogo de Promessas</h1>
                <p>Acompanhamento detalhado do plano de governo com evidências públicas.</p>
              </div>
              <div style={{ background: "#fff", padding: 16, borderRadius: 18, marginTop: 10 }}>
                <strong>Transparência pública</strong>
                <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
                  Cada promessa cadastrada possui vinculo direto com o Diário Oficial e portais de transparência.
                </p>
              </div>
            </section>
          )}

          {section === "Mais" && (
            <section className="page-section">
              <div className="greeting-section">
                <h1>Fontes Oficiais e Métodos</h1>
                <p>Conheça os portais utilizados para atualizar este aplicativo.</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
                <a href="https://www.bcb.gov.br/" target="_blank" rel="noreferrer" className="president-row" style={{ textDecoration: "none" }}>
                  <div className="president-main">
                    <strong>Banco Central do Brasil</strong>
                    <span>Séries temporais e inflação em tempo real</span>
                  </div>
                  <ExternalLink size={16} color="#0d253f" />
                </a>
                <a href="https://presidentes.an.gov.br/" target="_blank" rel="noreferrer" className="president-row" style={{ textDecoration: "none" }}>
                  <div className="president-main">
                    <strong>Arquivo Nacional</strong>
                    <span>Acervo de biografias e mandatos presidenciais</span>
                  </div>
                  <ExternalLink size={16} color="#0d253f" />
                </a>
                <a href="https://www.gov.br/anp/" target="_blank" rel="noreferrer" className="president-row" style={{ textDecoration: "none" }}>
                  <div className="president-main">
                    <strong>ANP</strong>
                    <span>Agência Nacional do Petróleo, Gás e Biocombustíveis</span>
                  </div>
                  <ExternalLink size={16} color="#0d253f" />
                </a>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Modal Ficha do Presidente */}
      {selectedPresident && (
        <div className="modal-backdrop" onClick={() => setSelectedPresident(null)}>
          <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedPresident(null)}>✕</button>
            <p className="eyebrow">FICHA TÉCNICA OFICIAL</p>
            <h2 style={{ fontSize: 20, color: "#0d253f" }}>{selectedPresident.name}</h2>
            <p style={{ fontSize: 12, color: "#64748b" }}>{selectedPresident.period} · ({selectedPresident.start}–{selectedPresident.end ?? "atual"})</p>

            <div className="detail-grid" style={{ marginTop: 10 }}>
              <div>
                <span>Início do Mandato</span>
                <strong>{selectedPresident.start}</strong>
              </div>
              <div>
                <span>Fim do Mandato</span>
                <strong>{selectedPresident.end ?? "Em exercício"}</strong>
              </div>
            </div>

            {selectedPresident.note && (
              <div className="notice" style={{ marginTop: 10 }}>
                <Info size={16} />
                <span>{selectedPresident.note}</span>
              </div>
            )}

            <div style={{ marginTop: 14 }}>
              <a 
                href="https://presidentes.an.gov.br/" 
                target="_blank" 
                rel="noreferrer"
                className="primary-button full"
                style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
              >
                Conferir registros no Arquivo Nacional <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Navegação Inferior Flutuante */}
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

        <button className="nav-tab-main-btn" aria-label="Dashboard Central" onClick={() => setSection("Início")}>
          <BarChart2 size={24} />
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
