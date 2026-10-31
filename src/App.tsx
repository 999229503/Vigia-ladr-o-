import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowUpRight, BookOpen, CheckCircle2, ChevronRight, Database, ExternalLink, Landmark, Search, Users, X, RefreshCw, Info } from "lucide-react";
import { presidents, type President } from "./data/presidents";

type Section = "Início" | "Mandato atual" | "Presidentes" | "Economia" | "Tributos" | "Saúde" | "Educação" | "Segurança" | "Gastos públicos" | "Promessas" | "Fontes e método";
const nav: { label: Section; icon: typeof Landmark }[] = [
  { label: "Início", icon: Activity }, { label: "Mandato atual", icon: CheckCircle2 },
  { label: "Presidentes", icon: Users }, { label: "Economia", icon: Activity }, { label: "Tributos", icon: Database }, { label: "Saúde", icon: CheckCircle2 }, { label: "Educação", icon: BookOpen }, { label: "Segurança", icon: Landmark }, { label: "Gastos públicos", icon: Database }, { label: "Promessas", icon: CheckCircle2 }, { label: "Fontes e método", icon: BookOpen }
];
const sources = [
  { name: "Biblioteca da Presidência da República", desc: "Biografias e registros oficiais de ex-presidentes.", url: "https://www.biblioteca.presidencia.gov.br/presidencia/ex-presidentes", type: "História" },
  { name: "Arquivo Nacional", desc: "Publicação histórica Os Presidentes e a República.", url: "https://www.gov.br/arquivonacional/pt-br/canais_atendimento/imprensa/noticias/conheca-a-publicacao-os-presidentes-e-a-republica", type: "História" },
  { name: "Banco Central do Brasil — SGS", desc: "Séries temporais econômicas, incluindo IPCA mensal.", url: "https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/12?formato=json", type: "Economia" },
  { name: "IBGE — SIDRA", desc: "Estatísticas oficiais de inflação, população e economia.", url: "https://sidra.ibge.gov.br/", type: "Economia e população" },
  { name: "Tesouro Nacional — Carga Tributária do Governo Geral", desc: "Série anual da carga tributária como proporção do PIB, por esfera de governo.", url: "https://www.tesourotransparente.gov.br/publicacoes/carga-tributaria-do-governo-geral/2025/114", type: "Tributos" },
  { name: "Receita Federal — Carga Tributária", desc: "Estudos oficiais e tabelas da carga tributária brasileira.", url: "https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/estudos/carga-tributaria", type: "Tributos" },
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
  const [ipca, setIpca] = useState<IpcaRow[]>([]);
  const [foodIpca, setFoodIpca] = useState<IpcaRow[]>([]);
  const [ipca12m, setIpca12m] = useState<IpcaRow[]>([]);
  const [ipcaState, setIpcaState] = useState<"loading" | "ready" | "error">("loading");
  const [ipcaUpdated, setIpcaUpdated] = useState("");
  const [sourceSearch, setSourceSearch] = useState("");
  const [showOlderPresidents, setShowOlderPresidents] = useState(false);

  async function loadIpca() {
    setIpcaState("loading");
    try {
      const series = await Promise.all([
        fetch("https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/24?formato=json").then(r => { if (!r.ok) throw new Error("IPCA indisponível"); return r.json() as Promise<IpcaRow[]>; }),
        fetch("https://api.bcb.gov.br/dados/serie/bcdata.sgs.1635/dados/ultimos/24?formato=json").then(r => { if (!r.ok) throw new Error("IPCA alimentação indisponível"); return r.json() as Promise<IpcaRow[]>; }),
        fetch("https://api.bcb.gov.br/dados/serie/bcdata.sgs.13522/dados/ultimos/24?formato=json").then(r => { if (!r.ok) throw new Error("IPCA 12 meses indisponível"); return r.json() as Promise<IpcaRow[]>; })
      ]);
      if (!series[0].length) throw new Error("A fonte não retornou dados");
      setIpca(series[0]); setFoodIpca(series[1]); setIpca12m(series[2]);
      const savedAt = Date.now();
      setIpcaUpdated(new Date(savedAt).toLocaleString("pt-BR"));
      setIpcaState("ready");
      try { localStorage.setItem("observabrasil_indicadores_v2", JSON.stringify({ savedAt, ipca: series[0], food: series[1], ipca12m: series[2] })); } catch { /* cache é opcional */ }
    } catch {
      try {
        const cached = localStorage.getItem("observabrasil_indicadores_v2");
        if (cached) { const data = JSON.parse(cached); setIpca(data.ipca || []); setFoodIpca(data.food || []); setIpca12m(data.ipca12m || []); setIpcaUpdated(data.savedAt ? `última consulta em ${new Date(data.savedAt).toLocaleString("pt-BR")} · sem conexão` : "dados salvos anteriormente; atualização indisponível"); setIpcaState("ready"); return; }
      } catch { /* cache inválido */ }
      setIpcaState("error");
    }
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
  function changeSection(label: Section) { setSection(label); setSelected(null); window.scrollTo({ top: 0, behavior: "smooth" }); }

  return <div className="app-shell">
    <header className="site-header">
      <div className="site-header-inner">
        <button className="brand brand-home" onClick={() => changeSection("Início")} aria-label="Ir para o início">
          <span className="brand-mark" aria-hidden="true"><Landmark size={25}/></span>
          <span className="brand-copy"><strong>Observa Brasil</strong><small>Transparência pública, sem torcida</small></span>
        </button>
        <div className="header-status"><span className="status-dot"/> Consulta pública <span className="header-status-divider"/> Sem login</div>
      </div>
      <nav className="top-navigation" aria-label="Navegação principal">
        {nav.map(item => { const Icon = item.icon; return <button key={item.label} className={`nav-item ${section === item.label ? "active" : ""}`} onClick={() => changeSection(item.label)} aria-current={section === item.label ? "page" : undefined}><Icon size={16}/><span>{item.label}</span></button>; })}
      </nav>
    </header>
    <main className="main-area">
      <header className="topbar"><div className="breadcrumb"><span className="breadcrumb-brand">Observa Brasil</span><span>/</span> {section}</div><div className="top-status"><span className="status-dot"/> Fontes públicas</div></header>
      <div className="content">
        {section === "Início" && <Overview setSection={changeSection} ipca={ipca} foodIpca={foodIpca} ipca12m={ipca12m} ipcaState={ipcaState}/>}
        {section === "Mandato atual" && <CurrentMandate setSection={changeSection}/>}
        {section === "Presidentes" && <section className="page-section"><div className="page-heading"><div><p className="eyebrow">CONSULTA HISTÓRICA</p><h1>Presidentes do Brasil</h1><p className="muted">Mostramos primeiro os presidentes de 2000 em diante. A história anterior fica disponível quando você quiser pesquisar.</p></div><span className="count-pill">{filtered.length} registros</span></div><div className="filters"><label className="search-box"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar nome, ano ou período..." aria-label="Buscar presidentes"/></label><select aria-label="Filtrar por período histórico" value={period} onChange={e => setPeriod(e.target.value)}><option>Todos os períodos</option>{Array.from(new Set(presidents.map(p => p.period))).map(p => <option key={p}>{p}</option>)}</select></div><div className="president-list">{filtered.length ? filtered.map(p => <button className="president-row" key={p.id} onClick={() => setSelected(p)}><div className="avatar">{p.name.split(" ").filter(Boolean).slice(0,2).map(s => s[0]).join("")}</div><div className="president-main"><strong>{p.name}</strong><span>{p.period}{p.note ? " · observação histórica" : ""}</span></div><span className="year-range">{formatYear(p)}</span><ChevronRight size={17} className="row-arrow"/></button>) : <div className="no-results"><Search size={22}/><strong>Nenhum registro encontrado</strong><span>Tente outro nome ou limpe os filtros.</span><button className="secondary-light" onClick={() => {setQuery("");setPeriod("Todos os períodos");}}>Limpar filtros</button></div>}</div><div className="history-toggle"><button className="secondary-light" onClick={() => { setShowOlderPresidents(v => !v); setQuery(""); setPeriod("Todos os períodos"); }}>{showOlderPresidents ? "Mostrar somente presidentes de 2000 em diante" : "Pesquisar presidentes anteriores a 2000"}</button></div><div className="notice"><Info size={16}/><span>Os registros históricos são uma área secundária; o acompanhamento principal está em “Mandato atual”.</span></div></section>}
        {section !== "Início" && section !== "Mandato atual" && section !== "Presidentes" && <CategoryPage section={section} setSection={changeSection} ipca={ipca} foodIpca={foodIpca} ipca12m={ipca12m} ipcaState={ipcaState} ipcaUpdated={ipcaUpdated} onRefresh={() => void loadIpca()} sourceSearch={sourceSearch} setSourceSearch={setSourceSearch} filteredSources={filteredSources}/>}
      </div>
      <footer><strong>Observa Brasil</strong><span>Dados, evidências e contexto — sem torcida política.</span><button className="footer-link" onClick={() => changeSection("Fontes e método")}>Fontes e metodologia</button></footer>
    </main>
    {selected && <PresidentDetails president={selected} onClose={() => setSelected(null)} onSources={() => { setSelected(null); setSection("Fontes e método"); }} />}
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

function Overview({ setSection, ipca, foodIpca, ipca12m, ipcaState }: { setSection: (s: Section) => void; ipca: IpcaRow[]; foodIpca: IpcaRow[]; ipca12m: IpcaRow[]; ipcaState: string }) {
  const latest = ipca[ipca.length - 1];
  const food = foodIpca[foodIpca.length - 1];
  const annual = ipca12m[ipca12m.length - 1];
  return <div className="overview overview-simple">
    <section className="hero hero-simple"><div className="hero-copy"><div className="hero-kicker"><span className="live-dot"/> ACOMPANHAMENTO DO GOVERNO FEDERAL</div><h1>O que o presidente <em>prometeu</em> e o que está fazendo.</h1><p>Veja compromissos, andamento, resultados e fontes — sem precisar procurar em relatórios longos.</p><div className="hero-actions"><button className="primary-button" onClick={() => setSection("Mandato atual")}>Acompanhar mandato <ChevronRight size={17}/></button></div></div><div className="hero-art"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-center"><Landmark size={27}/><span>OBSERVA</span></div><div className="floating-card card-top"><CheckCircle2 size={16}/><span>Compromissos</span><strong>Prometeu × entregou</strong></div><div className="floating-card card-bottom"><Activity size={16}/><span>Progresso</span><strong>Com fonte verificável</strong></div></div></section>
    <section className="mandate-summary"><div><span className="eyebrow">FOCO PRINCIPAL</span><h2>Mandato atual</h2><p>Acompanhe obras, medidas, programas e promessas. Cada percentual deve vir de uma fonte e explicar exatamente o que está sendo medido.</p></div><button className="primary-button" onClick={() => setSection("Mandato atual")}>Ver acompanhamento <ChevronRight size={17}/></button></section>
    <section className="live-indicators">
      <div className="section-title"><div><p className="eyebrow">NÚMEROS COM FONTE OFICIAL</p><h2>Como estão os indicadores?</h2><p className="muted">Valores publicados pelas instituições responsáveis, com período de referência.</p></div><button className="text-button" onClick={() => setSection("Economia")}>Ver painel completo <ChevronRight size={15}/></button></div>
      <div className="indicator-grid-home">
        <article className="home-indicator"><span>Inflação geral · mensal</span><strong>{ipcaState === "ready" && latest ? `${Number(latest.valor).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}%` : "—"}</strong><small>{latest?.data || "Aguardando Banco Central"}</small></article>
        <article className="home-indicator"><span>Alimentação e bebidas · mensal</span><strong>{food ? `${Number(food.valor).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}%` : "—"}</strong><small>{food?.data || "Aguardando Banco Central"}</small></article>
        <article className="home-indicator"><span>IPCA acumulado · 12 meses</span><strong>{annual ? `${Number(annual.valor).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}%` : "—"}</strong><small>{annual?.data || "Aguardando Banco Central"}</small></article>
        <article className="home-indicator"><span>Salário mínimo nacional · 2026</span><strong>R$ 1.621</strong><small>Reajuste nominal de 6,79% · Decreto 12.797/2025</small></article>
        <article className="home-indicator"><span>Carga tributária bruta · 2025</span><strong>32,40%</strong><small>Do PIB · Tesouro Nacional · dado anual</small></article>
      </div>
      <p className="indicator-footnote">Os dados de inflação são consultados automaticamente no Banco Central. Salário mínimo e carga tributária são anuais e exibem o último valor oficial identificado, com seu ano de referência. Não são comparáveis entre si.</p>
    </section>
    <section className="service-tiles"><div className="section-title"><div><p className="eyebrow">ACOMPANHAMENTO POR ÁREA</p><h2>Serviços e informações</h2></div></div><div className="service-grid">
      <button onClick={() => setSection("Saúde")}><img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80" alt="Profissional de saúde"/><b>Saúde</b></button>
      <button onClick={() => setSection("Educação")}><img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80" alt="Educação"/><b>Educação</b></button>
      <button onClick={() => setSection("Segurança")}><img src="https://images.unsplash.com/photo-1453873531674-2151bcd01707?auto=format&fit=crop&w=600&q=80" alt="Segurança pública"/><b>Segurança</b></button>
      <button onClick={() => setSection("Gastos públicos")}><img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80" alt="Infraestrutura"/><b>Infraestrutura e gastos</b></button>
    </div></section>
    <section className="quick-links"><button onClick={() => setSection("Presidentes")}><Users size={18}/><span><strong>Presidentes anteriores</strong><small>Pesquise o histórico quando precisar</small></span><ChevronRight size={17}/></button><button onClick={() => setSection("Fontes e método")}><BookOpen size={18}/><span><strong>Fontes e critérios</strong><small>Confira de onde vem cada número</small></span><ChevronRight size={17}/></button></section>
  </div>;
}
function CurrentMandate({ setSection }: { setSection: (s: Section) => void }) {
  return <section className="page-section current-mandate-page"><p className="eyebrow">ACOMPANHAMENTO DOCUMENTAL</p><h1>Mandato atual · 2023–2026</h1><p className="muted page-intro">Esta área separa promessas eleitorais, atos oficiais, execução e resultados. Não publicamos um percentual geral de cumprimento sem uma lista completa de compromissos, critérios e evidências individualizadas.</p>
    <div className="mandate-summary"><div><span className="eyebrow">CRITÉRIO DE PUBLICAÇÃO</span><h2>Sem nota inventada</h2><p>Cada promessa deverá ter texto original, prazo, órgão responsável, evidência de execução e regra clara para classificação. Indicadores nacionais serão exibidos separadamente, sem atribuição automática de causalidade.</p></div><button className="primary-button" onClick={() => setSection("Promessas")}>Ver metodologia de promessas <ChevronRight size={16}/></button></div>
    <div className="empty-state"><div className="empty-icon"><BookOpen size={25}/></div><h3>Cadastro de promessas em validação</h3><p>O catálogo completo ainda precisa ser confrontado com o plano de governo registrado no TSE e com documentos de execução. Até concluir essa conferência, não exibimos percentual total.</p><div className="source-pills"><span>TSE</span><span>Diário Oficial</span><span>TCU</span><span>Portal da Transparência</span></div><button className="primary-button" onClick={() => setSection("Fontes e método")}>Ver fontes e critérios <ArrowUpRight size={16}/></button></div>
  </section>;
}
function CategoryPage({ section, setSection, ipca, foodIpca, ipca12m, ipcaState, ipcaUpdated, onRefresh, sourceSearch, setSourceSearch, filteredSources }: { section: Section; setSection: (s: Section) => void; ipca: IpcaRow[]; foodIpca: IpcaRow[]; ipca12m: IpcaRow[]; ipcaState: string; ipcaUpdated: string; onRefresh: () => void; sourceSearch: string; setSourceSearch: (v: string) => void; filteredSources: typeof sources }) {
  const descriptions: Record<string,string> = {"Economia":"Inflação, atividade econômica, emprego, renda e poder de compra.","Saúde":"Indicadores de saúde, acesso a serviços, mortalidade e dados do SUS.","Educação":"Acesso, permanência, alfabetização e indicadores de aprendizagem.","Segurança":"Indicadores de violência e segurança, respeitando diferenças entre fontes.","Gastos públicos":"Orçamento aprovado, despesas executadas, contratos e transferências.","Promessas":"Compromissos documentados, prazos, evidências e situação de execução.","Fontes e método":"Fontes consultadas, critérios de análise e limites dos dados."};
  if (section === "Fontes e método") return <section className="page-section"><p className="eyebrow">TRANSPARÊNCIA E CRITÉRIOS</p><h1>Fontes e metodologia</h1><p className="muted page-intro">A informação deve poder ser conferida. Use a busca para encontrar as fontes oficiais que sustentam cada área.</p><label className="search-box source-search"><Search size={17}/><input value={sourceSearch} onChange={e => setSourceSearch(e.target.value)} placeholder="Buscar por tema ou órgão..." aria-label="Buscar fontes"/></label><div className="source-list">{filteredSources.map(s => <article className="source-item" key={s.name}><div className="source-item-icon"><BookOpen size={18}/></div><div className="source-item-content"><span className="source-type">{s.type}</span><strong>{s.name}</strong><p>{s.desc}</p><button className="inline-link" onClick={() => openExternal(s.url)}>Abrir fonte oficial <ExternalLink size={14}/></button></div></article>)}{!filteredSources.length && <div className="no-results"><strong>Nenhuma fonte encontrada</strong><button className="secondary-light" onClick={() => setSourceSearch("")}>Limpar busca</button></div>}</div><div className="method-list">{[["1","Fonte e data visíveis","Toda informação publicada deve apontar para a fonte original, o período de referência e a data de consulta."],["2","Separar promessa de resultado","Anúncio, aprovação legal, execução orçamentária e impacto são etapas diferentes."],["3","Comparação justa","Comparar períodos equivalentes, explicar mudanças metodológicas e ajustar valores monetários quando necessário."],["4","Causalidade com cautela","A evolução de um indicador não deve ser atribuída automaticamente ao governante."],["5","Incerteza explícita","Dados ausentes, atrasados ou divergentes precisam ser sinalizados; a IA nunca deve inventar lacunas."],["6","Atualização verificável","A versão inicial não mantém ainda um histórico automatizado de alterações; isso deverá ser implementado antes de avaliações públicas completas."]].map(([n,t,d]) => <div className="method-row" key={n}><span>{n}</span><div><strong>{t}</strong><p>{d}</p></div></div>)}</div></section>;
  if (section === "Economia") {
    const latest = ipca[ipca.length - 1], previous = ipca[ipca.length - 2];
    const food = foodIpca[foodIpca.length - 1], foodPrevious = foodIpca[foodIpca.length - 2];
    const annual = ipca12m[ipca12m.length - 1], annualPrevious = ipca12m[ipca12m.length - 2];
    const fmt = (v?: IpcaRow) => v ? `${Number(v.valor).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}%` : "—";
    const movement = (a?: IpcaRow,b?: IpcaRow) => a && b ? `${Number(a.valor)>Number(b.valor)?"Subiu":Number(a.valor)<Number(b.valor)?"Caiu":"Ficou estável"} ${Math.abs(Number(a.valor)-Number(b.valor)).toLocaleString("pt-BR",{maximumFractionDigits:2})} p.p. ante o mês anterior` : "Comparação indisponível";
    return <section className="page-section economy-page"><p className="eyebrow">INDICADORES ECONÔMICOS · FONTES PRIMÁRIAS</p><h1>Economia, preços e poder de compra</h1><p className="muted page-intro">Acompanhe o que subiu, o que caiu e o período de cada medição. Variação mensal, acumulado em 12 meses e percentual do PIB são medidas diferentes.</p>
      <div className="economy-toolbar"><span className={`data-state ${ipcaState}`}>{ipcaState === "ready" ? "● Conectado ao Banco Central" : ipcaState === "loading" ? "● Consultando fontes oficiais" : "● Fonte temporariamente indisponível"}</span><button className="refresh-button" onClick={onRefresh} disabled={ipcaState === "loading"}><RefreshCw size={15} className={ipcaState === "loading" ? "spin" : ""}/> Atualizar dados</button></div>
      <div className="economy-cards">
        <article className="economy-card"><span className="source-type">BANCO CENTRAL · SGS 433</span><h2>Inflação geral (IPCA)</h2><strong className="economy-number">{fmt(latest)}</strong><p>Variação mensal · {latest?.data || "sem dado"}</p><small>{movement(latest,previous)}</small><a href="https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/24?formato=json" target="_blank" rel="noreferrer">Consultar série oficial ↗</a></article>
        <article className="economy-card"><span className="source-type">BANCO CENTRAL · SGS 1635</span><h2>Inflação de alimentos</h2><strong className="economy-number">{fmt(food)}</strong><p>Alimentação e bebidas · {food?.data || "sem dado"}</p><small>{movement(food,foodPrevious)}</small><a href="https://api.bcb.gov.br/dados/serie/bcdata.sgs.1635/dados/ultimos/24?formato=json" target="_blank" rel="noreferrer">Consultar série oficial ↗</a></article>
        <article className="economy-card"><span className="source-type">BANCO CENTRAL · SGS 13522</span><h2>IPCA acumulado em 12 meses</h2><strong className="economy-number">{fmt(annual)}</strong><p>Acumulado · {annual?.data || "sem dado"}</p><small>{movement(annual,annualPrevious)}</small><a href="https://api.bcb.gov.br/dados/serie/bcdata.sgs.13522/dados/ultimos/24?formato=json" target="_blank" rel="noreferrer">Consultar série oficial ↗</a></article>
        <article className="economy-card"><span className="source-type">DECRETO 12.797/2025</span><h2>Salário mínimo nacional</h2><strong className="economy-number">R$ 1.621</strong><p>Vigente desde 1º de janeiro de 2026</p><small>Reajuste nominal de 6,79% sobre R$ 1.518 em 2025; ganho real aproximado de 2,50% após descontar o INPC de 4,18%.</small><a href="https://www2.camara.leg.br/legin/fed/decret/2025/decreto-12797-23-dezembro-2025-798569-publicacaooriginal-177587-pe.html" target="_blank" rel="noreferrer">Consultar decreto ↗</a></article>
        <article className="economy-card"><span className="source-type">TESOURO NACIONAL · 2025</span><h2>Carga tributária bruta</h2><strong className="economy-number">32,40%</strong><p>Percentual do PIB · ano de 2025</p><small>Aumento de 0,18 ponto percentual ante 2024. Não é a alíquota de um imposto individual.</small><a href="https://www.tesourotransparente.gov.br/publicacoes/carga-tributaria-do-governo-geral/2025/114" target="_blank" rel="noreferrer">Consultar estudo oficial ↗</a></article>
        <article className="economy-card"><span className="source-type">IBGE · PNAD CONTÍNUA</span><h2>Desocupação</h2><strong className="economy-number">5,3%</strong><p>Trimestre junho–agosto de 2026 · IBGE</p><small>Queda de 0,3 p.p. ante o trimestre móvel encerrado em maio de 2026.</small><a href="https://www.ibge.gov.br/estatisticas/sociais/trabalho/17270-pnad-continua.html" target="_blank" rel="noreferrer">Consultar divulgação baseada no IBGE ↗</a></article>
      </div>
      <div className="indicator-card"><h2>Histórico recente do IPCA mensal</h2><p className="muted">Últimos valores retornados pela série oficial. O sinal indica inflação positiva ou deflação no mês.</p><div className="ipca-history">{ipca.slice(-12).reverse().map(r => <div className="ipca-row" key={r.data}><span>{r.data}</span><strong>{fmt(r)}</strong></div>)}</div><div className="live-panel-foot"><span>{ipcaUpdated ? `Consulta: ${ipcaUpdated}` : "Aguardando consulta"}</span><span>Fonte: Banco Central do Brasil</span></div></div>
      <div className="notice"><Info size={16}/><span>Metodologia: a diferença entre duas taxas é expressa em pontos percentuais (p.p.). IPCA mede preços ao consumidor; carga tributária mede arrecadação total em relação ao PIB; salário mínimo é valor nominal. Não atribuímos automaticamente mudanças ao presidente ou a uma única política.</span></div>
    </section>;
  }
  if (section === "Tributos") return <section className="page-section economy-page"><p className="eyebrow">ARRECADAÇÃO E CARGA TRIBUTÁRIA</p><h1>Tributos: quanto se arrecada?</h1><p className="muted page-intro">A carga tributária mostra a arrecadação total de tributos em relação ao PIB. Ela não significa que todo brasileiro paga essa porcentagem da própria renda nem substitui as alíquotas de cada imposto.</p><div className="economy-cards"><article className="economy-card"><span className="source-type">TESOURO NACIONAL · 2025</span><h2>Carga tributária bruta</h2><strong className="economy-number">32,40%</strong><p>Do PIB · ano-base 2025</p><small>Subiu 0,18 ponto percentual em relação a 2024.</small><a href="https://www.tesourotransparente.gov.br/publicacoes/carga-tributaria-do-governo-geral/2025/114" target="_blank" rel="noreferrer">Abrir estudo e planilha oficiais ↗</a></article><article className="economy-card"><span className="source-type">COMPARAÇÃO 2025 × 2024</span><h2>Variação por esfera de governo</h2><strong className="economy-number">+0,26 p.p.</strong><p>Governo central</p><small>Estados: −0,10 p.p. · Municípios: +0,03 p.p. no mesmo comparativo.</small><a href="https://www.gov.br/cgu/pt-br/assuntos/auditoria-e-fiscalizacao/avaliacao-da-gestao-dos-administradores/prestacao-de-contas-do-presidente-da-republica/2025/AnexoEstimativadaCargaTributariaBoletim_CTB_20251.pdf" target="_blank" rel="noreferrer">Conferir quadro oficial por esfera ↗</a></article></div><div className="notice"><Info size={16}/><span>Não existe uma única “porcentagem de imposto” que represente todos os tributos. Para acompanhar IR, IPI, IOF, PIS/Cofins, ICMS e ISS, o Observa Brasil deverá exibir alíquota legal, base de cálculo, vigência e alterações legislativas separadamente. A carga tributária não é uma alíquota individual.</span></div></section>;
  const relevant = section === "Saúde" ? ["DATASUS", "IBGE"] : section === "Educação" ? ["INEP", "Dados Abertos"] : section === "Segurança" ? ["Atlas da Violência", "Dados Abertos"] : section === "Gastos públicos" ? ["Portal da Transparência", "Dados Abertos"] : ["Câmara dos Deputados", "Dados Abertos"];
  const relevantSources = sources.filter(s => relevant.some(r => s.name.includes(r)));
  return <section className="page-section"><p className="eyebrow">DADOS, DOCUMENTOS E CONTEXTO</p><h1>{section}</h1><p className="muted page-intro">{descriptions[section]}</p><div className="empty-state"><div className="empty-icon"><Database size={25}/></div><h3>Fontes oficiais para consulta</h3><p>Esta área não exibe números sem validação. Abaixo estão as fontes públicas para começar a consultar dados reais; a integração automatizada e a comparação histórica desta categoria ainda precisam ser desenvolvidas.</p><div className="relevant-sources">{relevantSources.map(s => <button className="source-link-card" key={s.name} onClick={() => openExternal(s.url)}><span><strong>{s.name}</strong><small>{s.desc}</small></span><ExternalLink size={16}/></button>)}</div><button className="primary-button" onClick={() => {setSourceSearch(""); setSection("Fontes e método");}}>Consultar catálogo completo <ArrowUpRight size={16}/></button></div><div className="notice"><Info size={16}/><span>Não há estatísticas fictícias nesta tela. As próximas etapas são escolher indicadores específicos, registrar suas unidades e datas, integrar as fontes e testar os resultados antes da publicação.</span></div></section>;
}
