// CockpitModalDetalle.jsx
import "../../../../styles/modules/Cockpit.css";

const ESTADO_META = {
  confirmado:  { color: "#22c55e", label: "Confirmado" },
  en_ruta:     { color: "#3b82f6", label: "En Ruta" },
  verificando: { color: "#f59e0b", label: "Verificando" },
  completado:  { color: "#22c55e", label: "Completado" },
};

export default function CockpitModalDetalle({ transaccion, onClose }) {
  if (!transaccion) return null;
  const meta = ESTADO_META[transaccion.estadoKey] ?? { color: "#6b7280", label: transaccion.estado };

  return (
    <div className="ck-modal-overlay" onClick={onClose}>
      <div className="ck-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ck-modal__header">
          <div>
            <p className="ck-modal__sub">Transacción</p>
            <h2 className="ck-modal__title">{transaccion.id}</h2>
          </div>
          <button className="ck-modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="ck-modal__body">
          <div className="ck-modal__row">
            <span className="ck-modal__key">Lote</span>
            <span className="ck-modal__val">{transaccion.lote}</span>
          </div>
          <div className="ck-modal__row">
            <span className="ck-modal__key">Adquiriente</span>
            <span className="ck-modal__val">{transaccion.cliente}</span>
          </div>
          <div className="ck-modal__row">
            <span className="ck-modal__key">Fecha</span>
            <span className="ck-modal__val">{transaccion.fecha}</span>
          </div>
          <div className="ck-modal__row">
            <span className="ck-modal__key">Estado</span>
            <span
              className="ck-badge"
              style={{ background: `${meta.color}20`, color: meta.color, border: `1px solid ${meta.color}40` }}
            >
              <span className="ck-badge__dot" style={{ background: meta.color }} />
              {meta.label}
            </span>
          </div>
          <div className="ck-modal__row ck-modal__row--monto">
            <span className="ck-modal__key">Monto</span>
            <span className="ck-modal__monto">{transaccion.monto}</span>
          </div>
        </div>

        <div className="ck-modal__footer">
          <button className="ck-btn ck-btn--ghost" onClick={onClose}>Cerrar</button>
          <button className="ck-btn ck-btn--primary">Editar Transacción</button>
        </div>
      </div>
    </div>
  );
}