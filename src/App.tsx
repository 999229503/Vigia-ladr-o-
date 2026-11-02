import { useCallback, useEffect, useMemo, useRef, useState, type TouchEvent as ReactTouchEvent } from "react";
import {
  Menu, Check, Clock, HelpCircle, BarChart2, Heart, Coins,
  GraduationCap, ShieldCheck, Home, Users, CheckSquare, Grid, Fuel,
  ChevronRight, ExternalLink, ArrowUpRight, Info, Search, RefreshCw
} from "lucide-react";
import { presidents, type President } from "./data/presidents";
import { mandateRecords, mandateStatuses, type MandateRecord, type MandateStatus } from "./data/mandates";

type Section = "Início" | "Presidentes" | "Promessas" | "Mais";
const pages: Section[] = ["Início", "Presidentes", "Promessas", "Mais"];

/* ------------------------------------------------------------------ */
/* Registros de mandato (derivados de data/mandates.ts)                */
/* ------------------------------------------------------------------ */

type FlatRecord = MandateRecord & { presidentName: string; years: string };

const flatRecords: FlatRecord[] = presidents.flatMap((p) =>
  (mandateRecords[p.id] ?? []).map((r) => ({
    ...r,
    presidentName: p.name,
    years: `${p.start}–${p.end ?? "atual"}`
  }))
);

function countByStatus(records: FlatRecord[]): Record<MandateStatus, number> {
  const counts: Record<MandateStatus, number> = { "Realizado": 0, "Em andamento": 0, "A validar": 0 };
  for (const r of records) counts[r.status] += 1;
  return counts;
}

const statusCounts = countByStatus(flatRecords);

function statusClass(status: MandateStatus): string {
  if (status === "Realizado") return "done";
  if (status === "Em andamento") return "progress";
  return "pending";
}

function ringBackground(counts: Record<MandateStatus, number>): string {
  const total = counts["Realizado"] + counts["Em andamento"] + counts["A validar"];
  if (total === 0) return "#e2e8f0";
  const a = (counts["Realizado"] / total) * 100;
  const b = a + (counts["Em andamento"] / total) * 100;
  return `conic-gradient(#00c853 0% ${a}%, #ff9800 ${a}% ${b}%, #94a3b8 ${b}% 100%)`;
}

/* ------------------------------------------------------------------ */
/* IPCA (Banco Central, SGS 433) com cache local de 24 horas           */
/* ------------------------------------------------------------------ */

type IpcaRow = { data: string; valor: string };
type IpcaData = { valor: number; referencia: string; fetchedAt: number };
type IpcaState =
  | { status: "loading" }
  | { status: "ok"; data: IpcaData; stale: boolean }
  | { status: "error" };

const IPCA_URL = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/1?formato=json";
const IPCA_CACHE_KEY = "observabrasil:ipca:v1";
const IPCA_TTL_MS = 24 * 60 * 60 * 1000;

function readIpcaCache(): IpcaData | null {
  try {
    const raw = localStorage.getItem(IPCA_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<IpcaData>;
    if (
      typeof parsed.valor !== "number" ||
      typeof parsed.referencia !== "string" ||
      typeof parsed.fetchedAt !== "number"
    ) return null;
    return { valor: parsed.valor, referencia: parsed.referencia, fetchedAt: parsed.fetchedAt };
  } catch {
    return null;
  }
}

function writeIpcaCache(data: IpcaData) {
  try {
    localStorage.setItem(IPCA_CACHE_KEY, JSON.stringify(data));
  } catch {
    /* armazenamento indisponível: o app funciona sem cache */
  }
}

function isFresh(data: IpcaData | null): data is IpcaData {
  return data !== null && Date.now() - data.fetchedAt < IPCA_TTL_MS;
}

function formatIpca(valor: number): string {
  const text = valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${valor > 0 ? "+" : ""}${text}%`;
}

function useIpca() {
  const [state, setState] = useState<IpcaState>(() => {
    const cached = readIpcaCache();
    return isFresh(cached) ? { status: "ok", data: cached, stale: false } : { status: "loading" };
  });
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (force: boolean) => {
    const cached = readIpcaCache();
    if (!force && isFresh(cached)) {
      setState({ status: "ok", data: cached, stale: false });
      return;
    }
    setRefreshing(true);
    try {
      const res = await fetch(IPCA_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const rows = (await res.json()) as IpcaRow[];
      const row = rows[0];
      const valor = Number(row?.valor);
      if (!row || !Number.isFinite(valor)) throw new Error("Resposta inválida");
      const [, mes, ano] = row.data.split("/");
      const data: IpcaData = {
        valor,
        referencia: mes && ano ? `${mes}/${ano}` : row.data,
        fetchedAt: Date.now()
      };
      writeIpcaCache(data);
      setState({ status: "ok", data, stale: false });
    } catch {
      setState(cached ? { status: "ok", data: cached, stale: true } : { status: "error" });
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load(false);
  }, [load]);

  const reload = useCallback(() => load(true), [load]);
  return { state, refreshing, reload };
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

type Source = { name: string; description: string; url: string };

const sources: Source[] = [
  { name: "Banco Central do Brasil", description: "IPCA mensal (SGS série 433), consultado direto na API pública", url: "https://www.bcb.gov.br/" },
  { name: "Arquivo Nacional", description: "Biografias e mandatos presidenciais", url: "https://presidentes.an.gov.br/" },
  { name: "Biblioteca da Presidência", description: "Galeria de ex-presidentes", url: "https://www.biblioteca.presidencia.gov.br/presidencia/ex-presidentes" },
  { name: "Portal da Transparência", description: "Gastos e execução orçamentária do governo federal", url: "https://portaldatransparencia.gov.br/" },
  { name: "IBGE / SIDRA", description: "Estatísticas oficiais de população, emprego e economia", url: "https://sidra.ibge.gov.br/" },
  { name: "DATASUS", description: "Informações de saúde pública e sistemas do SUS", url: "https://datasus.saude.gov.br/" },
  { name: "INEP / Ministério da Educação", description: "Indicadores oficiais da educação brasileira (IDEB)", url: "https://www.gov.br/inep/pt-br" },
  { name: "Atlas da Violência / Ipea", description: "Indicadores de violência e segurança pública", url: "https://www.ipea.gov.br/atlasviolencia/" },
  { name: "ANP", description: "Preços de combustíveis (ainda não conectado ao app)", url: "https://www.gov.br/anp/pt-br" }
];

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
  const { state: ipca, refreshing, reload } = useIpca();

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

  const visibleRecords = useMemo(
    () => (statusFilter === "Todos" ? flatRecords : flatRecords.filter((r) => r.status === statusFilter)),
    [statusFilter]
  );

  const totalRecords = flatRecords.length;

  return (
    <div className="app-shell">
      {/* Cabeçalho */}
      <header className="site-header">
        <div className="site-header-inner">
          <button className="header-icon-btn" aria-label="Fontes e métodos" onClick={() => go("Mais")}>
            <Menu size={20} />
          </button>

          <button className="brand" onClick={() => go("Início")} aria-label="Ir para o início">
            <div className="brand-mark">
              <svg viewBox="0 0 100 100" width="28" height="28" aria-hidden="true">
                <path d="M15 35 Q50 15 85 35 Q90 65 50 85 Q10 65 15 35 Z" fill="#00c853" />
                <circle cx="50" cy="50" r="20" fill="#0047bb" />
              </svg>
            </div>
            <div className="brand-copy">
              <strong>Observa</strong>
              <small>Brasil</small>
            </div>
          </button>

          <span className="header-icon-btn header-spacer" aria-hidden="true" />
        </div>
      </header>

      {/* Conteúdo (com swipe entre abas) */}
      <main className="main-area" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <div className="content">
          {section === "Início" && (
            <>
              <section className="greeting-section" style={{ paddingTop: "8px" }}>
                <h1>Olá, Cidadão!</h1>
                <p>Aqui você acompanha o governo de forma simples e visual.</p>
              </section>

              {/* Registros catalogados: contagem real da base do app, não uma nota de governo */}
              <section className="dashboard-promises-card" aria-label="Registros catalogados por status">
                <div className="ring-container" style={{ background: ringBackground(statusCounts) }}>
                  <div className="ring-inner">
                    <strong>{totalRecords}</strong>
                    <span>Registros<br />catalogados</span>
                  </div>
                </div>

                <div className="promises-stats-list">
                  <div className="stat-item">
                    <div className="stat-icon-wrapper green"><Check size={16} strokeWidth={3} /></div>
                    <div className="stat-info">
                      <strong>{statusCounts["Realizado"]}</strong>
                      <span>Realizados</span>
                    </div>
                  </div>

                  <div className="stat-item">
                    <div className="stat-icon-wrapper orange"><Clock size={16} strokeWidth={3} /></div>
                    <div className="stat-info">
                      <strong>{statusCounts["Em andamento"]}</strong>
                      <span>Em andamento</span>
                    </div>
                  </div>

                  <div className="stat-item">
                    <div className="stat-icon-wrapper gray"><HelpCircle size={16} strokeWidth={3} /></div>
                    <div className="stat-info">
                      <strong>{statusCounts["A validar"]}</strong>
                      <span>A validar</span>
                    </div>
                  </div>
                </div>
              </section>

              <button className="notice notice-button" onClick={() => go("Promessas")}>
                <Info size={16} />
                <span>
                  Amostra inicial de registros com fonte. Não é uma nota do governo. Toque para ver cada registro.
                </span>
              </button>

              {/* Indicadores */}
              <section className="indicators-grid" aria-label="Indicadores">
                <div className="indicator-card-v3">
                  <div className="indicator-head">
                    <div className="indicator-icon-bg gold"><Coins size={20} /></div>
                    <div className="indicator-title-group">
                      <span>Economia · IPCA</span>
                      {ipca.status === "loading" && <strong>Carregando…</strong>}
                      {ipca.status === "error" && <strong>Indisponível</strong>}
                      {ipca.status === "ok" && <strong>{formatIpca(ipca.data.valor)}</strong>}
                      <small>
                        {ipca.status === "ok" && !ipca.stale && `Ref. ${ipca.data.referencia} · Banco Central`}
                        {ipca.status === "ok" && ipca.stale && `Ref. ${ipca.data.referencia} · sem conexão`}
                        {ipca.status === "error" && "Sem conexão com o BCB"}
                        {ipca.status === "loading" && "Banco Central"}
                      </small>
                    </div>
                  </div>
                  <button
                    className="indicator-refresh"
                    onClick={() => void reload()}
                    disabled={refreshing}
                    aria-label="Atualizar IPCA"
                  >
                    <RefreshCw size={14} className={refreshing ? "spin" : undefined} />
                  </button>
                </div>

                <a className="indicator-card-v3 indicator-link" href="https://datasus.saude.gov.br/" target="_blank" rel="noreferrer">
                  <div className="indicator-head">
                    <div className="indicator-icon-bg pink"><Heart size={20} /></div>
                    <div className="indicator-title-group">
                      <span>Saúde</span>
                      <strong>A validar</strong>
                      <small>Ver DATASUS ↗</small>
                    </div>
                  </div>
                </a>

                <a className="indicator-card-v3 indicator-link" href="https://www.gov.br/inep/pt-br" target="_blank" rel="noreferrer">
                  <div className="indicator-head">
                    <div className="indicator-icon-bg blue"><GraduationCap size={20} /></div>
                    <div className="indicator-title-group">
                      <span>Educação</span>
                      <strong>A validar</strong>
                      <small>Ver INEP ↗</small>
                    </div>
                  </div>
                </a>

                <a className="indicator-card-v3 indicator-link" href="https://www.ipea.gov.br/atlasviolencia/" target="_blank" rel="noreferrer">
                  <div className="indicator-head">
                    <div className="indicator-icon-bg shield"><ShieldCheck size={20} /></div>
                    <div className="indicator-title-group">
                      <span>Segurança</span>
                      <strong>A validar</strong>
                      <small>Ver Atlas da Violência ↗</small>
                    </div>
                  </div>
                </a>
              </section>

              {/* Combustíveis: ainda sem integração com a ANP */}
              <section className="fuel-card-container">
                <div className="fuel-card-title">
                  <Fuel size={18} color="#0d253f" />
                  <span>Combustíveis - ANP</span>
                </div>
                <p className="muted-text">
                  Os preços ainda não estão conectados à base da ANP, então o app não mostra valores aqui.
                </p>
                <a className="text-link" href="https://www.gov.br/anp/pt-br" target="_blank" rel="noreferrer">
                  Consultar preços na ANP ↗
                </a>
              </section>
            </>
          )}

          {/* Presidentes */}
          {section === "Presidentes" && (
            <section className="page-section">
              <div className="greeting-section" style={{ paddingTop: "8px" }}>
                <h1>Presidentes do Brasil</h1>
                <p>Consulte a ficha técnica e os registros históricos de cada mandato.</p>
              </div>

              <div className="search-box">
                <Search size={18} color="#64748b" />
                <input
                  type="search"
                  placeholder="Buscar por nome ou ano..."
                  aria-label="Buscar presidente por nome ou ano"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <div className="president-list">
                {visiblePresidents.map((p) => {
                  const n = mandateRecords[p.id]?.length ?? 0;
                  return (
                    <button key={p.id} className="president-row" onClick={() => setSelectedPresident(p)}>
                      <div className="avatar">
                        {p.name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("")}
                      </div>
                      <div className="president-main">
                        <strong>{p.name}</strong>
                        <span>
                          {p.period} ({p.start}–{p.end ?? "atual"})
                          {n > 0 ? ` · ${n} registro${n > 1 ? "s" : ""}` : ""}
                        </span>
                      </div>
                      <ChevronRight size={18} color="#cbd5e1" />
                    </button>
                  );
                })}
                {visiblePresidents.length === 0 && (
                  <p className="muted-text empty-state">Nenhum presidente encontrado para essa busca.</p>
                )}
              </div>

              {!searching && (
                <button className="ghost-button" onClick={() => setShowAllPresidents((v) => !v)}>
                  {showAllPresidents ? "Mostrar só de 2000 em diante" : "Ver histórico completo (desde 1889)"}
                </button>
              )}
            </section>
          )}

          {/* Promessas */}
          {section === "Promessas" && (
            <section className="page-section" style={{ paddingTop: "8px" }}>
              <div className="greeting-section">
                <h1>Promessas e ações</h1>
                <p>Registros de mandato com status e link para a fonte.</p>
              </div>

              <div className="notice">
                <Info size={16} />
                <span>
                  Amostra inicial de {totalRecords} registros em {new Set(flatRecords.map((r) => r.presidentName)).size} mandatos.
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

              <div className="record-list">
                {visibleRecords.map((r) => (
                  <article key={`${r.presidentName}-${r.title}`} className="record-card">
                    <div className="record-top">
                      <strong>{r.title}</strong>
                      <span className={`status-pill ${statusClass(r.status)}`}>{r.status}</span>
                    </div>
                    <small className="record-meta">{r.presidentName} · {r.years} · {r.category}</small>
                    <p>{r.detail}</p>
                    <a className="text-link" href={r.url} target="_blank" rel="noreferrer">Ver fonte ↗</a>
                  </article>
                ))}
                {visibleRecords.length === 0 && (
                  <p className="muted-text empty-state">Nenhum registro com esse status.</p>
                )}
              </div>

              <a
                href="https://portaldatransparencia.gov.br/"
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                Acessar o Portal da Transparência ↗
              </a>
            </section>
          )}

          {/* Mais: fontes oficiais */}
          {section === "Mais" && (
            <section className="page-section" style={{ paddingTop: "8px" }}>
              <div className="greeting-section">
                <h1>Fontes oficiais e métodos</h1>
                <p>Portais governamentais usados ou indicados por este aplicativo.</p>
              </div>

              <div className="notice">
                <Info size={16} />
                <span>
                  Hoje só o IPCA vem de uma API ao vivo. Os demais indicadores aparecem como “A validar” até serem conectados à fonte.
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
            </section>
          )}
        </div>
      </main>

      {/* Ficha do presidente */}
      {selectedPresident && (
        <div className="modal-backdrop" onClick={() => setSelectedPresident(null)}>
          <div
            className="detail-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Ficha de ${selectedPresident.name}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" aria-label="Fechar" onClick={() => setSelectedPresident(null)}>✕</button>
            <p className="eyebrow">FICHA TÉCNICA E REGISTROS</p>
            <h2 style={{ fontSize: 20, color: "#0d253f" }}>{selectedPresident.name}</h2>
            <p style={{ fontSize: 12, color: "#64748b" }}>
              {selectedPresident.period} · ({selectedPresident.start}–{selectedPresident.end ?? "atual"})
            </p>

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
                  <div key={rec.title} className="mandate-record">
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
