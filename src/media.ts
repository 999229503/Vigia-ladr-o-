import { useCallback, useEffect, useMemo, useState } from "react";
import { articleKeywords, maxArticles, maxPerOutlet, newsFeeds, videos, type NewsFeed } from "./data/media";

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */

function normalize(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function truncate(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max).trimEnd()}…`;
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

/* ------------------------------------------------------------------ */
/* Vídeos do YouTube                                                   */
/* ------------------------------------------------------------------ */

const ID_PATTERN = /^[\w-]{11}$/;

/** Extrai o ID do vídeo de qualquer formato de link do YouTube. Devolve null se o link não for válido. */
export function youtubeId(input: string): string | null {
  const text = input.trim();
  if (ID_PATTERN.test(text)) return text;
  try {
    const url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`);
    const host = url.hostname.replace(/^(www|m|music)\./, "");
    if (host === "youtu.be") {
      const id = url.pathname.slice(1).split("/")[0];
      return ID_PATTERN.test(id) ? id : null;
    }
    if (host === "youtube.com" || host === "youtube-nocookie.com") {
      const v = url.searchParams.get("v");
      if (v && ID_PATTERN.test(v)) return v;
      const match = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([\w-]{11})/);
      if (match) return match[1];
    }
  } catch {
    return null;
  }
  return null;
}

export type VideoItem = { id: string; url: string; title: string; channel: string; tag: string };

type VideoInfo = { title?: string; channel?: string };

async function fetchVideoInfo(id: string): Promise<VideoInfo | null> {
  try {
    const target = encodeURIComponent(`https://www.youtube.com/watch?v=${id}`);
    const res = await fetch(`https://www.youtube.com/oembed?url=${target}&format=json`);
    if (!res.ok) return null;
    const data = (await res.json()) as { title?: string; author_name?: string };
    return { title: data.title, channel: data.author_name };
  } catch {
    return null;
  }
}

/** Lista de vídeos cadastrados em data/media.ts, com título e canal buscados no YouTube quando faltam. */
export function useVideos(): VideoItem[] {
  const base = useMemo(() => {
    const seen = new Set<string>();
    const list: Array<{ id: string; title?: string; channel?: string; tag?: string }> = [];
    for (const v of videos) {
      const id = youtubeId(v.url);
      if (!id || seen.has(id)) continue;
      seen.add(id);
      list.push({ id, title: v.title, channel: v.channel, tag: v.tag });
    }
    return list;
  }, []);

  const [info, setInfo] = useState<Record<string, VideoInfo>>({});

  useEffect(() => {
    let cancelled = false;
    for (const v of base) {
      if (v.title && v.channel) continue;
      void fetchVideoInfo(v.id).then((data) => {
        if (!cancelled && data) setInfo((prev) => ({ ...prev, [v.id]: data }));
      });
    }
    return () => {
      cancelled = true;
    };
  }, [base]);

  return base.map((v) => ({
    id: v.id,
    url: `https://www.youtube.com/watch?v=${v.id}`,
    title: v.title || info[v.id]?.title || "Vídeo do YouTube",
    channel: v.channel || info[v.id]?.channel || "",
    tag: v.tag ?? ""
  }));
}

/* ------------------------------------------------------------------ */
/* Artigos da imprensa (feeds RSS convertidos por rss2json)            */
/* ------------------------------------------------------------------ */

export type Article = {
  id: string;
  title: string;
  link: string;
  image: string | null;
  source: string;
  date: number;
  summary: string;
};

type FeedItem = {
  title?: string;
  pubDate?: string;
  link?: string;
  guid?: string;
  thumbnail?: string;
  description?: string;
  content?: string;
  enclosure?: { link?: string; type?: string } | unknown[];
};

type FeedResponse = { status?: string; items?: FeedItem[] };

function htmlToText(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return (doc.body.textContent ?? "").replace(/\s+/g, " ").trim();
}

function firstImage(html: string): string | null {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

function cleanImage(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) return null;
  return trimmed.replace(/^http:\/\//i, "https://");
}

function parseDate(value: string | undefined): number {
  if (!value) return 0;
  const time = Date.parse(value.includes("T") ? value : `${value.replace(" ", "T")}Z`);
  return Number.isNaN(time) ? 0 : time;
}

async function fetchFeed(feed: NewsFeed): Promise<Article[]> {
  const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = (await res.json()) as FeedResponse;
  if (data.status !== "ok" || !data.items) throw new Error("feed inválido");

  const out: Article[] = [];
  for (const item of data.items) {
    if (!item.title || !item.link) continue;
    const html = `${item.description ?? ""} ${item.content ?? ""}`;
    const enc = item.enclosure;
    const encImage = enc && !Array.isArray(enc) && enc.link && (!enc.type || enc.type.startsWith("image")) ? enc.link : null;
    out.push({
      id: item.guid || item.link,
      title: htmlToText(item.title),
      link: item.link,
      image: cleanImage(item.thumbnail) ?? cleanImage(encImage) ?? cleanImage(firstImage(html)),
      source: feed.name,
      date: parseDate(item.pubDate),
      summary: truncate(htmlToText(item.description ?? ""), 150)
    });
  }
  return out;
}

/** Filtra pelo presidente, limita por veículo e ordena do mais recente para o mais antigo. */
function pickArticles(perFeed: Article[][]): Article[] {
  const keywords = articleKeywords.map(normalize);
  const seen = new Set<string>();
  const merged: Article[] = [];

  for (const list of perFeed) {
    let count = 0;
    for (const article of [...list].sort((a, b) => b.date - a.date)) {
      if (count >= maxPerOutlet) break;
      if (seen.has(article.link)) continue;
      const text = normalize(`${article.title} ${article.summary}`);
      if (keywords.length > 0 && !keywords.some((k) => text.includes(k))) continue;
      seen.add(article.link);
      merged.push(article);
      count += 1;
    }
  }

  return merged.sort((a, b) => b.date - a.date).slice(0, maxArticles);
}

const CACHE_KEY = "observa-artigos-v1";
const CACHE_MS = 60 * 60 * 1000;

type ArticleCache = { at: number; items: Article[] };

function readCache(): ArticleCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ArticleCache;
    if (!parsed || typeof parsed.at !== "number" || !Array.isArray(parsed.items)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(items: Article[]): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), items }));
  } catch {
    // sem armazenamento disponível: segue sem cache
  }
}

export type ArticlesState = { status: "loading" | "ready" | "error"; items: Article[]; updatedAt: number | null };

/** Busca os artigos nos feeds (cache de 1 hora) e permite forçar a atualização. */
export function useArticles() {
  const [state, setState] = useState<ArticlesState>(() => {
    const cached = readCache();
    return cached
      ? { status: "ready", items: cached.items, updatedAt: cached.at }
      : { status: "loading", items: [], updatedAt: null };
  });
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (force: boolean) => {
    const cached = readCache();
    if (!force && cached && Date.now() - cached.at < CACHE_MS) return;

    setRefreshing(true);
    const results = await Promise.allSettled(newsFeeds.map((feed) => fetchFeed(feed)));
    const lists = results
      .filter((r): r is PromiseFulfilledResult<Article[]> => r.status === "fulfilled")
      .map((r) => r.value);

    if (lists.length === 0) {
      setState((prev) => ({ ...prev, status: prev.items.length > 0 ? "ready" : "error" }));
    } else {
      const items = pickArticles(lists);
      writeCache(items);
      setState({ status: "ready", items, updatedAt: Date.now() });
    }
    setRefreshing(false);
  }, []);

  useEffect(() => {
    void load(false);
  }, [load]);

  const reload = useCallback(() => load(true), [load]);

  return { state, refreshing, reload };
}
