import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getUsuarioActual } from "../../services/AuthService";
import { usuarioTienePermiso } from "../../services/dashboard.service";

import icoCow from "../../assets/icons/cow.png";
import icoDashboard from "../../assets/icons/dashboard.png";
import icoReproduccion from "../../assets/icons/reproduccion.png";
import icoSalud from "../../assets/icons/salud.png";
import icoInventario from "../../assets/icons/inventario.png";
import icoPotreros from "../../assets/icons/potreros.png";
import icoFinanzas from "../../assets/icons/finanzas.png";
import icoAlimentacion from "../../assets/icons/alimentacion.png";
import icoConfiguracion from "../../assets/icons/configuracion.png";

import "../../styles/Sidebar.css";

const MENU = [
  {
    seccion: "Principal",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        img: icoDashboard,
      },
    ],
  },
  {
    seccion: "Producción",
    items: [
      {
        label: "Ganado",
        href: "/ganado",
        img: icoCow,
        permiso: "ganado.ver",
      },
      {
        label: "Reproducción",
        href: "/reproduccion",
        img: icoReproduccion,
        permiso: "reproduccion.ver",
      },
      {
        label: "Salud",
        href: "/eventos",
        img: icoSalud,
        permiso: "salud.ver",
      },
      {
        label: "Alimentación",
        href: "/alimentacion",
        img: icoAlimentacion,
        permiso: "alimentacion.ver",
      },
    ],
  },
  {
    seccion: "Recursos",
    items: [
      {
        label: "Inventario",
        href: "/inventario",
        img: icoInventario,
        permiso: "productos.ver",
      },
      {
        label: "Potreros",
        href: "/pasturas",
        img: icoPotreros,
        permiso: "potreros.ver",
      },
    ],
  },
  {
    seccion: "Finanzas",
    items: [
      {
        label: "Ventas",
        href: "/ventas",
        img: icoFinanzas,
        permiso: "ventas.ver",
      },
      {
        label: "Cockpit",
        href: "/finanzas",
        img: icoFinanzas,
        permiso: "cockpit.ver",
      },
    ],
  },
  {
    seccion: "Sistema",
    items: [
      {
        label: "Configuración",
        href: "/configuracion/finca",
        img: icoConfiguracion,
        permiso: "configuracion.ver",
      },
    ],
  },
];

export default function Sidebar({ collapsed, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const usuario = getUsuarioActual();

  const isActive = (href) => location.pathname.startsWith(href);

  const menuPermitido = useMemo(() => {
    return MENU.map((grupo) => ({
      ...grupo,
      items: grupo.items.filter((item) =>
        usuarioTienePermiso(usuario, item.permiso)
      ),
    })).filter((grupo) => grupo.items.length > 0);
  }, [usuario]);

  return (
    <aside className={`gc-sidebar${collapsed ? " collapsed" : ""}`}>
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

      <nav className="gc-sidebar__nav">
        {menuPermitido.map((grupo) => (
          <div key={grupo.seccion}>
            <div className="gc-sidebar__section-label">{grupo.seccion}</div>

            {grupo.items.map((item) => (
              <button
                key={item.href}
                className={`gc-sidebar__item${
                  isActive(item.href) ? " active" : ""
                }`}
                data-label={item.label}
                onClick={() => navigate(item.href)}
                type="button"
              >
                <span className="gc-sidebar__item-icon">
                  <img
                    src={item.img}
                    alt={item.label}
                    style={{
                      width: 22,
                      height: 22,
                      objectFit: "contain",
                      filter: "brightness(0) invert(1)",
                      opacity: isActive(item.href) ? 1 : 0.75,
                    }}
                  />
                </span>

                <span className="gc-sidebar__item-label">{item.label}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="gc-sidebar__collapse">
        <button
          className="gc-sidebar__collapse-btn"
          onClick={onToggle}
          type="button"
        >
          <span className="gc-sidebar__collapse-icon">◀</span>
          <span className="gc-sidebar__item-label">Colapsar</span>
        </button>
      </div>
    </aside>
  );
}