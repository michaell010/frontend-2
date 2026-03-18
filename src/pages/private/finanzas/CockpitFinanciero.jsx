import { useNavigate } from "react-router-dom";
import "../../../styles/modules/Modulos.css";

const TRANSACCIONES = [
  { id:"#LT-4210", desc:"Black Angus Bull",       cliente:"Riverbend Farms",   fecha:"2025.10.24", estado:"Confirmado", color:"#22c55e", monto:"$4,250.00" },
  { id:"#LT-4211", desc:"Hereford Heifer x5",     cliente:"Southern Grazing",  fecha:"2025.10.23", estado:"En Ruta",    color:"#3b82f6", monto:"$12,400.00" },
  { id:"#LT-3988", desc:"Brahman Breeding Pair",   cliente:"Int. Cattle Group", fecha:"2025.10.22", estado:"Verificando",color:"#f59e0b", monto:"$8,100.00" },
  { id:"#LT-3750", desc:"Leche - Lote mensual",    cliente:"Colechera SA",      fecha:"2025.10.20", estado:"Completado", color:"#22c55e", monto:"$2,850.00" },
];

const BARRAS = [
  { mes:"ENE", pct:40 }, { mes:"FEB", pct:60 }, { mes:"MAR", pct:50 },
  { mes:"ABR", pct:85 }, { mes:"MAY", pct:100, activo:true }, { mes:"JUN", pct:70 },
];

export default function CockpitFinanciero() {
  const navigate = useNavigate();
  return (
    <div className="gc-animate-in">

      {/* HERO */}
      <div className="mod-hero" style={{ marginBottom:"var(--space-8)" }}>
        <div className="mod-hero__content">
          <div className="mod-hero__badge">
            <span className="mod-hero__badge-dot"></span>
            Sistema Activo
          </div>
          <h1 className="mod-hero__h1">Control de Ventas<br/><span>e Ingresos</span></h1>
          <p className="mod-hero__p">Monitorización de rendimiento financiero y liquidación de inventario ganadero.</p>
          <div className="mod-hero__btns">
            <button className="gc-btn gc-btn--primary" onClick={() => navigate("/ventas")}>➕ Nueva Venta</button>
            <button className="gc-btn gc-btn--secondary">📊 Exportar Reporte</button>
          </div>
        </div>
        <div className="mod-hero__img-wrap">
          <img className="mod-hero__img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtlnLmSb-CmqEfsXu_Hpf5ja59Jz_X9xvL482bGj59MVCbeuNrEkfLz6Sy-nu-todf95Yl-fE3HEm02c4pQ5LHGy4ykqXeBtWghElcZ9B3sik0Pit7RJDKl_rDKlQvRBAFi86MvZP6fW5T2CVvxl215BYh1j3HjCfebrjuxxVSFshn4tlpiEWE3dfSgB1mxf4G-Vaa5Zw4iklD_1IfXTJWQvoiSRPOFUt0k0CFkAOMRckk9UwyB1fDbb3B0_l5H6FLUhLyibMuLuA" alt="Finanzas" />
          <div className="mod-hero__img-overlay"></div>
        </div>
      </div>

      {/* KPIs */}
      <div className="gc-grid-4" style={{ marginBottom:"var(--space-8)" }}>
        {[
          { label:"Ventas Totales",      val:"$452.000", sub:"+8.2%",  ico:"💰", pct:"80%" },
          { label:"Precio Promedio",     val:"$3.531/u", sub:"+12%",   ico:"📈", pct:"60%" },
          { label:"Unidades Liquidadas", val:"128K",     sub:"+5%",    ico:"🐄", pct:"40%" },
          { label:"Ingresos Netos",      val:"$12.850",  sub:"STABLE", ico:"🏦", pct:"90%" },
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

      {/* GRÁFICO + LIQUIDACIÓN */}
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:"var(--space-6)", marginBottom:"var(--space-8)" }}>

        {/* Gráfico */}
        <div className="gc-card">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"var(--space-6)" }}>
            <div>
              <h3 style={{ fontWeight:800, margin:0 }}>Análisis de Crecimiento</h3>
              <p style={{ fontSize:"0.72rem", color:"var(--text-muted)", margin:"4px 0 0" }}>Proyección Mensual</p>
            </div>
            <div style={{ display:"flex", background:"var(--surface-light)", borderRadius:"var(--radius-md)", padding:4, border:"1px solid var(--border-light)", gap:2 }}>
              {["Semana","Mes","Año"].map(t => (
                <button key={t} className={t==="Mes" ? "gc-btn gc-btn--primary gc-btn--sm" : "gc-btn gc-btn--sm"} style={{ background: t==="Mes" ? undefined : "transparent", color: t==="Mes" ? undefined : "var(--text-muted)" }}>{t}</button>
              ))}
            </div>
          </div>
          <div style={{ height:180, display:"flex", alignItems:"flex-end", gap:"0.75rem" }}>
            {BARRAS.map((b,i) => (
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                <div style={{ width:"100%", height:`${b.pct}%`, borderRadius:"6px 6px 0 0", background: b.activo ? "linear-gradient(to top,var(--green-700),var(--green-500))" : "var(--green-50)", border: b.activo ? "none" : "1px solid var(--green-100)", boxShadow: b.activo ? "var(--shadow-green-md)" : "none" }}></div>
                <span style={{ fontSize:"0.65rem", fontWeight:800, color: b.activo ? "var(--green-700)" : "var(--text-faint)", textTransform:"uppercase" }}>{b.mes}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Liquidación */}
        <div style={{ display:"flex", flexDirection:"column", gap:"var(--space-4)" }}>
          <h3 style={{ fontWeight:800, margin:0 }}>Estado de Liquidación</h3>
          {[
            { ico:"🔨", label:"Listos para Subasta",    desc:"42 Angus Yearlings",    val:"$84K" },
            { ico:"🔒", label:"Ventas Reservadas",       desc:"12 Brahman Bulls",       val:"$156K" },
            { ico:"🚛", label:"En Tránsito",             desc:"8 Lotes Carne/Lácteos", val:"$12.5K" },
          ].map((item,i) => (
            <div key={i} className="gc-card" style={{ display:"flex", alignItems:"center", gap:"1rem", cursor:"pointer", padding:"1rem" }}>
              <div style={{ width:40, height:40, borderRadius:"var(--radius-md)", background:"var(--green-50)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.2rem", flexShrink:0 }}>{item.ico}</div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:"0.68rem", fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", margin:0 }}>{item.label}</p>
                <p style={{ fontSize:"0.875rem", fontWeight:800, color:"var(--text-primary)", margin:"2px 0 0" }}>{item.desc}</p>
              </div>
              <span style={{ fontFamily:"monospace", fontSize:"0.82rem", fontWeight:700, color:"var(--green-700)" }}>{item.val}</span>
            </div>
          ))}
          <button className="gc-btn gc-btn--primary" onClick={() => navigate("/ventas")}>Ver Todas las Ventas →</button>
        </div>
      </div>

      {/* TABLA */}
      <div className="gc-card" style={{ padding:0, overflow:"hidden" }}>
        <div className="mod-table-actions">
          <div>
            <h3 style={{ fontWeight:800, margin:0, fontStyle:"italic" }}>Transacciones Recientes</h3>
            <p style={{ fontSize:"0.68rem", color:"var(--text-muted)", fontFamily:"monospace", margin:"4px 0 0" }}>Base de Datos: CENTRAL_LEDGER</p>
          </div>
          <button className="gc-btn gc-btn--ghost gc-btn--sm" onClick={() => navigate("/ventas")}>Ver Historial →</button>
        </div>
        <div className="gc-table-wrap">
          <table className="gc-table">
            <thead>
              <tr>
                <th>Identificador / Lote</th><th>Adquiriente</th>
                <th>Fecha</th><th>Estado</th><th style={{ textAlign:"right" }}>Monto</th>
              </tr>
            </thead>
            <tbody>
              {TRANSACCIONES.map((t,i) => (
                <tr key={i} style={{ cursor:"pointer" }}>
                  <td>
                    <p style={{ fontWeight:800, margin:0, fontSize:"0.875rem" }}>{t.id}</p>
                    <p style={{ fontSize:"0.68rem", color:"var(--text-muted)", fontFamily:"monospace", margin:"2px 0 0" }}>{t.desc}</p>
                  </td>
                  <td>{t.cliente}</td>
                  <td style={{ color:"var(--text-muted)", fontFamily:"monospace", fontSize:"0.82rem" }}>{t.fecha}</td>
                  <td>
                    <span className="gc-badge" style={{ background:`${t.color}20`, color:t.color }}>{t.estado}</span>
                  </td>
                  <td style={{ textAlign:"right", fontFamily:"monospace", fontWeight:800 }}>{t.monto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}