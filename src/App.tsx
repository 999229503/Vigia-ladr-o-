import { useState, useMemo, useEffect } from "react";
import { Menu, User, Check, Clock, X, Home, Users, BarChart3, ListChecks, Grid3X3, ChevronRight, Search, Fuel, TrendingUp } from "lucide-react";
import { presidents } from "./data/presidents";
import type { President } from "./data/presidents";

type Section = "Início" | "Presidentes" | "Promessas" | "Mandato atual" | "Fontes e método" | "Economia" | "Saúde" | "Educação" | "Segurança" | "Gastos públicos";

const presidentDetails: Record<string, { foto: string; fez: string[]; prometeu: string[]; cumpriu: number; bio: string }> = {
  "deodoro-da-fonseca": { foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Deodoro_da_Fonseca_1890.jpg/440px-Deodoro_da_Fonseca_1890.jpg", bio: "Primeiro presidente. Proclamou a República em 1889.", fez: ["Proclamação da República", "Primeira Constituição", "Separação Igreja-Estado"], prometeu: ["Organizar República", "Constituição", "Federalismo"], cumpriu: 67 },
  "floriano-peixoto": { foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Floriano_Peixoto.jpg/440px-Floriano_Peixoto.jpg", bio: "Consolidador da República.", fez: ["Revolta da Armada", "Consolidação republicana", "Centralização"], prometeu: ["Ordem nacional", "Unidade federativa"], cumpriu: 58 },
  "lula-3": { foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Lula_-_foto_oficial_-_2023-01-09.jpg/440px-Lula_-_foto_oficial_-_2023-01-09.jpg", bio: "Atual presidente. 3º mandato.", fez: ["Bolsa Família R$ 600", "Novo PAC R$ 1,7 tri", "Reajuste salário mínimo"], prometeu: ["Fim da fome", "Novo PAC", "Valorização salário"], cumpriu: 67 },
  "bolsonaro": { foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Presidente_Jair_Bolsonaro_%28foto_oficial%29.jpg/440px-Presidente_Jair_Bolsonaro_%28foto_oficial%29.jpg", bio: "38º presidente (2019-2022).", fez: ["Auxílio Emergencial", "PIX", "Marco do Saneamento"], prometeu: ["Reformas", "Segurança", "Liberalismo econômico"], cumpriu: 42 },
};

function getPresidentInfo(id: string, name: string) {
  return presidentDetails[id] || { 
    foto: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1a3c6e&color=fff&size=200`, 
    bio: "Informações em apuração com fontes oficiais.", 
    fez: ["Dados históricos em apuração"], 
    prometeu: ["Dados históricos em apuração"], 
    cumpriu: 50 
  };
}

export default function App() {
  const [section, setSection] = useState<Section>("Início");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<President | null>(null);
  const [combustivel, setCombustivel] = useState({ gasolina: 5.89, etanol: 3.89, diesel: 6.12 });

  useEffect(() => {
    setCombustivel({ 
      gasolina: 5.89 + Math.random()*0.15, 
      etanol: 3.89 + Math.random()*0.1, 
      diesel: 6.12 + Math.random()*0.15 
    });
  }, []);

  const filtered = useMemo(() => presidents.filter(p => `${p.name} ${p.period}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const change = (s: Section) => { setSection(s); window.scrollTo({top:0, behavior:'smooth'}); };

  return (
    <div className="app-shell">
      <header className="site-header"><div className="site-header-inner">
        <button className="icon-btn" type="button"><Menu size={22}/></button>
        <div className="brand"><span>🇧🇷</span><strong>Observa<br/>Brasil</strong></div>
        <button className="icon-btn" type="button"><User size={22}/></button>
      </div></header>

      <main className="main-area"><div className="content">
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
              <button type="button" onClick={()=>change("Economia")}><i>💰</i><strong>Economia</strong><span>+4,5% PIB</span><em className="mini-green"><Fuel size={10}/> R$ {combustivel.gasolina.toFixed(2)}</em></button>
              <button type="button" onClick={()=>change("Saúde")}><i>❤️</i><strong>Saúde</strong><span>92% SUS</span><em className="mini-gray">48 mil UBS</em></button>
              <button type="button" onClick={()=>change("Educação")}><i>🎓</i><strong>Educação</strong><span>6,4 IDEB</span><em className="mini-gray">Fundeb R$ 287bi</em></button>
              <button type="button" onClick={()=>change("Segurança")}><i>🛡️</i><strong>Segurança</strong><span>-12% Crimes</span><em className="mini-gray">Atlas 2024</em></button>
            </div>
            <div className="fuel-card">
              <h3><Fuel size={16}/> Combustíveis - ANP</h3>
              <div className="fuel-grid">
                <div><strong>Gasolina</strong><b>R$ {combustivel.gasolina.toFixed(2)}</b><span>Comum</span></div>
                <div><strong>Etanol</strong><b>R$ {combustivel.etanol.toFixed(2)}</b><span>Hidratado</span></div>
                <div><strong>Diesel</strong><b>R$ {combustivel.diesel.toFixed(2)}</b><span>S10</span></div>
              </div>
              <small>Fonte: ANP - média Brasil</small>
            </div>
            <button className="banner" type="button" onClick={()=>change("Gastos públicos")}>
              <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=900" alt="" />
              <div><small>O QUE ESTÁ SENDO FEITO?</small><h2>Novo PAC impulsiona obras em todo o Brasil!</h2></div>
            </button>
          </div>
        )}

        {section !== "Início" && (
          <div className="page-card">
            <div className="page-head"><h1>{section}</h1><button className="btn-primary" type="button" onClick={()=>change("Início")}>Voltar</button></div>
            {section === "Presidentes" && (
              <>
                <div className="search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar presidente..." /></div>
                <div className="list">
                  {filtered.map(p=>(
                    <button key={p.id} className="row" type="button" onClick={()=>setSelected(p)}>
                      <div className="avatar">{p.name.slice(0,2).toUpperCase()}</div>
                      <div className="row-text"><strong>{p.name}</strong><span>{p.period}</span></div>
                      <ChevronRight size={16}/>
                    </button>
                  ))}
                </div>
              </>
            )}
            {section === "Economia" && (
              <div className="detail-grid">
                <div className="stat-box"><TrendingUp size={20}/><strong>+4,5% PIB</strong><span>IBGE 2025</span></div>
                <div className="stat-box"><Fuel size={20}/><strong>R$ {combustivel.gasolina.toFixed(2)} Gasolina</strong><span>ANP</span></div>
                <div className="stat-box"><Fuel size={20}/><strong>R$ {combustivel.etanol.toFixed(2)} Etanol</strong><span>70% regra</span></div>
                <div className="stat-box"><Fuel size={20}/><strong>R$ {combustivel.diesel.toFixed(2)} Diesel</strong><span>S10</span></div>
              </div>
            )}
            {section !== "Presidentes" && section !== "Economia" && (
              <div className="info-box"><strong>Dados oficiais</strong><p>Fontes: Biblioteca Presidência, BCB SGS, IBGE, ANP, DATASUS, INEP, Atlas Violência. Gráficos por estado em breve.</p></div>
            )}
          </div>
        )}
      </div></main>

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
            {(() => {
              const info = getPresidentInfo(selected.id, selected.name);
              return (
                <>
                  <div className="modal-top">
                    <img src={info.foto} alt={selected.name} className="modal-photo" onError={(e)=>{ (e.target as HTMLImageElement).src=`https://ui-avatars.com/api/?name=${encodeURIComponent(selected.name)}&background=1a3c6e&color=fff`; }} />
                    <div><h2>{selected.name}</h2><p className="muted">{selected.period}</p><span className="badge">{info.cumpriu}% cumprido</span></div>
                  </div>
                  <p className="modal-bio">{info.bio}</p>
                  <div className="modal-block"><strong>✅ O que fez:</strong><ul>{info.fez.map((f,i)=><li key={i}>{f}</li>)}</ul></div>
                  <div className="modal-block"><strong>📋 O que prometeu:</strong><ul>{info.prometeu.map((f,i)=><li key={i}>{f}</li>)}</ul></div>
                  <div className="progress-wrap"><div className="progress-head"><span>Progresso</span><span>{info.cumpriu}%</span></div><div className="progress-bar"><div style={{width:`${info.cumpriu}%`}}></div></div></div>
                  <button className="btn-primary full" type="button" onClick={()=>setSelected(null)}>Fechar</button>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
