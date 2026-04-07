// InventarioSuministros.jsx
import "../../../../styles/modules/Inventario.css";

const nivelColor = (n) =>
  n === "critico" ? "#ef4444" : n === "bajo" ? "#f59e0b" : "#16a34a";

const nivelGradient = (n) =>
  n === "critico"
    ? "linear-gradient(90deg,#dc2626,#f87171)"
    : n === "bajo"
    ? "linear-gradient(90deg,#d97706,#fbbf24)"
    : "linear-gradient(90deg,var(--iv-green-600),var(--iv-green-400))";

export default function InventarioSuministros({ suministros = [] }) {
  return (
    <div className="iv-card iv-sumi-card">
      <div className="iv-sumi-header">
        <h3 className="iv-sumi-header__title">Niveles de Suministro</h3>
        <span className="iv-sumi-header__sub">
          {suministros.filter(s => s.nivel !== "normal").length} alertas
        </span>
      </div>

      <div className="iv-sumi-list">
        {suministros.map((s, i) => {
          const col = nivelColor(s.nivel);
          return (
            <div key={i} className="iv-sumi-item">
              <div className="iv-sumi-item__top">
                <span
                  className="iv-sumi-item__name"
                  style={{ color: s.nivel === "critico" ? "#ef4444" : "inherit" }}
                >
                  {s.nombre}
                </span>
                <span className="iv-sumi-item__pct" style={{ color: col }}>
                  {s.pct}%
                </span>
              </div>
              <div className="iv-progress">
                <div
                  className="iv-progress__fill"
                  style={{ "--pct": `${s.pct}%`, background: nivelGradient(s.nivel) }}
                />
              </div>
              {s.nivel === "critico" && (
                <p className="iv-sumi-item__warn">⚠ Reponer urgente</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}