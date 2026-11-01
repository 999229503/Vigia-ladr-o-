import { useState, useMemo } from "react";
import { Menu, User, Check, Clock, X, Home, Users, BarChart3, ListChecks, Grid3X3, ChevronRight, Search, TrendingUp } from "lucide-react";
import { presidents } from "./data/presidents";
import type { President } from "./data/presidents";

type Section = "Início" | "Presidentes" | "Promessas" | "Mandato atual" | "Fontes e método" | "Economia" | "Saúde" | "Educação" | "Segurança" | "Gastos públicos";

const presidentDetails: Record<string, any> = {
  "lula-3": { foto: "https://upload.wikimedia.org/wikipedia/commons/8/80/Lula_-_foto_oficial_-_2023-01-09.jpg", bio: "Mandato 2023-atual", fez: ["Bolsa Família R$ 600", "Novo PAC"], prometeu: ["Fim da fome"], cumpriu: 67 },
};

function getPresidentInfo(p: President) {
  return presidentDetails[p.id] || { foto: `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=1a3c6e&color=fff`, bio: `${p.start} - ${p.end ?? "atual"} | ${p.period}`, fez: ["Dados em apuração"], prometeu: ["Dados em apuração"], cumpriu: 50 };
}

export default function App() {
  const [section, setSection] = useState<Section>("Início");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<President | null>(null);
  const filtered = useMemo(() => presidents.filter(p => `${p.name} ${p.period}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const change = (s: Section) => { setSection(s); window.scrollTo({top:0, behavior:'smooth'}); };

  return (
    <div className="app-shell premium">
      <header className="site-header premium-header"><div className="site-header-inner">
        <button className="icon-btn" type="button"><Menu size={22}/></button>
        <div className="brand"><span>🇧🇷</span><strong>Observa<br/>Brasil</strong></div>
        <button className="icon-btn" type="button"><User size={22}/></button>
      </div></header>

      <main className="main-area"><div className="content">
        {section === "Início" && (
          <div className="dashboard-premium">
            <div className="hero-bg"><img src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1000&q=80" alt=""/><div className="hero-fade"></div></div>
            <div className="hero-text"><h1>Olá, Cidadão!</h1><p>Aqui você acompanha o governo de forma simples e visual.</p></div>
            
            <div className="card-main-premium">
              <div className="ring-premium"><div><b>67%</b><small>Promessas<br/>Cumpridas</small><i><Check size={12}/></i></div></div>
              <div className="stats-premium">
                <div><i className="g"><Check size={14}/></i><div><b>1.020</b><span>Cumpridas</span></div></div>
                <div><i className="o"><Clock size={14}/></i><div><b>498</b><span>Em andamento</span></div></div>
                <div><i className="r"><X size={14}/></i><div><b>503</b><span>Não cumpridas</span></div></div>
              </div>
            </div>

            <div className="grid4-premium">
              <button type="button" onClick={()=>change("Economia")} className="card-eco"><div className="card-top"><i className="ico-coin">🪙</i><div><strong>Economia</strong><b>+4,5%</b><span>PIB 2025</span></div><TrendingUp size={16} className="up"/></div><div className="mini-chart green"></div></button>
              <button type="button" onClick={()=>change("Saúde")} className="card-saude"><div className="card-top"><i className="ico-heart">❤️</i><div><strong>Saúde</strong><b>92%</b><span>SUS</span></div></div><div className="mini-chart blue"></div></button>
              <button type="button" onClick={()=>change("Educação")} className="card-edu"><div className="card-top"><i className="ico-edu">🎓</i><div><strong>Educação</strong><b>6,4%</b><span>IDEB</span></div></div><div className="mini-chart purple"></div></button>
              <button type="button" onClick={()=>change("Segurança")} className="card-seg"><div className="card-top"><i className="ico-seg">🛡️</i><div><strong>Segurança</strong><b>-12%</b><span>Crimes</span></div></div><div className="mini-chart red"></div></button>
            </div>

            <button className="banner-premium" type="button" onClick={()=>change("Gastos públicos")}>
              <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900" alt="obras" className="banner-img"/>
              <div className="banner-flag">🇧🇷</div>
              <div className="banner-text"><small>O que está sendo feito?</small><h2>Novo PAC impulsiona obras em todo o Brasil!</h2></div>
            </button>
          </div>
        )}

        {section !== "Início" && (
          <div className="page-card">
            <div className="page-head"><h1>{section}</h1><button className="btn-primary" type="button" onClick={()=>change("Início")}>Voltar</button></div>
            {section === "Presidentes" && (<><div className="search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar presidente..." /></div><div className="list">{filtered.map(p=>(<button key={p.id} className="row" type="button" onClick={()=>setSelected(p)}><div className="avatar">{p.name.slice(0,2).toUpperCase()}</div><div className="row-text"><strong>{p.name}</strong><span>{p.period}</span></div><ChevronRight size={16}/></button>))}</div></>)}
            {section !== "Presidentes" && (<div className="info-box"><strong>Dados oficiais</strong><p>Fonte: Biblioteca Presidência, BCB, IBGE, ANP.</p></div>)}
          </div>
        )}
      </div></main>

      <nav className="bottom premium-bottom">
        <button type="button" className={section==="Início"?"active":""} onClick={()=>change("Início")}><Home size={20}/><span>Início</span></button>
        <button type="button" className={section==="Presidentes"?"active":""} onClick={()=>change("Presidentes")}><Users size={20}/><span>Presidentes</span></button>
        <button type="button" className="fab-premium" onClick={()=>change("Mandato atual")}><TrendingUp size={22}/></button>
        <button type="button" className={section==="Promessas"?"active":""} onClick={()=>change("Promessas")}><ListChecks size={20}/><span>Promessas</span></button>
        <button type="button" className={section==="Fontes e método"?"active":""} onClick={()=>change("Fontes e método")}><Grid3X3 size={20}/><span>Mais</span></button>
      </nav>

      {selected && (<div className="backdrop" onClick={()=>setSelected(null)}><div className="modal" onClick={e=>e.stopPropagation()}>{(()=>{const info=getPresidentInfo(selected);return(<><div className="modal-top"><img src={info.foto} alt="" className="modal-photo"/><div><h2>{selected.name}</h2><p className="muted">{selected.start} - {selected.end ?? "atual"} | {selected.period}</p><span className="badge">{info.cumpriu}% cumprido</span></div></div><button className="btn-primary full" type="button" onClick={()=>setSelected(null)}>Fechar</button></>)})()}</div></div>)}
    </div>
  );
}
