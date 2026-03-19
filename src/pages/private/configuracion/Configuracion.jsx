import { useState } from "react";
import { getUsuarioActual } from "../../../services/AuthService";
import "../../../styles/modules/Modulos.css";

const TABS = ["Finca", "Usuarios", "Roles", "Sistema"];

export default function Configuracion() {
  const [tab, setTab] = useState("Finca");
  const usuario = getUsuarioActual();

  return (
    <div className="gc-animate-in">

      <div style={{ marginBottom: "var(--space-8)" }}>
        <h1 className="gc-page-title">⚙️ Configuración</h1>
        <p className="gc-page-sub">
          Administre la información de la finca, usuarios y roles del sistema.
        </p>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "var(--space-6)", borderBottom: "1px solid var(--border-light)" }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "0.65rem 1.5rem",
              border: "none",
              background: "none",
              cursor: "pointer",
              fontWeight: tab === t ? 800 : 500,
              color: tab === t ? "var(--green-700)" : "var(--text-muted)",
              borderBottom: tab === t ? "2px solid var(--green-600)" : "2px solid transparent",
              fontSize: "0.875rem",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Finca" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-8)" }}>
          <div className="gc-card">
            <h3 style={{ fontWeight: 800, marginBottom: "var(--space-6)" }}>
              Información de la Finca
            </h3>
            {[
              { label: "Nombre de la finca", val: "La Ceiva" },
              { label: "Municipio",          val: "Pandi" },
              { label: "Departamento",       val: "Cundinamarca" },
              { label: "Propietario",        val: "Administrador" },
              { label: "Prefijo Factura",    val: "FV" },
            ].map((f, i) => (
              <div key={i} style={{ marginBottom: "var(--space-4)" }}>
                <label className="gc-label">{f.label}</label>
                <input className="gc-input" defaultValue={f.val} />
              </div>
            ))}
            <button className="gc-btn gc-btn--primary" style={{ marginTop: "var(--space-2)" }}>
              Guardar Cambios
            </button>
          </div>

          <div className="gc-card">
            <h3 style={{ fontWeight: 800, marginBottom: "var(--space-6)" }}>
              Perfil del Usuario
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg,var(--green-700),var(--green-500))", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: "1.6rem" }}>
                {(usuario?.nombres || "U").charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>
                  {usuario?.nombres || "Administrador"}
                </div>
                <span className="gc-badge gc-badge--success" style={{ marginTop: 4 }}>
                  {usuario?.rol || "Administrador"}
                </span>
              </div>
            </div>
            {[
              { label: "Correo", val: usuario?.correo || "admin@ganacontrol.co" },
              { label: "Finca",  val: usuario?.finca  || "La Ceiva" },
            ].map((f, i) => (
              <div key={i} style={{ marginBottom: "var(--space-4)" }}>
                <label className="gc-label">{f.label}</label>
                <input className="gc-input" defaultValue={f.val} />
              </div>
            ))}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
              <button className="gc-btn gc-btn--primary">Actualizar Perfil</button>
              <button className="gc-btn gc-btn--ghost">Cambiar Contraseña</button>
            </div>
          </div>
        </div>
      )}

      {tab === "Usuarios" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-6)" }}>
            <h3 style={{ fontWeight: 800, margin: 0 }}>Usuarios del sistema</h3>
            <button className="gc-btn gc-btn--primary">➕ Nuevo Usuario</button>
          </div>
          <div className="gc-card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="gc-table-wrap">
              <table className="gc-table">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { nombre: "Administrador", correo: "admin@ganacontrol.co", rol: "Administrador", activo: true },
                    { nombre: "Veterinario",   correo: "vet@ganacontrol.co",   rol: "Veterinario",   activo: true },
                    { nombre: "Operario",      correo: "op@ganacontrol.co",    rol: "Operario",      activo: false },
                  ].map((u, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{u.nombre}</td>
                      <td style={{ color: "var(--text-muted)" }}>{u.correo}</td>
                      <td>
                        <span className="gc-badge gc-badge--success">{u.rol}</span>
                      </td>
                      <td>
                        <span className={`gc-badge ${u.activo ? "gc-badge--success" : "gc-badge--danger"}`}>
                          {u.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button className="gc-btn gc-btn--ghost gc-btn--sm">✏️ Editar</button>
                          <button className="gc-btn gc-btn--danger gc-btn--sm">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === "Roles" && (
        <div className="gc-grid-3">
          {[
            { nombre: "Administrador", desc: "Acceso total al sistema.", permisos: ["Todos los módulos", "Gestión de usuarios", "Configuración"] },
            { nombre: "Veterinario",   desc: "Acceso a salud y reproducción.", permisos: ["Salud y Sanidad", "Reproducción", "Ganado"] },
            { nombre: "Operario",      desc: "Acceso básico de registro.", permisos: ["Ganado (lectura)", "Alimentación", "Inventario (lectura)"] },
          ].map((r, i) => (
            <div key={i} className="gc-card">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
                <h4 style={{ fontWeight: 800, margin: 0 }}>{r.nombre}</h4>
                <button className="gc-btn gc-btn--ghost gc-btn--sm">✏️</button>
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

      {tab === "Sistema" && (
        <div className="gc-card">
          <h3 style={{ fontWeight: 800, marginBottom: "var(--space-6)" }}>Estado del Sistema</h3>
          {[
            ["Versión",        "v1.0.0"],
            ["Base de Datos",  "MySQL 8.0 — Conectado ✅"],
            ["Entorno",        "Desarrollo"],
            ["JWT",            "Activo — 15 min"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 0", borderBottom: "1px solid var(--surface-subtle)", fontSize: "0.875rem" }}>
              <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>{k}</span>
              <span style={{ fontWeight: 700 }}>{v}</span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
