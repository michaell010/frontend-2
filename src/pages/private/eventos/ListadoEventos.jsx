// ListadoEventos.jsx  –  Página principal Salud & Sanidad
import { useSalud }          from "./hooks/useSalud";
import SaludHero             from "./components/SaludHero";
import SaludKPIs             from "./components/SaludKPIs";
import SaludHistorial        from "./components/SaludHistorial";
import SaludProximos         from "./components/SaludProximos";
import SaludEstatus          from "./components/SaludEstatus";
import SaludModalDetalle     from "./modals/SaludModalDetalle";
import SaludModalForm        from "./modals/SaludModalForm";
import "../../../styles/modules/Salud.css";

export default function ListadoEventos() {
  const {
  historial,
  historialTotal,
  kpis,
  proximos,
  estatus,
  heroStats,
  busqueda,
  setBusqueda,
  filtroEstado,
  setFiltroEstado,
  loading,
  modalDetalle,
  setModalDetalle,
  modalForm,
  setModalForm,
  handleEliminar,
  handleGuardar,
  handleExportar,
} = useSalud();

  return (
    <div className="sl-animate-in">

      {/* ── HERO ─────────────────────────────── */}
      <SaludHero
        onNuevoExamen={() => setModalForm("nuevo")}
        onExportar={handleExportar}
        loading={loading}
        stats={heroStats}
      />

      {/* ── KPIs ─────────────────────────────── */}
      <SaludKPIs kpis={kpis} />

      {/* ── GRID PRINCIPAL ───────────────────── */}
      <div className="sl-main-grid">

        {/* Historial clínico (2/3) */}
        <SaludHistorial
          historial={historial}
          historialTotal={historialTotal}
          busqueda={busqueda}          onBusqueda={setBusqueda}
          filtroEstado={filtroEstado}  onFiltroEstado={setFiltroEstado}
          onVer={(ev)    => setModalDetalle(ev)}
          onEditar={(ev) => setModalForm(ev)}
          onEliminar={handleEliminar}
          onNuevoExamen={() => setModalForm("nuevo")}
        />

        {/* Sidebar derecho (1/3) */}
        <div className="sl-sidebar">
          <SaludProximos proximos={proximos} />
          <SaludEstatus  estatus={estatus} />
        </div>

      </div>

      {/* ── MODALES ──────────────────────────── */}
      <SaludModalDetalle
        evento={modalDetalle}
        onClose={() => setModalDetalle(null)}
        onEditar={(ev) => setModalForm(ev)}
      />

      {(modalForm === "nuevo" || (modalForm && modalForm !== "nuevo")) && (
        <SaludModalForm
          evento={modalForm === "nuevo" ? null : modalForm}
          onClose={() => setModalForm(null)}
          onGuardar={handleGuardar}
        />
      )}

    </div>
  );
}