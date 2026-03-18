import { useNavigate } from "react-router-dom";
import "../../../styles/modules/Modulos.css";

const PRODUCTOS = [
  { ico:"🌾", nombre:"Grano Premium B1",    id:"GA-10294", fecha:"24 Oct, 2025", tipo:"Alimento",    estado:"En Stock",   color:"#22c55e", stock:85 },
  { ico:"💉", nombre:"Vacuna FMD Lote 22",  id:"VC-99812", fecha:"23 Oct, 2025", tipo:"Medicamento", estado:"Stock Bajo", color:"#f59e0b", stock:22 },
  { ico:"💊", nombre:"Oxitetraciclina 20%", id:"ME-00122", fecha:"21 Oct, 2025", tipo:"Medicamento", estado:"Crítico",    color:"#ef4444", stock:8  },
  { ico:"🧂", nombre:"Sal Mineral x50kg",   id:"AL-00544", fecha:"20 Oct, 2025", tipo:"Alimento",    estado:"En Stock",   color:"#22c55e", stock:70 },
  { ico:"🔩", nombre:"Agujas 18G x100",     id:"IN-01120", fecha:"18 Oct, 2025", tipo:"Insumo",      estado:"En Stock",   color:"#22c55e", stock:95 },
];

const SUMINISTROS = [
  { nombre:"Concentrado Inicio",  pct:85, color:"var(--green-600)" },
  { nombre:"Vacunas FMD",         pct:22, color:"var(--color-warning)" },
  { nombre:"Fertilizantes",       pct:92, color:"var(--green-600)" },
  { nombre:"Antibióticos",        pct:8,  color:"var(--color-danger)" },
  { nombre:"Sales Minerales",     pct:60, color:"var(--green-500)" },
];

export default function ListadoInventario() {
  return (
    <div className="gc-animate-in">

      {/* HERO */}
      <div className="mod-hero" style={{ marginBottom:"var(--space-8)" }}>
        <div className="mod-hero__content">
          <div className="mod-hero__badge">
            <span className="mod-hero__badge-dot"></span>
            Sistema de Telemetría Activo
          </div>
          <h1 className="mod-hero__h1">Inventario<br/><span>Inteligente v7</span></h1>
          <p className="mod-hero__p">Gestión predictiva de suministros y monitoreo de recursos en tiempo real.</p>
          <div className="mod-hero__btns">
            <button className="gc-btn gc-btn--primary">➕ Añadir Insumo</button>
            <button className="gc-btn gc-btn--secondary">📊 Análisis IA</button>
          </div>
        </div>
        <div className="mod-hero__img-wrap" style={{ background:"linear-gradient(135deg,var(--green-50),var(--green-100))", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:"1.5rem", padding:"2rem" }}>
          {/* Silos */}
          <h4 style={{ fontWeight:700, color:"var(--green-700)", fontSize:"0.78rem", textTransform:"uppercase", letterSpacing:"0.1em", margin:0 }}>Estado de Silos</h4>
          <div style={{ display:"flex", gap:"2rem", alignItems:"flex-end", height:160 }}>
            {[["Silo A1",85,"var(--green-500)"],["Stock Bajo",12,"var(--color-warning)"],["Silo B2",60,"var(--green-400)"]].map(([l,p,c]) => (
              <div key={l} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
                <div style={{ width:50, height:140, background:"var(--surface-white)", borderRadius:"16px 16px 8px 8px", border:"1px solid var(--border-green)", position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", bottom:0, width:"100%", height:`${p}%`, background:c, transition:"height 1s ease" }}></div>
                  <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.72rem", fontWeight:900 }}>{p}%</div>
                </div>
                <span style={{ fontSize:"0.65rem", fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="gc-grid-4" style={{ marginBottom:"var(--space-8)" }}>
        {[
          { label:"Valor de Inventario", val:"$42.850",  ico:"💰", sub:"ACTIVO" },
          { label:"Alertas Críticas",    val:"4",        ico:"⚠️", sub:"STOCK BAJO" },
          { label:"Concentrado Total",   val:"1.240 Kg", ico:"🌿", sub:"En existencia" },
          { label:"Lotes Medicina",      val:"12 Und",   ico:"💊", sub:"Controlados" },
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

      {/* SUMINISTROS + TABLA */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:"var(--space-8)" }}>

        {/* Suministros */}
        <div>
          <h3 style={{ fontWeight:800, marginBottom:"var(--space-5)" }}>Niveles de Suministro</h3>
          <div className="gc-card" style={{ display:"flex", flexDirection:"column", gap:"var(--space-5)" }}>
            {SUMINISTROS.map((s,i) => (
              <div key={i}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.82rem", marginBottom:6 }}>
                  <span style={{ fontWeight:600, color: s.pct < 20 ? "var(--color-danger)" : "var(--text-secondary)" }}>{s.nombre}</span>
                  <span style={{ fontWeight:800, color:s.color }}>{s.pct}%</span>
                </div>
                <div className="mod-progress">
                  <div className="mod-progress__fill" style={{ width:`${s.pct}%`, background:s.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabla flujos */}
        <div>
          <h3 style={{ fontWeight:800, marginBottom:"var(--space-5)" }}>Flujos de Carga</h3>
          <div className="gc-card" style={{ padding:0, overflow:"hidden" }}>
            <div className="gc-table-wrap">
              <table className="gc-table">
                <thead>
                  <tr><th>Producto</th><th>Tipo</th><th>Fecha</th><th>Stock</th><th>Estado</th></tr>
                </thead>
                <tbody>
                  {PRODUCTOS.map((p,i) => (
                    <tr key={i} style={{ cursor:"pointer" }}>
                      <td>
                        <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
                          <div style={{ width:36, height:36, background:"var(--green-50)", borderRadius:"var(--radius-md)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.1rem", flexShrink:0 }}>{p.ico}</div>
                          <div>
                            <div style={{ fontWeight:700, fontSize:"0.875rem" }}>{p.nombre}</div>
                            <div style={{ fontSize:"0.65rem", color:"var(--text-faint)", fontFamily:"monospace" }}>ID: {p.id}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ color:"var(--text-muted)" }}>{p.tipo}</td>
                      <td style={{ color:"var(--text-muted)" }}>{p.fecha}</td>
                      <td>
                        <div className="mod-progress" style={{ width:80, height:6, display:"inline-block" }}>
                          <div className="mod-progress__fill" style={{ width:`${p.stock}%`, background:p.color }}></div>
                        </div>
                      </td>
                      <td>
                        <span className="gc-badge" style={{ background:`${p.color}20`, color:p.color }}>{p.estado}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding:"0.875rem 1.25rem", borderTop:"1px solid var(--surface-subtle)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:"0.78rem", color:"var(--text-muted)" }}>Mostrando 5 de 124 registros</span>
              <div style={{ display:"flex", gap:"0.5rem" }}>
                <button className="gc-btn gc-btn--ghost gc-btn--sm">Anterior</button>
                <button className="gc-btn gc-btn--ghost gc-btn--sm">Siguiente →</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}