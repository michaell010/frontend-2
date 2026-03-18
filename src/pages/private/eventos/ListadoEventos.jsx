import { useNavigate } from "react-router-dom";
import "../../../styles/modules/Modulos.css";

const HISTORIAL = [
  { id:"#EV-2490", tratamiento:"Refuerzo Aftosa",     fecha:"12 Oct, 2025", vet:"Dr. Sarah Miller", estado:"Completado", color:"#22c55e" },
  { id:"#EV-1182", tratamiento:"Soporte Parto",       fecha:"11 Oct, 2025", vet:"Dr. James Wilson", estado:"En Curso",   color:"#3b82f6" },
  { id:"#EV-3015", tratamiento:"Protocolo Parásitos", fecha:"10 Oct, 2025", vet:"Dr. Sarah Miller", estado:"Completado", color:"#22c55e" },
  { id:"#EV-0982", tratamiento:"Vacuna Brucelosis",   fecha:"08 Oct, 2025", vet:"Dr. James Wilson", estado:"Pendiente",  color:"#f59e0b" },
];

const PROXIMOS = [
  { titulo:"Campaña Brucelosis",  sub:"Sector A - 45 Cabezas", fecha:"14 OCT", color:"var(--green-500)" },
  { titulo:"Control Nutricional", sub:"Añojos - 12 Cabezas",   fecha:"16 OCT", color:"var(--green-300)" },
  { titulo:"Vacunación FMD",      sub:"Hato completo",         fecha:"20 OCT", color:"var(--green-600)" },
];

export default function ListadoEventos() {
  const navigate = useNavigate();
  return (
    <div className="gc-animate-in">

      {/* HERO */}
      <div className="mod-hero">
        <div className="mod-hero__content">
          <div className="mod-hero__badge">
            <span className="mod-hero__badge-dot"></span>
            Módulo Sanitario V7
          </div>
          <h1 className="mod-hero__h1">Salud y Sanidad<br/><span>Inteligente</span></h1>
          <p className="mod-hero__p">Monitoreo biométrico y diagnóstico preventivo para la excelencia en la gestión veterinaria.</p>
          <div className="mod-hero__btns">
            <button className="gc-btn gc-btn--primary">➕ Nuevo Examen</button>
            <button className="gc-btn gc-btn--secondary">📊 Exportar Historial</button>
          </div>
        </div>
        <div className="mod-hero__img-wrap">
          <img className="mod-hero__img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqaert0Je6_m1zaN_hXwaBICvmnldiYJ6-wDJHC7dBgJAQFR2O1166rC1IRoBqqQ-wa5xwax8GA_3uG0vM_YfvoPxiRR1lgXPpqKXCfq1G6eqfhoUUsfJBFJbb7Y6yUBNIgjEF2TM4IDDf4zHhXksELJ0_mFqTn3eQjp0FMB4BtrhmjGvafSdqbakHFM22foepExFUUzPW-cVEjbeyveGxTr10w9Al3PjjzL63uYPWchdwxMa06jTiiyGWxguPog6DzgBlJPt-Ckw" alt="Salud" />
          <div className="mod-hero__img-overlay"></div>
        </div>
      </div>

      {/* KPIs */}
      <div className="gc-grid-4" style={{ marginBottom:"var(--space-8)" }}>
        {[
          { label:"Población Total",      val:"1,482", ico:"👥", sub:"+2.4% este mes" },
          { label:"Tasa Vacunación",       val:"94%",   ico:"💉", sub:"Objetivo cumplido" },
          { label:"Alertas Médicas",       val:"12",    ico:"🚨", sub:"+3 casos críticos" },
          { label:"Tratamientos Activos",  val:"45",    ico:"🏥", sub:"12 cerrados hoy" },
        ].map((k,i) => (
          <div key={i} className="gc-kpi">
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <span className="gc-kpi__label">{k.label}</span>
              <span style={{ fontSize:"1.3rem" }}>{k.ico}</span>
            </div>
            <div className="gc-kpi__value">{k.val}</div>
            <div className="gc-kpi__sub">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* CONTENIDO */}
      <div className="mod-grid-main">

        {/* Historial + tabla */}
        <div style={{ display:"flex", flexDirection:"column", gap:"var(--space-6)" }}>
          <div className="gc-card" style={{ padding:0, overflow:"hidden" }}>
            <div className="mod-table-actions">
              <h3 style={{ fontWeight:800 }}>Historial Clínico</h3>
              <button className="gc-btn gc-btn--ghost gc-btn--sm">Ver Todo →</button>
            </div>
            <div className="gc-table-wrap">
              <table className="gc-table">
                <thead>
                  <tr>
                    <th>ID Animal</th><th>Tratamiento</th>
                    <th>Fecha</th><th>Veterinario</th><th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {HISTORIAL.map((ev,i) => (
                    <tr key={i} style={{ cursor:"pointer" }}>
                      <td style={{ fontWeight:700, color:"var(--green-700)" }}>{ev.id}</td>
                      <td>{ev.tratamiento}</td>
                      <td style={{ color:"var(--text-muted)" }}>{ev.fecha}</td>
                      <td style={{ fontStyle:"italic" }}>{ev.vet}</td>
                      <td>
                        <span className="gc-badge" style={{ background:`${ev.color}20`, color:ev.color }}>
                          {ev.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display:"flex", flexDirection:"column", gap:"var(--space-6)" }}>

          {/* Próximos eventos */}
          <div className="gc-card">
            <h3 style={{ fontWeight:800, marginBottom:"var(--space-5)" }}>Próximos Eventos</h3>
            <div className="mod-timeline">
              {PROXIMOS.map((ev,i) => (
                <div key={i} className="mod-timeline-item">
                  <div className="mod-timeline-dot-wrap">
                    <div className="mod-timeline-dot" style={{ background:ev.color }}></div>
                    {i < PROXIMOS.length-1 && <div className="mod-timeline-line"></div>}
                  </div>
                  <div style={{ flex:1, paddingBottom:"0.75rem" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                      <div>
                        <p style={{ fontWeight:700, fontSize:"0.875rem", color:"var(--text-primary)", margin:0 }}>{ev.titulo}</p>
                        <p style={{ fontSize:"0.75rem", color:"var(--text-muted)", margin:"2px 0 0" }}>{ev.sub}</p>
                      </div>
                      <span style={{ fontSize:"0.68rem", fontWeight:700, color:"var(--text-faint)", whiteSpace:"nowrap", marginLeft:"0.5rem" }}>{ev.fecha}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Estatus campo */}
          <div className="mod-glass">
            <h4 style={{ fontWeight:700, color:"var(--green-700)", marginBottom:"var(--space-3)", fontSize:"0.82rem", textTransform:"uppercase", letterSpacing:"0.1em" }}>Estatus del Campo</h4>
            {[["Vacunación al día","82%"],["Tratamientos completados","94%"],["Alertas resueltas","67%"]].map(([l,p]) => (
              <div key={l} style={{ marginBottom:"var(--space-4)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.82rem", marginBottom:4 }}>
                  <span style={{ color:"var(--text-secondary)" }}>{l}</span>
                  <span style={{ fontWeight:700, color:"var(--green-700)" }}>{p}</span>
                </div>
                <div className="mod-progress">
                  <div className="mod-progress__fill" style={{ width:p }}></div>
                </div>
              </div>
            ))}
            <button className="gc-btn gc-btn--primary" style={{ width:"100%", marginTop:"var(--space-2)" }} onClick={() => navigate("/eventos")}>
              Ver todos los eventos
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}