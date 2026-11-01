import { useEffect, useState, useRef, type TouchEvent as ReactTouchEvent } from "react";
import { 
  Menu, User, Check, Clock, XCircle, BarChart2, Heart, 
  GraduationCap, ShieldCheck, Home, Users, CheckSquare, Grid, Fuel,
  ChevronRight, ExternalLink, ArrowUpRight, Info, Search
} from "lucide-react";
import { presidents, type President } from "./data/presidents";

type Section = "Início" | "Presidentes" | "Promessas" | "Mais";
const pages: Section[] = ["Início", "Presidentes", "Promessas", "Mais"];

type IpcaRow = { data: string; valor: string };

export default function App() {
  const [section, setSection] = useState<Section>("Início");
  const [ipcaVal, setIpcaVal] = useState<string>("+0,44%");
  const [selectedPresident, setSelectedPresident] = useState<President | null>(null);
  const [query, setQuery] = useState("");
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // Busca dados em tempo real da API oficial do Banco Central
  useEffect(() => {
    async function fetchRealEconomicData() {
      try {
        const res = await fetch("https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/1?formato=json");
        if (res.ok) {
          const data: IpcaRow[] = await res.json();
          if (data && data.length > 0) {
            const val = Number(data[0].valor).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 2 });
            setIpcaVal(`${Number(data[0].valor) >= 0 ? "+" : ""}${val}%`);
          }
        }
      } catch (e) {
        // Fallback seguro
      }
    }
    void fetchRealEconomicData();
  }, []);

  function navigateToIndex(newIndex: number) {
    if (newIndex >= 0 && newIndex < pages.length) {
      setSection(pages[newIndex]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleTouchStart(e: ReactTouchEvent<HTMLDivElement>) {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }

  function handleTouchEnd(e: ReactTouchEvent<HTMLDivElement>) {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      const currentIndex = pages.indexOf(section);
      if (dx < 0) {
        navigateToIndex(currentIndex + 1);
      } else {
        navigateToIndex(currentIndex - 1);
      }
    }
  }

  // Conversão segura para string para evitar erros de TypeScript
  const filteredPresidents = presidents.filter(p => {
    const nameMatch = p.name.toLowerCase().includes(query.toLowerCase());
    const startMatch = String(p.start).includes(query);
    const endMatch = p.end ? String(p.end).includes(query) : false;
    return nameMatch || startMatch || endMatch;
  });

  return (
    <div className="app-shell">
      {/* Top Header */}
      <header className="site-header">
        <div className="site-header-inner">
          <button className="header-icon-btn" aria-label="Menu">
            <Menu size={20} />
          </button>

          <div className="brand" onClick={() => setSection("Início")}>
            <div className="brand-mark">
              <svg viewBox="0 0 100 100" width="28" height="28">
                <path d="M15 35 Q50 15 85 35 Q90 65 50 85 Q10 65 15 35 Z" fill="#00c853" />
                <circle cx="50" cy="50" r="20" fill="#0047bb" />
              </svg>
            </div>
            <div className="brand-copy">
              <strong>Observa</strong>
              <small>Brasil</small>
            </div>
          </div>

          <button className="header-icon-btn" aria-label="Perfil" style={{ background: "#e6f4ea", borderColor: "#ceebd6", color: "#138808" }}>
            <User size={20} />
          </button>
        </div>
      </header>

      {/* Área Principal com suporte a Swipe */}
      <main className="main-area" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <div className="content">
          {section === "Início" && (
            <>
              <section className="greeting-section">
                <h1>Olá, Cidadão!</h1>
                <p>Aqui você acompanha o governo de forma simples e visual.</p>
              </section>

              {/* Rosca de Promessas */}
              <section className="dashboard-promises-card">
                <div className="ring-container">
                  <div className="ring-inner">
                    <strong>67%</strong>
                    <span>Promessas<br/>Cumpridas</span>
                  </div>
                </div>

                <div className="promises-stats-list">
                  <div className="stat-item">
                    <div className="stat-icon-wrapper green">
                      <Check size={16} strokeWidth={3} />
                    </div>
                    <div className="stat-info">
                      <strong>1.020</strong>
                      <span>Cumpridas</span>
                    </div>
                  </div>

                  <div className="stat-item">
                    <div className="stat-icon-wrapper orange">
                      <Clock size={16} stroke
