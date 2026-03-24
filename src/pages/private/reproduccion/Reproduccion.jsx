// src/pages/private/reproduccion/Reproduccion.jsx
// Pantalla principal del módulo Reproducción.
// Orquesta estado, CRUD y renderizado. Sin lógica suelta.

import { useState, useEffect }        from "react";
import "../../../styles/modules/Reproduccion.css";

import { reproduccionService }        from "../../../services/reproduccion.service";
import { PER_PAGE }                   from "./reproduccion.constants";
import useToasts                      from "./hooks/useToasts";
import useTablaReproduccion           from "./hooks/useTablaReproduccion";

import ReproduccionHero               from "./components/ReproduccionHero";
import ReproduccionKPIs               from "./components/ReproduccionKPIs";
import ReproduccionGrafico            from "./components/ReproduccionGrafico";
import ReproduccionTimeline           from "./components/ReproduccionTimeline";
import ReproduccionSearch             from "./components/ReproduccionSearch";
import ReproduccionFiltros            from "./components/ReproduccionFiltros";
import ReproduccionTabla              from "./components/ReproduccionTabla";
import ReproduccionPaginacion         from "./components/ReproduccionPaginacion";

import ModalNuevoServicio             from "./modals/ModalNuevoServicio";
import ModalEditarServicio            from "./modals/ModalEditarServicio";
import ModalDetalleServicio           from "./modals/ModalDetalleServicio";
import ModalConfirmarEliminar         from "./modals/ModalConfirmarEliminar";

import ToastContainer                 from "./ui/ToastContainer";

export default function Reproduccion() {
  /* ── Datos ── */
  const [registros,  setRegistros]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [errorCarga, setErrorCarga] = useState("");

  /* ── Hooks ── */
  const { toasts, addToast } = useToasts();
  const tabla                = useTablaReproduccion(registros);

  /* ── Modales ── */
  const [modalNuevo,    setModalNuevo]    = useState(false);
  const [modalEditar,   setModalEditar]   = useState(null);
  const [modalDetalle,  setModalDetalle]  = useState(null);
  const [modalEliminar, setModalEliminar] = useState(null);

  /* ── Carga inicial ── */
  useEffect(() => {
    let activo = true;
    const cargar = async () => {
      try {
        setLoading(true);
        setErrorCarga("");
        const lista = await reproduccionService.listar();
        if (activo) setRegistros(Array.isArray(lista) ? lista : []);
      } catch (err) {
        if (!activo) return;
        const msg = err?.mensaje || "No se pudo cargar los registros.";
        setErrorCarga(msg);
        addToast(msg, "error");
      } finally {
        if (activo) setLoading(false);
      }
    };
    cargar();
    return () => { activo = false; };
  }, []);

  /* ── CRUD ── */
  const handleGuardar = async (form) => {
    try {
      const nuevo = await reproduccionService.crear(form);
      if (!nuevo) throw new Error("No se recibió el registro creado.");
      setRegistros(prev => [nuevo, ...prev]);
      setModalNuevo(false);
      addToast(`✨ Servicio #${nuevo.id} registrado correctamente`, "success");
    } catch (err) {
      addToast(err?.mensaje || "No se pudo crear el registro.", "error");
      throw err;
    }
  };

  const handleActualizar = async (form) => {
    try {
      const actualizado = await reproduccionService.actualizar(form);
      if (!actualizado) throw new Error("No se recibió el registro actualizado.");
      setRegistros(prev => prev.map(r => r.id === actualizado.id ? actualizado : r));
      setModalEditar(null);
      if (modalDetalle?.id === actualizado.id) setModalDetalle(actualizado);
      addToast(`💾 Servicio #${actualizado.id} actualizado correctamente`, "success");
    } catch (err) {
      addToast(err?.mensaje || "No se pudo actualizar el registro.", "error");
      throw err;
    }
  };

  const handleEliminar = async (id) => {
    try {
      await reproduccionService.eliminar(id);
      setRegistros(prev => {
        const actualizados = prev.filter(r => r.id !== id);
        const totalDespues = tabla.filtrados.filter(r => r.id !== id).length;
        const pagsDespues  = Math.max(1, Math.ceil(totalDespues / PER_PAGE));
        if (tabla.pagina > pagsDespues) tabla.setPagina(pagsDespues);
        return actualizados;
      });
      setModalEliminar(null);
      setModalDetalle(null);
      addToast(`🗑️ Registro #${id} eliminado correctamente`, "success");
    } catch (err) {
      addToast(err?.mensaje || "No se pudo eliminar el registro.", "error");
    }
  };

  /* ── Loading / Error ── */
  if (loading) return (
    <div className="rp-root rp-animate-in">
      <div className="rp-loading">
        <div className="rp-loading__spinner" />
        <p>Cargando registros reproductivos…</p>
      </div>
      <ToastContainer toasts={toasts} />
    </div>
  );

  if (errorCarga) return (
    <div className="rp-root rp-animate-in">
      <div className="rp-error-card">
        <div className="rp-error-card__ico">😔</div>
        <div className="rp-error-card__title">Error al cargar</div>
        <p className="rp-error-card__msg">{errorCarga}</p>
        <button className="rp-btn rp-btn--secondary" onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
      <ToastContainer toasts={toasts} />
    </div>
  );

  /* ── Render ── */
  return (
    <div className="rp-root rp-animate-in">

      {/* Hero */}
      <ReproduccionHero onNuevoServicio={() => setModalNuevo(true)} />

      {/* KPIs */}
      <ReproduccionKPIs registros={registros} />

      {/* Gráfico + Timeline */}
      <div className="rp-grid-main">
        <ReproduccionGrafico  registros={registros} />
        <ReproduccionTimeline registros={registros} onVerDetalle={setModalDetalle} />
      </div>

      {/* Tabla de inventario */}
      <div className="rp-tabla-section">

        {/* Encabezado y controles */}
        <div className="rp-tabla-header">
          <div>
            <div className="rp-tabla-header__title">Registro de Servicios</div>
            {tabla.filtrosActivos > 0 && (
              <div className="rp-tabla-header__filtros">
                {tabla.filtrosActivos} filtro{tabla.filtrosActivos > 1 ? "s" : ""} activo{tabla.filtrosActivos > 1 ? "s" : ""}
                <button className="rp-tabla-header__limpiar" onClick={tabla.limpiarFiltros}>
                  × Limpiar
                </button>
              </div>
            )}
          </div>

          <div className="rp-tabla-controls">
            <ReproduccionSearch
              busqueda={tabla.busqueda}
              onChange={v => { tabla.setBusqueda(v); tabla.setPagina(1); }}
            />

            <div style={{ position: "relative" }}>
              <button
                className={`rp-btn rp-btn--secondary rp-btn--sm${tabla.filtrosActivos > 0 ? " rp-btn--filtered" : ""}`}
                onClick={() => tabla.setFiltroOpen(o => !o)}
              >
                🔽 Filtrar {tabla.filtrosActivos > 0 && `(${tabla.filtrosActivos})`}
              </button>
              {tabla.filtroOpen && (
                <ReproduccionFiltros
                  filtros={tabla.filtros}
                  onToggle={tabla.toggleFiltro}
                  onLimpiar={tabla.limpiarFiltros}
                  onCerrar={() => tabla.setFiltroOpen(false)}
                />
              )}
            </div>

            <button className="rp-btn rp-btn--primary rp-btn--sm" onClick={() => setModalNuevo(true)}>
              ➕ Agregar
            </button>
          </div>
        </div>

        {/* Tabla */}
        <ReproduccionTabla
          filas={tabla.paginados}
          sortCol={tabla.sortCol}
          sortDir={tabla.sortDir}
          onSort={tabla.handleSort}
          onVerDetalle={setModalDetalle}
          onEditar={setModalEditar}
          onEliminar={setModalEliminar}
        />

        {/* Paginación */}
        <ReproduccionPaginacion
          pagina={tabla.pagina}
          totalPags={tabla.totalPags}
          totalFiltrados={tabla.filtrados.length}
          perPage={PER_PAGE}
          onChange={tabla.setPagina}
        />
      </div>

      {/* Modales */}
      {modalNuevo   && <ModalNuevoServicio   onClose={() => setModalNuevo(false)}   onGuardar={handleGuardar}    />}
      {modalEditar  && <ModalEditarServicio  onClose={() => setModalEditar(null)}   onGuardar={handleActualizar} registro={modalEditar}  />}
      {modalDetalle && <ModalDetalleServicio onClose={() => setModalDetalle(null)}  onEditar={setModalEditar}    onEliminar={setModalEliminar} registro={modalDetalle} />}
      {modalEliminar && <ModalConfirmarEliminar onClose={() => setModalEliminar(null)} onConfirmar={handleEliminar} registro={modalEliminar} />}

      <ToastContainer toasts={toasts} />
    </div>
  );
}