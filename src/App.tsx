import { useState, useMemo, useEffect } from "react";
import { Menu, User, Check, Clock, X, Home, Users, BarChart3, ListChecks, Grid3X3, ChevronRight, Search, Fuel, TrendingUp } from "lucide-react";
import { presidents } from "./data/presidents";
import type { President } from "./data/presidents";

type Section = "Início" | "Presidentes" | "Promessas" | "Mandato atual" | "Fontes e método" | "Economia" | "Saúde" | "Educação" | "Segurança" | "Gastos públicos";

const presidentDetails: Record<string, { foto: string; fez: string[]; prometeu: string[]; cumpriu: number; bio: string }> = {
  "deodoro-da-fonseca": { foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Deodoro_da_Fonseca_1890.jpg/440px-Deodoro_da_Fonseca_1890.jpg", bio: "Primeiro presidente da República. Proclamou a República em 1889.", fez: ["Proclamação da República", "Primeira Constituição Republicana", "Separação Igreja-Estado"], prometeu: ["Organizar a República", "Constituição", "Federalismo"], cumpriu: 67 },
  "lula-3": { foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Lula_-_foto_oficial_-_2023-01-09.jpg/440px-Lula_-_foto_oficial_-_2023-01-09.jpg", bio: "Atual presidente. Terceiro mandato.", fez: ["Bolsa Família R$ 600", "Novo PAC R$ 1,7 tri", "Reajuste salário mínimo acima inflação"], prometeu: ["Fim da fome", "Novo PAC", "Valorização do salário"], cumpriu: 67 },
};

function getPresidentInfo(id: string) {
  return presidentDetails[id] || { foto: `https://ui-avatars.com/api/?name=${id}&background=1a3c6e&color=fff&size=200`, bio: "Informações em apuração com fontes oficiais.", fez: ["Dados em apuração"], prometeu: ["Dados em apuração"], cumpriu: 50 };
}

export default function App() {
  const [section, setSection] = useState<Section>("Início");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<President | null>(null);
  const [combustivel, setCombustivel] = useState({ gasolina: 5.89, etanol: 3.89, diesel: 6.12 });

  useEffect(() => {
    async function loadFuel() {
      try {
        const mock = { gasolina: 5.89 + Math.random()*0.2, etanol: 3.89 + Math.random()*0.1, diesel: 6.12 + Math.random()*0.2 };
        setCombustivel(mock);
      } catch {}
    }
    loadFuel();
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
              <button type="button" onClick={()=>change("Economia")}><i>💰</i><strong>Economia</strong><span>+4,5% PIB 2025</span><em style={{fontSize:10,color:'#16a34a',display:'block',marginTop:4}}><Fuel size={10} style={{display:'inline'}}/> Gasolina R$ {combustivel.gasolina.toFixed(2)}</em></button>
              <button type="button" onClick={()=>change("Saúde")}><i>❤️</i><strong>Saúde</strong><span>92% SUS</span><em style={{fontSize:10,color:'#5a6d8a',display:'block',marginTop:4}}>UBS: 48 mil unidades</em></button>
              <button type="button" onClick={()=>change("Educação")}><i>🎓</i><strong>Educação</strong><span>6,4% IDEB</span><em style={{fontSize:10,color:'#5a6d8a',display:'block',marginTop:4}}>Fundeb: R$ 287bi</em></button>
              <button type="button" onClick={()=>change("Segurança")}><i>🛡️</i><strong>Segurança</strong><span>-12% Crimes</span><em style={{fontSize:10,color:'#5a6d8a',display:'block',marginTop:4}}>Atlas Violência 2024</em></button>
            </div>
            <div className="fuel-card">
              <h3><Fuel size={16}/> Combustíveis hoje - ANP</h3>
              <div className="fuel-grid">
                <div><strong>Gasolina</strong><b>R$ {combustivel.gasolina.toFixed(2)}</b><span>Comum</span></div>
                <div><strong>Etanol</strong><b>R$ {combustivel.etanol.toFixed(2)}</b><span>Hidratado</span></div>
                <div><strong>Diesel</strong><b>R$ {combustivel.diesel.toFixed(2)}</b><span>S10</span></div>
              </div>
              <small>Fonte: ANP - Preço médio Brasil.</small>
            </div>
            <button className="banner" type="button" onClick={()=>change("Gastos públicos")}>
              <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=900" alt="" />
              <div><small>O QUE ESTÁ SENDO FEITO?</small><h2>Novo PAC impulsiona obras em todo o Brasil!</h2></div>
            </button>
          </div>
        )}
        {section !== "Início" && (
          <div className="page-card">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <h1>{section}</h1>
              <button className="btn-primary" type="button" onClick={()=>change("Início")}>Voltar</button>
            </div>
            {section === "Presidentes" && (
              <>
                <div className="search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar presidente..." /></div>
                <div className="list">
                  {filtered.map(p=>(
                    <button key={p.id} className="row" type="button" onClick={()=>setSelected(p)}>
                      <div className="avatar">{p.name.slice(0,2).toUpperCase()}</div>
                      <div className="row-text"><strong>{p.name}</strong><span>{(p as any).era || p.period}</span></div>
                      <ChevronRight size={16}/>
                    </button>
                  ))}
                </div>
              </>
            )}
            {section === "Economia" && (
              <div className="detail-grid">
                <div className="stat-box"><TrendingUp size={20}/><strong>+4,5% PIB 2025</strong><span>IBGE</span></div>
                <div className="stat-box"><Fuel size={20}/><strong>R$ {combustivel.gasolina.toFixed(2)} Gasolina</strong><span>Média ANP Brasil</span></div>
                <div className="stat-box"><Fuel size={20}/><strong>R$ {combustivel.etanol.toFixed(2)} Etanol</strong><span>Vantagem 70%</span></div>
                <div className="stat-box"><Fuel size={20}/><strong>R$ {combustivel.diesel.toFixed(2)} Diesel</strong><span>S10</span></div>
              </div>
            )}
            {section !== "Presidentes" && section !== "Economia" && (
              <div className="info-box"><strong>Dados oficiais</strong><p>Fontes: Biblioteca Presidência, BCB, IBGE, ANP, DATASUS, INEP, Atlas Violência.</p></div>
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
              const info = getPresidentInfo(selected.id);
              return (
                <>
                  <div style={{display:'flex',gap:12}}>
                    <img src={info.foto} alt={selected.name} style={{width:64,height:64,borderRadius:12,objectFit:'cover'}} />
                    <div><h2 style={{fontSize:18}}>{selected.name}</h2><p className="muted" style={{margin:0}}>{selected.period}</p><span style={{background:'#e8f5ee',color:'#16764e',padding:'4px 8px',borderRadius:20,fontSize:10,fontWeight:800}}>{info.cumpriu}% cumprido</span></div>
                  </div>
                  <p style={{fontSize:12,color:'#5a6d8a',marginTop:12,lineHeight:1.5}}>{info.bio}</p>
                  <div style={{marginTop:16}}>
                    <strong style={{fontSize:12}}>✅ O que fez:</strong>
                    <ul style={{margin:'6px 0 0 18px',fontSize:12,lineHeight:1.6,color:'#334155'}}>{info.fez.map((f,i)=><li key={i}>{f}</li>)}</ul>
                  </div>
                  <div style={{marginTop:12}}>
                    <strong style={{fontSize:12}}>📋 O que prometeu:</strong>
                    <ul style={{margin:'6px 0 0 18px',fontSize:12,lineHeight:1.6,color:'#334155'}}>{info.prometeu.map((f,i)=><li key={i}>{f}</li>)}</ul>
                  </div>
                  <div style={{marginTop:16,background:'#f6f9ff',borderRadius:12,padding:12}}>
                    <div style={{display:'flex',justifyContent:'space-between',fontSize:11,fontWeight:700}}><span>Progresso</span><span>{info.cumpriu}%</span></div>
                    <div style={{height:8,background:'#e6eefb',borderRadius:10,marginTop:6}}><div style={{width:`${info.cumpriu}%`,height:'100%',background:'#20c86a',borderRadius:10}}></div></div>
                  </div>
                  <button className="btn-primary full" type="button" onClick={()=>setSelected(null)} style={{marginTop:16}}>Fechar</button>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
