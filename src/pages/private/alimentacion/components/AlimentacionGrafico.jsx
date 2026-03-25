// src/pages/private/alimentacion/components/AlimentacionGrafico.jsx
// Gráfico de barras: cantidad total por tipo de alimento

import { TIPOS_ALIMENTO, TIPO_ALIMENTO_STYLES } from "../alimentacion.constants";

export default function AlimentacionGrafico({ registros }) {
  // Suma de cantidad_kg por tipo
  const datos = TIPOS_ALIMENTO.map(tipo => {
    const total = registros
      .filter(r => r.tipo_alimento === tipo)
      .reduce((acc, r) => acc + (parseFloat(r.cantidad_kg) || 0), 0);
    return { tipo, total };
  }).filter(d => d.total > 0);

  const maxVal = Math.max(...datos.map(d => d.total), 1);

  return (
    <div className="al-card al-card--grafico">
      <h3 className="al-card__title">Distribución por Alimento 📊</h3>

      {datos.length === 0 ? (
        <p className="al-empty-msg">Sin datos para graficar aún</p>
      ) : (
        <div className="al-grafico">
          {datos.map(d => {
            const pct   = Math.round((d.total / maxVal) * 100);
            const estilo = TIPO_ALIMENTO_STYLES[d.tipo] ?? TIPO_ALIMENTO_STYLES.Otro;
            return (
              <div key={d.tipo} className="al-grafico__row">
                <div className="al-grafico__label">
                  <span>{estilo.icono}</span>
                  <span>{d.tipo.replace("_", " ")}</span>
                </div>
                <div className="al-grafico__bar-wrap">
                  <div
                    className="al-grafico__bar"
                    style={{ width: `${pct}%`, background: estilo.color, opacity: 0.8 }}
                  />
                </div>
                <div className="al-grafico__val">{d.total.toFixed(1)} kg</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}