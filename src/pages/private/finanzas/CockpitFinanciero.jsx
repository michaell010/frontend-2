// CockpitFinanciero.jsx  ─  Página principal (orchestrador)
import { useCockpit }              from "./hooks/useCockpit";
import CockpitHero                 from "./components/CockpitHero";
import CockpitKPIs                 from "./components/CockpitKPIs";
import CockpitGrafico              from "./components/CockpitGrafico";
import CockpitLiquidacion          from "./components/CockpitLiquidacion";
import CockpitTransacciones        from "./components/CockpitTransacciones";
import CockpitModalDetalle         from "./components/CockpitModalDetalle";
import "../../../styles/modules/Cockpit.css";

export default function CockpitFinanciero() {
  const {
    kpis,
    barras,
    liquidacion,
    transacciones,
    periodoActivo,
    loading,
    loadingBusqueda,
    busqueda,
    setBusqueda,
    cambiarPeriodo,
    handleExportar,
    eliminarTransaccion,
    modalDetalle,
    setModalDetalle,
    verDetalleTransaccion,
  } = useCockpit();

  return (
    <div className="ck-animate-in">

      {/* ── HERO ─────────────────────────────── */}
      <CockpitHero onExportar={handleExportar} loading={loading} />

      {/* ── KPIs ─────────────────────────────── */}
      <CockpitKPIs kpis={kpis} />

      {/* ── GRÁFICO + LIQUIDACIÓN ─────────────── */}
      <div className="ck-mid-grid">
        <CockpitGrafico
          barras={barras}
          periodoActivo={periodoActivo}
          onCambiarPeriodo={cambiarPeriodo}
          loading={loading}
        />

        <CockpitLiquidacion
          items={liquidacion}
          loading={loading}
          onSeleccionar={(item) => {
            console.log("liquidacion", item);
            // opcional: abrir modal o filtrar
          }}
        />
      </div>

      {/* ── TABLA TRANSACCIONES ───────────────── */}
      <CockpitTransacciones
        transacciones={transacciones}
        busqueda={busqueda}
        onBusqueda={setBusqueda}
        onVer={verDetalleTransaccion}
        onEditar={(t) => console.log("editar", t)}
        onEliminar={eliminarTransaccion}
        loading={loadingBusqueda}
      />

      {/* ── MODAL DETALLE ─────────────────────── */}
      <CockpitModalDetalle
        transaccion={modalDetalle}
        onClose={() => setModalDetalle(null)}
      />
    </div>
  );
}