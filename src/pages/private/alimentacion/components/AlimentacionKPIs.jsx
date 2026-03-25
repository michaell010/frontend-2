// src/pages/private/alimentacion/components/AlimentacionKPIs.jsx

import { calcularKPIsAlimentacion, formatCOP, TIPO_ALIMENTO_STYLES } from "../alimentacion.constants";

export default function AlimentacionKPIs({ registros }) {
  const { total, animalesUnicos, costoTotal, alimentoTop } = calcularKPIsAlimentacion(registros);

  const iconoTop = TIPO_ALIMENTO_STYLES[alimentoTop]?.icono ?? "📦";

  const items = [
    {
      label: "Total Registros",
      val:   total,
      ico:   "📋",
      sub:   "Raciones registradas",
      pct:   Math.min(total * 2, 100),
    },
    {
      label: "Animales en Dieta",
      val:   animalesUnicos,
      ico:   "🐄",
      sub:   "Animales con raciones activas",
      pct:   Math.min(animalesUnicos * 5, 100),
    },
    {
      label: "Costo Total Estimado",
      val:   formatCOP(costoTotal),
      ico:   "💰",
      sub:   costoTotal > 0 ? "Basado en costo × cantidad" : "Sin costos registrados",
      pct:   costoTotal > 0 ? Math.min(costoTotal / 1000, 100) : 0,
      warn:  false,
    },
    {
      label: "Alimento Principal",
      val:   alimentoTop === "—" ? "—" : alimentoTop.replace("_", " "),
      ico:   iconoTop,
      sub:   alimentoTop === "—" ? "Sin registros aún" : "El más suministrado",
      pct:   alimentoTop === "—" ? 0 : 75,
    },
  ];

  return (
    <div className="al-grid-4">
      {items.map((k, i) => (
        <div className="al-kpi" key={i}>
          <div className="al-kpi__top">
            <span className="al-kpi__label">{k.label}</span>
            <span className="al-kpi__ico">{k.ico}</span>
          </div>
          <div className="al-kpi__value">{k.val}</div>
          <div className={`al-kpi__sub${k.warn ? " al-kpi__sub--warn" : ""}`}>
            {k.sub}
          </div>
          <div className="al-kpi__bar">
            <div className="al-kpi__bar-fill" style={{ width: `${k.pct}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}