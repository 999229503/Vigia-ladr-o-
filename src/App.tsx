import { useState, useMemo } from "react";
import { Menu, User, Check, Clock, X, Home, Users, BarChart3, ListChecks, Grid3X3, ChevronRight, Search } from "lucide-react";
import { presidents } from "./data/presidents";
import type { President } from "./data/presidents";

type Section = "Início" | "Presidentes" | "Promessas" | "Economia" | "Saúde" | "Educação" | "Segurança" | "Gastos públicos" | "Fontes e método" | "Mandato atual";

export default function App() {
  const [section, setSection] = useState<Section>("Início");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<President | null>(null);

  const filtered = useMemo(() => {
    return presidents.filter((p) => `${p.name} ${p.start}`.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  function changeSection(s: Section) {
    setSection(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <button className="icon-button" type="button"><Menu size={22} /></button>
          <div className="brand"><span className="brand-mark">🇧🇷</span><span className="brand-copy"><strong>Observa<br/>Brasil</strong></span></div>
          <button className="icon-button" type="button"><User size={24} /></button>
        </div>
      </header>

      <main className="main-area">
        <div className="content">
          {section === "Início" && (
            <div className="dashboard-v2">
              <div className="dashboard-heading">
                <h1>Olá, Cidadão!</h1>
                <p>Aqui você acompanha o governo de forma simples e visual.</p>
              </div>

              <button className="dashboard-promises" type="button" onClick={() => changeSection("Promessas")}>
                <div className="promise-ring"><div><strong>67%</strong><span>Promessas<br/>Cumpridas</span></div></div>
                <div className="promise-statuses">
                  <div><span className="dot green"><Check size={12} /></span><div><strong>1.020</strong><small>Cumpridas</small></div></div>
                  <div><span className="dot orange"><Clock size={12} /></span><div><strong>498</strong><small>Em andamento</small></div></div>
                  <div><span className="dot red"><X size={12} /></span><div><strong>503</strong><small>Não cumpridas</small></div></div>
                </div>
              </button>

              <div className="dashboard-quick-grid">
                <button className="dashboard-quick-card" type="button" onClick={() => changeSection("Economia")}><div className="quick-icon">💰</div><div className="quick-text"><strong>Economia</strong><b>+4,5% PIB 2025</b></div></button>
                <button className="dashboard-quick-card" type="button" onClick={() => changeSection("Saúde")}><div className="quick-icon">❤️</div><div className="quick-text"><strong>Saúde</strong><b>92% SUS</b></div></button>
                <button className="dashboard-quick-card" type="button" onClick={() => changeSection("Educação")}><div className="quick-icon">🎓</div><div className="quick-text"><strong>Educação</strong><b>6,4% IDEB</b></div></button>
                <button className="dashboard-quick-card" type="button" onClick={() => changeSection("Segurança")}><div className="quick-icon">🛡️</div><div className="quick-text"><strong>Segurança</strong><b>-12% Crimes</b></div></button>
              </div>

              <button className="dashboard-works" type="button" onClick={() => changeSection("Gastos públicos")}>
                <div className="works-copy"><span className="eyebrow">O QUE ESTÁ SENDO FEITO?</span><h2>Novo PAC impulsiona obras em todo o Brasil!</h2></div>
                <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800" alt="obras" />
              </button>
            </div>
          )}

          {section !== "Início" && (
            <section className="page-section">
              <h1>{section}</h1>
              <p className="muted">Toque em Voltar para retornar ao Início.</p>
              <button className="primary-button" type="button" onClick={() => changeSection("Início")}>Voltar ao Início</button>

              {section === "Presidentes" && (
                <>
                  <label className="search-box"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar..." /></label>
                  <div className="president-list">
                    {filtered.map((p) => (
                      <button key={p.id} className="president-row" type="button" onClick={() => setSelected(p)}>
                        <div className="avatar">{p.name.slice(0, 2)}</div>
                        <div className="president-main"><strong>{p.name}</strong><span>{p.period}</span></div>
                        <ChevronRight size={16} />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </section>
          )}
        </div>
      </main>

      <nav className="mobile-bottom-nav">
        <button type="button" className={section === "Início" ? "active" : ""} onClick={() => changeSection("Início")}><Home size={20} /><span>Início</span></button>
        <button type="button" className={section === "Presidentes" ? "active" : ""} onClick={() => changeSection("Presidentes")}><Users size={20} /><span>Presidentes</span></button>
        <button type="button" className="mobile-nav-main" onClick={() => changeSection("Mandato atual")}><BarChart3 size={22} /></button>
        <button type="button" className={section === "Promessas" ? "active" : ""} onClick={() => changeSection("Promessas")}><ListChecks size={20} /><span>Promessas</span></button>
        <button type="button" className={section === "Fontes e método" ? "active" : ""} onClick={() => changeSection("Fontes e método")}><Grid3X3 size={20} /><span>Mais</span></button>
      </nav>

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selected.name}</h2>
            <p className="muted">{selected.period}</p>
            <button className="primary-button full" type="button" onClick={() => setSelected(null)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}
