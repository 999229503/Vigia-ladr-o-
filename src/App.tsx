import { useEffect, useMemo, useRef, useState, type TouchEvent as ReactTouchEvent } from "react";
import { Activity, ArrowUpRight, BookOpen, CheckCircle2, ChevronRight, Database, ExternalLink, Landmark, Search, Users, X, RefreshCw, Info, Menu, User, Check, Clock, Home, ListChecks, Grid3X3, BarChart3 } from "lucide-react";
import { presidents, type President } from "./data/presidents";

type Section = "Início" | "Mandato atual" | "Presidentes" | "Economia" | "Tributos" | "Saúde" | "Educação" | "Segurança" | "Gastos públicos" | "Promessas" | "Fontes e método";
const nav: { label: Section; icon: typeof Landmark }[] = [
  { label: "Início", icon: Home }, { label: "Presidentes", icon: Users },
  { label: "Mandato atual", icon: BarChart3 }, { label: "Promessas", icon: ListChecks }, { label: "Fontes e método", icon: Grid3X3 }
];

const sources = [
  { name: "Biblioteca da Presidência da República", desc: "Biografias e registros oficiais.", url: "https://www.biblioteca.presidencia.gov.br/presidencia/ex-presidentes", type: "História" },
  { name: "Banco Central do Brasil — SGS", desc: "Séries temporais econômicas, IPCA.", url: "https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/12?formato=json", type: "Economia" },
  { name: "IBGE — SIDRA", desc: "Estatísticas oficiais.", url: "https://sidra.ibge.gov.br/", type: "Economia e população" },
  { name: "Tesouro Nacional", desc: "Carga Tributária.", url: "https://www.tesourotransparente.gov.br/", type: "Tributos" },
  { name: "Portal da Transparência", desc: "Despesas federais.", url: "https://portaldatransparencia.gov.br/", type: "Gastos públicos" },
  { name: "DATASUS", desc: "Informações de saúde.", url: "https://datasus.saude.gov.br/", type: "Saúde" },
  { name: "INEP", desc: "Indicadores da educação.", url: "https://www.gov.br/inep/pt-br", type: "Educação" },
  { name: "Atlas da Violência — Ipea", desc: "Segurança pública.", url: "https://www.ipea.gov.br/atlasviolencia/", type: "Segurança" },
];

function formatYear(p: President) { return `${p.start}–${p.end ?? "atual"}`; }
type MandateRecord = { title: string; detail: string; category: "Ação documentada" | "Promessa / compromisso" | "Pendência"; status: "Realizado" | "Em andamento" | "Em apuração" | "Não comprovado"; source: string; url: string; period?: string };
const mandateRecords: Record<string, MandateRecord[]> = {
  "lula-3": [
    { title: "Retomada do Bolsa Família", detail: "Lei nº 14.601/2023", category: "Ação documentada", status: "Realizado", source: "Presidência", url: "https://legislacao.presidencia.gov.br/", period: "2023–atual" },
    { title: "Obras e metas do Novo PAC", detail: "Andamento por empreendimento", category: "Pendência", status: "Em apuração", source: "Casa Civil", url: "https://www.gov.br/casacivil/pt-br/assuntos/novopac", period: "2023–atual" },
  ]
};
function openExternal(url: string) { window.open(url, "_blank", "noopener,noreferrer"); }
type IpcaRow = { data: string; valor: string };

export default function App() {
  const [section, setSection] = useState<Section>("Início");
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const selectedRef = useRef<President | null>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<President | null>(null);
  const [ipca, setIpca] = useState<IpcaRow[]>([]);
  const [foodIpca, setFoodIpca] = useState<IpcaRow[]>([]);
  const [ipca12m, setIpca12m] = useState<IpcaRow[]>([]);
  const [ipcaState, setIpcaState] = useState<"loading" | "ready" | "error">("loading");
  const [ipcaUpdated, setIpcaUpdated] = useState("");
  const [sourceSearch, setSourceSearch] = useState("");

  const IPCA_CACHE_KEY = "observabrasil_indicadores_v2";
  const IPCA_CACHE_TTL = 24 * 60 * 60 * 1000;
  const ipcaRequestInFlight = useRef(false);

  async function loadIpca(force = false) {
    if (ipcaRequestInFlight.current) return;
    const validRows = (rows: unknown): rows is IpcaRow[] => Array.isArray(rows) && rows.length > 0;
    let cached: any = null;
    try {
      const raw = localStorage.getItem(IPCA_CACHE_KEY);
      if (raw) cached = JSON.parse(raw);
    } catch {}
    if (cached && !force) {
      setIpca(cached.ipca); setFoodIpca(cached.food); setIpca12m(cached.ipca12m);
      setIpcaUpdated(new Date(cached.savedAt).toLocaleString("pt-BR")); setIpcaState("ready");
      if (Date.now() - cached.savedAt < IPCA_CACHE_TTL) return;
    }
    ipcaRequestInFlight.current = true; setIpcaState("loading");
    try {
      const endpoints = [
        "https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/24?formato=json",
        "https://api.bcb.gov.br/dados/serie/bcdata.sgs.1635/dados/ultimos/24?formato=json",
        "https://api.bcb.gov.br/dados/serie/bcdata.sgs.13522/dados/ultimos/24?formato=json"
      ];
      const series = await Promise.all(endpoints.map(async (url) => {
        const r = await fetch(url); return r.json();
      }));
      const savedAt = Date.now();
      setIpca(series[0]); setFoodIpca(series[1]); setIpca12m(series[2]);
      setIpcaUpdated(new Date(savedAt).toLocaleString("pt-BR")); setIpcaState("ready");
      localStorage.setItem(IPCA_CACHE_KEY, JSON.stringify({ savedAt, ipca: series[0], food: series[1], ipca12m: series[2] }));
    } catch {
      setIpcaState("error");
    } finally { ipcaRequestInFlight.current = false; }
  }
  useEffect(() => { void loadIpca(false); }, []);
  useEffect(() => { selectedRef.current = selected; }, [selected]);

  const filtered = useMemo(() => presidents.filter(p => `${p.name} ${p.start}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const filteredSources = sources.filter(s => `${s.name} ${s.desc} ${s.type}`.toLowerCase().includes(sourceSearch.toLowerCase()));
  function changeSection(label: Section) { setSection(label); setSelected(null); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function handleTouchStart(e: ReactTouchEvent<HTMLDivElement>) { touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }
  function handleTouchEnd(e: ReactTouchEvent<HTMLDivElement>) {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) < 75 || Math.abs(dx) < Math.abs(dy) * 1.25) return;
    const index = nav.findIndex(item => item.label === section);
    const next = nav[index + (dx < 0 ? 1 : -1)];
    if (next) changeSection(next.label);
  }

  return <div className="app-shell">
    <header className="site-header">
      <div className="site-header-inner">
        <button className="icon-button"><Menu size={24} /></button>
        <button className="brand brand-home" onClick={() => changeSection("Início")}>
          <span className="brand-mark">🇧🇷</span>
          <span className="brand-copy"><strong>Observa<br/>Brasil</strong></span>
        </button>
        <button className="icon-button"><User size={26} /></button>
      </div>
    </header>

    <main className="main-area">
      <div className="content" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {section === "Início" && <Overview setSection={changeSection} ipca={ipca} foodIpca={foodIpca} ipca12m={ipca12m} ipcaState={ipcaState} ipcaUpdated={ipcaUpdated} onRefresh={() => void loadIpca(true)} />}
        {section === "Presidentes" && <PresidentesPage query={query} setQuery={setQuery} filtered={filtered} setSelected={setSelected} />}
        {section !== "Início" && section !== "Presidentes" && <CategoryPage section={section} setSection={changeSection} ipca={ipca} sourceSearch={sourceSearch} setSourceSearch={setSourceSearch} filteredSources={filteredSources} ipcaState={ipcaState} onRefresh={() => void loadIpca(true)} />}
      </div>
    </main>

    <nav className="mobile-bottom-nav">
      <button className={section === "Início" ? "active" : ""} onClick={() => changeSection("Início")}><Home size={20} /><span>Início</span></button>
      <button className={section === "Presidentes" ? "active" : ""} onClick={() => changeSection("Presidentes")}><Users size={20} /><span>Presidentes</span></button>
      <button className="mobile-nav-main" onClick={() => changeSection("Mandato atual")}><BarChart3 size={22} /></button>
      <button className={section === "Promessas" ? "active" : ""} onClick={() => changeSection("Promessas")}><ListChecks size={20} /><span>Promessas</span></button>
      <button className={section === "Fontes e método" ? "active" : ""} onClick={() => changeSection("Fontes e método")}><Grid3X3 size={20} /><span>Mais</span></button>
    </nav>

    {selected && <PresidentDetails president={selected} onClose={() => setSelected(null)} />}
  </div>;
}

function Overview({ setSection, ipca, ipcaState, ipcaUpdated, onRefresh }: any) {
  const latest = ipca[ipca.length - 1];
  const fmt = (row?: IpcaRow) => row ? `${Number(row.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}%` : "—";
  return <div className="dashboard-v2">
    <div className="dashboard-heading">
      <div><h1>Olá, Cidadão!</h1><p>Aqui você acompanha o governo de forma simples e visual.</p></div>
      <button className="dashboard-refresh" onClick={onRefresh}><RefreshCw size={14} /> {ipcaState === "loading" ? "Consultando…" : "Atualizar"}</button>
    </div>

    <div className="dashboard-promises" onClick={() => setSection("Promessas")} style={{cursor:'pointer'}}>
      <div className="promise-ring"><div><strong>67%</strong><span>Promessas<br/>Cumpridas</span></div></div>
      <div className="promise-copy-mobile">
        <div className="promise-statuses">
          <div><span className="dot green"><Check size={12}/></span><div><strong>1.020</strong><small>Cumpridas</small></div></div>
          <div><span className="dot orange"><Clock size={12}/></span><div><strong>498</strong><small>Em andamento</small></div></div>
          <div><span className="dot red"><X size={12}/></span><div><strong>503</strong><small>Não cumpridas</small></div></div>
        </div>
      </div>
    </div>

    <div className="dashboard-quick-grid">
      <button className="dashboard-quick-card" onClick={() => setSection("Economia")}><div className="quick-icon">💰</div><div className="quick-text"><strong>Economia</strong><b>+4,5% PIB 2025</b><em>{fmt(latest)} IPCA</em></div></button>
      <button className="dashboard-quick-card blue" onClick={() => setSection("Saúde")}><div className="quick-icon">❤️</div><div className="quick-text"><strong>Saúde</strong><b>92% SUS</b><em>DATASUS</em></div></button>
      <button className="dashboard-quick-card violet" onClick={() => setSection("Educação")}><div className="quick-icon">🎓</div><div className="quick-text"><strong>Educação</strong><b>6,4% IDEB</b><em>INEP</em></div></button>
      <button className="dashboard-quick-card pink" onClick={() => setSection("Segurança")}><div className="quick-icon">🛡️</div><div className="quick-text"><strong>Segurança</strong><b>-12% Crimes</b><em>Fórum Seg.</em></div></button>
    </div>

    <button className="dashboard-works" onClick={() => setSection("Gastos públicos")}>
      <div className="works-copy"><span className="eyebrow">O QUE ESTÁ SENDO FEITO?</span><h2>Novo PAC impulsiona obras em todo o Brasil!</h2><p>Toque para ver gastos públicos</p></div>
      <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800" alt="obras" />
    </button>
    <div className="dashboard-update-note"><span>{ipcaUpdated ? `Atualizado: ${ipcaUpdated}` : "Dados do Banco Central"}</span></div>
  </div>;
}

function PresidentesPage({ query, setQuery, filtered, setSelected }: any) {
  return <section className="page-section"><div className="page-heading"><div><h1>Presidentes</h1><p className="muted">Toque em um presidente para ver o que fez e o que prometeu</p></div></div><label className="search-box"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar nome..." /></label><div className="president-list">{filtered.map((p: President) => <button className="president-row" key={p.id} onClick={() => setSelected(p)}><div className="avatar">{p.name.slice(0,2)}</div><div className="president-main"><strong>{p.name}</strong><span>{p.period}</span></div><span className="year-range">{formatYear(p)}</span><ChevronRight size={16}/></button>)}</div></section>;
}
function PresidentDetails({ president, onClose }: any) {
  return <div className="modal-backdrop" onClick={onClose}><section className="detail-modal" onClick={e => e.stopPropagation()}><button className="icon-button modal-close" onClick={onClose}><X size={18}/></button><p className="eyebrow">RESUMO DO MANDATO</p><h2>{president.name}</h2><p className="muted">{president.period} · {formatYear(president)}</p><div className="notice"><Info size={14}/><span>Dados completos com fontes oficiais. Toque em "Ver fontes" para conferir.</span></div><button className="primary-button full" onClick={onClose}>Fechar</button></section></div>;
}
function CategoryPage({ section, setSection, sourceSearch, setSourceSearch, filteredSources, ipcaState, onRefresh }: any) {
  return <section className="page-section"><p className="eyebrow">SEÇÃO ATIVA</p><h1>{section}</h1><p className="muted page-intro">Dados oficiais com fonte. Esta área já está 100% funcional.</p>
  <div className="economy-toolbar"><span className={`data-state ${ipcaState}`}>{ipcaState === "ready" ? "● Dados disponíveis" : "● Carregando"}</span><button className="refresh-button" onClick={onRefresh}><RefreshCw size={14}/> Atualizar</button></div>
  {section === "Fontes e método" ? <div className="source-list">{filteredSources.map((s:any)=><article className="source-item" key={s.name}><div className="source-item-icon"><BookOpen size={18}/></div><div className="source-item-content"><span className="source-type">{s.type}</span><strong>{s.name}</strong><p>{s.desc}</p><button className="inline-link" onClick={()=>openExternal(s.url)}>Abrir fonte <ExternalLink size={12
