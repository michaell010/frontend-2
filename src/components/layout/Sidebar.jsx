import { useNavigate, useLocation } from "react-router-dom";
// ── Íconos PNG ───────────────────────────────────────────────────
import icoCow          from "../../assets/icons/cow.png";
import icoDashboard    from "../../assets/icons/dashboard.png";
import icoReproduccion from "../../assets/icons/reproduccion.png";
import icoSalud        from "../../assets/icons/salud.png";
import icoInventario   from "../../assets/icons/inventario.png";
import icoPotreros     from "../../assets/icons/potreros.png";
import icoFinanzas     from "../../assets/icons/finanzas.png";
import icoAlimentacion from "../../assets/icons/alimentacion.png";
import "../../styles/Sidebar.css";
// ── Menú de navegación ───────────────────────────────────────────
const MENU = [
  {
    seccion: "Principal",
    items: [
      { label: "Dashboard",     href: "/dashboard",           img: icoDashboard },
    ],
  },
  {
    seccion: "Producción",
    items: [
      { label: "Ganado",        href: "/ganado",              img: icoCow },
      { label: "Reproducción",  href: "/reproduccion",        img: icoReproduccion },
      { label: "Salud",         href: "/eventos",             img: icoSalud },
      { label: "Alimentación",  href: "/alimentacion",        img: icoAlimentacion },
    ],
  },
  {
    seccion: "Recursos",
    items: [
      { label: "Inventario",    href: "/inventario",          img: icoInventario },
      { label: "Potreros",      href: "/pasturas",            img: icoPotreros },
    ],
  },
  {
    seccion: "Finanzas",
    items: [
      { label: "Ventas",        href: "/ventas",              img: icoFinanzas },
      { label: "Cockpit",       href: "/finanzas",            img: icoFinanzas },
    ],
  },
  {
    seccion: "Sistema",
    items: [
      { label: "Configuración", href: "/configuracion/finca", img: null, ico: "⚙️" },
    ],
  },
];
// ── Componente ───────────────────────────────────────────────────
export default function Sidebar({ collapsed, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (href) => location.pathname.startsWith(href);
  return (
    <aside className={`gc-sidebar${collapsed ? " collapsed" : ""}`}>
      {/* Logo */}
      <div
        className="gc-sidebar__logo"
        onClick={() => navigate("/dashboard")}
        style={{ cursor: "pointer" }}
      >
        <div className="gc-sidebar__logo-icon">
          <img
            src={icoCow}
            alt="GanaControl"
            style={{ width: 24, height: 24, objectFit: "contain" }}
          />
        </div>
        <div className="gc-sidebar__logo-text">
          <span className="gc-sidebar__logo-name">GanaControl</span>
          <span className="gc-sidebar__logo-tag">Gestión Ganadera</span>
        </div>
      </div>
      {/* Navegación */}
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
                <span className="gc-sidebar__item-icon">
                  {item.img
                    ? (
                      <img
                        src={item.img}
                        alt={item.label}
                        style={{
                          width:  22,
                          height: 22,
                          objectFit:  "contain",
                          filter: "brightness(0) invert(1)",
                          opacity: isActive(item.href) ? 1 : 0.75,
                        }}
                      />
                    )
                    : item.ico
                  }
                </span>
                <span className="gc-sidebar__item-label">{item.label}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>
      {/* Colapsar */}
      <div className="gc-sidebar__collapse">
        <button className="gc-sidebar__collapse-btn" onClick={onToggle}>
          <span className="gc-sidebar__collapse-icon">◀</span>
          <span className="gc-sidebar__item-label">Colapsar</span>
        </button>
      </div>
    </aside>
  );
}