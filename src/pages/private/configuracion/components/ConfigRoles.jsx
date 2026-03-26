// ─── components/ConfigRoles.jsx ──────────────────────────────────────────────
import { useRoles }        from "../hooks/useRoles";
import { ModalEditarRol }  from "../modals/ModalEditarRol";

export function ConfigRoles({ esAdmin, showToast }) {
  const {
    roles, modalRol, draft, setDraft,
    nuevoPermiso, setNuevoPermiso,
    abrirEditar, cerrarModal, guardar, agregarPermiso, quitarPermiso,
  } = useRoles(showToast);

  return (
    <div>
      <div className="cfg-toolbar">
        <div>
          <h3 className="cfg-toolbar__title">Roles del sistema</h3>
          <p className="cfg-toolbar__sub">Define los niveles de acceso por perfil</p>
        </div>
      </div>

      <div className="gc-grid-3">
        {roles.map((r) => (
          <div key={r.id} className="gc-card cfg-rol-card">
            <div className="cfg-rol-card__head">
              <div className="cfg-rol-icon">{r.nombre.charAt(0)}</div>
              <div className="cfg-rol-info">
                <h4 className="cfg-rol-nombre">{r.nombre}</h4>
                <p className="cfg-rol-desc">{r.desc}</p>
              </div>
              {esAdmin && (
                <button className="gc-btn gc-btn--ghost gc-btn--sm" onClick={() => abrirEditar(r)}>
                  ✏️
                </button>
              )}
            </div>
            <div className="cfg-rol-permisos">
              {r.permisos.map((p) => (
                <div key={p} className="cfg-permiso-item">
                  <span className="cfg-permiso-check">✓</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
            <div className="cfg-rol-footer">
              <span className="cfg-muted cfg-muted--sm">
                {r.permisos.length} permiso{r.permisos.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        ))}
      </div>

      {modalRol !== null && draft && (
        <ModalEditarRol
          modalRol={modalRol}
          draft={draft}
          setDraft={setDraft}
          nuevoPermiso={nuevoPermiso}
          setNuevoPermiso={setNuevoPermiso}
          onGuardar={guardar}
          onAgregarPermiso={agregarPermiso}
          onQuitarPermiso={quitarPermiso}
          onClose={cerrarModal}
        />
      )}
    </div>
  );
}