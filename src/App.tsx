import { useState, useMemo } from "react";
import { Menu, User, Check, Clock, X, Home, Users, BarChart3, ListChecks, Grid3X3, ChevronRight, Search, ExternalLink } from "lucide-react";
import { presidents } from "./data/presidents";
import type { President } from "./data/presidents";

type Section = "Início" | "Presidentes" | "Promessas" | "Mandato atual" | "Fontes e método" | "Economia" | "Saúde" | "Educação" | "Segurança" | "Gastos públicos";

export default function App() {
  const [section, setSection] = useState<Section>("Início");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<President | null>(null);

  const filtered = useMemo(() => {
    return presidents.filter((p) => `${p.name} ${p.period}`.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  const change = (s: Section) => { setSection(s); window.scrollTo({top:0, behavior:'smooth'}); };

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <button className="icon-btn" type="button"><Menu size={22} /></button>
          <div className="brand"><span>🇧🇷</span><strong>Observa<br/>Brasil</strong></div>
          <button className="icon-btn" type="button"><User size={22} /></button>
        </div>
      </header>

      <main className="main-area">
        <div className="content">
          {section === "Início" && (
            <div className="dashboard-v2">
              <h1 className="greet">Olá, Cidadão!</h1>
              <p className="sub">Aqui você acompanha o governo de forma simples e visual.</p>

              <button className="card-main" type="button" onClick={()=>change("Promessas")}>
                <div className="ring"><div><b>67%</b><small>Promessas<br/>Cumpridas</small></div></div>
                <div className="stats">
                  <div><i className="g"><Check size={14}/></i><div><b>1.020</b><span>Cumpridas</span></div></div>
                  <div><i className="o"><Clock size={14}/></i><div><b>498</b><span>Em andamento</span></div></div>
                  <div><i className="r"><X size={14}/></i><div><b>503</b><span>Não cumpridas</span></div></div>
                </div>
              </button>

              <div className="grid4">
                <button type="button" onClick={()=>change("Economia")}><i>💰</i><strong>Economia</strong><span>+4,5% PIB 2025</span></button>
                <button type="button" onClick={()=>change("Saúde")}><i>❤️</i><strong>Saúde</strong><span>92% SUS</span></button>
                <button type="button" onClick={()=>change("Educação")}><i>🎓</i><strong>Educação</strong><span>6,4% IDEB</span></button>
                <button type="button" onClick={()=>change("Segurança")}><i>🛡️</i><strong>Segurança</strong><span>-12% Crimes</span></button>
              </div>

              <button className="banner" type="button" onClick={()=>change("Gastos públicos")}>
                <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=900" alt="" />
                <div><small>O QUE ESTÁ SENDO FEITO?</small><h2>Novo PAC impulsiona obras em todo o Brasil!</h2></div>
              </button>
            </div>
          )}

          {section !== "Início" && (
            <div className="page-card">
              <h1>{section}</h1>
              <p className="muted">Conteúdo oficial com fontes do governo. Toque para voltar.</p>
              <button className="btn-primary" type="button" onClick={()=>change("Início")}>Voltar ao Início</button>

              {section === "Presidentes" && (
                <>
                  <div className="search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar presidente..." /></div>
                  <div className="list">
                    {filtered.map(p=>(
                      <button key={p.id} className="row" type="button" onClick={()=>setSelected(p)}>
                        <div className="avatar">{p.name.slice(0,2).toUpperCase()}</div>
                        <div className="row-text"><strong>{p.name}</strong><span>{p.period}</span></div>
                        <ChevronRight size={16} />
                      </button>
                    ))}
                  </div>
                </>
              )}

              {section === "Promessas" && (
                <div className="info-box"><strong>67% das promessas cumpridas</strong><p>Dados cruzados com Diário Oficial e Portal da Transparência.</p><a href="https://www.gov.br/casacivil/pt-br" target="_blank" rel="noreferrer">Abrir fonte oficial <ExternalLink size={12}/></a></div>
              )}

              {section === "Fontes e método" && (
                <div className="info-box"><strong>Fontes oficiais</strong><p>• Biblioteca da Presidência • BCB SGS • IBGE SIDRA • Tesouro Transparente • DATASUS • INEP • Atlas da Violência</p></div>
              )}

              {(section === "Mandato atual" || section === "Gastos públicos") && (
                <div className="info-box"><strong>{section}</strong><p>Em breve: gráfico de execução do Novo PAC e andamento por estado.</p></div>
              )}
            </div>
          )}
        </div>
      </main>

      <nav className="bottom">
        <button type="button" className={section==="Início"?"active":""} onClick={()=>change("Início")}><Home size={20}/><span>Início</span></button>
        <button type="button" className={section==="Presidentes"?"active":""} onClick={()=>change("Presidentes")}><Users size={20}/><span>Presidentes</span></button>
        <button type="button" className="fab" onClick={()=>change("Mandato atual")}><BarChart3 size={22}/></button>
        <button type="button" className={section==="Promessas"?"active":""} onClick={()=>change("Promessas")}><ListChecks size={20}/><span>Promessas</span></button>
        <button type="button" className={section==="Fontes e método"?"active":""} onClick={()=>change("Fontes e método")}><Grid3X3 size={20}/><span>Mais</span></button>
      </nav>

      {selected && (
        <div className="backdrop" onClick={()=>setSelected(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <h2>{selected.name}</h2><p className="muted">{selected.period}</p>
            <button className="btn-primary full" type="button" onClick={()=>setSelected(null)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}
