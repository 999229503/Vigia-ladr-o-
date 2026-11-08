import { useEffect, useState } from "react";
import { ExternalLink, Info, Newspaper, Play, RefreshCw } from "lucide-react";
import { thirdPartyNotice } from "./data/media";
import { formatDate, useArticles, useVideos, type Article, type VideoItem } from "./media";
import "./media.css";

type View = "videos" | "articles";

function ThirdPartyTag() {
  return <em className="third-party-tag">Conteúdo de terceiros · não oficial</em>;
}

function VideoCard({ v, onOpen }: { v: VideoItem; onOpen: (v: VideoItem) => void }) {
  const [failed, setFailed] = useState(false);
  return (
    <button className="media-card" onClick={() => onOpen(v)} aria-label={`Assistir: ${v.title}`}>
      <div className="media-thumb">
        {!failed && (
          <img
            src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            onError={() => setFailed(true)}
          />
        )}
        <span className="play-badge" aria-hidden="true">
          <span>
            <Play size={22} fill="currentColor" />
          </span>
        </span>
      </div>
      <div className="media-body">
        <strong>{v.title}</strong>
        <div className="media-meta">
          {v.tag && <span className="media-tag">{v.tag}</span>}
          {v.channel && <span>{v.channel}</span>}
        </div>
        <ThirdPartyTag />
      </div>
    </button>
  );
}

function VideoPlayer({ v, onClose }: { v: VideoItem; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="detail-modal"
        role="dialog"
        aria-modal="true"
        aria-label={v.title}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="sheet-handle" aria-hidden="true" />
        <button className="modal-close" aria-label="Fechar" onClick={onClose}>✕</button>

        <div className="video-frame">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0&playsinline=1`}
            title={v.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>

        <div className="video-info">
          <strong>{v.title}</strong>
          {(v.channel || v.tag) && (
            <span>{[v.tag, v.channel].filter(Boolean).join(" · ")}</span>
          )}
        </div>

        <div className="notice">
          <Info size={16} />
          <span>{thirdPartyNotice}</span>
        </div>

        <a className="primary-button full link-button" href={v.url} target="_blank" rel="noreferrer">
          Abrir no YouTube <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}

function ArticleCard({ a }: { a: Article }) {
  const [failed, setFailed] = useState(false);
  return (
    <a className="media-card" href={a.link} target="_blank" rel="noreferrer noopener">
      <div className="media-thumb">
        {a.image && !failed ? (
          <img
            src={a.image}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="article-fallback">
            <Newspaper size={28} />
            <span>{a.source}</span>
          </div>
        )}
      </div>
      <div className="media-body">
        <div className="media-meta">
          <span className="media-tag">{a.source}</span>
          {a.date > 0 && <span>{formatDate(a.date)}</span>}
        </div>
        <strong>{a.title}</strong>
        {a.summary && <p>{a.summary}</p>}
        <ThirdPartyTag />
        <span className="text-link">Ler na fonte ↗</span>
      </div>
    </a>
  );
}

export function MediaSection() {
  const [view, setView] = useState<View>("videos");
  const [playing, setPlaying] = useState<VideoItem | null>(null);
  const videoItems = useVideos();
  const { state, refreshing, reload } = useArticles();

  return (
    <section className="page-section">
      <div className="notice">
        <Info size={16} />
        <span>{thirdPartyNotice}</span>
      </div>

      <div className="chip-row" role="group" aria-label="Tipo de conteúdo">
        <button className={`chip ${view === "videos" ? "active" : ""}`} onClick={() => setView("videos")}>
          Vídeos ({videoItems.length})
        </button>
        <button className={`chip ${view === "articles" ? "active" : ""}`} onClick={() => setView("articles")}>
          Artigos
        </button>
      </div>

      {view === "videos" && (
        <div className="media-list">
          {videoItems.map((v) => (
            <VideoCard key={v.id} v={v} onOpen={setPlaying} />
          ))}
          {videoItems.length === 0 && (
            <p className="muted-text empty-state">Nenhum vídeo publicado ainda.</p>
          )}
        </div>
      )}

      {view === "articles" && (
        <>
          <div className="section-head">
            <div>
              <h2>Notícias sobre o presidente</h2>
              <small>
                Fotos e textos dos próprios veículos
                {state.updatedAt ? ` · atualizado às ${new Date(state.updatedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}` : ""}
              </small>
            </div>
            <button
              className="refresh-btn"
              onClick={() => void reload()}
              disabled={refreshing}
              aria-label="Atualizar artigos"
            >
              <RefreshCw size={15} className={refreshing ? "spin" : undefined} />
            </button>
          </div>

          <div className="media-list">
            {state.items.map((a) => (
              <ArticleCard key={a.link} a={a} />
            ))}
          </div>

          {state.status === "loading" && state.items.length === 0 && (
            <p className="muted-text empty-state">Carregando artigos…</p>
          )}
          {state.status === "error" && (
            <p className="muted-text empty-state">
              Não foi possível carregar os artigos agora. Verifique a conexão e toque em atualizar.
            </p>
          )}
          {state.status === "ready" && state.items.length === 0 && (
            <p className="muted-text empty-state">Nenhum artigo recente encontrado nos veículos acompanhados.</p>
          )}
        </>
      )}

      {playing && <VideoPlayer v={playing} onClose={() => setPlaying(null)} />}
    </section>
  );
}
