// src/pages/private/alimentacion/ListadoAlimentacion.jsx
// Pantalla principal del módulo Alimentación.
// Orquesta estado, CRUD y renderizado. Sin lógica suelta.

import { useState, useEffect }        from "react";
import "../../../styles/modules/Alimentacion.css";

import { alimentacionService }        from "../../../services/alimentacion.service";
import { PER_PAGE }                   from "./alimentacion.constants";
import useToasts                      from "./hooks/useToasts";
import useTablaAlimentacion           from "./hooks/useTablaAlimentacion";

import AlimentacionKPIs               from "./components/AlimentacionKPIs";
import AlimentacionGrafico            from "./components/AlimentacionGrafico";
import AlimentacionTimeline           from "./components/AlimentacionTimeline";
import AlimentacionSearch             from "./components/AlimentacionSearch";
import AlimentacionFiltros            from "./components/AlimentacionFiltros";
import AlimentacionTabla              from "./components/AlimentacionTabla";
import AlimentacionPaginacion         from "./components/AlimentacionPaginacion";

import ModalNuevaRacion               from "./modals/ModalNuevaRacion";
import ModalEditarRacion              from "./modals/ModalEditarRacion";
import ModalDetalleRacion             from "./modals/ModalDetalleRacion";
import ModalConfirmarEliminar         from "./modals/ModalConfirmarEliminar";

import ToastContainer                 from "./ui/ToastContainer";

export default function ListadoAlimentacion() {
  /* ── Datos ── */
  const [registros,  setRegistros]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [errorCarga, setErrorCarga] = useState("");

  /* ── Hooks ── */
  const { toasts, addToast } = useToasts();
  const tabla                = useTablaAlimentacion(registros);

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
        const lista = await alimentacionService.listar();
        if (activo) setRegistros(Array.isArray(lista) ? lista : []);
      } catch (err) {
        if (!activo) return;
        const msg = err?.mensaje || "No se pudo cargar los registros de alimentación.";
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
      const nuevo = await alimentacionService.crear(form);
      if (!nuevo) throw new Error("No se recibió el registro creado.");
      setRegistros(prev => [nuevo, ...prev]);
      setModalNuevo(false);
      addToast(`✨ Ración #${nuevo.id} registrada correctamente`, "success");
    } catch (err) {
      addToast(err?.mensaje || "No se pudo crear el registro.", "error");
      throw err;
    }
  };

  const handleActualizar = async (form) => {
    try {
      const actualizado = await alimentacionService.actualizar(form);
      if (!actualizado) throw new Error("No se recibió el registro actualizado.");
      setRegistros(prev => prev.map(r => r.id === actualizado.id ? actualizado : r));
      setModalEditar(null);
      if (modalDetalle?.id === actualizado.id) setModalDetalle(actualizado);
      addToast(`💾 Ración #${actualizado.id} actualizada correctamente`, "success");
    } catch (err) {
      addToast(err?.mensaje || "No se pudo actualizar el registro.", "error");
      throw err;
    }
  };

  const handleEliminar = async (id) => {
    try {
      await alimentacionService.eliminar(id);
      setRegistros(prev => {
        const actualizados = prev.filter(r => r.id !== id);
        const totalDespues = tabla.filtrados.filter(r => r.id !== id).length;
        const pagsDespues  = Math.max(1, Math.ceil(totalDespues / PER_PAGE));
        if (tabla.pagina > pagsDespues) tabla.setPagina(pagsDespues);
        return actualizados;
      });
      setModalEliminar(null);
      setModalDetalle(null);
      addToast(`🗑️ Ración #${id} eliminada correctamente`, "success");
    } catch (err) {
      addToast(err?.mensaje || "No se pudo eliminar el registro.", "error");
    }
  };

  /* ── Loading / Error ── */
  if (loading) return (
    <div className="al-root al-animate-in">
      <div className="al-loading">
        <div className="al-loading__spinner" />
        <p>Cargando registros de alimentación…</p>
      </div>
      <ToastContainer toasts={toasts} />
    </div>
  );

  if (errorCarga) return (
    <div className="al-root al-animate-in">
      <div className="al-error-card">
        <div className="al-error-card__ico">😔</div>
        <div className="al-error-card__title">Error al cargar</div>
        <p className="al-error-card__msg">{errorCarga}</p>
        <button className="al-btn al-btn--secondary" onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
      <ToastContainer toasts={toasts} />
    </div>
  );

  /* ── Render ── */
  return (
    <div className="al-root al-animate-in">

      {/* Hero */}
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

      {/* KPIs */}
      <AlimentacionKPIs registros={registros} />

      {/* Gráfico + Timeline */}
      <div className="al-grid-main">
        <AlimentacionGrafico  registros={registros} />
        <AlimentacionTimeline registros={registros} onVerDetalle={setModalDetalle} />
      </div>

      {/* Tabla */}
      <div className="al-tabla-section">

        <div className="al-tabla-header">
          <div>
            <div className="al-tabla-header__title">Registro de Raciones</div>
            {tabla.filtrosActivos > 0 && (
              <div className="al-tabla-header__filtros">
                {tabla.filtrosActivos} filtro{tabla.filtrosActivos > 1 ? "s" : ""} activo{tabla.filtrosActivos > 1 ? "s" : ""}
                <button className="al-tabla-header__limpiar" onClick={tabla.limpiarFiltros}>
                  × Limpiar
                </button>
              </div>
            )}
          </div>

          <div className="al-tabla-controls">
            <AlimentacionSearch
              busqueda={tabla.busqueda}
              onChange={v => { tabla.setBusqueda(v); tabla.setPagina(1); }}
            />

            <div style={{ position: "relative" }}>
              <button
                className={`al-btn al-btn--secondary al-btn--sm${tabla.filtrosActivos > 0 ? " al-btn--filtered" : ""}`}
                onClick={() => tabla.setFiltroOpen(o => !o)}
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

            <button className="al-btn al-btn--primary al-btn--sm" onClick={() => setModalNuevo(true)}>
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
          onEliminar={setModalEliminar}
        />

        <AlimentacionPaginacion
          pagina={tabla.pagina}
          totalPags={tabla.totalPags}
          totalFiltrados={tabla.filtrados.length}
          perPage={PER_PAGE}
          onChange={tabla.setPagina}
        />
      </div>

      {/* Modales */}
      {modalNuevo    && <ModalNuevaRacion      onClose={() => setModalNuevo(false)}    onGuardar={handleGuardar}    />}
      {modalEditar   && <ModalEditarRacion     onClose={() => setModalEditar(null)}    onGuardar={handleActualizar} registro={modalEditar}  />}
      {modalDetalle  && <ModalDetalleRacion    onClose={() => setModalDetalle(null)}   onEditar={setModalEditar}    onEliminar={setModalEliminar} registro={modalDetalle} />}
      {modalEliminar && <ModalConfirmarEliminar onClose={() => setModalEliminar(null)} onConfirmar={handleEliminar} registro={modalEliminar} />}

      <ToastContainer toasts={toasts} />
    </div>
  );
}