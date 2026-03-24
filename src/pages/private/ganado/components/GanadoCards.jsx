import { ESTADO_STYLES, CARD_IMGS } from "../ganado.constants";

export default function GanadoCards({ animales, onVerDetalle }) {
  return (
    <div className="ganado-cards">
      {animales.slice(0, 3).map((a, i) => {
        const es = ESTADO_STYLES[a.estado] || ESTADO_STYLES.Activo;
        const imgSrc = a.foto || CARD_IMGS[i % CARD_IMGS.length];

        return (
          <div className="ganado-card" key={a.id} onClick={() => onVerDetalle(a)}>
            <div className="ganado-card__img-wrap">
              <img
                src={imgSrc}
                alt={a.nombre || a.codigo}
                className="ganado-card__img"
                onError={(e) => {
                  e.currentTarget.src = CARD_IMGS[i % CARD_IMGS.length];
                }}
              />
              <span className="ganado-card__id">Código: {a.codigo || a.id}</span>
              <span className="ganado-card__estado" style={{ background: es.color }}>
                {a.estado}
              </span>
            </div>

            <div className="ganado-card__body">
              <div className="ganado-card__nombre">{a.nombre || "Sin nombre"}</div>
              <div className="ganado-card__raza">
                {(a.raza || "Sin raza")} · {(a.categoria || "Sin categoría")}
              </div>
              <div className="ganado-card__peso">{a.peso_actual ?? a.peso ?? "-"} kg</div>
              <div className="ganado-card__peso-lbl">Peso actual</div>

              <div className="ganado-card__metrics">
                <div className="ganado-card__metric">
                  <span>📍</span>
                  <div>
                    <div className="ganado-card__metric-lbl">Potrero ID</div>
                    <div className="ganado-card__metric-val">{a.potrero_id || "-"}</div>
                  </div>
                </div>

                <div className="ganado-card__metric">
                  <span>{a.sexo === "Macho" ? "🐂" : "🐄"}</span>
                  <div>
                    <div className="ganado-card__metric-lbl">Sexo</div>
                    <div className="ganado-card__metric-val">{a.sexo || "-"}</div>
                  </div>
                </div>
              </div>

              {a.fecha_nacimiento && (
                <div
                  className="ganado-card__metric-val"
                  style={{ marginTop: "0.75rem", fontSize: "0.85rem" }}
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