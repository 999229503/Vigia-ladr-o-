import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode, type TouchEvent as ReactTouchEvent } from "react";
import {
  Menu, Check, Clock, HelpCircle, X, BarChart2, Heart, Coins,
  GraduationCap, ShieldCheck, Home, Users, CheckSquare, Grid, Fuel,
  ChevronRight, ChevronDown, ExternalLink, ArrowUpRight, Info, Search, RefreshCw,
  FileText, Flag, Percent, DollarSign, Briefcase, TrendingUp
} from "lucide-react";
import { presidents, type President } from "./data/presidents";
import { mandateRecords, mandateStatuses, type MandateRecord, type MandateStatus } from "./data/mandates";
import { socialCheckedAt, socialIndicators, type SocialIndicator } from "./data/indicators";
import { describeSeries, seriesDefs, useBcbIndicators, type SeriesId } from "./bcb";

type Section = "Início" | "Presidentes" | "Promessas" | "Mais";
const pages: Section[] = ["Início", "Presidentes", "Promessas", "Mais"];

/* ------------------------------------------------------------------ */
/* Registros de mandato (derivados de data/mandates.ts)                */
/* ------------------------------------------------------------------ */

type FlatRecord = MandateRecord & { presidentId: string; presidentName: string; years: string; current: boolean };

const flatRecords: FlatRecord[] = presidents.flatMap((p) =>
  (mandateRecords[p.id] ?? []).map((r) => ({
    ...r,
    presidentId: p.id,
    presidentName: p.name.split(" — ")[0],
    years: `${p.start}–${p.end ?? "atual"}`,
    current: p.end === null
  }))
);

function countByStatus(records: FlatRecord[]): Record<MandateStatus, number> {
  const counts: Record<MandateStatus, number> = { "Realizado": 0, "Em andamento": 0, "Não cumprido": 0, "A validar": 0 };
  for (const r of records) counts[r.status] += 1;
  return counts;
}

const statusCounts = countByStatus(flatRecords);

// O painel da tela inicial mostra só o mandato em exercício, para não misturar governos.
const currentFlat = flatRecords.filter((r) => r.current);
const currentCounts = countByStatus(currentFlat);
const currentPresident = presidents.find((p) => p.end === null);
const currentName = currentPresident ? currentPresident.name.split(" — ")[0] : "";

function statusClass(status: MandateStatus): string {
  if (status === "Realizado") return "done";
  if (status === "Em andamento") return "progress";
  if (status === "Não cumprido") return "failed";
  return "pending";
}

function ringBackground(counts: Record<MandateStatus, number>): string {
  const total = counts["Realizado"] + counts["Em andamento"] + counts["Não cumprido"] + counts["A validar"];
  if (total === 0) return "#e2e8f0";
  const a = (counts["Realizado"] / total) * 100;
  const b = a + (counts["Em andamento"] / total) * 100;
  const c = b + (counts["Não cumprido"] / total) * 100;
  return `conic-gradient(#00a859 0% ${a}%, #ffc400 ${a}% ${b}%, #e5484d ${b}% ${c}%, #94a3b8 ${c}% 100%)`;
}

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */

function normalize(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

const reversedPresidents = [...presidents].reverse();

function isRecent(p: President): boolean {
  return p.end === null || p.end >= 2000;
}

type Group = { label: string; items: President[] };

/** Agrupa a lista (já em ordem) em blocos consecutivos do mesmo período histórico. */
function groupByPeriod(list: President[]): Group[] {
  const groups: Group[] = [];
  for (const p of list) {
    const label = p.period === "Outro" ? "Transição" : p.period;
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(p);
    else groups.push({ label, items: [p] });
  }
  return groups;
}

/** Nome do arquivo da foto: o mesmo presidente em mandatos diferentes reaproveita a foto (lula-1, lula-2, lula-3 → lula.jpg). */
function photoFor(p: President): string {
  return `/presidentes/${p.id.replace(/-\d$/, "")}.jpg`;
}

function initials(name: string): string {
  return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("");
}

const avatarTones = ["green", "blue", "yellow"] as const;

function toneFor(id: string): (typeof avatarTones)[number] {
  let sum = 0;
  for (const ch of id) sum += ch.charCodeAt(0);
  return avatarTones[sum % avatarTones.length];
}

const socialStyle: Record<SocialIndicator["id"], { tone: string; icon: JSX.Element }> = {
  saude: { tone: "pink", icon: <Heart size={20} /> },
  educacao: { tone: "blue", icon: <GraduationCap size={20} /> },
  seguranca: { tone: "amber", icon: <ShieldCheck size={20} /> }
};

const econStyle: Record<SeriesId, { tone: string; icon: JSX.Element }> = {
  ipca: { tone: "yellow", icon: <Coins size={20} /> },
  ipca12: { tone: "sky", icon: <TrendingUp size={20} /> },
  selic: { tone: "blue", icon: <Percent size={20} /> },
  usd: { tone: "green", icon: <DollarSign size={20} /> },
  desocupacao: { tone: "navy", icon: <Briefcase size={20} /> }
};

type Source = { name: string; description: string; url: string };

const sources: Source[] = [
  { name: "Banco Central do Brasil", description: "IPCA, Selic, dólar e desemprego (séries SGS), consultados direto na API pública", url: "https://www.bcb.gov.br/" },
  { name: "Arquivo Nacional", description: "Biografias e mandatos presidenciais", url: "https://presidentes.an.gov.br/" },
  { name: "Biblioteca da Presidência", description: "Galeria de ex-presidentes", url: "https://www.biblioteca.presidencia.gov.br/presidencia/ex-presidentes" },
  { name: "Portal da Transparência", description: "Gastos e execução orçamentária do governo federal", url: "https://portaldatransparencia.gov.br/" },
  { name: "IBGE / SIDRA", description: "Estatísticas oficiais de população, emprego e economia", url: "https://sidra.ibge.gov.br/" },
  { name: "DATASUS", description: "Informações de saúde pública e sistemas do SUS", url: "https://datasus.saude.gov.br/" },
  { name: "INEP / Ministério da Educação", description: "Indicadores oficiais da educação brasileira (IDEB)", url: "https://www.gov.br/inep/pt-br" },
  { name: "Atlas da Violência / Ipea", description: "Indicadores de violência e segurança pública", url: "https://www.ipea.gov.br/atlasviolencia/" },
  { name: "ANP", description: "Preços de combustíveis (ainda não conectado ao app)", url: "https://www.gov.br/anp/pt-br" }
];

type PromiseSource = { name: string; description: string; url: string; kind: "Oficial" | "Imprensa" };

/** Fontes de cada registro do mandato atual. "Oficial" comprova o fato (lei, promulgação, relatório); "Imprensa" traz a classificação de cumprida ou não cumprida. */
const promiseSources: PromiseSource[] = [
  { name: "Senado Notícias · Lei 15.270", description: "Sanção da isenção do Imposto de Renda até R$ 5 mil (26/11/2025)", url: "https://www12.senado.leg.br/noticias/materias/2025/11/27/sancionada-isencao-do-imposto-de-renda-para-quem-ganha-ate-r-5-mil-por-mes", kind: "Oficial" },
  { name: "Agência Gov · sanção da lei do IR", description: "Cobertura oficial da sanção da lei que amplia a isenção do IR", url: "https://agenciagov.ebc.com.br/noticias/202511/lula-sanciona-lei-que-amplia-isencao-do-imposto-de-renda-para-quem-ganha-ate-r-5-mil-assista", kind: "Oficial" },
  { name: "Congresso Nacional · Emenda 141", description: "Sessão solene de 16/10/2026 que promulgou o fim da escala 6x1", url: "https://www.congressonacional.leg.br/en_US/sessoes/agenda-do-congresso-nacional/-/pauta/592942", kind: "Oficial" },
  { name: "Senado Notícias · Emenda 132", description: "Promulgação da reforma tributária (20/12/2023)", url: "https://www12.senado.leg.br/noticias/materias/2023/12/20/congresso-promulga-reforma-tributaria", kind: "Oficial" },
  { name: "MDS · Mapa da Fome", description: "Relatório da FAO de 21/07/2026: Brasil segue fora do Mapa da Fome", url: "https://www.gov.br/mds/pt-br/noticias/relatorio-da-onu-confirma-que-brasil-permanece-fora-do-mapa-da-fome-e-aponta-melhora-em-indicadores", kind: "Oficial" },
  { name: "Ministério das Cidades · Minha Casa, Minha Vida", description: "MP 1.162/2023 e Lei 14.620/2023", url: "https://www.gov.br/cidades/pt-br/acesso-a-informacao/acoes-e-programas/habitacao/programa-minha-casa-minha-vida/sobre-o-minha-casa-minha-vida-1", kind: "Oficial" },
  { name: "Câmara dos Deputados · Lei 14.621", description: "Estratégia Nacional de Formação de Especialistas, no âmbito do Mais Médicos", url: "https://www.camara.leg.br/noticias/980066-ENTRA-EM-VIGOR-LEI-QUE-INSTITUI-ESTRATEGIA-DE-APOIO-AO-PROGRAMA-MAIS-MEDICOS", kind: "Oficial" },
  { name: "Senado Notícias · Lei 14.690", description: "Desenrola Brasil: MP 1.176/2023 e lei de 03/10/2023", url: "https://www12.senado.leg.br/noticias/materias/2023/10/04/sancionada-a-lei-que-prorroga-desenrola-brasil-ate-o-fim-de-2023", kind: "Oficial" },
  { name: "Câmara dos Deputados · reforma administrativa", description: "Criação do grupo de trabalho da reforma administrativa (21/05/2025)", url: "https://www.camara.leg.br/noticias/1161492-motta-indica-deputado-pedro-paulo-para-coordenar-grupo-de-trabalho-da-reforma-administrativa/", kind: "Oficial" },
  { name: "Senado Notícias · PEC da Segurança", description: "PEC da Segurança Pública no Plenário (14/10/2026)", url: "https://www12.senado.leg.br/noticias/materias/2026/10/14/pec-da-seguranca-publica-esta-na-pauta-do-plenario-nesta-quinta-feira", kind: "Oficial" },
  { name: "g1 (via News Rondônia)", description: "Balanço de 22/07/2026: 36 compromissos de 2022, com 26 cumpridos, 4 em parte e 6 não cumpridos", url: "https://newsrondonia.com.br/politica/2026/07/22/balanco-de-governo-de-lula-aponta-26-promessas-cumpridas/", kind: "Imprensa" },
  { name: "Folha de S.Paulo (via Gazeta do Povo)", description: "Levantamento de 19/01/2025: 103 promessas de campanha de 2022", url: "https://www.gazetadopovo.com.br/republica/lula-metade-mandato-28-promessas-cumpridas/", kind: "Imprensa" },
  { name: "ND Mais", description: "Balanço de 30/12/2025: reforma administrativa, fila do SUS e desmatamento zero", url: "https://ndmais.com.br/politica/promessas-de-lula-balanco-tres-anos-governo/", kind: "Imprensa" },
  { name: "O POVO", description: "Coluna de 18/10/2026: 27 de 36 promessas cumpridas após a promulgação do fim da escala 6x1", url: "https://mais.opovo.com.br/colunistas/beatriz-cavalcante/2026/10/18/6x1-promessas-cumpridas-e-pressao-por-ajustes.html", kind: "Imprensa" }
];

/* ------------------------------------------------------------------ */
/* Peças de interface                                                  */
/* ------------------------------------------------------------------ */

/** Foto do presidente em círculo; se o arquivo não existir, mostra as iniciais. */
function PresidentAvatar({ p, size }: { p: President; size: "sm" | "lg" }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`avatar ${size} ${toneFor(p.id)}`}>
      {failed ? (
        <span aria-hidden="true">{initials(p.name)}</span>
      ) : (
        <img src={photoFor(p)} alt="" loading="lazy" onError={() => setFailed(true)} />
      )}
    </div>
  );
}

function RecordCard({ r }: { r: FlatRecord }) {
  return (
    <article className={`record-card ${statusClass(r.status)}`}>
      <div className="record-top">
        <strong>{r.title}</strong>
        <span className={`status-pill ${statusClass(r.status)}`}>{r.status}</span>
      </div>
      <small className="record-meta">
        <span className="meta-cat">
          {r.category === "Ação documentada" ? <FileText size={13} /> : <Flag size={13} />}
          {r.category}
        </span>
        <span>{r.presidentName} · {r.years}</span>
      </small>
      <p>{r.detail}</p>
      <a className="text-link" href={r.url} target="_blank" rel="noreferrer">Ver fonte ↗</a>
    </article>
  );
}

function PageHero({ tone, title, subtitle, children }: { tone: string; title: string; subtitle: string; children?: ReactNode }) {
  return (
    <section className={`page-hero ${tone}`}>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */

export default function App() {
  const [section, setSection] = useState<Section>("Início");
  const [selectedPresident, setSelectedPresident] = useState<President | null>(null);
  const [query, setQuery] = useState("");
  const [showAllPresidents, setShowAllPresidents] = useState(false);
  const [statusFilter, setStatusFilter] = useState<MandateStatus | "Todos">("Todos");
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const { state: bcb, refreshing, reload } = useBcbIndicators();

  const go = useCallback((next: Section) => {
    setSection(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!selectedPresident) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedPresident(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedPresident]);

  function handleTouchStart(e: ReactTouchEvent<HTMLElement>) {
    // Áreas com rolagem horizontal própria (ex.: economia ao vivo) não trocam de aba.
    if ((e.target as Element).closest("[data-no-swipe]")) {
      touchStart.current = null;
      return;
    }
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }

  function handleTouchEnd(e: ReactTouchEvent<HTMLElement>) {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      const next = pages.indexOf(section) + (dx < 0 ? 1 : -1);
      if (next >= 0 && next < pages.length) go(pages[next]);
    }
  }

  const searching = query.trim().length > 0;

  const visiblePresidents = useMemo(() => {
    const q = normalize(query.trim());
    if (q) {
      return reversedPresidents.filter((p) =>
        normalize(p.name).includes(q) ||
        normalize(p.period).includes(q) ||
        String(p.start).includes(q) ||
        (p.end !== null && String(p.end).includes(q))
      );
    }
    return showAllPresidents ? reversedPresidents : reversedPresidents.filter(isRecent);
  }, [query, showAllPresidents]);

  const presidentGroups = useMemo<Group[]>(
    () => (searching ? [{ label: "Resultados", items: visiblePresidents }] : groupByPeriod(visiblePresidents)),
    [searching, visiblePresidents]
  );

  const visibleRecords = useMemo(
    () => (statusFilter === "Todos" ? flatRecords : flatRecords.filter((r) => r.status === statusFilter)),
    [statusFilter]
  );

  const currentRecords = visibleRecords.filter((r) => r.current);
  const pastRecords = visibleRecords.filter((r) => !r.current);
  const currentMandate = presidents.find((p) => p.end === null);
  const totalRecords = flatRecords.length;

  return (
    <div className="app-shell">
      <main className="main-area" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {/* Topo de cada aba */}
        {section === "Início" && (
          <section className="home-hero">
            <div className="hero-bar">
              <button className="hero-icon-btn" aria-label="Fontes e métodos" onClick={() => go("Mais")}>
                <Menu size={20} />
              </button>

              <button className="hero-brand" onClick={() => go("Início")} aria-label="Ir para o início">
                <svg viewBox="0 0 100 100" width="26" height="26" aria-hidden="true">
                  <path d="M15 35 Q50 15 85 35 Q90 65 50 85 Q10 65 15 35 Z" fill="#00c853" />
                  <circle cx="50" cy="50" r="20" fill="#0047bb" />
                </svg>
                <span>Observa Brasil</span>
              </button>

              <span className="hero-icon-btn hero-spacer" aria-hidden="true" />
            </div>

            <div className="hero-copy">
              <h1>Olá, Cidadão!</h1>
              <p>Acompanhe o governo de forma simples.</p>
            </div>
          </section>
        )}

        {section === "Presidentes" && (
          <PageHero tone="blue" title="Presidentes do Brasil" subtitle="Ficha técnica e registros de cada mandato.">
            <label className="hero-search">
              <Search size={18} aria-hidden="true" />
              <input
                type="search"
                placeholder="Buscar por nome ou ano..."
                aria-label="Buscar presidente por nome ou ano"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
          </PageHero>
        )}

        {section === "Promessas" && (
          <PageHero tone="green" title="Promessas e ações" subtitle="Cada registro tem status e link para a fonte." />
        )}

        {section === "Mais" && (
          <PageHero tone="navy" title="Fontes e métodos" subtitle="Portais oficiais usados ou indicados por este aplicativo." />
        )}

        {/* Conteúdo (com swipe entre abas) */}
        <div key={section} className={`content ${section === "Início" ? "overlap" : ""}`}>
          {section === "Início" && (
            <>
              {/* Registros catalogados: contagem real da base do app, não uma nota de governo */}
              <section className="dashboard-promises-card" aria-label="Registros do mandato atual por status">
                <div className="ring-container" style={{ background: ringBackground(currentCounts) }}>
                  <div className="ring-inner">
                    <strong>{currentFlat.length}</strong>
                    <span>Registros<br />do mandato</span>
                  </div>
                </div>

                <div className="promises-stats-list">
                  <div className="stat-item">
                    <div className="stat-icon-wrapper green"><Check size={16} strokeWidth={3} /></div>
                    <div className="stat-info">
                      <strong>{currentCounts["Realizado"]}</strong>
                      <span>Realizados</span>
                    </div>
                  </div>

                  <div className="stat-item">
                    <div className="stat-icon-wrapper yellow"><Clock size={16} strokeWidth={3} /></div>
                    <div className="stat-info">
                      <strong>{currentCounts["Em andamento"]}</strong>
                      <span>Em andamento</span>
                    </div>
                  </div>

                  <div className="stat-item">
                    <div className="stat-icon-wrapper red"><X size={16} strokeWidth={3} /></div>
                    <div className="stat-info">
                      <strong>{currentCounts["Não cumprido"]}</strong>
                      <span>Não cumpridos</span>
                    </div>
                  </div>

                  <div className="stat-item">
                    <div className="stat-icon-wrapper gray"><HelpCircle size={16} strokeWidth={3} /></div>
                    <div className="stat-info">
                      <strong>{currentCounts["A validar"]}</strong>
                      <span>A validar</span>
                    </div>
                  </div>
                </div>
              </section>

              <button className="notice notice-button" onClick={() => go("Promessas")}>
                <Info size={16} />
                <span>
                  Mostrando só o mandato atual{currentName ? ` (${currentName})` : ""}. Registros com fonte; não é uma nota do governo. Toque para ver cada um.
                </span>
              </button>

              {/* Economia ao vivo (Banco Central) */}
              <section aria-label="Economia ao vivo">
                <div className="section-head">
                  <div>
                    <h2>Economia ao vivo</h2>
                    <small>Banco Central do Brasil</small>
                  </div>
                  <button
                    className="refresh-btn"
                    onClick={() => void reload()}
                    disabled={refreshing}
                    aria-label="Atualizar indicadores do Banco Central"
                  >
                    <RefreshCw size={15} className={refreshing ? "spin" : undefined} />
                  </button>
                </div>

                <div className="econ-scroll" data-no-swipe>
                  {seriesDefs.map((def) => {
                    const view = describeSeries(def.id, bcb[def.id]);
                    const style = econStyle[def.id];
                    return (
                      <article key={def.id} className={`econ-tile ${style.tone}`}>
                        {style.icon}
                        <span className="econ-label">{def.label}</span>
                        <strong>{view.value}</strong>
                        <small>{view.caption}</small>
                      </article>
                    );
                  })}
                </div>

                <a className="text-link block-link" href="https://www.bcb.gov.br/" target="_blank" rel="noreferrer">
                  Ver séries no Banco Central ↗
                </a>
              </section>

              {/* Saúde, educação e segurança: toque para ver detalhes e fonte */}
              <section aria-label="Saúde, educação e segurança">
                <div className="section-head">
                  <div>
                    <h2>Saúde, educação e segurança</h2>
                    <small>Toque para ver detalhes e fonte</small>
                  </div>
                </div>

                <div className="social-list">
                  {socialIndicators.map((s) => (
                    <details key={s.id} className="social-item">
                      <summary>
                        <div className={`social-icon ${socialStyle[s.id].tone}`}>{socialStyle[s.id].icon}</div>
                        <div className="social-main">
                          <strong>{s.name}</strong>
                          <span>{s.caption}</span>
                        </div>
                        <span className="social-value">{s.headline}</span>
                        <ChevronDown className="chev" size={18} aria-hidden="true" />
                      </summary>
                      <div className="social-body">
                        <strong>{s.title}</strong>
                        {s.lines.map((line) => <p key={line}>{line}</p>)}
                        <a className="text-link small" href={s.url} target="_blank" rel="noreferrer">
                          Fonte: {s.source} ↗
                        </a>
                      </div>
                    </details>
                  ))}
                </div>

                <p className="muted-text footnote">
                  Valores publicados por cada fonte e conferidos em {socialCheckedAt}. Não são atualizados automaticamente.
                </p>
              </section>

              {/* Combustíveis: ainda sem integração com a ANP */}
              <section className="soon-card">
                <div className="soon-icon"><Fuel size={18} /></div>
                <div className="soon-copy">
                  <strong>Combustíveis · em breve</strong>
                  <p>Os preços ainda não estão conectados à base da ANP, então o app não mostra valores.</p>
                  <a className="text-link" href="https://www.gov.br/anp/pt-br" target="_blank" rel="noreferrer">
                    Consultar na ANP ↗
                  </a>
                </div>
              </section>
            </>
          )}

          {/* Presidentes */}
          {section === "Presidentes" && (
            <section className="page-section">
              {!searching && (
                <div className="chip-row" role="group" aria-label="Período da lista">
                  <button
                    className={`chip ${!showAllPresidents ? "active" : ""}`}
                    onClick={() => setShowAllPresidents(false)}
                  >
                    Desde 2000
                  </button>
                  <button
                    className={`chip ${showAllPresidents ? "active" : ""}`}
                    onClick={() => setShowAllPresidents(true)}
                  >
                    Desde 1889
                  </button>
                </div>
              )}

              {presidentGroups.map((group) => (
                group.items.length > 0 && (
                  <div key={group.label} className="president-group">
                    <h2 className="group-title">{group.label}</h2>
                    <div className="president-list">
                      {group.items.map((p) => {
                        const n = mandateRecords[p.id]?.length ?? 0;
                        return (
                          <button key={p.id} className="president-row" onClick={() => setSelectedPresident(p)}>
                            <PresidentAvatar p={p} size="sm" />
                            <div className="president-main">
                              <strong>{p.name}</strong>
                              <span>
                                {p.start}–{p.end ?? "atual"}
                                {searching ? ` · ${p.period}` : ""}
                              </span>
                              <em className={`count-pill ${n > 0 ? "has" : ""}`}>
                                {n > 0 ? `${n} registro${n > 1 ? "s" : ""}` : "sem registros"}
                              </em>
                            </div>
                            <ChevronRight size={18} color="#cbd5e1" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )
              ))}

              {visiblePresidents.length === 0 && (
                <p className="muted-text empty-state">Nenhum presidente encontrado para essa busca.</p>
              )}
            </section>
          )}

          {/* Promessas */}
          {section === "Promessas" && (
            <section className="page-section">
              <div className="notice">
                <Info size={16} />
                <span>
                  Amostra inicial de {totalRecords} registros em {new Set(flatRecords.map((r) => r.presidentId)).size} mandatos.
                  O status descreve cada item, não avalia o presidente. “A validar” indica que falta confirmar em fonte oficial.
                </span>
              </div>

              <div className="chip-row" role="group" aria-label="Filtrar por status">
                <button
                  className={`chip ${statusFilter === "Todos" ? "active" : ""}`}
                  onClick={() => setStatusFilter("Todos")}
                >
                  Todos ({totalRecords})
                </button>
                {mandateStatuses.map((s) => (
                  <button
                    key={s}
                    className={`chip ${statusFilter === s ? "active" : ""}`}
                    onClick={() => setStatusFilter(s)}
                  >
                    {s} ({statusCounts[s]})
                  </button>
                ))}
              </div>

              {/* Mandato em exercício, separado do histórico */}
              {currentMandate && (
                <section className="current-block" aria-label="Promessas do mandato atual">
                  <div className="current-head">
                    <span className="current-badge">Mandato atual</span>
                    <strong>{currentMandate.name.split(" — ")[0]}</strong>
                    <small>Em exercício desde {currentMandate.start}</small>
                  </div>
                  <p className="muted-text">
                    Outros levantamentos contam de formas diferentes: o g1 acompanhou 36 compromissos de 2022 até 30/06/2026 e
                    apontou 26 cumpridos, 4 em parte e 6 não cumpridos; a Folha acompanhou 103 promessas em janeiro de 2025 e
                    apontou 28% cumpridas. A lista abaixo reúne os itens que foi possível confirmar em fontes.
                  </p>
                  <div className="record-list">
                    {currentRecords.map((r) => <RecordCard key={`${r.presidentId}-${r.title}`} r={r} />)}
                    {currentRecords.length === 0 && (
                      <p className="muted-text empty-state">Nenhum registro do mandato atual com esse status.</p>
                    )}
                  </div>
                </section>
              )}

              <div className="president-group">
                <h2 className="group-title">Mandatos anteriores</h2>
                <div className="record-list">
                  {pastRecords.map((r) => <RecordCard key={`${r.presidentId}-${r.title}`} r={r} />)}
                  {pastRecords.length === 0 && (
                    <p className="muted-text empty-state">Nenhum registro com esse status.</p>
                  )}
                </div>
              </div>

              <a
                href="https://portaldatransparencia.gov.br/"
                target="_blank"
                rel="noreferrer"
                className="text-link block-link"
              >
                Acessar o Portal da Transparência ↗
              </a>
            </section>
          )}

          {/* Mais: fontes oficiais */}
          {section === "Mais" && (
            <section className="page-section">
              <div className="notice">
                <Info size={16} />
                <span>
                  Economia (IPCA, Selic, dólar e desemprego) vem ao vivo do Banco Central. Saúde, educação e segurança são os últimos valores publicados pelas fontes, com data e link. Combustíveis ainda não estão conectados.
                  A lista de presidentes é uma base inicial e deve ser conferida no Arquivo Nacional e na Biblioteca da Presidência.
                </span>
              </div>

              <div className="source-list">
                {sources.map((s) => (
                  <a key={s.url} href={s.url} target="_blank" rel="noreferrer" className="president-row link-row">
                    <div className="president-main">
                      <strong>{s.name}</strong>
                      <span>{s.description}</span>
                    </div>
                    <ExternalLink size={16} color="#0d253f" />
                  </a>
                ))}
              </div>

              <div className="president-group">
                <h2 className="group-title">Fontes das promessas do mandato atual</h2>
                <div className="notice">
                  <Info size={16} />
                  <span>
                    Se uma medida foi aprovada, sancionada ou promulgada, a prova está em fonte oficial (Senado, Câmara, Congresso, ministérios).
                    Já “cumprida” ou “não cumprida” é uma avaliação: ela vem dos balanços da imprensa (g1, Folha, ND Mais), marcados como Imprensa. Não existe placar oficial do governo.
                  </span>
                </div>
                <div className="source-list">
                  {promiseSources.map((s) => (
                    <a key={s.url} href={s.url} target="_blank" rel="noreferrer" className="president-row link-row">
                      <div className="president-main">
                        <strong>{s.name}</strong>
                        <span>{s.description}</span>
                        <em className={`kind-pill ${s.kind === "Oficial" ? "official" : "press"}`}>{s.kind}</em>
                      </div>
                      <ExternalLink size={16} color="#0d253f" />
                    </a>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Ficha do presidente (abre de baixo para cima) */}
      {selectedPresident && (
        <div className="modal-backdrop" onClick={() => setSelectedPresident(null)}>
          <div
            className="detail-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Ficha de ${selectedPresident.name}`}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="sheet-handle" aria-hidden="true" />
            <button className="modal-close" aria-label="Fechar" onClick={() => setSelectedPresident(null)}>✕</button>

            <div className="sheet-head">
              <PresidentAvatar p={selectedPresident} size="lg" />
              <div>
                <p className="eyebrow">FICHA TÉCNICA E REGISTROS</p>
                <h2>{selectedPresident.name}</h2>
                <p className="sheet-sub">
                  {selectedPresident.period} · ({selectedPresident.start}–{selectedPresident.end ?? "atual"})
                </p>
              </div>
            </div>

            <div className="detail-grid">
              <div>
                <span>Início</span>
                <strong>{selectedPresident.start}</strong>
              </div>
              <div>
                <span>Fim</span>
                <strong>{selectedPresident.end ?? "Em exercício"}</strong>
              </div>
            </div>

            {selectedPresident.note && (
              <div className="notice">
                <Info size={16} />
                <span>{selectedPresident.note}</span>
              </div>
            )}

            <div className="detail-group">
              <h3>Ações e propostas registradas</h3>
              {mandateRecords[selectedPresident.id]?.length ? (
                mandateRecords[selectedPresident.id].map((rec) => (
                  <div key={rec.title} className={`mandate-record ${statusClass(rec.status)}`}>
                    <div className="record-top">
                      <strong>{rec.title}</strong>
                      <span className={`status-pill ${statusClass(rec.status)}`}>{rec.status}</span>
                    </div>
                    <p>{rec.detail}</p>
                    <a className="text-link small" href={rec.url} target="_blank" rel="noreferrer">
                      Ver fonte oficial ↗
                    </a>
                  </div>
                ))
              ) : (
                <div className="mandate-record">
                  <strong>Sem registros catalogados ainda</strong>
                  <p>Consulte o acervo do Arquivo Nacional para este período presidencial.</p>
                </div>
              )}
            </div>

            <a
              href="https://presidentes.an.gov.br/"
              target="_blank"
              rel="noreferrer"
              className="primary-button full link-button"
            >
              Conferir no Arquivo Nacional <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      )}

      {/* Navegação inferior */}
      <nav className="bottom-floating-nav" aria-label="Navegação inferior">
        <button className={`nav-tab-btn ${section === "Início" ? "active" : ""}`} onClick={() => go("Início")}>
          <Home size={20} />
          <span>Início</span>
        </button>

        <button className={`nav-tab-btn ${section === "Presidentes" ? "active" : ""}`} onClick={() => go("Presidentes")}>
          <Users size={20} />
          <span>Presidentes</span>
        </button>

        <button className="nav-tab-main-btn" aria-label="Painel inicial" onClick={() => go("Início")}>
          <BarChart2 size={24} />
        </button>

        <button className={`nav-tab-btn ${section === "Promessas" ? "active" : ""}`} onClick={() => go("Promessas")}>
          <CheckSquare size={20} />
          <span>Promessas</span>
        </button>

        <button className={`nav-tab-btn ${section === "Mais" ? "active" : ""}`} onClick={() => go("Mais")}>
          <Grid size={20} />
          <span>Mais</span>
        </button>
      </nav>
    </div>
  );
}
