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

type MandateRecord = { title: string; detail: string; category: "Ação documentada" | "Promessa / compromisso" | "Pendência"; status: "Realizado" | "Em andamento" | "Em apuração" | "Não comprovado"; source: string; url: string; period?: string };
const mandateRecords: Record<string, MandateRecord[]> = {
  "fhc-2": [
    { title: "Continuidade da estabilização monetária", detail: "O governo manteve a política de estabilização iniciada com o Plano Real e adotou medidas econômicas durante o segundo mandato.", category: "Ação documentada", status: "Realizado", source: "Biblioteca da Presidência", url: "https://www.gov.br/secretariageral/pt-br/centrais-de-conteudo/biblioteca-da-pr/galeria-dos-ex-presidentes/fernando-henrique-cardoso/biografia-completa-fernando-henrique-cardoso/", period: "1999–2002" },
    { title: "Reformas administrativa e previdenciária", detail: "Foram propostas e debatidas reformas, mas cada medida precisa ser verificada separadamente para determinar o que foi aprovado e implementado.", category: "Promessa / compromisso", status: "Em apuração", source: "Biblioteca da Presidência", url: "https://www.gov.br/secretariageral/pt-br/centrais-de-conteudo/biblioteca-da-pr/galeria-dos-ex-presidentes/fernando-henrique-cardoso/biografia-completa-fernando-henrique-cardoso/", period: "1999–2002" }
  ],
  "lula-1": [
    { title: "Criação do Bolsa Família", detail: "O programa foi criado em 2003 por medida provisória e convertido em lei em janeiro de 2004.", category: "Ação documentada", status: "Realizado", source: "Ministério do Desenvolvimento Social", url: "https://www.gov.br/mds/pt-br/noticias-e-conteudos/desenvolvimento-social/noticias-desenvolvimento-social/reconstrucao-e-dignidade-ao-povo-brasileiro-governo-federal-celebra-os-20-anos-do-programa-bolsa-familia/", period: "2003–2006" },
    { title: "Compromissos do plano de governo", detail: "O catálogo de promessas eleitorais deste mandato ainda precisa ser comparado item por item com os resultados e documentos oficiais.", category: "Promessa / compromisso", status: "Em apuração", source: "Arquivo Nacional", url: "https://presidentes.an.gov.br/index.php/centro-de-referencia-de-acervos-presidenciais/assuntos/biografias/204-luiz-inacio-lula-da-silva", period: "2003–2006" }
  ],
  "lula-2": [
    { title: "Programa de Aceleração do Crescimento (PAC)", detail: "O PAC foi lançado em 2007 para apoiar investimentos em infraestrutura, incluindo energia, transporte, habitação e saneamento. O lançamento do programa não significa que todas as obras previstas foram concluídas.", category: "Ação documentada", status: "Realizado", source: "Arquivo Nacional", url: "https://presidentes.an.gov.br/index.php/centro-de-referencia-de-acervos-presidenciais/assuntos/biografias/204-luiz-inacio-lula-da-silva", period: "2007–2010" },
    { title: "Execução das obras previstas no PAC", detail: "Para classificar cada obra como concluída ou não concluída, é necessário consultar o empreendimento individual, seu cronograma e a prestação de contas correspondente.", category: "Pendência", status: "Em apuração", source: "Arquivo Nacional", url: "https://presidentes.an.gov.br/index.php/centro-de-referencia-de-acervos-presidenciais/assuntos/biografias/204-luiz-inacio-lula-da-silva", period: "2007–2010" }
  ],
  "dilma-1": [
    { title: "Ações e programas do primeiro mandato", detail: "O registro de ações está sendo estruturado a partir de documentos oficiais. Esta versão ainda não possui uma lista completa de promessas eleitorais verificadas para o período.", category: "Ação documentada", status: "Em apuração", source: "Arquivo Nacional — acervos presidenciais", url: "https://presidentes.an.gov.br/", period: "2011–2014" },
    { title: "Promessas eleitorais e metas", detail: "Ainda é necessário cadastrar cada promessa, prazo e evidência de cumprimento para classificar o resultado com segurança.", category: "Promessa / compromisso", status: "Em apuração", source: "Arquivo Nacional — acervos presidenciais", url: "https://presidentes.an.gov.br/", period: "2011–2014" }
  ],
  "dilma-2": [
    { title: "Mandato interrompido em 2016", detail: "O segundo mandato terminou antes do prazo previsto. Por isso, compromissos precisam ser avaliados considerando o período efetivo de governo e o contexto institucional.", category: "Ação documentada", status: "Realizado", source: "Arquivo Nacional — acervos presidenciais", url: "https://presidentes.an.gov.br/", period: "2015–2016" },
    { title: "Promessas não concluídas no período", detail: "Não é correto marcar uma promessa como descumprida sem identificar o compromisso, o prazo, as medidas adotadas e o efeito da interrupção do mandato.", category: "Pendência", status: "Em apuração", source: "Arquivo Nacional — acervos presidenciais", url: "https://presidentes.an.gov.br/", period: "2015–2016" }
  ],
  "temer": [
    { title: "Reforma trabalhista", detail: "A reforma foi aprovada pelo Congresso e sancionada em julho de 2017, alterando dispositivos da legislação trabalhista.", category: "Ação documentada", status: "Realizado", source: "Agência Senado", url: "https://www12.senado.leg.br/noticias/materias/2017/07/13/sancionada-a-reforma-trabalhista", period: "2016–2018" },
    { title: "Promessa de geração de empregos", detail: "A aprovação da reforma é verificável; já o efeito sobre a geração de empregos precisa ser medido com indicadores e não pode ser presumido apenas pela aprovação da lei.", category: "Promessa / compromisso", status: "Em apuração", source: "Agência Senado", url: "https://www12.senado.leg.br/noticias/materias/2017/07/13/sancionada-a-reforma-trabalhista", period: "2016–2018" }
  ],
  "bolsonaro": [
    { title: "Criação do Auxílio Brasil", detail: "O governo encaminhou a proposta em 2021 para unificar benefícios sociais; a situação e os resultados do programa devem ser analisados no período em que vigorou.", category: "Ação documentada", status: "Realizado", source: "Ministério do Desenvolvimento Social", url: "https://www.gov.br/mds/pt-br/noticias-e-conteudos/original/desenvolvimento-social/privados/2021/governo-federal-cria-o-programa-auxilio-brasil-para-unificar-politicas-sociais", period: "2019–2022" },
    { title: "Compromissos do plano de governo", detail: "A lista completa de promessas precisa ser conferida com o plano eleitoral e com evidências de execução. Ausência de registro nesta versão não significa descumprimento.", category: "Promessa / compromisso", status: "Em apuração", source: "Portal de dados públicos", url: "https://dados.gov.br/", period: "2019–2022" }
  ],
  "lula-3": [
    { title: "Retomada do Bolsa Família", detail: "A Medida Provisória nº 1.164/2023 foi convertida na Lei nº 14.601/2023, que instituiu o programa Bolsa Família nesta gestão.", category: "Ação documentada", status: "Realizado", source: "Legislação da Presidência da República", url: "https://legislacao.presidencia.gov.br/atos/?ano=2023&ato=fa7cXW610MZpWT573&numero=14601&tipo=LEI", period: "2023–atual" },
    { title: "Obras e metas do Novo PAC", detail: "O andamento precisa ser acompanhado por empreendimento e por etapa. Um percentual geral da carteira não representa o progresso físico de cada rodovia, escola ou hospital.", category: "Pendência", status: "Em apuração", source: "Casa Civil — Novo PAC", url: "https://www.gov.br/casacivil/pt-br/assuntos/novopac", period: "2023–atual" },
    { title: "Promessas eleitorais ainda sem ficha individual", detail: "A lista completa de compromissos e prazos deve ser confrontada com o plano de governo e com documentos de execução antes de publicar percentuais de cumprimento.", category: "Promessa / compromisso", status: "Em apuração", source: "Tribunal Superior Eleitoral", url: "https://divulgacandcontas.tse.jus.br/", period: "2023–atual" }
  ]
};
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
    {selected && <PresidentDetails president={selected} onClose={() => setSelected(null)} onSources={() => { setSelected(null); setSection("Fontes e método"); }}/>}
  </div>;
}
function PresidentDetails({ president, onClose, onSources }: { president: President; onClose: () => void; onSources: () => void }) {
  const records = mandateRecords[president.id] ?? [];
  const actions = records.filter(r => r.category === "Ação documentada");
  const promises = records.filter(r => r.category === "Promessa / compromisso");
  const pending = records.filter(r => r.category === "Pendência");
  const statusClass = (status: MandateRecord["status"]) => status === "Realizado" ? "record-status record-done" : status === "Em andamento" ? "record-status record-progress" : "record-status record-pending";
  const renderRecords = (items: MandateRecord[], emptyText: string) => items.length ? <div className="mandate-record-list">{items.map((r, i) => <article className="mandate-record" key={`${r.title}-${i}`}><div className="mandate-record-head"><span className="record-category">{r.category}</span><span className={statusClass(r.status)}>{r.status}</span></div><h3>{r.title}</h3><p>{r.detail}</p>{r.period && <small className="record-period">Período: {r.period}</small>}<div className="record-source"><span>Fonte: {r.source}</span><button className="inline-link" onClick={() => openExternal(r.url)}>Conferir <ExternalLink size={13}/></button></div></article>)}</div> : <div className="record-empty"><strong>Registro ainda não cadastrado</strong><p>{emptyText}</p></div>;
  return <div className="modal-backdrop" role="presentation" onClick={onClose}><section className="detail-modal president-detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title" onClick={e => e.stopPropagation()}><button className="icon-button modal-close" onClick={onClose} aria-label="Fechar detalhes"><X size={19}/></button><p className="eyebrow">RESUMO DO MANDATO</p><h2 id="detail-title">{president.name}</h2><p className="muted">{president.period} · {formatYear(president)}</p><div className="detail-grid"><div><span>Início</span><strong>{president.start}</strong></div><div><span>Fim</span><strong>{president.end ?? "Em andamento"}</strong></div></div>{president.note && <div className="notice"><Info size={15}/><span>{president.note}</span></div>}
    <div className="mandate-detail-summary"><div><strong>{actions.length}</strong><span>Ações cadastradas</span></div><div><strong>{promises.length}</strong><span>Promessas em catálogo</span></div><div><strong>{pending.length + promises.filter(r => r.status === "Em apuração").length}</strong><span>Em apuração</span></div></div>
    <section className="detail-group"><div className="detail-group-title"><CheckCircle2 size={18}/><div><h3>O que fez</h3><p>Ações documentadas em fontes públicas</p></div></div>{renderRecords(actions, "Ainda não há ações verificadas cadastradas para este período. Isso não significa que o presidente não tenha realizado ações; significa que o catálogo precisa ser pesquisado e preenchido.")}</section>
    <section className="detail-group"><div className="detail-group-title"><BookOpen size={18}/><div><h3>O que prometeu</h3><p>Compromissos e propostas de governo</p></div></div>{renderRecords(promises, "As promessas deste mandato ainda precisam ser transcritas do plano de governo e comparadas com evidências de execução. Não atribuímos percentual sem essa verificação.")}</section>
    <section className="detail-group"><div className="detail-group-title"><Info size={18}/><div><h3>Não cumprido ou pendente</h3><p>Itens que precisam de comprovação</p></div></div>{renderRecords(pending, "Não há pendências individualizadas suficientes para afirmar que uma promessa foi descumprida. Para isso, precisamos registrar a promessa original, o prazo e a evidência disponível.")}</section>
    <div className="notice"><Info size={16}/><span>Os registros desta versão são iniciais, não um levantamento completo de todas as promessas. “Em apuração” significa que ainda não há evidência suficiente para dar um veredito ou calcular um percentual.</span></div><div className="source-card"><BookOpen size={18}/><div><strong>Consultar registros oficiais</strong><p>Compare os documentos do governo, os planos eleitorais e as fontes de fiscalização antes de concluir se uma promessa foi cumprida.</p><button className="inline-link" onClick={() => openExternal("https://presidentes.an.gov.br/")}>Abrir Arquivo Nacional <ExternalLink size={14}/></button></div></div><button className="primary-button full" onClick={onSources}>Ver fontes e metodologia <ArrowUpRight size={16}/></button>
  </section></div>;
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
