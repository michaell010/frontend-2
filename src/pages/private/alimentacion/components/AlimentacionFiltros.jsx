// src/pages/private/alimentacion/components/AlimentacionFiltros.jsx

import { TIPOS_ALIMENTO, TIPOS_ANIMAL } from "../alimentacion.constants";

export default function AlimentacionFiltros({ filtros, onToggle, onLimpiar, onCerrar }) {
  return (
    <div className="al-filtros-panel">
      <div className="al-filtros-panel__header">
        <span>Filtros</span>
        <button className="al-modal__close" onClick={onCerrar}>✕</button>
      </div>

      <div className="al-filtros-panel__section">
        <div className="al-filtros-panel__label">Tipo de Alimento</div>
        <div className="al-filtros-panel__chips">
          {TIPOS_ALIMENTO.map(t => (
            <button
              key={t}
              className={`al-filtro-chip${filtros.tipos.includes(t) ? " active" : ""}`}
              onClick={() => onToggle("tipos", t)}
            >
              {t.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="al-filtros-panel__section">
        <div className="al-filtros-panel__label">Tipo de Animal</div>
        <div className="al-filtros-panel__chips">
          {TIPOS_ANIMAL.map(t => (
            <button
              key={t}
              className={`al-filtro-chip${filtros.tiposAnimal.includes(t) ? " active" : ""}`}
              onClick={() => onToggle("tiposAnimal", t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <button className="al-btn al-btn--ghost al-btn--sm" onClick={onLimpiar}>
        × Limpiar filtros
      </button>
    </div>
  );
}