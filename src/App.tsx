import { useEffect, useMemo, useRef, useState, type TouchEvent as ReactTouchEvent } from "react";
import { Activity, ArrowUpRight, BookOpen, CheckCircle2, ChevronRight, Database, ExternalLink, Landmark, Search, Users, X, RefreshCw, Info } from "lucide-react";
import { presidents, type President } from "./data/presidents";

type Section = "Início" | "Mandato atual" | "Presidentes" | "Economia" | "Tributos" | "Saúde" | "Educação" | "Segurança" | "Gastos públicos" | "Promessas" | "Fontes e método";
const nav: { label: Section; icon: typeof Landmark }[] = [
  { label: "Início", icon: Activity }, { label: "Economia", icon: Activity },
  { label: "Mandato atual", icon: CheckCircle2 }, { label: "Presidentes", icon: Users }, { label: "Tributos", icon: Database }, { label: "Saúde", icon: CheckCircle2 }, { label: "Educação", icon: BookOpen }, { label: "Segurança", icon: Landmark }, { label: "Gastos públicos", icon: Database }, { label: "Promessas", icon: CheckCircle2 }, { label: "Fontes e método", icon: BookOpen }
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

type MandateRecord = { title: string; detail: string; category: "Ação documentada" | "Indicador oficial" | "Promessa / compromisso" | "Pendência"; status: "Realizado" | "Em andamento" | "Em apuração" | "Não comprovado"; source: string; url: string; period?: string };
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
    { title: "Novo PAC — metas de entregas em 2025", detail: "O TCU registrou que 23,1% das metas de entregas da agenda prioritária do Novo PAC atingiram integralmente o valor previsto para 2025. É uma medida de alcance das metas anuais, não a porcentagem de obras concluídas.", category: "Indicador oficial", status: "Em apuração", source: "Tribunal de Contas da União — avaliação do PPA 2024–2027", url: "https://pesquisa.apps.tcu.gov.br/documento/acordao-completo/transi%25C3%25A7%25C3%25A3o%2520energ%25C3%25A9tica/%2520%2520/DTRELEVANCIA%2520desc%252C%2520NUMACORDAOINT%2520desc/19", period: "Ano-base 2025" },
    { title: "Transporte rodoviário — metas de entregas em 2025", detail: "No programa de Transporte Rodoviário, 19,5% das 87 metas de entregas foram integralmente atingidas. O TCU também informou mediana de execução de 42,5%. Esses números medem metas do PPA, não o percentual físico total da malha rodoviária.", category: "Indicador oficial", status: "Em apuração", source: "Tribunal de Contas da União — avaliação do PPA 2024–2027", url: "https://pesquisa.apps.tcu.gov.br/documento/acordao-completo/transi%25C3%25A7%25C3%25A3o%2520energ%25C3%25A9tica/%2520%2520/DTRELEVANCIA%2520desc%252C%2520NUMACORDAOINT%2520desc/19", period: "Ano-base 2025" },
    { title: "Atenção primária à saúde — metas em 2025", detail: "Na avaliação do PPA, nenhum dos quatro objetivos específicos do programa de Atenção Primária à Saúde atingiu integralmente a meta anual; 21% das 24 metas de entregas foram integralmente alcançadas. O indicador não mede, sozinho, a qualidade de todo o SUS.", category: "Indicador oficial", status: "Em apuração", source: "Tribunal de Contas da União — avaliação do PPA 2024–2027", url: "https://pesquisa.apps.tcu.gov.br/documento/acordao-completo/transi%25C3%25A7%25C3%25A3o%2520energ%25C3%25A9tica/%2520%2520/DTRELEVANCIA%2520desc%252C%2520NUMACORDAOINT%2520desc/19", period: "Ano-base 2025" },
    { title: "Obras e metas do Novo PAC", detail: "O andamento precisa ser acompanhado por empreendimento e por etapa. Um percentual geral da carteira não representa o progresso físico de cada rodovia, escola ou hospital.", category: "Pendência", status: "Em apuração", source: "Casa Civil — Novo PAC", url: "https://www.gov.br/casacivil/pt-br/assuntos/novopac", period: "2023–atual" },
    { title: "Promessas eleitorais ainda sem ficha individual", detail: "A lista completa de compromissos e prazos deve ser confrontada com o plano de governo e com documentos de execução antes de publicar percentuais de cumprimento.", category: "Promessa / compromisso", status: "Em apuração", source: "Tribunal Superior Eleitoral", url: "https://divulgacandcontas.tse.jus.br/", period: "2023–atual" }
  ]
};
function openExternal(url: string) { window.open(url, "_blank", "noopener,noreferrer"); }
type IpcaRow = { data: string; valor: string };

export default function App() {
  const [section, setSection] = useState<Section>("Início");
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const selectedRef = useRef<President | null>(null);
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

  const IPCA_CACHE_KEY = "observabrasil_indicadores_v2";
  const IPCA_CACHE_TTL = 24 * 60 * 60 * 1000;
  const ipcaRequestInFlight = useRef(false);

  async function loadIpca(force = false) {
    // Evita duas consultas simultâneas, inclusive no React StrictMode.
    if (ipcaRequestInFlight.current) return;

    const validRows = (rows: unknown): rows is IpcaRow[] =>
      Array.isArray(rows) && rows.every((row) =>
        row && typeof row.data === "string" && row.data.length > 0 &&
        row.valor !== undefined && Number.isFinite(Number(row.valor))
      );

    type CacheData = { savedAt: number; ipca: IpcaRow[]; food: IpcaRow[]; ipca12m: IpcaRow[]; partial: boolean };
    let cached: CacheData | null = null;

    try {
      const raw = localStorage.getItem(IPCA_CACHE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          const data = parsed as Record<string, unknown>;
          const savedAt = Number(data.savedAt);
          const cachedIpca = validRows(data.ipca) ? data.ipca : [];
          const cachedFood = validRows(data.food) ? data.food : [];
          const cachedAnnual = validRows(data.ipca12m) ? data.ipca12m : [];
          const hasAnySeries = cachedIpca.length > 0 || cachedFood.length > 0 || cachedAnnual.length > 0;

          if (Number.isFinite(savedAt) && savedAt > 0 && savedAt <= Date.now() + 60_000 && hasAnySeries) {
            cached = { savedAt, ipca: cachedIpca, food: cachedFood, ipca12m: cachedAnnual, partial: data.partial === true };
          }
        }
      }
    } catch {
      // Cache ausente, corrompido ou bloqueado: consulta as fontes oficiais.
    }

    if (cached) {
      setIpca(cached.ipca);
      setFoodIpca(cached.food);
      setIpca12m(cached.ipca12m);
      const age = Date.now() - cached.savedAt;
      setIpcaUpdated(`última atualização em ${new Date(cached.savedAt).toLocaleString("pt-BR")}${age >= IPCA_CACHE_TTL ? " · atualização pendente" : " · dados em cache"}`);
      if (!force && age < IPCA_CACHE_TTL && !cached.partial) {
        setIpcaState("ready");
        return;
      }
    }

    ipcaRequestInFlight.current = true;
    setIpcaState("loading");

    const endpoints = [
      "https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/24?formato=json",
      "https://api.bcb.gov.br/dados/serie/bcdata.sgs.1635/dados/ultimos/24?formato=json",
      "https://api.bcb.gov.br/dados/serie/bcdata.sgs.13522/dados/ultimos/24?formato=json"
    ];

    // Cada série é independente: uma falha não apaga os indicadores que responderam.
    const fetchSeries = async (url: string): Promise<IpcaRow[] | null> => {
      try {
        const response = await fetch(url, { headers: { Accept: "application/json" } });
        if (!response.ok) return null;
        const rows: unknown = await response.json();
        return validRows(rows) && rows.length > 0 ? rows : null;
      } catch {
        return null;
      }
    };

    try {
      const fetched = await Promise.all(endpoints.map(fetchSeries));
      const nextIpca = fetched[0] ?? cached?.ipca ?? [];
      const nextFood = fetched[1] ?? cached?.food ?? [];
      const nextAnnual = fetched[2] ?? cached?.ipca12m ?? [];
      const hasAnyData = nextIpca.length > 0 || nextFood.length > 0 || nextAnnual.length > 0;
      const hasFreshData = fetched.some(series => series !== null);

      if (!hasAnyData) {
        setIpca([]);
        setFoodIpca([]);
        setIpca12m([]);
        setIpcaUpdated("Fontes temporariamente indisponíveis. Tente atualizar novamente.");
        setIpcaState("error");
        return;
      }

      setIpca(nextIpca);
      setFoodIpca(nextFood);
      setIpca12m(nextAnnual);

      const now = Date.now();
      const partial = fetched.some(series => series === null);
      setIpcaUpdated(
        `${new Date(now).toLocaleString("pt-BR")}${partial ? " · atualização parcial; série sem resposta mantém o último dado salvo" : ""}`
      );
      setIpcaState("ready");

      // Guarda cada série disponível, inclusive quando a consulta foi parcial.
      try {
        localStorage.setItem(IPCA_CACHE_KEY, JSON.stringify({
          savedAt: hasFreshData ? now : cached?.savedAt ?? now,
          ipca: nextIpca,
          food: nextFood,
          ipca12m: nextAnnual,
          partial
        }));
      } catch {
        // Os dados continuam visíveis se o navegador bloquear o armazenamento.
      }
    } finally {
      ipcaRequestInFlight.current = false;
    }
  }
  useEffect(() => { void loadIpca(false); }, []);
  useEffect(() => {
    window.history.replaceState({ ...(window.history.state || {}), observabrSection: "Início" }, "", window.location.href);
    const onPopState = (event: PopStateEvent) => {
      if (selectedRef.current) { selectedRef.current = null; setSelected(null); return; }
      const previous = event.state?.observabrSection as Section | undefined;
      setSection(previous && nav.some(item => item.label === previous) ? previous : "Início");
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);
  useEffect(() => { selectedRef.current = selected; }, [selected]);
  useEffect(() => {
    if (!selected) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selected]);

  const filtered = useMemo(() => presidents.filter(p =>
    (showOlderPresidents || Number(p.start) >= 2000 || (p.end && Number(p.end) >= 2000)) &&
    `${p.name} ${p.start} ${p.end ?? ""} ${p.period}`.toLowerCase().includes(query.toLowerCase()) &&
    (period === "Todos os períodos
