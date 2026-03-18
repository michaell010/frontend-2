import { useNavigate } from "react-router-dom";
import { getUsuarioActual } from "../../../services/AuthService";
import "../../../styles/Dashboard.css";

const ALERTAS = [
  { tipo:"warn", ico:"⚠️", titulo:"Stock bajo",              desc:"Ivermectina 1% y Sal Mineral por debajo del mínimo.", href:"/inventario" },
  { tipo:"info", ico:"💉", titulo:"Vacunaciones pendientes",  desc:"2 animales con eventos sanitarios por completar.",    href:"/eventos" },
  { tipo:"warn", ico:"🤰", titulo:"Parto próximo",           desc:"GN-002 · La Negra — parto estimado en 3 días.",       href:"/reproduccion" },
  { tipo:"ok",   ico:"✅", titulo:"Inventario actualizado",   desc:"Concentrado Premium reabastecido correctamente.",     href:"/inventario" },
];

const MODULOS = [
  { ico:"🐄", label:"Control Ganadero",       desc:"Registro y trazabilidad",        href:"/ganado" },
  { ico:"🧬", label:"Reproducción",           desc:"Gestaciones y partos",           href:"/reproduccion" },
  { ico:"💉", label:"Salud y Sanidad",         desc:"Vacunaciones y tratamientos",    href:"/eventos" },
  { ico:"📦", label:"Inventario",             desc:"Productos y stock",              href:"/inventario" },
  { ico:"🌾", label:"Alimentación",           desc:"Raciones diarias",               href:"/alimentacion" },
  { ico:"🌿", label:"Potreros",               desc:"Pasturas y rotación",            href:"/pasturas" },
  { ico:"💰", label:"Cockpit Financiero",      desc:"Ventas e ingresos",              href:"/finanzas" },
  { ico:"🛒", label:"Ventas",                 desc:"Registro de ventas",             href:"/ventas" },
];

const KPIS = [
  { label:"Ganado Total",         val:"1,284", sub:"+2.4% este mes",    ico:"🐄", pct:"85%" },
  { label:"Alertas Activas",      val:"3",     sub:"Requieren atención", ico:"⚠️", pct:"30%" },
  { label:"Ingresos Proyectados", val:"$45.2M",sub:"+12.8% interanual", ico:"💰", pct:"72%" },
  { label:"Tasa Vacunación",      val:"94%",   sub:"Objetivo cumplido",  ico:"💉", pct:"94%" },
];

export default function DashBoard() {
  const navigate = useNavigate();
  const usuario  = getUsuarioActual();
  const nombre   = usuario?.nombres || "Usuario";
  const rol      = usuario?.rol     || "Administrador";
  const finca    = usuario?.finca   || "La Ceiva";
  const inicial  = nombre.charAt(0).toUpperCase();

  const hora   = new Date().getHours();
  const saludo = hora < 12 ? "Buenos días" : hora < 18 ? "Buenas tardes" : "Buenas noches";

  return (
    <div className="dashboard gc-animate-in">

      {/* HEADER */}
      <div className="dashboard__header">
        <div>
          <p className="dashboard__saludo">{saludo},</p>
          <h1 className="dashboard__nombre">{nombre}</h1>
          <p className="dashboard__fecha">
            Finca <strong>{finca}</strong> —{" "}
            {new Date().toLocaleDateString("es-CO", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
          </p>
        </div>
        <div className="dashboard__perfil">
          <div className="dashboard__perfil-avatar">{inicial}</div>
          <div>
            <div className="dashboard__perfil-nombre">{nombre}</div>
            <div className="dashboard__perfil-rol">{rol}</div>
            <div className="dashboard__perfil-finca">🏠 {finca}</div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="dashboard__kpis">
        {KPIS.map((k,i) => (
          <div key={i} className="gc-kpi">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span className="gc-kpi__label">{k.label}</span>
              <span style={{ fontSize:"1.4rem" }}>{k.ico}</span>
            </div>
            <div className="gc-kpi__value">{k.val}</div>
            <div className="gc-kpi__sub">{k.sub}</div>
            <div className="gc-kpi__bar">
              <div className="gc-kpi__bar-fill" style={{ width:k.pct }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* ALERTAS */}
      <div>
        <div className="dashboard__section-label">
          🔔 Alertas activas
          <span className="dashboard__badge-count">{ALERTAS.filter(a=>a.tipo!=="ok").length}</span>
        </div>
        <div className="dashboard__alertas">
          {ALERTAS.map((a,i) => (
            <div key={i} className={`dashboard__alerta dashboard__alerta--${a.tipo}`} onClick={() => navigate(a.href)}>
              <span className="dashboard__alerta-ico">{a.ico}</span>
              <div>
                <div className="dashboard__alerta-titulo">{a.titulo}</div>
                <div className="dashboard__alerta-desc">{a.desc}</div>
              </div>
              <span className="dashboard__alerta-arrow">→</span>
            </div>
          ))}
        </div>
      </div>

      {/* MÓDULOS */}
      <div>
        <div className="dashboard__section-label">⚡ Acceso rápido a módulos</div>
        <div className="dashboard__modulos">
          {MODULOS.map((m,i) => (
            <button key={i} className="dashboard__modulo" onClick={() => navigate(m.href)}>
              <span className="dashboard__modulo-ico">{m.ico}</span>
              <span className="dashboard__modulo-label">{m.label}</span>
              <span className="dashboard__modulo-desc">{m.desc}</span>
              <span className="dashboard__modulo-arrow">→</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}