// ─── components/ConfigUsuarios.jsx ───────────────────────────────────────────
import { useUsuarios }             from "../hooks/useUsuarios";
import { ConfigUsuariosTabla }     from "./ConfigUsuariosTabla";
import { ModalUsuario }            from "../modals/ModalUsuario";
import { ModalEliminarUsuario }    from "../modals/ModalEliminarUsuario";

export function ConfigUsuarios({ esAdmin, showToast }) {
  const {
    usuarios, modalUsuario, draft, setDraft,
    confirmElim, setConfirmElim,
    abrirNuevo, abrirEditar, cerrarModal,
    guardar, toggle, eliminar,
  } = useUsuarios(showToast);

  return (
    <div>
      <div className="cfg-toolbar">
        <div>
          <h3 className="cfg-toolbar__title">Usuarios del sistema</h3>
          <p className="cfg-toolbar__sub">
            {usuarios.length} usuario{usuarios.length !== 1 ? "s" : ""} registrado{usuarios.length !== 1 ? "s" : ""}
          </p>
        </div>
        {esAdmin && (
          <button className="gc-btn gc-btn--primary" onClick={abrirNuevo}>
            ➕ Nuevo Usuario
          </button>
        )}
      </div>

      <ConfigUsuariosTabla
        usuarios={usuarios}
        esAdmin={esAdmin}
        onEditar={abrirEditar}
        onToggle={toggle}
        onEliminar={(u) => setConfirmElim(u)}
      />

      {modalUsuario !== null && (
        <ModalUsuario
          modalUsuario={modalUsuario}
          draft={draft}
          setDraft={setDraft}
          onGuardar={guardar}
          onClose={cerrarModal}
        />
      )}

      {confirmElim && (
        <ModalEliminarUsuario
          item={confirmElim}
          onConfirm={eliminar}
          onClose={() => setConfirmElim(null)}
        />
      )}
    </div>
  );
}