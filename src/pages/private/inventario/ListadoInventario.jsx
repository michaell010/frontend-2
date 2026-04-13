import { useInventario } from "./hooks/useInventario";
import InventarioHero from "./components/InventarioHero";
import InventarioKPIs from "./components/InventarioKPIs";
import InventarioSuministros from "./components/InventarioSuministros";
import InventarioTabla from "./components/InventarioTabla";
import InventarioModalDetalle from "./modals/InventarioModalDetalle";
import InventarioModalForm from "./modals/InventarioModalForm";
import "../../../styles/modules/Inventario.css";

export default function ListadoInventario() {
  const {
    productos,
    productosTotal,
    suministros,
    silos,
    kpis,
    estadisticasHero,
    busqueda,
    setBusqueda,
    filtroTipo,
    setFiltroTipo,
    filtroEstado,
    setFiltroEstado,
    loading,
    errorCarga,
    modalDetalle,
    setModalDetalle,
    modalForm,
    setModalForm,
    handleEliminarProducto,
    handleGuardarProducto,
    handleExportar,
    recargarProductos,
  } = useInventario();

  if (loading && !productos.length) {
    return (
      <div className="iv-animate-in">
        <div className="iv-loading">
          <div className="iv-loading__spinner" />
          <p>Cargando inventario...</p>
        </div>
      </div>
    );
  }

  if (errorCarga && !productos.length) {
    return (
      <div className="iv-animate-in">
        <div className="iv-error-card">
          <div className="iv-error-card__icon">⚠️</div>
          <h3>No se pudo cargar el inventario</h3>
          <p>{errorCarga}</p>
          <button className="iv-btn iv-btn--primary" onClick={recargarProductos}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="iv-animate-in">
      <InventarioHero
        silos={silos}
        estadisticasHero={estadisticasHero}
        onAnadirInsumo={() => setModalForm({})}
        onExportar={handleExportar}
        loading={loading}
      />

      <InventarioKPIs kpis={kpis} />

      <div className="iv-inv-grid">
        <InventarioSuministros suministros={suministros} />

        <InventarioTabla
          productos={productos}
          productosTotal={productosTotal}
          busqueda={busqueda}
          onBusqueda={setBusqueda}
          filtroTipo={filtroTipo}
          onFiltroTipo={setFiltroTipo}
          filtroEstado={filtroEstado}
          onFiltroEstado={setFiltroEstado}
          onVer={(p) => setModalDetalle(p)}
          onEditar={(p) => setModalForm(p)}
          onEliminar={handleEliminarProducto}
          onAnadir={() => setModalForm("nuevo")}
        />
      </div>

      <InventarioModalDetalle
        producto={modalDetalle}
        onClose={() => setModalDetalle(null)}
        onEditar={(p) => setModalForm(p)}
      />

      {(modalForm === "nuevo" || (modalForm && modalForm !== "nuevo")) && (
        <InventarioModalForm
          producto={modalForm === "nuevo" ? null : modalForm}
          onClose={() => setModalForm(null)}
          onGuardar={handleGuardarProducto}
        />
      )}
    </div>
  );
}