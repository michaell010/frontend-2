import "../../../styles/modules/Alimentacion.css";

import { PER_PAGE } from "./alimentacion.constants";
import useAlimentacion from "./hooks/useToasts";
import useTablaAlimentacion from "./hooks/useTablaAlimentacion";

import AlimentacionKPIs from "./components/AlimentacionKPIs";
import AlimentacionGrafico from "./components/AlimentacionGrafico";
import AlimentacionTimeline from "./components/AlimentacionTimeline";
import AlimentacionSearch from "./components/AlimentacionSearch";
import AlimentacionFiltros from "./components/AlimentacionFiltros";
import AlimentacionTabla from "./components/AlimentacionTabla";
import AlimentacionPaginacion from "./components/AlimentacionPaginacion";

import ModalNuevaRacion from "./modals/ModalNuevaRacion";
import ModalEditarRacion from "./modals/ModalEditarRacion";
import ModalDetalleRacion from "./modals/ModalDetalleRacion";

export default function ListadoAlimentacion() {
  const {
    registros,
    loading,
    errorCarga,
    modalNuevo,
    setModalNuevo,
    modalEditar,
    setModalEditar,
    modalDetalle,
    setModalDetalle,
    handleGuardar,
    handleActualizar,
    handleEliminar,
    recargarAlimentacion,
  } = useAlimentacion();

  const tabla = useTablaAlimentacion(registros);

  if (loading) {
    return (
      <div className="al-root al-animate-in">
        <div className="al-loading">
          <div className="al-loading__spinner" />
          <p>Cargando registros de alimentación…</p>
        </div>
      </div>
    );
  }

  if (errorCarga) {
    return (
      <div className="al-root al-animate-in">
        <div className="al-error-card">
          <div className="al-error-card__ico">😔</div>
          <div className="al-error-card__title">Error al cargar</div>
          <p className="al-error-card__msg">{errorCarga}</p>
          <button
            className="al-btn al-btn--secondary"
            onClick={recargarAlimentacion}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="al-root al-animate-in">
      <div className="al-hero">
        <div className="al-hero__text">
          <h1 className="al-hero__title">🌿 Alimentación</h1>
          <p className="al-hero__sub">
            Gestión de raciones, dietas e inventario de alimentos del hato
          </p>
        </div>

        <button className="al-btn al-btn--primary" onClick={() => setModalNuevo(true)}>
          ➕ Nueva Ración
        </button>
      </div>

      <AlimentacionKPIs registros={registros} />

      <div className="al-grid-main">
        <AlimentacionGrafico registros={registros} />
        <AlimentacionTimeline
          registros={registros}
          onVerDetalle={setModalDetalle}
        />
      </div>

      <div className="al-tabla-section">
        <div className="al-tabla-header">
          <div>
            <div className="al-tabla-header__title">Registro de Raciones</div>

            {tabla.filtrosActivos > 0 && (
              <div className="al-tabla-header__filtros">
                {tabla.filtrosActivos} filtro
                {tabla.filtrosActivos > 1 ? "s" : ""} activo
                {tabla.filtrosActivos > 1 ? "s" : ""}
                <button
                  className="al-tabla-header__limpiar"
                  onClick={tabla.limpiarFiltros}
                >
                  × Limpiar
                </button>
              </div>
            )}
          </div>

          <div className="al-tabla-controls">
            <AlimentacionSearch
              busqueda={tabla.busqueda}
              onChange={(v) => {
                tabla.setBusqueda(v);
                tabla.setPagina(1);
              }}
            />

            <div style={{ position: "relative" }}>
              <button
                className={`al-btn al-btn--secondary al-btn--sm${
                  tabla.filtrosActivos > 0 ? " al-btn--filtered" : ""
                }`}
                onClick={() => tabla.setFiltroOpen((o) => !o)}
              >
                🔽 Filtrar {tabla.filtrosActivos > 0 && `(${tabla.filtrosActivos})`}
              </button>

              {tabla.filtroOpen && (
                <AlimentacionFiltros
                  filtros={tabla.filtros}
                  onToggle={tabla.toggleFiltro}
                  onLimpiar={tabla.limpiarFiltros}
                  onCerrar={() => tabla.setFiltroOpen(false)}
                />
              )}
            </div>

            <button
              className="al-btn al-btn--primary al-btn--sm"
              onClick={() => setModalNuevo(true)}
            >
              ➕ Agregar
            </button>
          </div>
        </div>

        <AlimentacionTabla
          filas={tabla.paginados}
          sortCol={tabla.sortCol}
          sortDir={tabla.sortDir}
          onSort={tabla.handleSort}
          onVerDetalle={setModalDetalle}
          onEditar={setModalEditar}
          onEliminar={handleEliminar}
        />

        <AlimentacionPaginacion
          pagina={tabla.pagina}
          totalPags={tabla.totalPags}
          totalFiltrados={tabla.filtrados.length}
          perPage={PER_PAGE}
          onChange={tabla.setPagina}
        />
      </div>

      {modalNuevo && (
        <ModalNuevaRacion
          onClose={() => setModalNuevo(false)}
          onGuardar={handleGuardar}
        />
      )}

      {modalEditar && (
        <ModalEditarRacion
          onClose={() => setModalEditar(null)}
          onGuardar={handleActualizar}
          registro={modalEditar}
        />
      )}

      {modalDetalle && (
        <ModalDetalleRacion
          onClose={() => setModalDetalle(null)}
          onEditar={setModalEditar}
          onEliminar={handleEliminar}
          registro={modalDetalle}
        />
      )}
    </div>
  );
}