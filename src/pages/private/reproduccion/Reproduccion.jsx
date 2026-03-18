import { useNavigate } from "react-router-dom";
import "../../../styles/modules/Modulos.css";

const HATO = [
  { id:"BELLA-0422", linaje:"Angus Purebred", estado:"Gestante",      color:"#22c55e", salud:92, evento:"Inseminación (Mar 12)", fecha:"Mañana" },
  { id:"DAISY-0398", linaje:"Hereford Mix",   estado:"Gestante",      color:"#22c55e", salud:88, evento:"Ultrasound (Jun 04)",   fecha:"Oct 14, 2025" },
  { id:"RUBY-0552",  linaje:"Angus Purebred", estado:"Alerta de Celo",color:"#f59e0b", salud:75, evento:"Sensor Actividad (Hoy)",fecha:"PENDIENTE" },
  { id:"LUNA-0511",  linaje:"Brahman x4",     estado:"Gestante",      color:"#22c55e", salud:95, evento:"Revisión (Sep 20)",    fecha:"Oct 18, 2025" },
];

const MESES = [
  { mes:"ENE", pct:60 }, { mes:"FEB", pct:75 }, { mes:"MAR", pct:45 },
  { mes:"ABR", pct:90 }, { mes:"MAY", pct:80, activo:true }, { mes:"JUN", pct:65 },
];

export default function Reproduccion() {
  return (
    <div className="gc-animate-in">

      {/* HERO */}
      <div className="mod-hero" style={{ marginBottom:"var(--space-8)" }}>
        <div className="mod-hero__content">
          <div className="mod-hero__badge">
            <span className="mod-hero__badge-dot"></span>
            Protocolo v7.4
          </div>
          <h1 className="mod-hero__h1">Reproducción<br/><span>y Genética</span></h1>
          <p className="mod-hero__p">Optimización algorítmica de linajes y monitoreo gestacional con análisis biomecánico en tiempo real.</p>
          <div className="mod-hero__btns">
            <button className="gc-btn gc-btn--primary">➕ Nueva Inseminación</button>
            <button className="gc-btn gc-btn--secondary">🧬 Dashboard Genético</button>
          </div>
        </div>
        <div className="mod-hero__img-wrap">
          <img className="mod-hero__img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRBZJZXbVPUkwBE3Gsi6apMlNG8LaqSHk_-8ftv9CFhLWsG57qdPywNe77mMnlumGfb2LTx7KBF4ii_ssHNicQBKYY6XUIC3G_ZpYyiRQYFaKlag-0F8Vgyk5zDVgWH0Rf4qG5w78AB26D66c160ENJK7r9v1Uj1L1wUYKl8W5STqMcpY_IO-vuynnbY7CXZ4H4dSQqJOC38lmi3UmY3jh-pXPN7JiKbtW_k38YX39CRVjWYym8Q-su9_mjwbPNnn1wL3cngR1UV4" alt="Reproducción" />
          <div className="mod-hero__img-overlay"></div>
        </div>
      </div>

      {/* KPIs */}
      <div className="gc-grid-4" style={{ marginBottom:"var(--space-8)" }}>
        {[
          { label:"Tasa de Preñez",    val:"78.5%", ico:"🧪", sub:"+2.4%", pct:"78%" },
          { label:"Partos Esperados",  val:"42",    ico:"🐄", sub:"Próxima ventana: 72h", pct:"42%" },
          { label:"Inseminaciones",    val:"56",    ico:"🔬", sub:"Ciclo: Fase final", pct:"56%" },
          { label:"Eficiencia Genética",val:"85%",  ico:"🧬", sub:"-1.2%", pct:"85%" },
        ].map((k,i) => (
          <div key={i} className="gc-kpi">
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <span className="gc-kpi__label">{k.label}</span>
              <span style={{ fontSize:"1.3rem" }}>{k.ico}</span>
            </div>
            <div className="gc-kpi__value">{k.val}</div>
            <div className="gc-kpi__sub">{k.sub}</div>
            <div className="gc-kpi__bar">
              <div className="gc-kpi__bar-fill" style={{ width:k.pct }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* GRÁFICO + PARTOS */}
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:"var(--space-6)", marginBottom:"var(--space-8)" }}>

        {/* Gráfico */}
        <div className="gc-card">
          <h3 style={{ fontWeight:800, marginBottom:"var(--space-6)" }}>Tendencias de Reproducción</h3>
          <div style={{ height:160, display:"flex", alignItems:"flex-end", gap:"0.75rem", padding:"0 0.5rem" }}>
            {MESES.map((b,i) => (
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                <div style={{ width:"100%", height:`${b.pct}%`, borderRadius:"8px 8px 0 0", background: b.activo ? "linear-gradient(to top,var(--green-700),var(--green-400))" : "var(--green-50)", border: b.activo ? "none" : "1px solid var(--green-100)", boxShadow: b.activo ? "var(--shadow-green-sm)" : "none", transition:"all 0.3s" }}></div>
                <span style={{ fontSize:"0.65rem", fontWeight:800, color: b.activo ? "var(--green-700)" : "var(--text-faint)", textTransform:"uppercase" }}>{b.mes}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Partos próximos */}
        <div className="gc-card">
          <h3 style={{ fontWeight:800, marginBottom:"var(--space-5)" }}>Partos Próximos 🔔</h3>
          <div className="mod-timeline">
            {[
              { nombre:"BELLA #0422", raza:"Angus • 2do Parto",  fecha:"Mañana",       activo:true },
              { nombre:"DAISY #0398", raza:"Hereford • 1er Parto",fecha:"Oct 14",       activo:false },
              { nombre:"LUNA #0511",  raza:"Brahman • 4to Parto", fecha:"Oct 18",       activo:false },
            ].map((p,i) => (
              <div key={i} className="mod-timeline-item">
                <div className="mod-timeline-dot-wrap">
                  <div className="mod-timeline-dot" style={{ background: p.activo ? "var(--green-500)" : "var(--border-light)", boxShadow: p.activo ? "0 0 0 4px rgba(34,197,94,0.15)" : "none" }}></div>
                  {i < 2 && <div className="mod-timeline-line"></div>}
                </div>
                <div style={{ paddingBottom:"0.75rem", flex:1 }}>
                  <p style={{ fontSize:"0.65rem", fontWeight:700, color: p.activo ? "var(--green-600)" : "var(--text-faint)", textTransform:"uppercase", letterSpacing:"0.1em", margin:0 }}>{p.fecha}</p>
                  <p style={{ fontWeight:700, color:"var(--text-primary)", margin:"2px 0" }}>{p.nombre}</p>
                  <p style={{ fontSize:"0.75rem", color:"var(--text-muted)", margin:0 }}>{p.raza}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="gc-btn gc-btn--secondary" style={{ width:"100%", marginTop:"var(--space-4)" }}>Ver Calendario Completo</button>
        </div>
      </div>

      {/* TABLA ESTATUS GENÉTICO */}
      <div className="gc-card" style={{ padding:0, overflow:"hidden" }}>
        <div className="mod-table-actions">
          <div>
            <h3 style={{ fontWeight:800, margin:0 }}>Estatus Genético del Hato</h3>
            <p style={{ fontSize:"0.75rem", color:"var(--text-muted)", margin:"4px 0 0" }}>Monitoreo de 154 especímenes reproductivos</p>
          </div>
          <div style={{ display:"flex", gap:"0.75rem" }}>
            <button className="gc-btn gc-btn--ghost gc-btn--sm">Filtros Avanzados</button>
            <button className="gc-btn gc-btn--primary gc-btn--sm">Exportar Reporte</button>
          </div>
        </div>
        <div className="gc-table-wrap">
          <table className="gc-table">
            <thead>
              <tr>
                <th>Identificador</th><th>Linaje Genético</th><th>Estatus</th>
                <th>Último Evento</th><th>Fecha Estimada</th><th>Índice Salud</th>
              </tr>
            </thead>
            <tbody>
              {HATO.map((a,i) => (
                <tr key={i} style={{ cursor:"pointer" }}>
                  <td style={{ fontWeight:800, color:"var(--green-700)" }}>{a.id}</td>
                  <td>{a.linaje}</td>
                  <td>
                    <span className="gc-badge" style={{ background:`${a.color}20`, color:a.color }}>{a.estado}</span>
                  </td>
                  <td style={{ color:"var(--text-muted)" }}>{a.evento}</td>
                  <td style={{ fontWeight:700 }}>{a.fecha}</td>
                  <td>
                    <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
                      <div style={{ flex:1, height:6, background:"var(--surface-subtle)", borderRadius:999, overflow:"hidden", maxWidth:80 }}>
                        <div style={{ height:"100%", width:`${a.salud}%`, background:"linear-gradient(to right,var(--green-700),var(--green-400))", borderRadius:999 }}></div>
                      </div>
                      <span style={{ fontSize:"0.72rem", fontWeight:700, color:"var(--green-700)" }}>{a.salud}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}