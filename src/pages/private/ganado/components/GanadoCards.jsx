import { ESTADO_STYLES } from "../ganado.constants";
import defaultCow from "../../../../assets/default-cow.png";

const getFoto = (a) => {
  // 1. Si no hay foto → default
  if (!a?.foto_url) return defaultCow;

  // 2. Si ya es URL completa
  if (a.foto_url.startsWith("http")) return a.foto_url;

  // 3. Si viene del backend (/uploads/...)
  const base = import.meta.env.VITE_API_BASE || "http://localhost:3000";
  return `${base}${a.foto_url}`;
};

export default function GanadoCards({ animales, onVerDetalle }) {
  return (
    <div className="ganado-cards">
      {animales.slice(0, 3).map((a) => {
        const es = ESTADO_STYLES[a.estado] || ESTADO_STYLES.Activo;

        return (
          <div
            className="ganado-card"
            key={a.id}
            onClick={() => onVerDetalle(a)}
          >
            <div className="ganado-card__img-wrap">
              <img
                src={getFoto(a)}
                alt={a.nombre || a.codigo}
                className="ganado-card__img"
                onError={(e) => {
                  e.currentTarget.src = defaultCow;
                }}
              />

              <span className="ganado-card__id">
                Código: {a.codigo || a.id}
              </span>

              <span
                className="ganado-card__estado"
                style={{ background: es.color }}
              >
                {a.estado}
              </span>
            </div>

            <div className="ganado-card__body">
              <div className="ganado-card__nombre">
                {a.nombre || "Sin nombre"}
              </div>

              <div className="ganado-card__raza">
                {(a.raza || "Sin raza")} ·{" "}
                {(a.categoria || "Sin categoría")}
              </div>

              <div className="ganado-card__peso">
                {a.peso_actual ?? a.peso ?? "-"} kg
              </div>

              <div className="ganado-card__peso-lbl">
                Peso actual
              </div>

              <div className="ganado-card__metrics">
                <div className="ganado-card__metric">
                  <span>📍</span>
                  <div>
                    <div className="ganado-card__metric-lbl">
                      Potrero ID
                    </div>
                    <div className="ganado-card__metric-val">
                      {a.potrero_id || "-"}
                    </div>
                  </div>
                </div>

                <div className="ganado-card__metric">
                  <span>{a.sexo === "Macho" ? "🐂" : "🐄"}</span>
                  <div>
                    <div className="ganado-card__metric-lbl">
                      Sexo
                    </div>
                    <div className="ganado-card__metric-val">
                      {a.sexo || "-"}
                    </div>
                  </div>
                </div>
              </div>

              {a.fecha_nacimiento && (
                <div
                  className="ganado-card__metric-val"
                  style={{
                    marginTop: "0.75rem",
                    fontSize: "0.85rem",
                  }}
                >
                  Nació: {a.fecha_nacimiento}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}