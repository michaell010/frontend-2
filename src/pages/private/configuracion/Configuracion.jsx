import { useState } from "react";
import { createPortal } from "react-dom";
import { getUsuarioActual } from "../../../services/AuthService";
import "../../../styles/modules/Modulos.css";

const TABS = ["Finca", "Usuarios", "Roles", "Sistema"];

// ─── Modal genérico (renderiza en document.body via Portal) ───────────────────
function Modal({ title, onClose, children }) {
  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(3px)",
        WebkitBackdropFilter: "blur(3px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 9999,
        animation: "overlayIn 0.18s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--surface, #fff)", borderRadius: 16,
          padding: "2rem", minWidth: 420, maxWidth: "95vw",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          animation: "modalIn 0.2s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h3 style={{ margin: 0, fontWeight: 800, fontSize: "1.1rem" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.4rem", color: "var(--text-muted)" }}>×</button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}

// ─── Modal de confirmación ────────────────────────────────────────────────────
function ConfirmModal({ message, onConfirm, onClose }) {
  return (
    <Modal title="Confirmar acción" onClose={onClose}>
      <p style={{ marginBottom: "1.5rem", color: "var(--text-muted)", fontSize: "0.92rem" }}>{message}</p>
      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
        <button className="gc-btn gc-btn--ghost" onClick={onClose}>Cancelar</button>
        <button className="gc-btn gc-btn--danger" onClick={() => { onConfirm(); onClose(); }}>Eliminar</button>
      </div>
    </Modal>
  );
}

// ─── Datos iniciales ──────────────────────────────────────────────────────────
const USUARIOS_INICIALES = [
  { id: 1, nombre: "Administrador", correo: "admin@ganacontrol.co",  rol: "Administrador", activo: true  },
  { id: 2, nombre: "Veterinario",   correo: "vet@ganacontrol.co",    rol: "Veterinario",   activo: true  },
  { id: 3, nombre: "Operario",      correo: "op@ganacontrol.co",     rol: "Operativo",     activo: false },
];

const ROLES_INICIALES = [
  {
    id: 1, nombre: "Administrador",
    desc: "Acceso total al sistema.",
    permisos: ["Todos los módulos", "Gestión de usuarios", "Configuración"],
  },
  {
    id: 2, nombre: "Veterinario",
    desc: "Acceso a salud y reproducción.",
    permisos: ["Salud y Sanidad", "Reproducción", "Ganado"],
  },
  {
    id: 3, nombre: "Operativo",
    desc: "Acceso básico de registro.",
    permisos: ["Ganado (lectura)", "Alimentación", "Inventario (lectura)"],
  },
];

const ROLES_DISPONIBLES = ["Administrador", "Veterinario", "Operativo"];

const FINCA_INICIAL = {
  nombre: "La Ceiva", municipio: "Pandi",
  departamento: "Cundinamarca", propietario: "Administrador", prefijo: "FV",
};

// ─── Toast de notificación ────────────────────────────────────────────────────
function Toast({ msg, onHide }) {
  return (
    <div
      style={{
        position: "fixed", bottom: "2rem", right: "2rem",
        background: "var(--green-700, #2d6a4f)", color: "#fff",
        padding: "0.85rem 1.4rem", borderRadius: 10,
        fontWeight: 700, fontSize: "0.88rem",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        zIndex: 99999, animation: "fadeInUp 0.25s ease",
      }}
    >
      {msg}
      <button onClick={onHide} style={{ marginLeft: "1rem", background: "none", border: "none", color: "#fff", cursor: "pointer", fontWeight: 900 }}>×</button>
    </div>
  );
}

export default function Configuracion() {
  const [tab, setTab]           = useState("Finca");
  const usuario                 = getUsuarioActual();
  const esAdmin                 = usuario?.rol === "Administrador";

  // ── Finca ──────────────────────────────────────────────────────────────────
  const [finca, setFinca]       = useState(FINCA_INICIAL);
  const [fincaDraft, setFincaDraft] = useState(FINCA_INICIAL);

  // ── Usuarios ───────────────────────────────────────────────────────────────
  const [usuarios, setUsuarios] = useState(USUARIOS_INICIALES);
  const [modalUsuario, setModalUsuario] = useState(null); // null | "nuevo" | usuario
  const [usuarioDraft, setUsuarioDraft] = useState({ nombre: "", correo: "", rol: "Operativo", activo: true });
  const [confirmEliminar, setConfirmEliminar] = useState(null); // null | { tipo, id, nombre }

  // ── Roles ──────────────────────────────────────────────────────────────────
  const [roles, setRoles]       = useState(ROLES_INICIALES);
  const [modalRol, setModalRol] = useState(null); // null | rol
  const [rolDraft, setRolDraft] = useState({ nombre: "", desc: "", permisos: [] });
  const [nuevoPermiso, setNuevoPermiso] = useState("");

  // ── Toast ──────────────────────────────────────────────────────────────────
  const [toast, setToast]       = useState(null);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  // ── Perfil ────────────────────────────────────────────────────────────────
  const [perfil, setPerfil]     = useState({
    nombres: usuario?.nombres || "Administrador",
    correo:  usuario?.correo  || "admin@ganacontrol.co",
    finca:   usuario?.finca   || "La Ceiva",
    rol:     usuario?.rol     || "Administrador",
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // HANDLERS FINCA
  // ═══════════════════════════════════════════════════════════════════════════
  const guardarFinca = () => { setFinca(fincaDraft); showToast("✅ Datos de la finca actualizados"); };
  const guardarPerfil = () => { showToast("✅ Perfil actualizado correctamente"); };

  // ═══════════════════════════════════════════════════════════════════════════
  // HANDLERS USUARIOS
  // ═══════════════════════════════════════════════════════════════════════════
  const abrirNuevoUsuario = () => {
    setUsuarioDraft({ nombre: "", correo: "", rol: "Operativo", activo: true });
    setModalUsuario("nuevo");
  };

  const abrirEditarUsuario = (u) => {
    setUsuarioDraft({ ...u });
    setModalUsuario(u);
  };

  const guardarUsuario = () => {
    if (!usuarioDraft.nombre.trim() || !usuarioDraft.correo.trim()) {
      showToast("⚠️ Nombre y correo son obligatorios"); return;
    }
    if (modalUsuario === "nuevo") {
      setUsuarios((prev) => [...prev, { ...usuarioDraft, id: Date.now() }]);
      showToast("✅ Usuario creado correctamente");
    } else {
      setUsuarios((prev) => prev.map((u) => u.id === usuarioDraft.id ? usuarioDraft : u));
      showToast("✅ Usuario actualizado correctamente");
    }
    setModalUsuario(null);
  };

  const toggleActivo = (id) => {
    setUsuarios((prev) =>
      prev.map((u) => u.id === id ? { ...u, activo: !u.activo } : u)
    );
  };

  const eliminarUsuario = (id) => {
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
    showToast("🗑️ Usuario eliminado");
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // HANDLERS ROLES
  // ═══════════════════════════════════════════════════════════════════════════
  const abrirEditarRol = (r) => {
    setRolDraft({ ...r, permisos: [...r.permisos] });
    setModalRol(r);
  };

  const guardarRol = () => {
    if (!rolDraft.nombre.trim()) { showToast("⚠️ El nombre del rol es obligatorio"); return; }
    setRoles((prev) => prev.map((r) => r.id === rolDraft.id ? { ...rolDraft } : r));
    showToast("✅ Rol actualizado correctamente");
    setModalRol(null);
  };

  const agregarPermiso = () => {
    if (!nuevoPermiso.trim()) return;
    if (rolDraft.permisos.includes(nuevoPermiso.trim())) { showToast("⚠️ Permiso ya existe"); return; }
    setRolDraft((prev) => ({ ...prev, permisos: [...prev.permisos, nuevoPermiso.trim()] }));
    setNuevoPermiso("");
  };

  const quitarPermiso = (p) => {
    setRolDraft((prev) => ({ ...prev, permisos: prev.permisos.filter((x) => x !== p) }));
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="gc-animate-in">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes overlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(16px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        .toggle-switch {
          position: relative; display: inline-block; width: 42px; height: 24px;
        }
        .toggle-switch input { opacity: 0; width: 0; height: 0; }
        .toggle-slider {
          position: absolute; cursor: pointer; inset: 0;
          background: #ccc; border-radius: 24px; transition: .3s;
        }
        .toggle-slider:before {
          position: absolute; content: ""; height: 18px; width: 18px;
          left: 3px; bottom: 3px; background: white; border-radius: 50%; transition: .3s;
        }
        input:checked + .toggle-slider { background: var(--green-600, #2d6a4f); }
        input:checked + .toggle-slider:before { transform: translateX(18px); }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: "var(--space-8)" }}>
        <h1 className="gc-page-title">⚙️ Configuración</h1>
        <p className="gc-page-sub">Administre la información de la finca, usuarios y roles del sistema.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "var(--space-6)", borderBottom: "1px solid var(--border-light)" }}>
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "0.65rem 1.5rem", border: "none", background: "none", cursor: "pointer",
            fontWeight: tab === t ? 800 : 500,
            color: tab === t ? "var(--green-700)" : "var(--text-muted)",
            borderBottom: tab === t ? "2px solid var(--green-600)" : "2px solid transparent",
            fontSize: "0.875rem",
          }}>
            {t}
          </button>
        ))}
      </div>

      {/* ───────────────────── TAB: FINCA ───────────────────── */}
      {tab === "Finca" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-8)" }}>
          {/* Información Finca */}
          <div className="gc-card">
            <h3 style={{ fontWeight: 800, marginBottom: "var(--space-6)" }}>Información de la Finca</h3>
            {[
              { label: "Nombre de la finca", key: "nombre" },
              { label: "Municipio",          key: "municipio" },
              { label: "Departamento",       key: "departamento" },
              { label: "Propietario",        key: "propietario" },
              { label: "Prefijo Factura",    key: "prefijo" },
            ].map((f) => (
              <div key={f.key} style={{ marginBottom: "var(--space-4)" }}>
                <label className="gc-label">{f.label}</label>
                <input className="gc-input" value={fincaDraft[f.key]}
                  readOnly={!esAdmin}
                  style={!esAdmin ? { background: "var(--surface-subtle, #f5f5f5)", cursor: "not-allowed" } : {}}
                  onChange={(e) => esAdmin && setFincaDraft((prev) => ({ ...prev, [f.key]: e.target.value }))} />
              </div>
            ))}
            {esAdmin && (
              <button className="gc-btn gc-btn--primary" style={{ marginTop: "var(--space-2)" }} onClick={guardarFinca}>
                Guardar Cambios
              </button>
            )}
          </div>

          {/* Perfil usuario */}
          <div className="gc-card">
            <h3 style={{ fontWeight: 800, marginBottom: "var(--space-6)" }}>Perfil del Usuario</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg,var(--green-700),var(--green-500))", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: "1.6rem" }}>
                {perfil.nombres.charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>{perfil.nombres}</div>
                <span className="gc-badge gc-badge--success" style={{ marginTop: 4 }}>{perfil.rol}</span>
              </div>
            </div>
            {[
              { label: "Correo", key: "correo" },
              { label: "Finca",  key: "finca" },
            ].map((f) => (
              <div key={f.key} style={{ marginBottom: "var(--space-4)" }}>
                <label className="gc-label">{f.label}</label>
                <input className="gc-input" value={perfil[f.key]}
                  onChange={(e) => setPerfil((prev) => ({ ...prev, [f.key]: e.target.value }))} />
              </div>
            ))}
            <div style={{ marginBottom: "var(--space-4)" }}>
              <label className="gc-label">Nueva Contraseña</label>
              <input className="gc-input" type="password" placeholder="••••••••" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
              <button className="gc-btn gc-btn--primary" onClick={guardarPerfil}>Actualizar Perfil</button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────── TAB: USUARIOS ───────────────────── */}
      {tab === "Usuarios" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-6)" }}>
            <h3 style={{ fontWeight: 800, margin: 0 }}>Usuarios del sistema</h3>
            {esAdmin && (
              <button className="gc-btn gc-btn--primary" onClick={abrirNuevoUsuario}>➕ Nuevo Usuario</button>
            )}
          </div>
          <div className="gc-card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="gc-table-wrap">
              <table className="gc-table">
                <thead>
                  <tr>
                    <th>Usuario</th><th>Correo</th><th>Rol</th><th>Estado</th>
                    {esAdmin && <th>Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 600 }}>{u.nombre}</td>
                      <td style={{ color: "var(--text-muted)" }}>{u.correo}</td>
                      <td><span className="gc-badge gc-badge--success">{u.rol}</span></td>
                      <td>
                        {esAdmin ? (
                          <label className="toggle-switch" title={u.activo ? "Desactivar" : "Activar"}>
                            <input type="checkbox" checked={u.activo} onChange={() => toggleActivo(u.id)} />
                            <span className="toggle-slider" />
                          </label>
                        ) : (
                          <span className={`gc-badge ${u.activo ? "gc-badge--success" : "gc-badge--danger"}`}>
                            {u.activo ? "Activo" : "Inactivo"}
                          </span>
                        )}
                      </td>
                      {esAdmin && (
                        <td>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button className="gc-btn gc-btn--ghost gc-btn--sm" onClick={() => abrirEditarUsuario(u)}>✏️ Editar</button>
                            <button className="gc-btn gc-btn--danger gc-btn--sm"
                              onClick={() => setConfirmEliminar({ tipo: "usuario", id: u.id, nombre: u.nombre })}>
                              🗑️
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────── TAB: ROLES ───────────────────── */}
      {tab === "Roles" && (
        <div className="gc-grid-3">
          {roles.map((r) => (
            <div key={r.id} className="gc-card">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
                <h4 style={{ fontWeight: 800, margin: 0 }}>{r.nombre}</h4>
                {esAdmin && (
                  <button className="gc-btn gc-btn--ghost gc-btn--sm" onClick={() => abrirEditarRol(r)}>✏️ Editar</button>
                )}
              </div>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "var(--space-4)" }}>{r.desc}</p>
              {r.permisos.map((p) => (
                <div key={p} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", marginBottom: "var(--space-2)" }}>
                  <span style={{ color: "var(--green-500)" }}>✓</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ───────────────────── TAB: SISTEMA ───────────────────── */}
      {tab === "Sistema" && (
        <div className="gc-card">
          <h3 style={{ fontWeight: 800, marginBottom: "var(--space-6)" }}>Estado del Sistema</h3>
          {[
            ["Versión",       "v1.0.0"],
            ["Base de Datos", "MySQL 8.0 — Conectado ✅"],
            ["Entorno",       "Desarrollo"],
            ["JWT",           "Activo — 15 min"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 0", borderBottom: "1px solid var(--surface-subtle)", fontSize: "0.875rem" }}>
              <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>{k}</span>
              <span style={{ fontWeight: 700 }}>{v}</span>
            </div>
          ))}
        </div>
      )}

      {/* ═══════════════ MODAL: USUARIO (nuevo / editar) ═══════════════ */}
      {modalUsuario !== null && (
        <Modal
          title={modalUsuario === "nuevo" ? "Nuevo Usuario" : `Editar: ${modalUsuario.nombre}`}
          onClose={() => setModalUsuario(null)}
        >
          {[
            { label: "Nombre completo", key: "nombre", type: "text" },
            { label: "Correo electrónico", key: "correo", type: "email" },
          ].map((f) => (
            <div key={f.key} style={{ marginBottom: "1rem" }}>
              <label className="gc-label">{f.label}</label>
              <input className="gc-input" type={f.type} value={usuarioDraft[f.key]}
                onChange={(e) => setUsuarioDraft((prev) => ({ ...prev, [f.key]: e.target.value }))} />
            </div>
          ))}

          <div style={{ marginBottom: "1rem" }}>
            <label className="gc-label">Rol</label>
            <select className="gc-input" value={usuarioDraft.rol}
              onChange={(e) => setUsuarioDraft((prev) => ({ ...prev, rol: e.target.value }))}>
              {ROLES_DISPONIBLES.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <label className="gc-label" style={{ margin: 0 }}>Estado</label>
            <label className="toggle-switch">
              <input type="checkbox" checked={usuarioDraft.activo}
                onChange={(e) => setUsuarioDraft((prev) => ({ ...prev, activo: e.target.checked }))} />
              <span className="toggle-slider" />
            </label>
            <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              {usuarioDraft.activo ? "Activo" : "Inactivo"}
            </span>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <button className="gc-btn gc-btn--ghost" onClick={() => setModalUsuario(null)}>Cancelar</button>
            <button className="gc-btn gc-btn--primary" onClick={guardarUsuario}>
              {modalUsuario === "nuevo" ? "Crear Usuario" : "Guardar Cambios"}
            </button>
          </div>
        </Modal>
      )}

      {/* ═══════════════ MODAL: ROL (editar) ═══════════════ */}
      {modalRol !== null && (
        <Modal title={`Editar Rol: ${modalRol.nombre}`} onClose={() => setModalRol(null)}>
          <div style={{ marginBottom: "1rem" }}>
            <label className="gc-label">Nombre del Rol</label>
            <input className="gc-input" value={rolDraft.nombre}
              onChange={(e) => setRolDraft((prev) => ({ ...prev, nombre: e.target.value }))} />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label className="gc-label">Descripción</label>
            <input className="gc-input" value={rolDraft.desc}
              onChange={(e) => setRolDraft((prev) => ({ ...prev, desc: e.target.value }))} />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label className="gc-label">Permisos</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.6rem" }}>
              {rolDraft.permisos.map((p) => (
                <span key={p} style={{
                  background: "var(--green-50, #f0fdf4)", border: "1px solid var(--green-200, #bbf7d0)",
                  borderRadius: 6, padding: "0.2rem 0.5rem", fontSize: "0.78rem",
                  display: "flex", alignItems: "center", gap: "0.3rem",
                }}>
                  {p}
                  <button onClick={() => quitarPermiso(p)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--danger, #ef4444)", fontWeight: 900, fontSize: "0.9rem", lineHeight: 1 }}>×</button>
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input className="gc-input" placeholder="Nuevo permiso…" value={nuevoPermiso}
                onChange={(e) => setNuevoPermiso(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && agregarPermiso()} />
              <button className="gc-btn gc-btn--primary gc-btn--sm" onClick={agregarPermiso}>+ Agregar</button>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "1rem" }}>
            <button className="gc-btn gc-btn--ghost" onClick={() => setModalRol(null)}>Cancelar</button>
            <button className="gc-btn gc-btn--primary" onClick={guardarRol}>Guardar Rol</button>
          </div>
        </Modal>
      )}

      {/* ═══════════════ MODAL: CONFIRMAR ELIMINACIÓN ═══════════════ */}
      {confirmEliminar !== null && (
        <ConfirmModal
          message={`¿Está seguro que desea eliminar "${confirmEliminar.nombre}"? Esta acción no se puede deshacer.`}
          onConfirm={() => {
            if (confirmEliminar.tipo === "usuario") eliminarUsuario(confirmEliminar.id);
          }}
          onClose={() => setConfirmEliminar(null)}
        />
      )}

      {/* ═══════════════ TOAST ═══════════════ */}
      {toast && <Toast msg={toast} onHide={() => setToast(null)} />}
    </div>
  );
}