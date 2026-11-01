
import { useState, useMemo, useEffect } from "react";
import {
  Menu,
  User,
  Check,
  Clock,
  X,
  Home,
  Users,
  BarChart3,
  ListChecks,
  Grid3X3,
  ChevronRight,
  Search,
  Fuel,
  TrendingUp,
} from "lucide-react";

import { presidents } from "./data/presidents";
import type { President } from "./data/presidents";

type Section =
  | "Início"
  | "Presidentes"
  | "Promessas"
  | "Mandato atual"
  | "Fontes e método"
  | "Economia"
  | "Saúde"
  | "Educação"
  | "Segurança"
  | "Gastos públicos";

type IpcaData = {
  valor: number;
  data: string;
};

const CACHE_KEY = "observabrasil_ipca_v3";
const CACHE_TIME = 24 * 60 * 60 * 1000;

const fontes = {
  presidencia: "https://www.biblioteca.presidencia.gov.br/presidencia/ex-presidentes",
  arquivo: "https://www.gov.br/arquivonacional/pt-br",
  bcb: "https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/12?formato=json",
  ibge: "https://sidra.ibge.gov.br/",
  anp: "https://www.gov.br/anp/pt-br/assuntos/dados-estatisticos",
  datasus: "https://datasus.saude.gov.br/",
  inep: "https://www.gov.br/inep/pt-br",
  ipea: "https://www.ipea.gov.br/atlasviolencia/",
  transparencia: "https://portaldatransparencia.gov.br/",
  camara: "https://www.camara.leg.br/",
  tse: "https://divulgacandcontas.tse.jus.br/",
};

const presidentPhotos: Record<string, string> = {
  deodoro:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Deodoro_da_Fonseca_1890.jpg/440px-Deodoro_da_Fonseca_1890.jpg",
  "lula-3":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Lula_-_foto_oficial_-_2023-01-09.jpg/440px-Lula_-_foto_oficial_-_2023-01-09.jpg",
  bolsonaro:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Presidente_Jair_Bolsonaro_%28foto_oficial%29.jpg/440px-Presidente_Jair_Bolsonaro_%28foto_oficial%29.jpg",
};

function formatDate(value: string) {
  if (!value) return "Data não informada";

  const parts = value.split("/");
  if (parts.length !== 3) return value;

  return `${parts[0]}/${parts[1]}/${parts[2]}`;
}

function getPresidentPhoto(p: President) {
  return (
    presidentPhotos[p.id] ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      p.name
    )}&background=1a3c6e&color=fff&size=200`
  );
}

function getPresidentDescription(p: President) {
  if (p.note) return p.note;

  return "Registro histórico em processo de conferência documental. As informações sobre realizações, decisões e compromissos precisam ser verificadas em fontes oficiais antes de receber uma avaliação.";
}

function SourceLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-primary"
    >
      {children}
    </a>
  );
}

export default function App() {
  const [section, setSection] = useState<Section>("Início");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<President | null>(null);

  const [ipca, setIpca] = useState<IpcaData | null>(null);
  const [loadingIpca, setLoadingIpca] = useState(true);
  const [ipcaError, setIpcaError] = useState(false);
  const [updatedAt, setUpdatedAt] = useState("");

  const filtered = useMemo(
    () =>
      presidents.filter((p) =>
        `${p.name} ${p.period} ${p.start} ${p.end ?? ""}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [query]
  );

  const change = (s: Section) => {
    setSection(s);
    setSelected(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  async function loadIpca(force = false) {
    setLoadingIpca(true);
    setIpcaError(false);

    try {
      if (!force) {
        const saved = localStorage.getItem(CACHE_KEY);

        if (saved) {
          const parsed = JSON.parse(saved);
          const fresh =
            Date.now() - parsed.savedAt < CACHE_TIME;

          if (fresh && parsed.data) {
            setIpca(parsed.data);
            setUpdatedAt(
              new Date(parsed.savedAt).toLocaleString("pt-BR")
            );
            setLoadingIpca(false);
            return;
          }
        }
      }

      const response = await fetch(
        "https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/12?formato=json"
      );

      if (!response.ok) {
        throw new Error("Não foi possível consultar o Banco Central.");
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("A API não retornou dados.");
      }

      const latest = data[data.length - 1];

      const result: IpcaData = {
        valor: Number(latest.valor),
        data: latest.data,
      };

      if (!Number.isFinite(result.valor)) {
        throw new Error("Valor do IPCA inválido.");
      }

      setIpca(result);

      const now = Date.now();

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data: result,
          savedAt: now,
        })
      );

      setUpdatedAt(new Date(now).toLocaleString("pt-BR"));
    } catch (error) {
      console.error("Erro ao consultar IPCA:", error);

      setIpcaError(true);

      const saved = localStorage.getItem(CACHE_KEY);

      if (saved) {
        try {
          const parsed = JSON.parse(saved);

          if (parsed.data) {
            setIpca(parsed.data);
            setUpdatedAt(
              new Date(parsed.savedAt).toLocaleString("pt-BR")
            );
          }
        } catch {
          setIpca(null);
        }
      }
    } finally {
      setLoadingIpca(false);
    }
  }

  useEffect(() => {
    loadIpca();
  }, []);

  const currentPresident = presidents.find(
    (p) => p.id === "lula-3"
  );

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <button
            className="icon-btn"
            type="button"
            aria-label="Abrir fontes e método"
            onClick={() => change("Fontes e método")}
          >
            <Menu size={22} />
          </button>

          <div className="brand">
            <span>🇧🇷</span>
            <strong>
              Observa
              <br />
              Brasil
            </strong>
          </div>

          <button
            className="icon-btn"
            type="button"
            aria-label="Abrir mandato atual"
            onClick={() => change("Mandato atual")}
          >
            <User size={22} />
          </button>
        </div>
      </header>

      <main className="main-area">
        <div className="content">
          {section === "Início" && (
            <div className="dashboard-v2">
              <h1 className="greet">Olá, Cidadão!</h1>

              <p className="sub">
                Acompanhe o governo, consulte indicadores e
                confira informações com fontes oficiais.
              </p>

              <button
                className="card-main"
                type="button"
                onClick={() => change("Promessas")}
              >
                <div className="ring">
                  <div>
                    <b>—</b>
                    <small>
                      Avaliação
                      <br />
                      das promessas
                    </small>
                  </div>
                </div>

                <div className="stats">
                  <div>
                    <i className="g">
                      <Check size={14} />
                    </i>
                    <div>
                      <b>—</b>
                      <span>Comprovadas</span>
                    </div>
                  </div>

                  <div>
                    <i className="o">
                      <Clock size={14} />
                    </i>
                    <div>
                      <b>—</b>
                      <span>Em andamento</span>
                    </div>
                  </div>

                  <div>
                    <i className="r">
                      <X size={14} />
                    </i>
                    <div>
                      <b>—</b>
                      <span>Não cumpridas</span>
                    </div>
                  </div>
                </div>
              </button>

              <div className="grid4">
                <button
                  type="button"
                  onClick={() => change("Economia")}
                >
                  <i>💰</i>
                  <strong>Economia</strong>
                  <span>
                    {loadingIpca
                      ? "Consultando..."
                      : ipca
                      ? `IPCA ${ipca.valor.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}%`
                      : "Consultar dados"}
                  </span>
                  <em className="mini-green">
                    <TrendingUp size={10} /> Banco Central
                  </em>
                </button>

                <button
                  type="button"
                  onClick={() => change("Saúde")}
                >
                  <i>❤️</i>
                  <strong>Saúde</strong>
                  <span>Dados oficiais</span>
                  <em className="mini-gray">DATASUS</em>
                </button>

                <button
                  type="button"
                  onClick={() => change("Educação")}
                >
                  <i>🎓</i>
                  <strong>Educação</strong>
                  <span>Dados oficiais</span>
                  <em className="mini-gray">INEP</em>
                </button>

                <button
                  type="button"
                  onClick={() => change("Segurança")}
                >
                  <i>🛡️</i>
                  <strong>Segurança</strong>
                  <span>Dados oficiais</span>
                  <em className="mini-gray">IPEA</em>
                </button>
              </div>

              <div className="fuel-card">
                <h3>
                  <Fuel size={16} /> Indicadores econômicos
                </h3>

                <div className="fuel-grid">
                  <div>
                    <strong>IPCA mensal</strong>
                    <b>
                      {loadingIpca
                        ? "..."
                        : ipca
                        ? `${ipca.valor.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}%`
                        : "Indisponível"}
                    </b>
                    <span>
                      {ipca ? formatDate(ipca.data) : "Banco Central"}
                    </span>
                  </div>

                  <div>
                    <strong>Combustíveis</strong>
                    <b>Consultar</b>
                    <span>Dados da ANP</span>
                  </div>

                  <div>
                    <strong>PIB</strong>
                    <b>Consultar</b>
                    <span>Dados do IBGE</span>
                  </div>
                </div>

                <small>
                  {ipcaError
                    ? "Não foi possível atualizar. Verifique a fonte oficial."
                    : updatedAt
                    ? `Última consulta: ${updatedAt}`
                    : "Fonte: Banco Central do Brasil"}
                </small>

                <button
                  className="btn-primary"
                  type="button"
                  onClick={() => loadIpca(true)}
                  disabled={loadingIpca}
                >
                  {loadingIpca
                    ? "Atualizando..."
                    : "Atualizar indicador"}
                </button>
              </div>

              <button
                className="banner"
                type="button"
                onClick={() => change("Gastos públicos")}
              >
                <img
                  src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=900"
                  alt=""
                />
                <div>
                  <small>ACOMPANHE O DINHEIRO PÚBLICO</small>
                  <h2>
                    Veja como os recursos públicos são aplicados.
                  </h2>
                </div>
              </button>
            </div>
          )}

          {section !== "Início" && (
            <div className="page-card">
              <div className="page-head">
                <h1>{section}</h1>

                <button
                  className="btn-primary"
                  type="button"
                  onClick={() => change("Início")}
                >
                  Voltar
                </button>
              </div>

              {section === "Presidentes" && (
                <>
                  <div className="search">
                    <Search size={16} />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Buscar presidente..."
                    />
                  </div>

                  <div className="list">
                    {filtered.map((p) => (
                      <button
                        key={p.id}
                        className="row"
                        type="button"
                        onClick={() => setSelected(p)}
                      >
                        <div className="avatar">
                          {p.name.slice(0, 2).toUpperCase()}
                        </div>

                        <div className="row-text">
                          <strong>{p.name}</strong>
                          <span>
                            {p.start} – {p.end ?? "Em andamento"} ·{" "}
                            {p.period}
                          </span>
                        </div>

                        <ChevronRight size={16} />
                      </button>
                    ))}

                    {filtered.length === 0 && (
                      <div className="info-box">
                        Nenhum presidente encontrado.
                      </div>
                    )}
                  </div>
                </>
              )}

              {section === "Mandato atual" && (
                <>
                  <div className="info-box">
                    <strong>Mandato iniciado em 2023</strong>

                    <p>
                      Esta área acompanha os compromissos, decisões,
                      ações e resultados do mandato atual.
                    </p>

                    {currentPresident && (
                      <p>
                        Presidente cadastrado:{" "}
                        {currentPresident.name}
                      </p>
                    )}

                    <p>
                      Nenhum percentual geral será apresentado sem
                      uma metodologia verificável e evidências
                      documentais para cada avaliação.
                    </p>
                  </div>

                  <div className="modal-block">
                    <strong>O que será acompanhado</strong>
                    <ul>
                      <li>Promessas do plano de governo.</li>
                      <li>Projetos de lei e medidas aprovadas.</li>
                      <li>Obras e programas anunciados.</li>
                      <li>Indicadores econômicos e sociais.</li>
                      <li>Resultados comprovados por fontes públicas.</li>
                    </ul>
                  </div>

                  <SourceLink href={fontes.tse}>
                    Consultar planos de governo no TSE
                  </SourceLink>

                  <SourceLink href={fontes.transparencia}>
                    Consultar Portal da Transparência
                  </SourceLink>
                </>
              )}

              {section === "Promessas" && (
                <>
                  <div className="info-box">
                    <strong>Acompanhamento das promessas</strong>

                    <p>
                      Cada compromisso precisa ser comparado com
                      documentos oficiais, ações realizadas e
                      resultados comprovados.
                    </p>

                    <p>
                      Nesta versão, a avaliação individual ainda
                      está em construção. Por isso, não exibimos
                      números inventados de promessas cumpridas,
                      em andamento ou não cumpridas.
                    </p>
                  </div>

                  <div className="modal-block">
                    <strong>Critérios de avaliação</strong>
                    <ul>
                      <li>
                        Cumprida: existe evidência de conclusão
                        integral do compromisso.
                      </li>
                      <li>
                        Em andamento: há execução comprovada,
                        mas ainda não concluída.
                      </li>
                      <li>
                        Não cumprida: o prazo ou período de
                        avaliação terminou sem cumprimento
                        comprovado.
                      </li>
                      <li>
                        Sem avaliação: não há evidência suficiente
                        para classificar.
                      </li>
                    </ul>
                  </div>

                  <SourceLink href={fontes.tse}>
                    Consultar plano de governo no TSE
                  </SourceLink>
                </>
              )}

              {section === "Economia" && (
                <>
                  <div className="detail-grid">
                    <div className="stat-box">
                      <TrendingUp size={20} />

                      <strong>
                        {loadingIpca
                          ? "Consultando..."
                          : ipca
                          ? `${ipca.valor.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}%`
                          : "Indisponível"}
                      </strong>

                      <span>IPCA mensal · Banco Central</span>
                    </div>

                    <div className="stat-box">
                      <Fuel size={20} />
                      <strong>ANP</strong>
                      <span>Preços de combustíveis</span>
                    </div>

                    <div className="stat-box">
                      <TrendingUp size={20} />
                      <strong>IBGE</strong>
                      <span>PIB e atividade econômica</span>
                    </div>

                    <div className="stat-box">
                      <BarChart3 size={20} />
                      <strong>Banco Central</strong>
                      <span>Indicadores econômicos</span>
                    </div>
                  </div>

                  <div className="info-box">
                    <strong>Sobre o IPCA</strong>
                    <p>
                      O IPCA mede a variação de preços de uma cesta
                      de produtos e serviços consumidos pelas
                      famílias. O número exibido é a variação
                      mensal, não a inflação acumulada em 12 meses.
                    </p>

                    <p>
                      {ipca
                        ? `Referência: ${formatDate(ipca.data)}.`
                        : "O indicador ainda não foi carregado."}
                    </p>

                    {ipcaError && (
                      <p>
                        A consulta automática falhou. O valor
                        anterior, quando disponível, pode estar
                        desatualizado.
                      </p>
                    )}
                  </div>

                  <SourceLink href={fontes.bcb}>
                    Consultar série oficial do IPCA
                  </SourceLink>

                  <SourceLink href={fontes.ibge}>
                    Consultar dados do IBGE
                  </SourceLink>

                  <SourceLink href={fontes.anp}>
                    Consultar preços da ANP
                  </SourceLink>

                  <button
                    className="btn-primary"
                    type="button"
                    onClick={() => loadIpca(true)}
                    disabled={loadingIpca}
                  >
                    {loadingIpca
                      ? "Atualizando..."
                      : "Atualizar IPCA"}
                  </button>
                </>
              )}

              {section === "Saúde" && (
                <>
                  <div className="info-box">
                    <strong>Indicadores da saúde pública</strong>

                    <p>
                      Acompanhe dados do SUS, atendimentos,
                      internações, vacinação, mortalidade e
                      estrutura de saúde.
                    </p>

                    <p>
                      Os indicadores numéricos ainda não estão
                      integrados automaticamente nesta versão.
                      Não exibimos percentuais sem consulta à
                      base correspondente.
                    </p>
                  </div>

                  <SourceLink href={fontes.datasus}>
                    Consultar DATASUS
                  </SourceLink>

                  <SourceLink href="https://www.gov.br/saude/pt-br">
                    Ministério da Saúde
                  </SourceLink>
                </>
              )}

              {section === "Educação" && (
                <>
                  <div className="info-box">
                    <strong>Indicadores da educação</strong>

                    <p>
                      Acompanhe alfabetização, matrículas,
                      aprendizagem, IDEB, evasão escolar e
                      investimentos em educação.
                    </p>

                    <p>
                      Os indicadores ainda precisam ser
                      integrados às bases oficiais. Nenhum
                      resultado estimado será apresentado como
                      dado confirmado.
                    </p>
                  </div>

                  <SourceLink href={fontes.inep}>
                    Consultar INEP
                  </SourceLink>

                  <SourceLink href="https://www.gov.br/mec/pt-br">
                    Ministério da Educação
                  </SourceLink>
                </>
              )}

              {section === "Segurança" && (
                <>
                  <div className="info-box">
                    <strong>Indicadores de segurança pública</strong>

                    <p>
                      Acompanhe homicídios, mortes violentas,
                      roubos, violência e outros indicadores
                      publicados por instituições oficiais.
                    </p>

                    <p>
                      Os números precisam ser comparados por
                      período, população e metodologia. A
                      integração automática ainda está pendente.
                    </p>
                  </div>

                  <SourceLink href={fontes.ipea}>
                    Consultar Atlas da Violência
                  </SourceLink>

                  <SourceLink href="https://www.gov.br/mj/pt-br">
                    Ministério da Justiça
                  </SourceLink>
                </>
              )}

              {section === "Gastos públicos" && (
                <>
                  <div className="info-box">
                    <strong>Fiscalização dos gastos públicos</strong>

                    <p>
                      Consulte despesas, contratos, transferências,
                      pagamentos e execução do orçamento federal.
                    </p>

                    <p>
                      Os valores precisam ser identificados por
                      órgão, período, natureza da despesa e fonte.
                      Esta versão ainda não consolida esses dados
                      automaticamente.
                    </p>
                  </div>

                  <SourceLink href={fontes.transparencia}>
                    Portal da Transparência
                  </SourceLink>

                  <SourceLink href="https://www.tesourotransparente.gov.br/">
                    Tesouro Transparente
                  </SourceLink>

                  <SourceLink href={fontes.camara}>
                    Câmara dos Deputados
                  </SourceLink>
                </>
              )}

              {section === "Fontes e método" && (
                <>
                  <div className="info-box">
                    <strong>Transparência e metodologia</strong>

                    <p>
                      O Observa Brasil utiliza fontes públicas.
                      Cada indicador deverá apresentar sua origem,
                      período de referência e critério de cálculo.
                    </p>

                    <p>
                      Quando não houver dados suficientes, a
                      informação será identificada como
                      indisponível ou em apuração.
                    </p>
                  </div>

                  <div className="modal-block">
                    <strong>Fontes históricas</strong>
                    <ul>
                      <li>Biblioteca da Presidência.</li>
                      <li>Arquivo Nacional.</li>
                    </ul>
                  </div>

                  <SourceLink href={fontes.presidencia}>
                    Biblioteca da Presidência
                  </SourceLink>

                  <SourceLink href={fontes.arquivo}>
                    Arquivo Nacional
                  </SourceLink>

                  <div className="modal-block">
                    <strong>Economia</strong>
                    <ul>
                      <li>Banco Central do Brasil.</li>
                      <li>IBGE e SIDRA.</li>
                      <li>Agência Nacional do Petróleo.</li>
                    </ul>
                  </div>

                  <SourceLink href={fontes.bcb}>
                    Banco Central
                  </SourceLink>

                  <SourceLink href={fontes.ibge}>
                    IBGE / SIDRA
                  </SourceLink>

                  <SourceLink href={fontes.anp}>
                    ANP
                  </SourceLink>

                  <div className="modal-block">
                    <strong>Indicadores sociais</strong>
                    <ul>
                      <li>DATASUS e Ministério da Saúde.</li>
                      <li>INEP e Ministério da Educação.</li>
                      <li>IPEA e Atlas da Violência.</li>
                    </ul>
                  </div>

                  <SourceLink href={fontes.datasus}>
                    DATASUS
                  </SourceLink>

                  <SourceLink href={fontes.inep}>
                    INEP
                  </SourceLink>

                  <SourceLink href={fontes.ipea}>
                    IPEA
                  </SourceLink>

                  <div className="modal-block">
                    <strong>Promessas e legislação</strong>
                    <ul>
                      <li>Planos de governo registrados no TSE.</li>
                      <li>Projetos e leis publicados oficialmente.</li>
                      <li>Documentos e relatórios de execução.</li>
                    </ul>
                  </div>

                  <SourceLink href={fontes.tse}>
                    TSE
                  </SourceLink>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      <nav className="bottom">
        <button
          type="button"
          className={section === "Início" ? "active" : ""}
          onClick={() => change("Início")}
        >
          <Home size={20} />
          <span>Início</span>
        </button>

        <button
          type="button"
          className={section === "Presidentes" ? "active" : ""}
          onClick={() => change("Presidentes")}
        >
          <Users size={20} />
          <span>Presidentes</span>
        </button>

        <button
          type="button"
          className="fab"
          onClick={() => change("Mandato atual")}
          aria-label="Mandato atual"
        >
          <BarChart3 size={22} />
        </button>

        <button
          type="button"
          className={section === "Promessas" ? "active" : ""}
          onClick={() => change("Promessas")}
        >
          <ListChecks size={20} />
          <span>Promessas</span>
        </button>

        <button
          type="button"
          className={section === "Fontes e método" ? "active" : ""}
          onClick={() => change("Fontes e método")}
        >
          <Grid3X3 size={20} />
          <span>Mais</span>
        </button>
      </nav>

      {selected && (
        <div
          className="backdrop"
          onClick={() => setSelected(null)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-top">
              <img
                src={getPresidentPhoto(selected)}
                alt={selected.name}
                className="modal-photo"
              />

              <div>
                <h2>{selected.name}</h2>

                <p className="muted">
                  {selected.start} –{" "}
                  {selected.end ?? "Em andamento"} |{" "}
                  {selected.period}
                </p>
              </div>
            </div>

            <p className="modal-bio">
              {getPresidentDescription(selected)}
            </p>

            <div className="modal-block">
              <strong>O que fez durante o período</strong>

              <p>
                O levantamento individual de realizações e
                decisões deste governo ainda precisa ser
                conferido em documentos oficiais. Não vamos
                atribuir realizações sem evidências.
              </p>
            </div>

            <div className="modal-block">
              <strong>O que prometeu</strong>

              <p>
                As promessas precisam ser extraídas do plano de
                governo e confrontadas com os resultados do
                respectivo mandato. A avaliação ainda não foi
                concluída para este registro.
              </p>
            </div>

            <div className="info-box">
              <strong>Status da avaliação</strong>
              <p>
                <span className="badge">
                  Aguardando verificação documental
                </span>
              </p>
              <p>
                Não há percentual de cumprimento publicado sem
                uma análise individual e fontes que sustentem
                o resultado.
              </p>
            </div>

            <SourceLink href={fontes.presidencia}>
              Consultar Biblioteca da Presidência
            </SourceLink>

            <SourceLink href={fontes.arquivo}>
              Consultar Arquivo Nacional
            </SourceLink>

            <button
              className="btn-primary full"
              type="button"
              onClick={() => setSelected(null)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
