import { useNavigate } from "react-router-dom";
import { getUsuarioActual, logout } from "../../services/AuthService";
import "../../styles/Navbar.css";

// ── Íconos ─────────────────────────────────────────
import icoBuscar from "../../assets/icons/buscar.png";
import icoAlerta from "../../assets/icons/alerta.png";

export default function Navbar({ collapsed, pageTitle }) {
  const navigate = useNavigate();
  const usuario  = getUsuarioActual();
  const nombre   = usuario?.nombres || "Usuario";
  const rol      = usuario?.rol     || "Administrador";
  const inicial  = nombre ? nombre.charAt(0).toUpperCase() : "U";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className={`gc-navbar${collapsed ? " sidebar-collapsed" : ""}`}>

      <div className="gc-navbar__left">
        <span className="gc-navbar__page-title">
          {pageTitle || "GanaControl"}
        </span>
      </div>

      <div className="gc-navbar__right">

        {/* ── Buscador ── */}
        <div className="gc-navbar__search">
          <img
            src={icoBuscar}
            alt="buscar"
            className="gc-navbar__search-icon"
          />
          <input
            className="gc-navbar__search-input"
            placeholder="Buscar..."
          />
        </div>

        {/* ── Notificaciones ── */}
        <button className="gc-navbar__icon-btn" title="Notificaciones">
          <img
            src={icoAlerta}
            alt="notificaciones"
            className="gc-navbar__icon-img"
          />
          <span className="gc-navbar__notif-dot" />
        </button>

        {/* ── Usuario ── */}
        <div
          className="gc-navbar__user"
          onClick={() => navigate("/configuracion/finca")}
        >
          <div className="gc-navbar__avatar">{inicial}</div>
          <div className="gc-navbar__user-info">
            <span className="gc-navbar__user-name">{nombre}</span>
            <span className="gc-navbar__user-role">{rol}</span>
          </div>
          <span className="gc-navbar__chevron">▾</span>
        </div>

        {/* ── Logout ── */}
        <button
          className="gc-btn gc-btn--ghost gc-btn--sm"
          onClick={handleLogout}
        >
          Salir
        </button>

      </div>
    </header>
  );
}