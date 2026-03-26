import { ROLES_DISPONIBLES } from "../configuracion.constants";
import { ConfigToggle } from "../ui/ConfigToggle";

export function UsuarioForm({ draft, setDraft }) {
  const set = (key) => (e) =>
    setDraft((p) => ({ ...p, [key]: e.target.value }));

  return (
    <div className="cfg-fields-stack">
      <div className="cfg-field">
        <label className="gc-label">Nombre completo</label>
        <input
          className="gc-input"
          type="text"
          value={draft.nombre || ""}
          onChange={set("nombre")}
          placeholder="Ej. Juan Pérez"
        />
      </div>

      <div className="cfg-field">
        <label className="gc-label">Correo electrónico</label>
        <input
          className="gc-input"
          type="email"
          value={draft.correo || ""}
          onChange={set("correo")}
          placeholder="usuario@ejemplo.com"
        />
      </div>

      <div className="cfg-field">
        <label className="gc-label">Rol</label>
        <select
          className="gc-input"
          value={draft.rol_id || ""}
          onChange={(e) =>
            setDraft((p) => ({ ...p, rol_id: Number(e.target.value) }))
          }
        >
          {ROLES_DISPONIBLES.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="cfg-field">
        <label className="gc-label">ID de finca</label>
        <input
          className="gc-input"
          type="number"
          value={draft.finca_id || 1}
          onChange={(e) =>
            setDraft((p) => ({ ...p, finca_id: Number(e.target.value) }))
          }
        />
      </div>

      <div className="cfg-field">
        <label className="gc-label">Contraseña</label>
        <input
          className="gc-input"
          type="password"
          value={draft.contrasena || ""}
          onChange={set("contrasena")}
          placeholder="Ingrese la contraseña"
        />
      </div>

      <div className="cfg-toggle-row">
        <label className="gc-label" style={{ margin: 0 }}>
          Estado
        </label>
        <ConfigToggle
          checked={!!draft.activo}
          onChange={(e) =>
            setDraft((p) => ({ ...p, activo: e.target.checked }))
          }
        />
        <span className="cfg-muted cfg-muted--sm">
          {draft.activo ? "Activo" : "Inactivo"}
        </span>
      </div>
    </div>
  );
}