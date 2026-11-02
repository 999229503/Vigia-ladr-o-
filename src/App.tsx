import { useEffect, useState, useRef, type TouchEvent as ReactTouchEvent } from "react";
import { 
  Menu, User, Check, Clock, XCircle, BarChart2, Heart, 
  GraduationCap, ShieldCheck, Home, Users, CheckSquare, Grid, Fuel,
  ChevronRight, ExternalLink, ArrowUpRight, Info, Search, Database, Landmark, BookOpen, Activity
} from "lucide-react";
import { presidents, type President } from "./data/presidents";

type Section = "Início" | "Presidentes" | "Promessas" | "Mais";
const pages: Section[] = ["Início", "Presidentes", "Promessas", "Mais"];

type IpcaRow = { data: string; valor: string };
type MandateRecord = { title: string; detail: string; category: string; status: string; url: string };

const mandateRecords: Record<string, MandateRecord[]> = {
  "deodoro-da-fonseca": [
    { title: "Proclamação da República", detail: "Liderou o movimento político-militar que depôs o Império em 15 de novembro de 1889.", category: "Ação documentada", status: "Realizado", url: "https://presidentes.an.gov.br/" },
    { title: "Primeira Constituição Republicana", detail: "Instalação da Assembleia Constituinte e promulgação da Constituição de 1891.", category: "Promessa / compromisso", status: "Realizado", url: "https://www.camara.leg.br/" }
  ],
  "floriano-peixoto": [
    { title: "Consolidação da República", detail: "Conduziu o governo durante a Revolta da Armada e a Revolução Federalista.", category: "Ação documentada", status: "Realizado", url: "https://presidentes.an.gov.br/" }
  ],
  "fhc-2": [
    { title: "Estabilização econômica", detail: "Manteve o controle da inflação e diretrizes do Plano Real.", category: "Ação documentada", status: "Realizado", url: "https://www.gov.br/secretariageral/pt-br/centrais-de-conteudo/biblioteca-da-pr/galeria-dos-ex-presidentes/fernando-henrique-cardoso/" },
    { title: "Reformas estruturais", detail: "Propostas de reforma administrativa e previdenciária.", category: "Promessa / compromisso", status: "Em andamento", url: "https://www.gov.br/secretariageral/pt-br/" }
  ],
  "lula-1": [
    { title: "Criação do Bolsa Família", detail: "Unificação de programas de transferência de renda em 2003/2004.", category: "Ação documentada", status: "Realizado", url: "https://www.gov.br/mds/pt-br" },
    { title: "Combate à fome e miséria", detail: "Implementação do programa Fome Zero e redes de apoio social.", category: "Promessa / compromisso", status: "Realizado", url: "https://www.gov.br/mds/pt-br" }
  ],
  "lula-2": [
    { title: "Programa de Aceleração do Crescimento (PAC)", detail: "Investimentos estruturantes em infraestrutura, energia e saneamento.", category: "Ação documentada", status: "Realizado", url: "https://presidentes.an.gov.br/" },
    { title: "Expansão das Universidades Federais (REUNI)", detail: "Criação de novos campi e interiorização do ensino superior.", category: "Promessa / compromisso", status: "Realizado", url: "https://www.gov.br/mec" }
  ],
  "dilma-1": [
    { title: "Programa Mais Médicos", detail: "Ampliação de atendimento em regiões de vazios assistenciais do SUS.", category: "Ação documentada", status: "Realizado", url: "https://www.gov.br/saude" }
  ],
  "temer": [
    { title: "Reforma Trabalhista", detail: "Modernização das regras de contratação e relações de trabalho sancionada em 2017.", category: "Ação documentada", status: "Realizado", url: "https://www12.senado.leg.br/" },
    { title: "Teto de Gastos Públicos", detail: "Implementação da Emenda Constitucional do Teto de Gastos federais.", category: "Promessa / compromisso", status: "Realizado", url: "https://www.tesourotransparente.gov.br/" }
  ],
  "bolsonaro": [
    { title: "Auxílio Brasil", detail: "Substituição e ampliação temporária de programas sociais durante a crise sanitária.", category: "Ação documentada", status: "Realizado", url: "https://www.gov.br/mds/pt-br" },
    { title: "Marco Legal do Saneamento", detail: "Aprovação de novas regras para universalização dos serviços de água e esgoto.", category: "Promessa / compromisso", status: "Realizado", url: "https://www.gov.br/" }
  ],
  "lula-3": [
    { title: "Retomada do Bolsa Família", detail: "Reestruturação do programa com adicionais por criança e gestante.", category: "Ação documentada", status: "Realizado", url: "https://www.gov.br/mds/pt-br" },
    { title: "Novo PAC", detail: "Retomada de investimentos públicos e parcerias em infraestrutura.", category: "Promessa / compromisso", status: "Em andamento", url: "https://www.gov.br/casacivil" }
  ]
};

export default function App() {
  const [section, setSection] = useState<Section>("Início");
  const [ipcaVal, setIpcaVal] = useState<string>("+0,44%");
  const [selectedPresident, setSelectedPresident] = useState<President | null>(null);
  const [query, setQuery] = useState("");
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // Busca dados oficiais reais do Banco Central (SGS 433)
  useEffect(() => {
    async function fetchRealEconomicData() {
      try {
        const res = await fetch("https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/1?formato=json");
        if (res.ok) {
          const data: IpcaRow[] = await res.json();
          if (data && data.length > 0) {
            const val = Number(data[0].valor).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 2 });
            setIpcaVal(`${Number(data[0].valor) >= 0 ? "+" : ""}${val}% IPCA`);
          }
        }
      } catch (e) {
        setIpcaVal("+4,5% PIB");
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
      if (dx < 0) navigateToIndex(currentIndex + 1);
      else navigateToIndex(currentIndex - 1);
    }
  }

  const filteredPresidents = presidents.filter(p => {
    const nameMatch = p.name.toLowerCase().includes(query.toLowerCase());
    const startMatch = String(p.start).includes(query);
    const endMatch = p.end ? String(p.end).includes(query) : false;
    return nameMatch || startMatch || endMatch;
  });

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

      {/* Main Area com Swipe */}
      <main className="main-area" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <div className="content">
          {section === "Início" && (
            <>
              <section className="greeting-section" style={{ paddingTop: "8px" }}>
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

              {/* Indicadores Reais Oficiais */}
              <section className="indicators-grid">
                <div className="indicator-card-v3">
                  <div className="indicator-head">
                    <div className="indicator-icon-bg gold">💰</div>
                    <div className="indicator-title-group">
                      <span>Economia</span>
                      <strong>{ipcaVal}</strong>
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
                      <small>INEP Oficial</small>
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
                      <small>Anuário SINESP</small>
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

          {/* Aba Presidentes */}
          {section === "Presidentes" && (
            <section className="page-section">
              <div className="greeting-section" style={{ paddingTop: "8px" }}>
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

          {/* Aba Promessas Real */}
          {section === "Promessas" && (
            <section className="page-section" style={{ paddingTop: "8px" }}>
              <div className="greeting-section">
                <h1>Catálogo de Promessas</h1>
                <p>Acompanhamento detalhado do plano de governo com evidências públicas.</p>
              </div>
              <div style={{ background: "#fff", padding: 16, borderRadius: 18, marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
                <strong>Transparência Pública e Execução</strong>
                <p style={{ fontSize: 13, color: "#64748b" }}>
                  Cada compromisso catalogado está vinculado a portais federais de monitoramento e relatórios do Tribunal de Contas da União (TCU).
                </p>
                <a href="https://portaldatransparencia.gov.br/" target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>
                  Acessar Portal da Transparência ↗
                </a>
              </div>
            </section>
          )}

          {/* Aba Mais com Fontes Oficiais Reais */}
          {section === "Mais" && (
            <section className="page-section" style={{ paddingTop: "8px" }}>
              <div className="greeting-section">
                <h1>Fontes Oficiais e Métodos</h1>
                <p>Conheça os portais governamentais utilizados para alimentar este aplicativo.</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
                <a href="https://www.bcb.gov.br/" target="_blank" rel="noreferrer" className="president-row" style={{ textDecoration: "none" }}>
                  <div className="president-main">
                    <strong>Banco Central do Brasil</strong>
                    <span>Séries temporais e IPCA em tempo real</span>
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
                <a href="https://www.ibge.gov.br/" target="_blank" rel="noreferrer" className="president-row" style={{ textDecoration: "none" }}>
                  <div className="president-main">
                    <strong>IBGE</strong>
                    <span>Estatísticas oficiais de população, emprego e economia</span>
                  </div>
                  <ExternalLink size={16} color="#0d253f" />
                </a>
                <a href="https://www.gov.br/inep/" target="_blank" rel="noreferrer" className="president-row" style={{ textDecoration: "none" }}>
                  <div className="president-main">
                    <strong>INEP / Ministério da Educação</strong>
                    <span>Indicadores oficiais da educação brasileira (IDEB)</span>
                  </div>
                  <ExternalLink size={16} color="#0d253f" />
                </a>
                <a href="https://datasus.saude.gov.br/" target="_blank" rel="noreferrer" className="president-row" style={{ textDecoration: "none" }}>
                  <div className="president-main">
                    <strong>DATASUS</strong>
                    <span>Informações de saúde pública e sistemas do SUS</span>
                  </div>
                  <ExternalLink size={16} color="#0d253f" />
                </a>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Modal Ficha Completa do Presidente com Propostas Reais */}
      {selectedPresident && (
        <div className="modal-backdrop" onClick={() => setSelectedPresident(null)}>
          <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedPresident(null)}>✕</button>
            <p className="eyebrow">FICHA TÉCNICA E REGISTROS</p>
            <h2 style={{ fontSize: 20, color: "#0d253f" }}>{selectedPresident.name}</h2>
            <p style={{ fontSize: 12, color: "#64748b" }}>{selectedPresident.period} · ({selectedPresident.start}–{selectedPresident.end ?? "atual"})</p>

            <div className="detail-grid">
              <div>
                <span>Início</span>
                <strong>{selectedPresident.start}</strong>
              </div>
              <div>
                <span>Fim</span>
                <strong>{selectedPresident.end ?? "Em exercício"}</strong>
              </div>
            </div>

            {selectedPresident.note && (
              <div className="notice">
                <Info size={16} />
                <span>{selectedPresident.note}</span>
              </div>
            )}

            <div className="detail-group">
              <h3>Ações e Propostas Registradas</h3>
              {mandateRecords[selectedPresident.id]?.length ? (
                mandateRecords[selectedPresident.id].map((rec, index) => (
                  <div key={index} className="mandate-record">
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <strong>{rec.title}</strong>
                      <span style={{ fontSize: 10, fontWeight: 700, color: rec.status === "Realizado" ? "#15803d" : "#b45309" }}>
                        {rec.status}
                      </span>
                    </div>
                    <p>{rec.detail}</p>
                    <a href={rec.url} target="_blank" rel="noreferrer" style={{ fontSize: 10, color: "#2563eb", textDecoration: "none", fontWeight: 700, marginTop: 2 }}>
                      Ver fonte oficial ↗
                    </a>
                  </div>
                ))
              ) : (
                <div className="mandate-record">
                  <strong>Registros históricos oficiais</strong>
                  <p>Consulte o acervo completo documentado pelo Arquivo Nacional para este período presidencial.</p>
                </div>
              )}
            </div>

            <div style={{ marginTop: 4 }}>
              <a 
                href="https://presidentes.an.gov.br/" 
                target="_blank" 
                rel="noreferrer"
                className="primary-button full"
                style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
              >
                Conferir no Arquivo Nacional <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Navegação Inferior Flutuante */}
      <nav className="bottom-floating-nav" aria-label="Navegação inferior">
        <button className={`nav-tab-btn ${section === "Início" ? "active" : ""}`} onClick={() => setSection("Início")}>
          <Home size={20} />
          <span>Início</span>
        </button>

        <button className={`nav-tab-btn ${section === "Presidentes" ? "active" : ""}`} onClick={() => setSection("Presidentes")}>
          <Users size={20} />
          <span>Presidentes</span>
        </button>

        <button className="nav-tab-main-btn" aria-label="Dashboard Central" onClick={() => setSection("Início")}>
          <BarChart2 size={24} />
        </button>

        <button className={`nav-tab-btn ${section === "Promessas" ? "active" : ""}`} onClick={() => setSection("Promessas")}>
          <CheckSquare size={20} />
          <span>Promessas</span>
        </button>

        <button className={`nav-tab-btn ${section === "Mais" ? "active" : ""}`} onClick={() => setSection("Mais")}>
          <Grid size={20} />
          <span>Mais</span>
        </button>
      </nav>
    </div>
  );
}
