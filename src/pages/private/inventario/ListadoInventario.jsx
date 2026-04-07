// ListadoInventario.jsx – Página principal Inventario
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
    modalDetalle,
    setModalDetalle,
    modalForm,
    setModalForm,
    handleEliminarProducto,
    handleGuardarProducto,
    handleExportar,
  } = useInventario();

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