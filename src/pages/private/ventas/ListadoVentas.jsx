import { useState } from "react";
import "../../../styles/modules/Modulos.css";

const VENTAS = [
  { factura:"FV-2025-00001", cliente:"Riverbend Farms",   fecha:"24 Oct, 2025", items:"2 bovinos", total:"$4,250.000", estado:"Completado", color:"#22c55e" },
  { factura:"FV-2025-00002", cliente:"Southern Grazing",  fecha:"23 Oct, 2025", items:"5 bovinos", total:"$12,400.000", estado:"En Ruta",   color:"#3b82f6" },
  { factura:"FV-2025-00003", cliente:"Int. Cattle Group", fecha:"22 Oct, 2025", items:"2 bovinos", total:"$8,100.000", estado:"Verificando",color:"#f59e0b" },
  { factura:"FV-2025-00004", cliente:"Colechera SA",      fecha:"20 Oct, 2025", items:"Leche",     total:"$2,850.000", estado:"Completado", color:"#22c55e" },
];

export default function ListadoVentas() {
  const [busqueda, setBusqueda] = useState("");

  const filtrados = VENTAS.filter(v =>
    v.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
    v.factura.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="gc-animate-in">

      {/* ENCABEZADO */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", gap:"1rem", marginBottom:"var(--space-8)", flexWrap:"wrap" }}>
        <div>
          <h1 className="gc-page-title">Registro de Ventas</h1>
          <p className="gc-page-sub">Historial completo de transacciones y facturación.</p>
        </div>
        <button className="gc-btn gc-btn--primary">➕ Nueva Venta</button>
      </div>

      {/* KPIs */}
      <div className="gc-grid-4" style={{ marginBottom:"var(--space-8)" }}>
        {[
          { label:"Ventas Totales",   val:"$27.600.000", ico:"💰", sub:"Este mes" },
          { label:"Transacciones",    val:"4",           ico:"🧾", sub:"Octubre 2025" },
          { label:"Clientes Activos", val:"8",           ico:"🤝", sub:"+2 nuevos" },
          { label:"Pendientes",       val:"1",           ico:"⏳", sub:"Por confirmar" },
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

      {/* TABLA */}
      <div className="gc-card" style={{ padding:0, overflow:"hidden" }}>
        <div className="mod-table-actions">
          <h3 style={{ fontWeight:800, margin:0 }}>Historial de Ventas</h3>
          <div style={{ display:"flex", gap:"0.75rem", alignItems:"center" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", background:"var(--surface-light)", border:"1px solid var(--border-light)", borderRadius:"var(--radius-full)", padding:"0.4rem 1rem" }}>
              <span>🔍</span>
              <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar venta..." style={{ border:"none", background:"transparent", fontSize:"0.85rem", outline:"none", boxShadow:"none", padding:0, width:180 }} />
            </div>
            <button className="gc-btn gc-btn--secondary gc-btn--sm">📥 Exportar</button>
          </div>
        </div>
        <div className="gc-table-wrap">
          <table className="gc-table">
            <thead>
              <tr>
                <th>Nº Factura</th><th>Cliente</th><th>Fecha</th>
                <th>Descripción</th><th>Estado</th><th style={{ textAlign:"right" }}>Total</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((v,i) => (
                <tr key={i} style={{ cursor:"pointer" }}>
                  <td style={{ fontWeight:800, color:"var(--green-700)", fontFamily:"monospace" }}>{v.factura}</td>
                  <td style={{ fontWeight:600 }}>{v.cliente}</td>
                  <td style={{ color:"var(--text-muted)" }}>{v.fecha}</td>
                  <td style={{ color:"var(--text-muted)" }}>{v.items}</td>
                  <td>
                    <span className="gc-badge" style={{ background:`${v.color}20`, color:v.color }}>{v.estado}</span>
                  </td>
                  <td style={{ textAlign:"right", fontFamily:"monospace", fontWeight:800 }}>{v.total}</td>
                  <td>
                    <button className="gc-btn gc-btn--ghost gc-btn--sm">Ver →</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding:"1rem 1.25rem", borderTop:"1px solid var(--surface-subtle)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:"0.78rem", color:"var(--text-muted)" }}>Mostrando {filtrados.length} de {VENTAS.length} ventas</span>
          <div style={{ display:"flex", gap:"0.5rem" }}>
            <button className="gc-btn gc-btn--ghost gc-btn--sm" disabled>Anterior</button>
            <button className="gc-btn gc-btn--primary gc-btn--sm">1</button>
            <button className="gc-btn gc-btn--ghost gc-btn--sm">Siguiente</button>
          </div>
        </div>
      </div>
    </div>
  );
}