// SaludEstatus.jsx
import { useNavigate } from "react-router-dom";
import "../../../../styles/modules/Salud.css";

export default function SaludEstatus({ estatus = [], onVerEventos }) {
  const navigate = useNavigate();
  return (
    <div className="sl-card sl-estatus">
      <h4 className="sl-estatus__title">Estatus del Campo</h4>

      <div className="sl-estatus__bars">
        {estatus.map((item, i) => (
          <div key={i} className="sl-estatus__item">
            <div className="sl-estatus__item-top">
              <span className="sl-estatus__label">{item.label}</span>
              <span
                className="sl-estatus__pct"
                style={{ color: item.pct >= 80 ? "var(--sl-green-700)" : item.pct >= 60 ? "#d97706" : "#dc2626" }}
              >
                {item.pct}%
              </span>
            </div>
            <div className="sl-progress">
              <div
                className="sl-progress__fill"
                style={{
                  "--pct": `${item.pct}%`,
                  background: item.pct >= 80
                    ? "linear-gradient(90deg, var(--sl-green-600), var(--sl-green-400))"
                    : item.pct >= 60
                    ? "linear-gradient(90deg, #d97706, #fbbf24)"
                    : "linear-gradient(90deg, #dc2626, #f87171)",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        className="sl-btn sl-btn--primary sl-btn--full"
        onClick={() => navigate("/eventos")}
      >
        Ver todos los eventos
      </button>
    </div>
  );
}