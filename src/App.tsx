import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowUpRight, BookOpen, CheckCircle2, ChevronRight, Database, ExternalLink, Landmark, Menu, Search, Users, X, RefreshCw, Info } from "lucide-react";
import { presidents, type President } from "./data/presidents";

type Section = "Início" | "Mandato atual" | "Presidentes" | "Economia" | "Saúde" | "Educação" | "Segurança" | "Gastos públicos" | "Promessas" | "Fontes e método";
const nav: { label: Section; icon: typeof Landmark }[] = [
  { label: "Início", icon: Activity }, { label: "Mandato atual", icon: CheckCircle2 },
  { label: "Presidentes", icon: Users }, { label: "Fontes e método", icon: BookOpen }
];
const sources = [
  { name: "Biblioteca da Presidência da República", desc: "Biografias e registros oficiais de ex-presidentes.", url: "https://www.biblioteca.presidencia.gov.br/presidencia/ex-presidentes", type: "História" },
  { name: "Arquivo Nacional", desc: "Publicação histórica Os Presidentes e a República.", url: "https://www.gov.br/arquivonacional/pt-br/canais_atendimento/imprensa/noticias/conheca-a-publicacao-os-presidentes-e-a-republica", type: "História" },
  { name: "Banco Central do Brasil — SGS", desc: "Séries temporais econômicas, incluindo IPCA mensal.", url: "https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/12?formato=json", type: "Economia" },
  { name: "IBGE — SIDRA", desc: "Estatísticas oficiais de inflação, população e economia.", url: "https://sidra.ibge.gov.br/", type: "Economia e população" },
  { name: "Portal da Transparência", desc: "Despesas, transferências, convênios e gastos federais.", url: "https://portaldatransparencia.gov.br/", type: "Gastos públicos" },
  { name: "Dados Abertos do Governo Federal", desc: "Catálogo de conjuntos de dados públicos.", url: "https://dados.gov.br/", type: "Dados públicos" },
  { name: "DATASUS", desc: "Informações de saúde pública e sistemas do SUS.", url: "https://datasus.saude.gov.br/", type: "Saúde" },
  { name: "INEP", desc: "Estatísticas e indicadores oficiais da educação brasileira.", url: "https://www.gov.br/inep/pt-br", type: "Educação" },
  { name: "Atlas da Violência — Ipea", desc: "Estudos e séries sobre violência e segurança pública.", url: "https://www.ipea.gov.br/atlasviolencia/", type: "Segurança" },
  { name: "Câmara dos Deputados — legislação", desc: "Constituição, leis e atividade legislativa.", url: "https://www.camara.leg.br/", type: "Legislação" }
];
function formatYear(p: President) { return `${p.start}–${p.end ?? "atual"}`; }
function openExternal(url: string) { window.open(url, "_blank", "noopener,noreferrer"); }
type IpcaRow = { data: string; valor: string };

export default function App() {
  const [section, setSection] = useState<Section>("Início");
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState("Todos os períodos");
  const [selected, setSelected] = useState<President | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ipca, setIpca] = useState<IpcaRow[]>([]);
  const [ipcaState, setIpcaState] = useState<"loading" | "ready" | "error">("loading");
  const [ipcaUpdated, setIpcaUpdated] = useState("");
  const [sourceSearch, setSourceSearch] = useState("");
  const [showOlderPresidents, setShowOlderPresidents] = useState(false);

  async function loadIpca(force = false) {
    const cacheKey = "observabrasil_ipca_cache_v1";
    if (!force) {
      try {
        const cachedRaw = localStorage.getItem(cacheKey);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw) as { savedAt: number; data: IpcaRow[] };
          if (Array.isArray(cached.data) && cached.data.length && Date.now() - cached.savedAt < 24 * 60 * 60 * 1000) {
            setIpca(cached.data);
            setIpcaUpdated(new Date(cached.savedAt).toLocaleString("pt-BR") + " (cache local)");
            setIpcaState("ready");
            return;
          }
        }
      } catch { /* Se o cache estiver indisponível, consulta a fonte normalmente. */ }
    }
    setIpcaState("loading");
    try {
      const response = await fetch("https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/12?formato=json", { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("Falha ao consultar o Banco Central");
      const data = await response.json() as IpcaRow[];
      if (!Array.isArray(data) || !data.length) throw new Error("A fonte não retornou dados");
      setIpca(data);
      const savedAt = Date.now();
      setIpcaUpdated(new Date(savedAt).toLocaleString("pt-BR"));
      setIpcaState("ready");
      try { localStorage.setItem(cacheKey, JSON.stringify({ savedAt, data })); } catch { /* Cache opcional; o indicador continua funcionando sem espaço local. */ }
    } catch { setIpcaState("error"); }
  }
  useEffect(() => { void loadIpca(); }, []);
  useEffect(() => {
    if (!selected) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selected]);

  const filtered = useMemo(() => presidents.filter(p =>
    (showOlderPresidents || Number(p.start) >= 2000 || (p.end && Number(p.end) >= 2000)) &&
    `${p.name} ${p.start} ${p.end ?? ""} ${p.period}`.toLowerCase().includes(query.toLowerCase()) &&
    (period === "Todos os períodos" || p.period === period)
  ), [query, period, showOlderPresidents]);
  const filteredSources = sources.filter(s => `${s.name} ${s.desc} ${s.type}`.toLowerCase().includes(sourceSearch.toLowerCase()));
  function changeSection(label: Section) { setSection(label); setMobileOpen(false); setSelected(null); window.scrollTo({ top: 0, behavior: "smooth" }); }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
      <div className="brand"><div className="brand-mark" aria-hidden="true"><EyeMark/></div><div><strong>ObservaBrasil</strong><span>O poder público sob o olhar de todos</span></div><button className="icon-button mobile-close" onClick={() => setMobileOpen(false)} aria-label="Fechar menu"><X size={19}/></button></div>
      <div className="nav-label">ACOMPANHAMENTO PÚBLICO</div>
      <nav aria-label="Navegação principal">{nav.map(item => { const Icon = item.icon; return <button key={item.label} className={`nav-item ${section === item.label ? "active" : ""}`} onClick={() => changeSection(item.label)} aria-current={section === item.label ? "page" : undefined}><Icon size={18}/><span>{item.label}</span>{section === item.label && <ChevronRight className="nav-chevron" size={16}/>}</button>; })}</nav>
      <div className="sidebar-bottom"><span className="source-dot"/><div><strong>Consulta pública</strong><span>Independente · sem login</span></div></div>
    </aside>
    {mobileOpen && <button className="mobile-scrim" onClick={() => setMobileOpen(false)} aria-label="Fechar menu"/>}
    <main className="main-area">
      <header className="topbar"><button className="icon-button mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Abrir menu"><Menu size={21}/></button><div className="breadcrumb"><span className="breadcrumb-brand">ObservaBrasil</span><span>/</span> {section}</div><div className="top-status"><span className="status-dot"/> Fontes públicas</div></header>
      <div className="content">
        {section === "Início" && <Overview setSection={changeSection} ipca={ipca} ipcaState={ipcaState}/>}
        {section === "Mandato atual" && <CurrentMandate setSection={changeSection}/>}
        {section === "Presidentes" && <section className="page-section"><div className="page-heading"><div><p className="eyebrow">CONSULTA HISTÓRICA</p><h1>Presidentes do Brasil</h1><p className="muted">Mostramos primeiro os presidentes de 2000 em diante. A história anterior fica disponível quando você quiser pesquisar.</p></div><span className="count-pill">{filtered.length} registros</span></div><div className="filters"><label className="search-box"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar nome, ano ou período..." aria-label="Buscar presidentes"/></label><select aria-label="Filtrar por período histórico" value={period} onChange={e => setPeriod(e.target.value)}><option>Todos os períodos</option>{Array.from(new Set(presidents.map(p => p.period))).map(p => <option key={p}>{p}</option>)}</select></div><div className="president-list">{filtered.length ? filtered.map(p => <button className="president-row" key={p.id} onClick={() => setSelected(p)}><div className="avatar">{p.name.split(" ").filter(Boolean).slice(0,2).map(s => s[0]).join("")}</div><div className="president-main"><strong>{p.name}</strong><span>{p.period}{p.note ? " · observação histórica" : ""}</span></div><span className="year-range">{formatYear(p)}</span><ChevronRight size={17} className="row-arrow"/></button>) : <div className="no-results"><Search size={22}/><strong>Nenhum registro encontrado</strong><span>Tente outro nome ou limpe os filtros.</span><button className="secondary-light" onClick={() => {setQuery("");setPeriod("Todos os períodos");}}>Limpar filtros</button></div>}</div><div className="history-toggle"><button className="secondary-light" onClick={() => { setShowOlderPresidents(v => !v); setQuery(""); setPeriod("Todos os períodos"); }}>{showOlderPresidents ? "Mostrar somente presidentes de 2000 em diante" : "Pesquisar presidentes anteriores a 2000"}</button></div><div className="notice"><Info size={16}/><span>Os registros históricos são uma área secundária; o acompanhamento principal está em “Mandato atual”.</span></div></section>}
        {section !== "Início" && section !== "Mandato atual" && section !== "Presidentes" && <CategoryPage section={section} setSection={changeSection} ipca={ipca} ipcaState={ipcaState} ipcaUpdated={ipcaUpdated} onRefresh={() => void loadIpca(true)} sourceSearch={sourceSearch} setSourceSearch={setSourceSearch} filteredSources={filteredSources}/>}
      </div>
      <footer><strong>ObservaBrasil</strong><span>Dados, evidências e contexto — sem torcida política.</span><button className="footer-link" onClick={() => changeSection("Fontes e método")}>Fontes e metodologia</button></footer>
    </main>
    {selected && <div className="modal-backdrop" role="presentation" onClick={() => setSelected(null)}><section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title" onClick={e => e.stopPropagation()}><button className="icon-button modal-close" onClick={() => setSelected(null)} aria-label="Fechar detalhes"><X size={19}/></button><p className="eyebrow">REGISTRO HISTÓRICO</p><h2 id="detail-title">{selected.name}</h2><p className="muted">{selected.period}</p><div className="detail-grid"><div><span>Ano de início</span><strong>{selected.start}</strong></div><div><span>Ano de término</span><strong>{selected.end ?? "Mandato em curso"}</strong></div></div>{selected.note && <p className="notice">{selected.note}</p>}<div className="source-card"><BookOpen size={18}/><div><strong>Referência histórica</strong><p>Consulte a Biblioteca da Presidência e o Arquivo Nacional para verificar a biografia, o contexto e as datas completas deste período.</p><button className="inline-link" onClick={() => openExternal("https://www.biblioteca.presidencia.gov.br/presidencia/ex-presidentes")}>Abrir Biblioteca da Presidência <ExternalLink size={14}/></button></div></div><button className="primary-button full" onClick={() => { setSelected(null); setSection("Fontes e método"); }}>Ver fontes e metodologia <ArrowUpRight size={16}/></button></section></div>}
  </div>;
}
function EyeMark() { return <svg viewBox="0 0 40 40" width="27" height="27" aria-hidden="true"><path d="M3 20C7.2 12.4 13 8.5 20 8.5S32.8 12.4 37 20C32.8 27.6 27 31.5 20 31.5S7.2 27.6 3 20Z" fill="none" stroke="currentColor" strokeWidth="3"/><circle cx="20" cy="20" r="7" fill="currentColor"/><circle cx="22" cy="18" r="2" fill="#f5ce42"/></svg>; }
function Overview({ setSection, ipca, ipcaState }: { setSection: (s: Section) => void; ipca: IpcaRow[]; ipcaState: string }) {
  const latest = ipca[ipca.length - 1];
  return <div className="overview overview-simple">
    <section className="hero hero-simple"><div className="hero-copy"><div className="hero-kicker"><span className="live-dot"/> ACOMPANHAMENTO DO GOVERNO FEDERAL</div><h1>O que o presidente <em>prometeu</em> e o que está fazendo.</h1><p>Veja compromissos, andamento, resultados e fontes — sem precisar procurar em relatórios longos.</p><div className="hero-actions"><button className="primary-button" onClick={() => setSection("Mandato atual")}>Acompanhar mandato <ChevronRight size={17}/></button></div></div><div className="hero-art"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-center"><EyeMark/><span>OBSERVA</span></div><div className="floating-card card-top"><CheckCircle2 size={16}/><span>Compromissos</span><strong>Prometeu × entregou</strong></div><div className="floating-card card-bottom"><Activity size={16}/><span>Progresso</span><strong>Com fonte verificável</strong></div></div></section>
    <section className="mandate-summary"><div><span className="eyebrow">FOCO PRINCIPAL</span><h2>Mandato atual</h2><p>Acompanhe obras, medidas, programas e promessas. Cada percentual deve vir de uma fonte e explicar exatamente o que está sendo medido.</p></div><button className="primary-button" onClick={() => setSection("Mandato atual")}>Ver acompanhamento <ChevronRight size={17}/></button></section>
    <section className="compact-indicator"><div><span className="eyebrow">INDICADOR ECONÔMICO</span><h3>Inflação mensal (IPCA)</h3>{ipcaState === "ready" && latest ? <p className="compact-value"><strong>{Number(latest.valor).toLocaleString("pt-BR", {maximumFractionDigits: 2, minimumFractionDigits: 2})}%</strong><span>{latest.data} · Banco Central</span></p> : <p className="muted">{ipcaState === "loading" ? "Consultando Banco Central…" : "Indicador indisponível no momento."}</p>}</div><button className="secondary-light" onClick={() => setSection("Economia")}>Ver detalhes</button></section>
    <section className="quick-links"><button onClick={() => setSection("Presidentes")}><Users size={18}/><span><strong>Presidentes anteriores</strong><small>Pesquise o histórico quando precisar</small></span><ChevronRight size={17}/></button><button onClick={() => setSection("Fontes e método")}><BookOpen size={18}/><span><strong>Fontes e critérios</strong><small>Confira de onde vem cada número</small></span><ChevronRight size={17}/></button></section>
  </div>;
}
function CurrentMandate({ setSection }: { setSection: (s: Section) => void }) {
  const records = [
    { title: "Obras rodoviárias — metas do PPA", area: "Infraestrutura", progress: 20, label: "Metas de entrega integralmente atingidas", period: "Ano-base 2025", status: "Atenção", url: "https://pesquisa.apps.tcu.gov.br/documento/acordao-completo/transi%25C3%25A7%25C3%25A3o%2520energ%25C3%25A9tica/%2520%2520/DTRELEVANCIA%2520desc%252C%2520NUMACORDAOINT%2520desc/19", source: "Tribunal de Contas da União", note: "Este número mede a proporção de metas de entrega atingidas integralmente — não o percentual físico de cada rodovia construída." },
    { title: "Novo PAC — empreendimentos concluídos", area: "Obras e investimentos", progress: 16.6, label: "Empreendimentos concluídos", period: "Dezembro de 2024", status: "Em andamento", url: "https://www.gov.br/casacivil/pt-br/assuntos/noticias/2025/abril/em-dois-anos-investimentos-do-novo-pac-atingem-53-7-do-previsto-ate-2026", source: "Casa Civil — Governo Federal", note: "Percentual histórico da carteira reportado em dezembro de 2024; não representa a situação atual de cada obra." },
    { title: "Redução de impostos e mudanças tributárias", area: "Impostos", progress: null, label: "Percentual de cumprimento", period: "A verificar", status: "Sem percentual validado", url: "https://www.gov.br/fazenda/pt-br", source: "Ministério da Fazenda", note: "É necessário definir qual promessa específica e conferir a lei e sua entrada em vigor antes de atribuir um percentual." },
    { title: "Reduzir filas e ampliar o atendimento de saúde", area: "Saúde", progress: null, label: "Percentual de cumprimento", period: "A verificar", status: "Sem percentual validado", url: "https://datasus.saude.gov.br/", source: "DATASUS / Ministério da Saúde", note: "O percentual só deve ser calculado após escolher uma meta, uma linha de base e um indicador oficial comparável." }
  ];
  const measured = records.filter(r => r.progress !== null);
  return <section className="page-section current-mandate-page"><div className="page-heading"><div><p className="eyebrow">PAINEL PRINCIPAL · GOVERNO FEDERAL</p><h1>Mandato atual</h1><p className="muted">Presidente em exercício: Luiz Inácio Lula da Silva · mandato 2023–2026. O que está sendo feito, o que avançou e o que ainda precisa ser comprovado.</p></div><span className="count-pill">{records.length} acompanhamentos</span></div>
    <div className="mandate-stats"><div><span>Itens no painel</span><strong>{records.length}</strong></div><div><span>Com métrica publicada</span><strong>{measured.length}</strong></div><div><span>Aguardando validação</span><strong>{records.length-measured.length}</strong></div></div>
    <div className="commitment-list">{records.map((r) => <article className="commitment-card" key={r.title}><div className="commitment-top"><span className="commitment-area">{r.area}</span><span className={`commitment-status ${r.progress === null ? "status-pending" : r.progress >= 100 ? "status-done" : "status-progress"}`}>{r.status}</span></div><h2>{r.title}</h2><div className="commitment-progress">{r.progress !== null ? <><div className="progress-number">{r.progress.toLocaleString("pt-BR", {maximumFractionDigits:1})}%</div><div className="progress-track" role="progressbar" aria-valuenow={r.progress} aria-valuemin={0} aria-valuemax={100}><span style={{width:`${r.progress}%`}}/></div></> : <div className="progress-unverified">Percentual ainda não validado</div>}</div><p className="commitment-label">{r.label} · {r.period}</p><p className="commitment-note">{r.note}</p><div className="commitment-foot"><span>Fonte: {r.source}</span><button className="inline-link" onClick={() => openExternal(r.url)}>Ver evidência <ExternalLink size={14}/></button></div></article>)}</div>
    <div className="notice"><Info size={16}/><span>Os percentuais não são notas subjetivas do presidente: cada um mede uma coisa diferente e aparece junto do período e da fonte. Quando a fonte não permite calcular um percentual confiável, o painel deixa isso explícito em vez de inventar um número.</span></div>
    <div className="mandate-next"><div><strong>Quer pesquisar outro governo?</strong><p>O histórico fica separado para não poluir a tela inicial.</p></div><button className="secondary-light" onClick={() => setSection("Presidentes")}>Abrir histórico de presidentes <ChevronRight size={16}/></button></div>
  </section>;
}
function CategoryPage({ section, setSection, ipca, ipcaState, ipcaUpdated, onRefresh, sourceSearch, setSourceSearch, filteredSources }: { section: Section; setSection: (s: Section) => void; ipca: IpcaRow[]; ipcaState: string; ipcaUpdated: string; onRefresh: () => void; sourceSearch: string; setSourceSearch: (v: string) => void; filteredSources: typeof sources }) {
  const descriptions: Record<string,string> = {"Economia":"Inflação, atividade econômica, emprego, renda e poder de compra.","Saúde":"Indicadores de saúde, acesso a serviços, mortalidade e dados do SUS.","Educação":"Acesso, permanência, alfabetização e indicadores de aprendizagem.","Segurança":"Indicadores de violência e segurança, respeitando diferenças entre fontes.","Gastos públicos":"Orçamento aprovado, despesas executadas, contratos e transferências.","Promessas":"Compromissos documentados, prazos, evidências e situação de execução.","Fontes e método":"Fontes consultadas, critérios de análise e limites dos dados."};
  if (section === "Fontes e método") return <section className="page-section"><p className="eyebrow">TRANSPARÊNCIA E CRITÉRIOS</p><h1>Fontes e metodologia</h1><p className="muted page-intro">A informação deve poder ser conferida. Use a busca para encontrar as fontes oficiais que sustentam cada área.</p><label className="search-box source-search"><Search size={17}/><input value={sourceSearch} onChange={e => setSourceSearch(e.target.value)} placeholder="Buscar por tema ou órgão..." aria-label="Buscar fontes"/></label><div className="source-list">{filteredSources.map(s => <article className="source-item" key={s.name}><div className="source-item-icon"><BookOpen size={18}/></div><div className="source-item-content"><span className="source-type">{s.type}</span><strong>{s.name}</strong><p>{s.desc}</p><button className="inline-link" onClick={() => openExternal(s.url)}>Abrir fonte oficial <ExternalLink size={14}/></button></div></article>)}{!filteredSources.length && <div className="no-results"><strong>Nenhuma fonte encontrada</strong><button className="secondary-light" onClick={() => setSourceSearch("")}>Limpar busca</button></div>}</div><div className="method-list">{[["1","Fonte e data visíveis","Toda informação publicada deve apontar para a fonte original, o período de referência e a data de consulta."],["2","Separar promessa de resultado","Anúncio, aprovação legal, execução orçamentária e impacto são etapas diferentes."],["3","Comparação justa","Comparar períodos equivalentes, explicar mudanças metodológicas e ajustar valores monetários quando necessário."],["4","Causalidade com cautela","A evolução de um indicador não deve ser atribuída automaticamente ao governante."],["5","Incerteza explícita","Dados ausentes, atrasados ou divergentes precisam ser sinalizados; a IA nunca deve inventar lacunas."],["6","Atualização verificável","A versão inicial não mantém ainda um histórico automatizado de alterações; isso deverá ser implementado antes de avaliações públicas completas."]].map(([n,t,d]) => <div className="method-row" key={n}><span>{n}</span><div><strong>{t}</strong><p>{d}</p></div></div>)}</div></section>;
  if (section === "Economia") { const latest = ipca[ipca.length - 1]; return <section className="page-section"><p className="eyebrow">INDICADORES COM FONTE PÚBLICA</p><h1>Economia</h1><p className="muted page-intro">Inflação, atividade econômica, emprego e renda. Os indicadores precisam ser interpretados no contexto do período e não explicam, isoladamente, as causas das mudanças.</p><div className="indicator-card"><div className="indicator-card-top"><div><span className="source-type">BANCO CENTRAL · SGS 433</span><h2>IPCA — variação mensal</h2><p>Índice Nacional de Preços ao Consumidor Amplo.</p></div><button className="refresh-button" onClick={onRefresh} disabled={ipcaState === "loading"}><RefreshCw size={15} className={ipcaState === "loading" ? "spin" : ""}/> Atualizar</button></div>{ipcaState === "ready" && latest ? <div className="indicator-value"><strong>{Number(latest.valor).toLocaleString("pt-BR", {maximumFractionDigits:2, minimumFractionDigits:2})}%</strong><span>Último período retornado: {latest.data}</span></div> : <p className="data-message">{ipcaState === "loading" ? "Carregando série oficial…" : "Não foi possível consultar a série agora. Tente atualizar ou abra a fonte."}</p>}<div className="ipca-history"><strong>Últimos valores mensais disponíveis</strong>{ipca.slice(-6).reverse().map(r => <div className="ipca-row" key={r.data}><span>{r.data}</span><strong>{Number(r.valor).toLocaleString("pt-BR", {maximumFractionDigits:2, minimumFractionDigits:2})}%</strong></div>)}</div><div className="live-panel-foot"><span>{ipcaUpdated ? `Consultado em ${ipcaUpdated}` : "Os dados são consultados ao abrir a página."}</span><button className="inline-link" onClick={() => openExternal("https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/12?formato=json")}>Ver série original <ExternalLink size={14}/></button></div></div><div className="notice"><Info size={16}/><span>O IPCA mede variação de preços; não representa sozinho custo de vida de cada família nem comprova efeito de uma política governamental.</span></div></section>; }
  const relevant = section === "Saúde" ? ["DATASUS", "IBGE"] : section === "Educação" ? ["INEP", "Dados Abertos"] : section === "Segurança" ? ["Atlas da Violência", "Dados Abertos"] : section === "Gastos públicos" ? ["Portal da Transparência", "Dados Abertos"] : ["Câmara dos Deputados", "Dados Abertos"];
  const relevantSources = sources.filter(s => relevant.some(r => s.name.includes(r)));
  return <section className="page-section"><p className="eyebrow">DADOS, DOCUMENTOS E CONTEXTO</p><h1>{section}</h1><p className="muted page-intro">{descriptions[section]}</p><div className="empty-state"><div className="empty-icon"><Database size={25}/></div><h3>Fontes oficiais para consulta</h3><p>Esta área não exibe números sem validação. Abaixo estão as fontes públicas para começar a consultar dados reais; a integração automatizada e a comparação histórica desta categoria ainda precisam ser desenvolvidas.</p><div className="relevant-sources">{relevantSources.map(s => <button className="source-link-card" key={s.name} onClick={() => openExternal(s.url)}><span><strong>{s.name}</strong><small>{s.desc}</small></span><ExternalLink size={16}/></button>)}</div><button className="primary-button" onClick={() => {setSourceSearch(""); setSection("Fontes e método");}}>Consultar catálogo completo <ArrowUpRight size={16}/></button></div><div className="notice"><Info size={16}/><span>Não há estatísticas fictícias nesta tela. As próximas etapas são escolher indicadores específicos, registrar suas unidades e datas, integrar as fontes e testar os resultados antes da publicação.</span></div></section>;
}
