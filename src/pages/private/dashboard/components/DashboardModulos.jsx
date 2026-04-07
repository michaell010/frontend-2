// DashboardModulos.jsx
import { useNavigate } from "react-router-dom";
import "../../../../styles/modules/Dashboard.css";

export default function DashboardModulos({ modulos = [] }) {
  const navigate = useNavigate();

  return (
    <div className="db-section">
      <div className="db-section-label">Acceso rápido a módulos</div>

      <div className="db-modulos">
        {modulos.map((m, i) => (
          <button
            key={i}
            className="db-modulo"
            onClick={() => navigate(m.href)}
          >
            <div className="db-modulo__ico-wrap">
              <img src={m.img} alt={m.label} className="db-modulo__ico" />
            </div>
            <span className="db-modulo__label">{m.label}</span>
            <span className="db-modulo__desc">{m.desc}</span>
            <span className="db-modulo__arrow">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}