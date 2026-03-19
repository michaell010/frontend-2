import { useNavigate } from "react-router-dom";
import { getUsuarioActual, logout } from "../../services/AuthService";
import "../../styles/Navbar.css";

export default function Navbar({ collapsed, pageTitle }) {
  const navigate = useNavigate();
  const usuario  = getUsuarioActual();
  const nombre   = usuario?.nombres || "Usuario";
  const rol      = usuario?.rol     || "Administrador";
  const inicial  = nombre.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className={`gc-navbar${collapsed ? " sidebar-collapsed" : ""}`}>

      <div className="gc-navbar__left">
        <span className="gc-navbar__page-title">{pageTitle || "GanaControl"}</span>
      </div>

      <div className="gc-navbar__right">

        <div className="gc-navbar__search">
          <span className="gc-navbar__search-icon">🔍</span>
          <input
            className="gc-navbar__search-input"
            placeholder="Buscar..."
          />
        </div>

        <button className="gc-navbar__icon-btn" title="Notificaciones">
          🔔
          <span className="gc-navbar__notif-dot" />
        </button>

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
