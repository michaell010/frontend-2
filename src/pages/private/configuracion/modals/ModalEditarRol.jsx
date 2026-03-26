// ─── modals/ModalEditarRol.jsx ────────────────────────────────────────────────
import { ModalBase } from "../shared/ModalBase";

export function ModalEditarRol({
  modalRol, draft, setDraft,
  nuevoPermiso, setNuevoPermiso,
  onGuardar, onAgregarPermiso, onQuitarPermiso, onClose,
}) {
  return (
    <ModalBase title={`Editar Rol: ${modalRol.nombre}`} onClose={onClose}>
      <div className="cfg-fields-stack">
        <div className="cfg-field">
          <label className="gc-label">Nombre del Rol</label>
          <input className="gc-input" value={draft.nombre}
            onChange={(e) => setDraft((p) => ({ ...p, nombre: e.target.value }))} />
        </div>

        <div className="cfg-field">
          <label className="gc-label">Descripción</label>
          <input className="gc-input" value={draft.desc}
            onChange={(e) => setDraft((p) => ({ ...p, desc: e.target.value }))} />
        </div>

        <div className="cfg-field">
          <label className="gc-label">Permisos</label>
          <div className="cfg-permisos-tags">
            {draft.permisos.map((p) => (
              <span key={p} className="cfg-tag">
                {p}
                <button className="cfg-tag__remove" onClick={() => onQuitarPermiso(p)}>×</button>
              </span>
            ))}
          </div>
          <div className="cfg-permiso-add">
            <input
              className="gc-input"
              placeholder="Nuevo permiso…"
              value={nuevoPermiso}
              onChange={(e) => setNuevoPermiso(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onAgregarPermiso()}
            />
            <button className="gc-btn gc-btn--primary gc-btn--sm" onClick={onAgregarPermiso}>
              + Agregar
            </button>
          </div>
        </div>
      </div>

      <div className="cfg-modal__footer">
        <button className="gc-btn gc-btn--ghost" onClick={onClose}>Cancelar</button>
        <button className="gc-btn gc-btn--primary" onClick={onGuardar}>Guardar Rol</button>
      </div>
    </ModalBase>
  );
}