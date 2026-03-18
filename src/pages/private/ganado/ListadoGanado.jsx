import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/modules/Ganado.css";

const ANIMALES = [
  { id:"GN-001", nombre:"Cara Blanca", raza:"Brahman",    edad:36, peso:480, potrero:"Potrero A1", estado:"Activo",    color:"#22c55e", img:"https://lh3.googleusercontent.com/aida-public/AB6AXuArW-QEqRpP4naKqaMRsFuT97jCL55C5bwwyv5jsXEmAsjCUiJ7m6BHZxPJ52PwyJtxrbEUH3CIiuzStqawwDqWH-tNcBPTtYWST04ha7lCbL1LY3vbJZWgzKIbq170fO_iefE0rXany6_EGAOdhflbVOjiZbCcy7Xy3Kttji5DIeVHCqU9CMY_7C0rFNT6JMCYM230Wmo_gZywrnzbBtK2dVQXnyvbdF4p0N_gQ5K9jLav-QCaCncwMES5vLr2Ijylvu5z27WNyls" },
  { id:"GN-002", nombre:"La Negra",    raza:"Angus",      edad:48, peso:520, potrero:"Potrero B2", estado:"Gestante",  color:"#f59e0b", img:"https://lh3.googleusercontent.com/aida-public/AB6AXuBHSHS-PDLZM_cTDqHfmm6GtkYdkXiUOXmtEFURzIICsjnEj0QCIN79jMsikR7RaI-QeogK6Dec_JPfTHHQUjphKRxNziED0NFUI-7_B5h-LcxaZEq93yIlaXUxP10n-L-dRB1DaPXDJFSjX1IOuxkv6vG9GA6MU8fpMUNvwU4A3voYjMxEWIOkScd1e-85Mstbk3l0gxndWmS_625Ni8jZHyLc35e36mRS0vG4SftXKl9Wb_fbMoNftOfe4kW4_OWVKVbj0E-VCC0" },
  { id:"GN-007", nombre:"Lucero",      raza:"Simmental",  edad:24, peso:380, potrero:"Potrero A1", estado:"Activo",    color:"#22c55e", img:"https://lh3.googleusercontent.com/aida-public/AB6AXuBt86E7HX8yiQB3ZLZwIz339DeXhGc61Y746LSbHfYchqJHHDAyN7BgH98vdyYZun59NMGRBGzs24S5SRE1Bx0teaQBd1UAOJUCoSUS9F7tbNRauE7LpPiriRE2vcsB6dahTaa4G0zxuZ9PnG795daMLOPXJa9PUEQgvlbovKWYie3ltNqSCaedifssqtVJCWY45OIKZ60uQLTDSLJOM-t0PxbLBUPGN2E2pzEgGp6K_co03zu6E4UtRZ8wRq8rXHQboRDV4GJgszE" },
  { id:"GN-012", nombre:"Torito Rey",  raza:"Cebú",       edad:18, peso:310, potrero:"Potrero C3", estado:"Vacunar",   color:"#3b82f6", img:"https://lh3.googleusercontent.com/aida-public/AB6AXuArW-QEqRpP4naKqaMRsFuT97jCL55C5bwwyv5jsXEmAsjCUiJ7m6BHZxPJ52PwyJtxrbEUH3CIiuzStqawwDqWH-tNcBPTtYWST04ha7lCbL1LY3vbJZWgzKIbq170fO_iefE0rXany6_EGAOdhflbVOjiZbCcy7Xy3Kttji5DIeVHCqU9CMY_7C0rFNT6JMCYM230Wmo_gZywrnzbBtK2dVQXnyvbdF4p0N_gQ5K9jLav-QCaCncwMES5vLr2Ijylvu5z27WNyls" },
  { id:"GN-019", nombre:"La Mona",     raza:"Holstein",   edad:60, peso:590, potrero:"Potrero B2", estado:"Activo",    color:"#22c55e", img:"https://lh3.googleusercontent.com/aida-public/AB6AXuBt86E7HX8yiQB3ZLZwIz339DeXhGc61Y746LSbHfYchqJHHDAyN7BgH98vdyYZun59NMGRBGzs24S5SRE1Bx0teaQBd1UAOJUCoSUS9F7tbNRauE7LpPiriRE2vcsB6dahTaa4G0zxuZ9PnG795daMLOPXJa9PUEQgvlbovKWYie3ltNqSCaedifssqtVJCWY45OIKZ60uQLTDSLJOM-t0PxbLBUPGN2E2pzEgGp6K_co03zu6E4UtRZ8wRq8rXHQboRDV4GJgszE" },
];

export default function ListadoGanado() {
  const navigate  = useNavigate();
  const [busqueda, setBusqueda] = useState("");

  const filtrados = ANIMALES.filter(a =>
    a.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    a.id.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="gc-animate-in">

      {/* HERO */}
      <div className="ganado-hero">
        <div className="ganado-hero__inner">
          <div className="ganado-hero__eyebrow">
            <span style={{ width:32, height:2, background:"var(--green-500)", display:"inline-block" }}></span>
            Análisis de Hato
          </div>
          <h1 className="ganado-hero__h1">Control<span> Ganadero</span></h1>
          <p className="ganado-hero__p">Telemetría de precisión y trazabilidad completa para sus activos ganaderos.</p>
          <div className="ganado-hero__btns">
            <button className="gc-btn gc-btn--primary">➕ Nuevo Registro</button>
            <button className="gc-btn gc-btn--secondary">📤 Exportar</button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="gc-grid-4" style={{ marginBottom:"var(--space-8)" }}>
        {[
          { label:"Total Cabezas",    val:"1,248",   ico:"🐄", sub:"+2.1% este mes" },
          { label:"Salud Promedio",   val:"98.2%",   ico:"❤️", sub:"Rango óptimo" },
          { label:"Tasa Crecimiento", val:"1.4 kg/d",ico:"📈", sub:"+0.2 kg vs semana ant." },
          { label:"Alertas Activas",  val:"3",       ico:"⚠️", sub:"Acción requerida" },
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

      {/* CARDS DESTACADOS */}
      <div className="ganado-cards">
        {ANIMALES.slice(0,3).map((a,i) => (
          <div key={i} className="ganado-card" onClick={() => navigate(`/ganado/${a.id}`)}>
            <div className="ganado-card__img-wrap">
              <img src={a.img} alt={a.nombre} className="ganado-card__img" />
              <span className="ganado-card__id">ID: {a.id}</span>
              <span className="ganado-card__estado" style={{ background:a.color }}>{a.estado}</span>
            </div>
            <div className="ganado-card__body">
              <div className="ganado-card__nombre">{a.nombre}</div>
              <div className="ganado-card__raza">{a.raza} • {a.edad} meses</div>
              <div>
                <div className="ganado-card__peso">{a.peso} kg</div>
                <div className="ganado-card__peso-lbl">Peso actual</div>
              </div>
              <div className="ganado-card__metrics">
                <div className="ganado-card__metric">
                  <span>📍</span>
                  <div>
                    <div className="ganado-card__metric-lbl">Potrero</div>
                    <div className="ganado-card__metric-val">{a.potrero}</div>
                  </div>
                </div>
                <div className="ganado-card__metric">
                  <span>❤️</span>
                  <div>
                    <div className="ganado-card__metric-lbl">Salud</div>
                    <div className="ganado-card__metric-val">Óptima</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TABLA */}
      <div className="ganado-table-section">
        <div className="ganado-table-header">
          <h2 style={{ fontSize:"1.1rem", fontWeight:800 }}>Inventario de Hato</h2>
          <div style={{ display:"flex", gap:"0.75rem", alignItems:"center" }}>
            <div className="ganado-table-search">
              <span>🔍</span>
              <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar animal..." />
            </div>
            <button className="gc-btn gc-btn--secondary gc-btn--sm">🔽 Filtrar</button>
          </div>
        </div>
        <div className="gc-table-wrap">
          <table className="gc-table">
            <thead>
              <tr>
                <th>ID</th><th>Nombre</th><th>Raza</th>
                <th>Edad (meses)</th><th>Peso (kg)</th>
                <th>Potrero</th><th>Estado</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((a,i) => (
                <tr key={i} style={{ cursor:"pointer" }} onClick={() => navigate(`/ganado/${a.id}`)}>
                  <td style={{ fontWeight:700, color:"var(--green-700)" }}>{a.id}</td>
                  <td style={{ fontWeight:600 }}>{a.nombre}</td>
                  <td>{a.raza}</td>
                  <td style={{ textAlign:"center" }}>{a.edad}</td>
                  <td style={{ textAlign:"center", fontWeight:700 }}>{a.peso}</td>
                  <td>{a.potrero}</td>
                  <td>
                    <span className="gc-badge" style={{ background:`${a.color}20`, color:a.color }}>
                      {a.estado}
                    </span>
                  </td>
                  <td>
                    <button className="gc-btn gc-btn--ghost gc-btn--sm">Ver →</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding:"1rem 1.5rem", borderTop:"1px solid var(--surface-subtle)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:"0.78rem", color:"var(--text-muted)" }}>Mostrando {filtrados.length} de {ANIMALES.length} registros</span>
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