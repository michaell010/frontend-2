import { useNavigate } from "react-router-dom";
import { getUsuarioActual } from "../../../services/AuthService";
// ── Íconos PNG ───────────────────────────────────────────────────
import icoCow          from "../../../assets/icons/cow.png";
import icoDashboard    from "../../../assets/icons/dashboard.png";
import icoReproduccion from "../../../assets/icons/reproduccion.png";
import icoSalud        from "../../../assets/icons/salud.png";
import icoInventario   from "../../../assets/icons/inventario.png";
import icoPotreros     from "../../../assets/icons/potreros.png";
import icoFinanzas     from "../../../assets/icons/finanzas.png";
import icoAlimentacion from "../../../assets/icons/alimentacion.png";
import icoVerificacion from "../../../assets/icons/verificacion.png";
import icoAlerta from "../../../assets/icons/alerta.png";
import "../../../styles/Dashboard.css";
// ── Datos ────────────────────────────────────────────────────────
const ALERTAS = [
  { tipo: "warn", ico: icoAlerta, titulo: "Stock bajo",             desc: "Ivermectina 1% y Sal Mineral por debajo del mínimo.", href: "/inventario" },
  { tipo: "info", ico: icoSalud, titulo: "Vacunaciones pendientes", desc: "2 animales con eventos sanitarios por completar.",    href: "/eventos" },
  { tipo: "warn", ico: icoReproduccion, titulo: "Parto próximo",          desc: "GN-002 · La Negra — parto estimado en 3 días.",       href: "/reproduccion" },
  { tipo: "ok",   ico: icoVerificacion, titulo: "Inventario actualizado",  desc: "Concentrado Premium reabastecido correctamente.",     href: "/inventario" },
];
const MODULOS = [
  { img: icoCow,          label: "Control Ganadero",       desc: "Registro y trazabilidad",     href: "/ganado" },
  { img: icoReproduccion, label: "Reproducción",           desc: "Gestaciones y partos",        href: "/reproduccion" },
  { img: icoSalud,        label: "Salud y Sanidad",        desc: "Vacunaciones y tratamientos", href: "/eventos" },
  { img: icoInventario,   label: "Inventario",             desc: "Productos y stock",           href: "/inventario" },
  { img: icoAlimentacion, label: "Alimentación",           desc: "Raciones diarias",            href: "/alimentacion" },
  { img: icoPotreros,     label: "Potreros",               desc: "Pasturas y rotación",         href: "/pasturas" },
  { img: icoFinanzas,     label: "Cockpit Financiero",     desc: "Ventas e ingresos",           href: "/finanzas" },
  { img: icoDashboard,    label: "Mando Central",          desc: "Vista ejecutiva",             href: "/dashboard" },
];
const KPIS = [
  { label: "Ganado Total",         value: "1,284", sub: "+2.4% este mes",    icon: icoCow,       barPct: 85 },
  { label: "Alertas Activas",      value: "3",     sub: "Requieren atención",icon: icoAlerta,    barPct: 30 },
  { label: "Ingresos Proyectados", value: "$45.2M",sub: "+12.8% interanual", icon: icoFinanzas,  barPct: 72 },
  { label: "Tasa Vacunación",      value: "94%",   sub: "Objetivo cumplido", icon: icoSalud,     barPct: 94 },
];
// ── Componente ───────────────────────────────────────────────────
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
      {/* ── Header ── */}
      <div className="dashboard__header">
        <div>
          <p className="dashboard__saludo">{saludo},</p>
          <h1 className="dashboard__nombre">{nombre}</h1>
          <p className="dashboard__fecha">
            Finca <strong>{finca}</strong> —{" "}
            {new Date().toLocaleDateString("es-CO", {
              weekday: "long",
              year:    "numeric",
              month:   "long",
              day:     "numeric",
            })}
          </p>
        </div>
        <div className="dashboard__perfil">
          <div className="dashboard__perfil-avatar">{inicial}</div>
          <div>
            <div className="dashboard__perfil-nombre">{nombre}</div>
            <div className="dashboard__perfil-rol">{rol}</div>
            <div className="dashboard__perfil-finca">{finca}</div>
          </div>
        </div>
      </div>
      {/* ── KPIs ── */}
      <div className="dashboard__kpis">
        {KPIS.map((k, i) => (
          <div key={i} className="gc-kpi">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="gc-kpi__label">{k.label}</span>
              {k.icon && (
                <img
                  src={k.icon}
                  alt={k.label}
                  style={{ width: 36, height: 36, objectFit: "contain" }}
                />
              )}
            </div>
            <div className="gc-kpi__value">{k.value}</div>
            <div className="gc-kpi__sub">{k.sub}</div>
            <div className="gc-kpi__bar">
              <div className="gc-kpi__bar-fill" style={{ width: `${k.barPct}%` }} />
            </div>
          </div>
        ))}
      </div>
      {/* ── Alertas ── */}
<div>
  <div className="dashboard__section-label">
    Alertas activas
    <span className="dashboard__badge-count">
      {ALERTAS.filter(a => a.tipo !== "ok").length}
    </span>
  </div>

  <div className="dashboard__alertas">
    {ALERTAS.map((a, i) => (
      <div
        key={i}
        className={`dashboard__alerta dashboard__alerta--${a.tipo}`}
        onClick={() => navigate(a.href)}
      >
        <img
          src={icoAlerta}
          alt="alerta"
          className="dashboard__alerta-ico"
        />

        <div>
          <div className="dashboard__alerta-titulo">{a.titulo}</div>
          <div className="dashboard__alerta-desc">{a.desc}</div>
        </div>

        <span className="dashboard__alerta-arrow">→</span>
      </div>
    ))}
  </div>
</div>
      {/* ── Módulos ── */}
      <div>
        <div className="dashboard__section-label">Acceso rápido a módulos</div>
        <div className="dashboard__modulos">
          {MODULOS.map((m, i) => (
            <button
              key={i}
              className="dashboard__modulo"
              onClick={() => navigate(m.href)}
            >
              <img
                src={m.img}
                alt={m.label}
                style={{ width: 48, height: 48, objectFit: "contain", marginBottom: "0.5rem" }}
              />
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