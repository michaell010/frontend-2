import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/Sidebar.css";

const MENU = [
  {
    seccion: "Principal",
    items: [
      { label: "Dashboard",     href: "/dashboard",           ico: "🎛️" },
    ],
  },
  {
    seccion: "Producción",
    items: [
      { label: "Ganado",        href: "/ganado",              ico: "🐄" },
      { label: "Reproducción",  href: "/reproduccion",        ico: "🧬" },
      { label: "Salud",         href: "/eventos",             ico: "💉" },
      { label: "Alimentación",  href: "/alimentacion",        ico: "🌾" },
    ],
  },
  {
    seccion: "Recursos",
    items: [
      { label: "Inventario",    href: "/inventario",          ico: "📦" },
      { label: "Potreros",      href: "/pasturas",            ico: "🌿" },
    ],
  },
  {
    seccion: "Finanzas",
    items: [
      { label: "Ventas",        href: "/ventas",              ico: "🛒" },
      { label: "Cockpit",       href: "/finanzas",            ico: "💰" },
    ],
  },
  {
    seccion: "Sistema",
    items: [
      { label: "Configuración", href: "/configuracion/finca", ico: "⚙️" },
    ],
  },
];

export default function Sidebar({ collapsed, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (href) => location.pathname.startsWith(href);

  return (
    <aside className={`gc-sidebar${collapsed ? " collapsed" : ""}`}>

      <div
        className="gc-sidebar__logo"
        onClick={() => navigate("/dashboard")}
        style={{ cursor: "pointer" }}
      >
        <div className="gc-sidebar__logo-icon">🐂</div>
        <div className="gc-sidebar__logo-text">
          <span className="gc-sidebar__logo-name">GanaControl</span>
          <span className="gc-sidebar__logo-tag">Gestión Ganadera</span>
        </div>
      </div>

      <nav className="gc-sidebar__nav">
        {MENU.map((grupo) => (
          <div key={grupo.seccion}>
            <div className="gc-sidebar__section-label">{grupo.seccion}</div>
            {grupo.items.map((item) => (
              <button
                key={item.href}
                className={`gc-sidebar__item${isActive(item.href) ? " active" : ""}`}
                data-label={item.label}
                onClick={() => navigate(item.href)}
              >
                <span className="gc-sidebar__item-icon">{item.ico}</span>
                <span className="gc-sidebar__item-label">{item.label}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="gc-sidebar__collapse">
        <button className="gc-sidebar__collapse-btn" onClick={onToggle}>
          <span className="gc-sidebar__collapse-icon">◀</span>
          <span className="gc-sidebar__item-label">Colapsar</span>
        </button>
      </div>

    </aside>
  );
}
