import { useMemo, useState } from "react";
import { Activity, ArrowUpRight, BookOpen, CalendarDays, CheckCircle2, ChevronRight, CircleDollarSign, Database, FileText, GraduationCap, HeartPulse, Landmark, Menu, Search, ShieldCheck, Users, X } from "lucide-react";
import { presidents, type President } from "./data/presidents";

type Section = "Visão geral" | "Presidentes" | "Economia" | "Saúde" | "Educação" | "Segurança" | "Gastos públicos" | "Promessas" | "Metodologia";
const nav: { label: Section; icon: typeof Landmark }[] = [
  { label: "Visão geral", icon: Activity }, { label: "Presidentes", icon: Users },
  { label: "Economia", icon: CircleDollarSign }, { label: "Saúde", icon: HeartPulse },
  { label: "Educação", icon: GraduationCap }, { label: "Segurança", icon: ShieldCheck },
  { label: "Gastos públicos", icon: Database }, { label: "Promessas", icon: CheckCircle2 },
  { label: "Metodologia", icon: BookOpen }
];
const categories = [
  { title: "Economia", desc: "Inflação, PIB, emprego e renda", icon: CircleDollarSign },
  { title: "Saúde", desc: "Acesso, mortalidade e indicadores do SUS", icon: HeartPulse },
  { title: "Educação", desc: "Alfabetização, aprendizagem e acesso", icon: GraduationCap },
  { title: "Segurança", desc: "Violência e dados de segurança pública", icon: ShieldCheck },
  { title: "Gastos públicos", desc: "Orçamento, execução e transferências", icon: Database },
  { title: "Promessas", desc: "Compromissos, evidências e andamento", icon: CheckCircle2 }
];
function formatYear(p: President) { return `${p.start}–${p.end ?? "atual"}`; }

export default function App() {
  const [section, setSection] = useState<Section>("Visão geral");
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState("Todos os períodos");
  const [selected, setSelected] = useState<President | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const filtered = useMemo(() => presidents.filter(p =>
    `${p.name} ${p.start} ${p.end ?? ""} ${p.period}`.toLowerCase().includes(query.toLowerCase()) &&
    (period === "Todos os períodos" || p.period === period)
  ), [query, period]);

  function changeSection(label: Section) { setSection(label); setMobileOpen(false); setSelected(null); }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
      <div className="brand"><div className="brand-mark"><Landmark size={23}/></div><div><strong>Observatório</strong><span>dos Mandatos</span></div><button className="icon-button mobile-close" onClick={() => setMobileOpen(false)} aria-label="Fechar menu"><X size={19}/></button></div>
      <div className="nav-label">ACOMPANHAMENTO</div>
      <nav>{nav.map(item => { const Icon = item.icon; return <button key={item.label} className={`nav-item ${section === item.label ? "active" : ""}`} onClick={() => changeSection(item.label)}><Icon size={18}/><span>{item.label}</span>{section === item.label && <ChevronRight className="nav-chevron" size={16}/>}</button>; })}</nav>
      <div className="sidebar-bottom"><div className="source-dot"/><div><strong>Projeto aberto</strong><span>Consulta pública · sem login</span></div></div>
    </aside>
    {mobileOpen && <button className="mobile-scrim" onClick={() => setMobileOpen(false)} aria-label="Fechar menu"/>}
    <main className="main-area">
      <header className="topbar"><button className="icon-button mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Abrir menu"><Menu size={21}/></button><div className="breadcrumb">Observatório <span>/</span> {section}</div><div className="top-status"><span className="status-dot"/> Base inicial de demonstração</div></header>
      <div className="content">
        {section === "Visão geral" && <Overview setSection={changeSection} setSelected={setSelected}/>}
        {section === "Presidentes" && <section className="page-section"><div className="page-heading"><div><p className="eyebrow">HISTÓRICO REPUBLICANO</p><h1>Presidentes do Brasil</h1><p className="muted">Pesquise os registros iniciais e abra um período para ver detalhes.</p></div><span className="count-pill">{filtered.length} registros na amostra</span></div><div className="filters"><label className="search-box"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar presidente, ano ou período..."/></label><select value={period} onChange={e => setPeriod(e.target.value)}><option>Todos os períodos</option>{Array.from(new Set(presidents.map(p => p.period))).map(p => <option key={p}>{p}</option>)}</select></div><div className="president-list">{filtered.map(p => <button className="president-row" key={p.id} onClick={() => setSelected(p)}><div className="avatar">{p.name.split(" ").filter(Boolean).slice(0,2).map(s => s[0]).join("")}</div><div className="president-main"><strong>{p.name}</strong><span>{p.period}{p.note ? " · observação histórica" : ""}</span></div><span className="year-range">{formatYear(p)}</span><ChevronRight size={17} className="row-arrow"/></button>)}</div><p className="notice"><FileText size={16}/> Esta é uma amostra para testar a interface, não uma lista histórica completa validada. Datas, interinidades e fontes devem ser revisadas antes da publicação.</p></section>}
        {section !== "Visão geral" && section !== "Presidentes" && <CategoryPage section={section}/>}
      </div>
      <footer><span>Observatório dos Mandatos</span><span>Dados, evidências e contexto — sem torcida política.</span></footer>
    </main>
    {selected && <div className="modal-backdrop" role="presentation" onClick={() => setSelected(null)}><section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title" onClick={e => e.stopPropagation()}><button className="icon-button modal-close" onClick={() => setSelected(null)} aria-label="Fechar"><X size={19}/></button><p className="eyebrow">REGISTRO HISTÓRICO</p><h2 id="detail-title">{selected.name}</h2><p className="muted">{selected.period}</p><div className="detail-grid"><div><span>Início</span><strong>{selected.start}</strong></div><div><span>Fim</span><strong>{selected.end ?? "Mandato em curso"}</strong></div></div>{selected.note && <p className="notice">{selected.note}</p>}<div className="source-card"><BookOpen size={18}/><div><strong>Fontes a validar</strong><p>Este registro ainda precisa ser ligado a fontes oficiais e ter datas conferidas antes de ser usado em análises.</p></div></div><button className="primary-button full" onClick={() => { setSelected(null); setSection("Metodologia"); }}>Ver metodologia de análise <ArrowUpRight size={16}/></button></section></div>}
  </div>;
}

function Overview({ setSection, setSelected }: { setSection: (s: Section) => void; setSelected: (p: President) => void }) {
  return <div className="overview">
    <section className="hero"><div className="hero-copy"><div className="hero-kicker"><span className="live-dot"/> TRANSPARÊNCIA PÚBLICA EM DADOS</div><h1>O que foi prometido.<br/><em>O que foi feito.</em><br/>O que os dados mostram.</h1><p>Uma plataforma independente para acompanhar mandatos presidenciais com fontes públicas, contexto histórico e critérios transparentes.</p><div className="hero-actions"><button className="primary-button" onClick={() => setSection("Presidentes")}>Explorar presidentes <ChevronRight size={17}/></button><button className="secondary-button" onClick={() => setSection("Metodologia")}>Como avaliamos</button></div></div><div className="hero-art"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-center"><Landmark size={48}/><span>BRASIL</span></div><div className="floating-card card-top"><Activity size={16}/><span>Indicadores</span><strong>Dados com contexto</strong></div><div className="floating-card card-bottom"><ShieldCheck size={16}/><span>Critério público</span><strong>Fontes verificáveis</strong></div></div></section>
    <div className="demo-banner"><span className="banner-icon"><CalendarDays size={19}/></span><div><strong>Protótipo inicial</strong><p>Os dados reais ainda não estão conectados. Não há relatório diário automático nesta versão.</p></div><span className="banner-tag">FASE 1</span></div>
    <section className="section-block"><div className="section-title"><div><p className="eyebrow">NAVEGUE POR TEMA</p><h2>O governo em diferentes dimensões</h2></div><button className="text-button" onClick={() => setSection("Metodologia")}>Nossa metodologia <ArrowUpRight size={16}/></button></div><div className="category-grid">{categories.map(c => {const Icon = c.icon; return <button className="category-card" key={c.title} onClick={() => setSection(c.title as Section)}><span className="category-icon"><Icon size={20}/></span><strong>{c.title}</strong><p>{c.desc}</p><ChevronRight size={16} className="category-arrow"/></button>;})}</div></section>
    <section className="section-block"><div className="section-title"><div><p className="eyebrow">LINHA DO TEMPO</p><h2>História presidencial</h2><p className="muted">Uma amostra da organização cronológica que será ampliada e validada.</p></div><button className="text-button" onClick={() => setSection("Presidentes")}>Ver registros <ArrowUpRight size={16}/></button></div><div className="timeline-card"><div className="timeline-line"/>{presidents.filter(p => ["deodoro","getulio-vargas","juscelino","sarney","fhc-1","lula-3"].includes(p.id)).map(p => <button className="timeline-entry" key={p.id} onClick={() => setSelected(p)}><span className="timeline-year">{p.start}</span><span className="timeline-point"/><span className="timeline-name"><strong>{p.name}</strong><small>{formatYear(p)} · {p.period}</small></span><ChevronRight size={16}/></button>)}</div></section>
    <section className="principles"><div><ShieldCheck size={22}/><strong>Imparcialidade por projeto</strong><p>Os mesmos critérios para todos os governos, com fontes visíveis e correções registradas.</p></div><div><Database size={22}/><strong>Dados antes de opinião</strong><p>Uma mudança no indicador não prova, sozinha, que uma política causou o resultado.</p></div><div><BookOpen size={22}/><strong>Contexto histórico</strong><p>Comparações respeitam diferenças de época, legislação e disponibilidade de dados.</p></div></section>
  </div>;
}

function CategoryPage({ section }: { section: Section }) {
  const descriptions: Record<string,string> = {
    "Economia": "Inflação, atividade econômica, emprego, renda e poder de compra.",
    "Saúde": "Indicadores de saúde, acesso a serviços, mortalidade e dados do SUS.",
    "Educação": "Acesso, permanência, alfabetização e indicadores de aprendizagem.",
    "Segurança": "Indicadores de violência e segurança, respeitando diferenças entre fontes.",
    "Gastos públicos": "Orçamento aprovado, despesas executadas, contratos e transferências.",
    "Promessas": "Compromissos documentados, prazos, evidências e situação de execução.",
    "Metodologia": "Como o Observatório organiza evidências, compara períodos e evita conclusões indevidas."
  };
  const isMethod = section === "Metodologia";
  return <section className="page-section"><p className="eyebrow">{isMethod ? "TRANSPARÊNCIA E CRITÉRIOS" : "ÁREA DE ANÁLISE"}</p><h1>{section}</h1><p className="muted page-intro">{descriptions[section] ?? "Área de acompanhamento público."}</p>
    {isMethod ? <div className="method-list">{[
      ["1","Fonte e data visíveis","Toda informação relevante terá link para a fonte original, data de referência e data da coleta."],
      ["2","Separar anúncio de execução","Anúncio, aprovação legal, liberação de recursos e resultado são etapas diferentes."],
      ["3","Comparação justa","Usar períodos comparáveis, corrigir valores monetários quando necessário e explicar mudanças de metodologia."],
      ["4","Causalidade com cautela","A evolução de um indicador não será atribuída automaticamente ao presidente; contexto e outros fatores serão considerados."],
      ["5","Incerteza explícita","Dados ausentes, divergentes ou atrasados serão identificados. A IA não deve preencher lacunas como se fossem fatos."],
      ["6","Correções auditáveis","Manter histórico de atualização e correções para que mudanças na análise possam ser verificadas."]
    ].map(([n,t,d]) => <div className="method-row" key={n}><span>{n}</span><div><strong>{t}</strong><p>{d}</p></div></div>)}</div> :
    <div className="empty-state"><div className="empty-icon"><Database size={25}/></div><h3>Conexão de dados ainda não configurada</h3><p>Esta área está preparada para receber indicadores oficiais. Nenhum número foi inventado para preencher o painel.</p><div className="source-pills"><span>IBGE</span><span>Dados.gov.br</span><span>Portais oficiais</span></div><p className="small-muted">Próxima etapa: definir indicadores, fontes específicas, frequência de atualização e regras de validação.</p></div>}
  </section>;
}