import { useCockpit } from "./hooks/useCockpit";
import CockpitHero from "./components/CockpitHero";
import CockpitKPIs from "./components/CockpitKPIs";
import CockpitGrafico from "./components/CockpitGrafico";
import CockpitLiquidacion from "./components/CockpitLiquidacion";
import CockpitTransacciones from "./components/CockpitTransacciones";
import CockpitModalDetalle from "./components/CockpitModalDetalle";
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
    errorCarga,
    busqueda,
    setBusqueda,
    cambiarPeriodo,
    handleExportar,
    eliminarTransaccion,
    modalDetalle,
    setModalDetalle,
    verDetalleTransaccion,
    recargarCockpit,
  } = useCockpit();

  if (loading && !kpis.length && !barras.length && !liquidacion.length) {
    return (
      <div className="ck-animate-in">
        <div className="ck-loading">
          <div className="ck-loading__spinner" />
          <p>Cargando cockpit financiero...</p>
        </div>
      </div>
    );
  }

  if (errorCarga && !kpis.length && !barras.length && !liquidacion.length) {
    return (
      <div className="ck-animate-in">
        <div className="ck-error-card">
          <div className="ck-error-card__icon">⚠️</div>
          <h3>No se pudo cargar el cockpit</h3>
          <p>{errorCarga}</p>
          <button className="ck-btn ck-btn--primary" onClick={recargarCockpit}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ck-animate-in">
      <CockpitHero onExportar={handleExportar} loading={loading} />

      <CockpitKPIs kpis={kpis} />

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
          }}
        />
      </div>

      <CockpitTransacciones
        transacciones={transacciones}
        busqueda={busqueda}
        onBusqueda={setBusqueda}
        onVer={verDetalleTransaccion}
        onEditar={(t) => console.log("editar", t)}
        onEliminar={eliminarTransaccion}
        loading={loadingBusqueda}
      />

      <CockpitModalDetalle
        transaccion={modalDetalle}
        onClose={() => setModalDetalle(null)}
      />
    </div>
  );
}