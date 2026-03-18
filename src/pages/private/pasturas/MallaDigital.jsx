import { useState } from "react";
import "../../../styles/modules/Modulos.css";

const POTREROS = [
  { nombre:"Potrero El Olvido",    sector:"Sector Norte", ha:15.5, pasto:"Estrella",   cap:25, val:88,  estado:"Ocupado",      color:"#22c55e" },
  { nombre:"Potrero La Esperanza", sector:"Sector Sur",   ha:12.0, pasto:"Guinea",     cap:18, dias:14, estado:"En Descanso",  color:"#3b82f6" },
  { nombre:"Lote San José",        sector:"Sector Bajo",  ha:22.8, pasto:"Mulato II",  cap:35, val:95,  estado:"Ocupado",      color:"#22c55e" },
  { nombre:"Sector Norte 1",       sector:"Sector Norte", ha:18.2, pasto:"Brizantha",  cap:30, forraje:"Baja", estado:"Crítico", color:"#ef4444" },
  { nombre:"Potrero Las Vacas",    sector:"Sector Sur",   ha:10.0, pasto:"Estrella",   cap:15, dias:22, estado:"En Descanso",  color:"#3b82f6" },
  { nombre:"Lote Bajo",            sector:"Sector Bajo",  ha:25.0, pasto:"Natural",    cap:40, val:60,  estado:"Ocupado",      color:"#22c55e" },
];

const STATS = [
  { label:"Disponibles",   val:12, ico:"✅", color:"#22c55e" },
  { label:"Ocupados",      val:8,  ico:"🐄", color:"#3b82f6" },
  { label:"Mantenimiento", val:3,  ico:"🔧", color:"#f59e0b" },
  { label:"Descanso",      val:5,  ico:"🌿", color:"#64748b" },
];

export default function MallaDigital() {
  const [vista, setVista]     = useState("grid");
  const [busqueda, setBusqueda] = useState("");

  const filtrados = POTREROS.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.sector.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="gc-animate-in">

      {/* ENCABEZADO */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", gap:"1rem", marginBottom:"var(--space-8)", flexWrap:"wrap" }}>
        <div>
          <h1 className="gc-page-title">Gestión de Potreros</h1>
          <p className="gc-page-sub">Supervise el estado de sus pastizales y capacidad de carga.</p>
        </div>
        <button className="gc-btn gc-btn--primary">➕ Nuevo Potrero</button>
      </div>

      {/* STATS */}
      <div className="gc-grid-4" style={{ marginBottom:"var(--space-6)" }}>
        {STATS.map((s,i) => (
          <div key={i} className="gc-card" style={{ display:"flex", alignItems:"center", gap:"1rem", padding:"1rem" }}>
            <div style={{ width:46, height:46, borderRadius:"var(--radius-md)", background:`${s.color}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.3rem" }}>{s.ico}</div>
            <div>
              <p style={{ fontSize:"0.68rem", color:"var(--text-muted)", textTransform:"uppercase", fontWeight:700, letterSpacing:"0.08em", margin:0 }}>{s.label}</p>
              <p style={{ fontSize:"1.4rem", fontWeight:900, margin:0 }}>{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TOOLBAR */}
      <div className="gc-card" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"1rem", marginBottom:"var(--space-6)", padding:"1rem 1.25rem" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", background:"var(--surface-light)", border:"1px solid var(--border-light)", borderRadius:"var(--radius-full)", padding:"0.4rem 1rem", minWidth:220 }}>
          <span>🔍</span>
          <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar potrero..." style={{ border:"none", background:"transparent", fontSize:"0.875rem", outline:"none", boxShadow:"none", padding:0 }} />
        </div>
        <div style={{ display:"flex", gap:"0.5rem" }}>
          <button className={vista==="grid" ? "gc-btn gc-btn--primary gc-btn--sm" : "gc-btn gc-btn--ghost gc-btn--sm"} onClick={() => setVista("grid")}>▦ Grid</button>
          <button className={vista==="tabla" ? "gc-btn gc-btn--primary gc-btn--sm" : "gc-btn gc-btn--ghost gc-btn--sm"} onClick={() => setVista("tabla")}>☰ Tabla</button>
        </div>
      </div>

      {/* GRID */}
      {vista === "grid" && (
        <div className="gc-grid-3" style={{ marginBottom:"var(--space-8)" }}>
          {filtrados.map((p,i) => (
            <div key={i} className="gc-card" style={{ padding:0, overflow:"hidden", cursor:"pointer", transition:"all var(--transition-normal)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=p.color; e.currentTarget.style.boxShadow="var(--shadow-green-sm)"; e.currentTarget.style.transform="translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border-light)"; e.currentTarget.style.boxShadow="none"; e.currentTarget.style.transform="none"; }}>
              <div style={{ background:`linear-gradient(135deg,${p.color}15,${p.color}05)`, padding:"1.5rem", borderBottom:"1px solid var(--surface-subtle)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <h3 style={{ fontWeight:800, fontSize:"1rem", color:"var(--text-primary)", margin:0 }}>{p.nombre}</h3>
                    <p style={{ fontSize:"0.75rem", color:"var(--text-muted)", margin:"4px 0 0", display:"flex", alignItems:"center", gap:4 }}>📍 {p.sector}</p>
                  </div>
                  <span className="gc-badge" style={{ background:`${p.color}20`, color:p.color }}>{p.estado}</span>
                </div>
              </div>
              <div style={{ padding:"1.25rem", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
                {[["Hectáreas",`${p.ha} Ha`],["Pasto",p.pasto],["Capacidad",`${p.cap} U.G.`],[p.val ? "Ocupación" : p.dias ? "Días Descanso" : "Forraje", p.val ? `${p.val}%` : p.dias ? `${p.dias} días` : p.forraje]].map(([l,v]) => (
                  <div key={l}>
                    <span style={{ fontSize:"0.62rem", fontWeight:700, color:"var(--text-faint)", textTransform:"uppercase", letterSpacing:"0.08em" }}>{l}</span>
                    <p style={{ fontWeight:800, fontSize:"1rem", color:"var(--text-primary)", margin:"2px 0 0" }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TABLA */}
      {vista === "tabla" && (
        <div className="gc-card" style={{ padding:0, overflow:"hidden", marginBottom:"var(--space-8)" }}>
          <div className="gc-table-wrap">
            <table className="gc-table">
              <thead>
                <tr><th>Nombre</th><th>Hectáreas</th><th>Tipo de Pasto</th><th>Capacidad</th><th>Estado</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {filtrados.map((p,i) => (
                  <tr key={i} style={{ cursor:"pointer" }}>
                    <td style={{ fontWeight:600 }}>{p.nombre}</td>
                    <td>{p.ha} ha</td>
                    <td>{p.pasto}</td>
                    <td>{p.cap} Cabezas</td>
                    <td>
                      <span className="gc-badge" style={{ background:`${p.color}20`, color:p.color }}>{p.estado}</span>
                    </td>
                    <td>
                      <button className="gc-btn gc-btn--ghost gc-btn--sm">⋮</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding:"1rem 1.25rem", borderTop:"1px solid var(--surface-subtle)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:"0.78rem", color:"var(--text-muted)" }}>Mostrando {filtrados.length} de {POTREROS.length} potreros</span>
            <div style={{ display:"flex", gap:"0.5rem" }}>
              <button className="gc-btn gc-btn--ghost gc-btn--sm" disabled>Anterior</button>
              <button className="gc-btn gc-btn--primary gc-btn--sm">1</button>
              <button className="gc-btn gc-btn--ghost gc-btn--sm">Siguiente</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}