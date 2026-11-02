import { useCallback, useEffect, useState } from "react";

/* Séries do Banco Central (SGS) consultadas direto na API pública, com cache local de 24 horas. */

export type SeriesId = "ipca" | "ipca12" | "selic" | "usd" | "desocupacao";

export type SeriesDef = {
  id: SeriesId;
  code: number;
  label: string;
  dateFormat: "month" | "day";
  format: (valor: number) => string;
};

type BcbRow = { data: string; valor: string };
type Point = { valor: number; referencia: string; fetchedAt: number };

export type SeriesState =
  | { status: "loading" }
  | { status: "ok"; point: Point; stale: boolean }
  | { status: "error" };

export type SeriesMap = Record<SeriesId, SeriesState>;

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function number(valor: number, digits = 2): string {
  return valor.toLocaleString("pt-BR", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export const seriesDefs: SeriesDef[] = [
  { id: "ipca", code: 433, label: "IPCA mensal", dateFormat: "month", format: (v) => `${v > 0 ? "+" : ""}${number(v)}%` },
  { id: "ipca12", code: 13522, label: "IPCA em 12 meses", dateFormat: "month", format: (v) => `${number(v)}%` },
  { id: "selic", code: 432, label: "Selic (meta)", dateFormat: "day", format: (v) => `${number(v)}% a.a.` },
  { id: "usd", code: 1, label: "Dólar (venda)", dateFormat: "day", format: (v) => `R$ ${number(v)}` },
  { id: "desocupacao", code: 24369, label: "Desemprego (PNAD)", dateFormat: "month", format: (v) => `${number(v, 1)}%` }
];

export const seriesById = Object.fromEntries(seriesDefs.map((d) => [d.id, d])) as Record<SeriesId, SeriesDef>;

/** Todas as séries exceto o IPCA mensal, que tem destaque próprio na tela inicial. */
export const otherSeries: SeriesDef[] = seriesDefs.filter((d) => d.id !== "ipca");

function cacheKey(id: SeriesId): string {
  return `observabrasil:bcb:${id}:v1`;
}

function readCache(id: SeriesId): Point | null {
  try {
    const raw = localStorage.getItem(cacheKey(id));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Point>;
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

function writeCache(id: SeriesId, point: Point) {
  try {
    localStorage.setItem(cacheKey(id), JSON.stringify(point));
  } catch {
    /* armazenamento indisponível: o app funciona sem cache */
  }
}

function isFresh(point: Point | null): point is Point {
  return point !== null && Date.now() - point.fetchedAt < CACHE_TTL_MS;
}

function formatDate(data: string, format: "month" | "day"): string {
  if (format === "day") return data;
  const [, mes, ano] = data.split("/");
  return mes && ano ? `${mes}/${ano}` : data;
}

async function fetchPoint(def: SeriesDef): Promise<Point> {
  const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${def.code}/dados/ultimos/1?formato=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const rows = (await res.json()) as BcbRow[];
  const row = rows[0];
  const valor = Number(row?.valor);
  if (!row || !Number.isFinite(valor)) throw new Error("Resposta inválida");
  return { valor, referencia: formatDate(row.data, def.dateFormat), fetchedAt: Date.now() };
}

function initialState(): SeriesMap {
  const map = {} as SeriesMap;
  for (const def of seriesDefs) {
    const cached = readCache(def.id);
    map[def.id] = isFresh(cached) ? { status: "ok", point: cached, stale: false } : { status: "loading" };
  }
  return map;
}

export function describeSeries(id: SeriesId, state: SeriesState): { value: string; caption: string } {
  if (state.status === "loading") return { value: "Carregando…", caption: "Banco Central" };
  if (state.status === "error") return { value: "Indisponível", caption: "Sem conexão com o BCB" };
  return {
    value: seriesById[id].format(state.point.valor),
    caption: `Ref. ${state.point.referencia}${state.stale ? " · sem conexão" : ""}`
  };
}

export function useBcbIndicators() {
  const [state, setState] = useState<SeriesMap>(initialState);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (force: boolean) => {
    const targets = seriesDefs.filter((def) => force || !isFresh(readCache(def.id)));
    if (targets.length === 0) return;

    setRefreshing(true);
    const results = await Promise.allSettled(targets.map((def) => fetchPoint(def)));

    const updates: Partial<SeriesMap> = {};
    results.forEach((result, i) => {
      const id = targets[i].id;
      if (result.status === "fulfilled") {
        writeCache(id, result.value);
        updates[id] = { status: "ok", point: result.value, stale: false };
      } else {
        const cached = readCache(id);
        updates[id] = cached ? { status: "ok", point: cached, stale: true } : { status: "error" };
      }
    });

    setState((prev) => ({ ...prev, ...updates }));
    setRefreshing(false);
  }, []);

  useEffect(() => {
    void load(false);
  }, [load]);

  const reload = useCallback(() => load(true), [load]);
  return { state, refreshing, reload };
}
