import { useEffect, useState } from "react";
import "../../../styles/modules/Ganado.css";

import { ganadoService } from "../../../services/ganado.service";
import { PER_PAGE } from "./ganado.constants";

import useToasts from "./hooks/useToasts";
import useTabla from "./hooks/useTabla";

import GanadoHero from "./components/GanadoHero";
import GanadoKPIs from "./components/GanadoKPIs";
import GanadoCards from "./components/GanadoCards";

import GanadoSearch from "./components/GanadoSearch";
import GanadoFiltros from "./components/GanadoFiltros";
import GanadoTabla from "./components/GanadoTabla";
import GanadoPaginacion from "./components/GanadoPaginacion";

import ModalNuevoRegistro from "./modals/ModalNuevoRegistro";
import ModalEditar from "./modals/ModalEditar";
import ModalDetalle from "./modals/ModalDetalle";
import ModalConfirmarEliminar from "./modals/ModalConfirmarEliminar";
import ModalExportar from "./modals/ModalExportar";

import ToastContainer from "./ui/ToastContainer";

export default function ListadoGanado() {
  const [animales, setAnimales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");

  const { toasts, addToast } = useToasts();
  const tabla = useTabla(animales);

  const [modalNuevo, setModalNuevo] = useState(false);
  const [modalEditar, setModalEditar] = useState(null);
  const [modalDetalle, setModalDetalle] = useState(null);
  const [modalEliminar, setModalEliminar] = useState(null);
  const [modalExport, setModalExport] = useState(false);

  const cargarGanado = async (mostrarToast = true) => {
    try {
      setLoading(true);
      setErrorCarga("");

      const lista = await ganadoService.listar();
      setAnimales(Array.isArray(lista) ? lista : []);
    } catch (err) {
      const mensaje = err?.mensaje || "No se pudo cargar el ganado.";
      setErrorCarga(mensaje);

      if (mostrarToast) {
        addToast(mensaje, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let activo = true;

    const cargarInicial = async () => {
      try {
        setLoading(true);
        setErrorCarga("");

        const lista = await ganadoService.listar();

        if (!activo) return;
        setAnimales(Array.isArray(lista) ? lista : []);
      } catch (err) {
        if (!activo) return;

        const mensaje = err?.mensaje || "No se pudo cargar el ganado.";
        setErrorCarga(mensaje);
        addToast(mensaje, "error");
      } finally {
        if (activo) {
          setLoading(false);
        }
      }
    };

    cargarInicial();

    return () => {
      activo = false;
    };
  }, []);

  const handleGuardar = async (form) => {
    try {
      const nuevo = await ganadoService.crear(form);

      if (!nuevo) {
        throw new Error("No se recibió el registro creado.");
      }

      setAnimales((prev) => [nuevo, ...prev]);
      setModalNuevo(false);

      addToast(
        `✨ ${nuevo.nombre || nuevo.codigo || "Registro"} registrado correctamente`,
        "success"
      );

      return nuevo;
    } catch (err) {
      addToast(err?.mensaje || "No se pudo crear el registro.", "error");
      throw err;
    }
  };

  const handleActualizar = async (form) => {
    try {
      const actualizado = await ganadoService.actualizar(form);

      if (!actualizado) {
        throw new Error("No se recibió el registro actualizado.");
      }

      setAnimales((prev) =>
        prev.map((a) => (a.id === actualizado.id ? actualizado : a))
      );

      setModalEditar(null);

      if (modalDetalle?.id === actualizado.id) {
        setModalDetalle(actualizado);
      }

      addToast(
        `💾 ${actualizado.nombre || actualizado.codigo || "Registro"} actualizado correctamente`,
        "success"
      );

      return actualizado;
    } catch (err) {
      addToast(err?.mensaje || "No se pudo actualizar el registro.", "error");
      throw err;
    }
  };

  const handleEliminar = async (id) => {
    try {
      await ganadoService.eliminar(id);

      const animalEliminado = animales.find((a) => a.id === id);

      setAnimales((prev) => {
        const actualizados = prev.filter((a) => a.id !== id);

        const totalFiltradosDespues = tabla.filtrados.filter((a) => a.id !== id).length;
        const totalPaginasDespues = Math.max(
          1,
          Math.ceil(totalFiltradosDespues / PER_PAGE)
        );

        if (tabla.pagina > totalPaginasDespues) {
          tabla.setPagina(totalPaginasDespues);
        }

        return actualizados;
      });

      setModalEliminar(null);
      setModalDetalle(null);

      addToast(
        `🗑️ ${animalEliminado?.nombre || animalEliminado?.codigo || `Registro ${id}`} eliminado correctamente`,
        "success"
      );
    } catch (err) {
      addToast(err?.mensaje || "No se pudo eliminar el registro.", "error");
    }
  };

  if (loading) {
    return (
      <div className="gc-root gc-animate-in">
        <div className="ganado-table-section">
          <div className="ganado-table-header__title">Cargando ganado...</div>
        </div>
        <ToastContainer toasts={toasts} />
      </div>
    );
  }

  if (errorCarga) {
    return (
      <div className="gc-root gc-animate-in">
        <div className="ganado-table-section">
          <div className="ganado-table-header__title">Error al cargar</div>
          <p style={{ marginTop: 12 }}>{errorCarga}</p>

          <button
            className="gc-btn gc-btn--secondary gc-btn--sm"
            onClick={() => cargarGanado(true)}
          >
            Reintentar
          </button>
        </div>

        <ToastContainer toasts={toasts} />
      </div>
    );
  }

  return (
    <div className="gc-root gc-animate-in">
      <GanadoHero
        onNuevoRegistro={() => setModalNuevo(true)}
        onExportar={() => setModalExport(true)}
      />

      <GanadoKPIs animales={animales} />
      <GanadoCards animales={animales} onVerDetalle={setModalDetalle} />

      <div className="ganado-table-section">
        <div className="ganado-table-header">
          <div>
            <div className="ganado-table-header__title">Inventario de Hato</div>

            {tabla.filtrosActivos > 0 && (
              <div className="ganado-table-header__filtros-activos">
                {tabla.filtrosActivos} filtro{tabla.filtrosActivos > 1 ? "s" : ""} activo
                {tabla.filtrosActivos > 1 ? "s" : ""}
                <button
                  className="ganado-table-header__limpiar"
                  onClick={tabla.limpiarFiltros}
                >
                  × Limpiar
                </button>
              </div>
            )}
          </div>

          <div className="ganado-table-controls">
            <GanadoSearch
              busqueda={tabla.busqueda}
              onChange={(v) => {
                tabla.setBusqueda(v);
                tabla.setPagina(1);
              }}
            />

            <div style={{ position: "relative" }}>
              <button
                className="gc-btn gc-btn--secondary gc-btn--sm"
                style={
                  tabla.filtrosActivos > 0
                    ? { borderColor: "var(--green-400)", color: "var(--green-700)" }
                    : {}
                }
                onClick={() => tabla.setFiltroOpen((o) => !o)}
              >
                🔽 Filtrar {tabla.filtrosActivos > 0 && `(${tabla.filtrosActivos})`}
              </button>

              {tabla.filtroOpen && (
                <GanadoFiltros
                  filtros={tabla.filtros}
                  onToggle={tabla.toggleFiltro}
                  onLimpiar={tabla.limpiarFiltros}
                  onCerrar={() => tabla.setFiltroOpen(false)}
                />
              )}
            </div>

            <button
              className="gc-btn gc-btn--secondary gc-btn--sm"
              onClick={() => setModalNuevo(true)}
            >
              ➕ Agregar
            </button>
          </div>
        </div>

        <GanadoTabla
          filas={tabla.paginados}
          sortCol={tabla.sortCol}
          sortDir={tabla.sortDir}
          onSort={tabla.handleSort}
          onVerDetalle={setModalDetalle}
          onEditar={setModalEditar}
          onEliminar={setModalEliminar}
        />

        <GanadoPaginacion
          pagina={tabla.pagina}
          totalPags={tabla.totalPags}
          totalFiltrados={tabla.filtrados.length}
          perPage={PER_PAGE}
          onChange={tabla.setPagina}
        />
      </div>

      {modalNuevo && (
        <ModalNuevoRegistro
          onClose={() => setModalNuevo(false)}
          onGuardar={handleGuardar}
        />
      )}

      {modalEditar && (
        <ModalEditar
          onClose={() => setModalEditar(null)}
          onGuardar={handleActualizar}
          animal={modalEditar}
        />
      )}

      {modalDetalle && (
        <ModalDetalle
          onClose={() => setModalDetalle(null)}
          onEliminar={handleEliminar}
          onEditar={(animal) => {
            setModalDetalle(null);
            setModalEditar(animal);
          }}
          animal={modalDetalle}
        />
      )}

      {modalEliminar && (
        <ModalConfirmarEliminar
          onClose={() => setModalEliminar(null)}
          onConfirmar={handleEliminar}
          animal={modalEliminar}
        />
      )}

      {modalExport && (
        <ModalExportar
          onClose={() => setModalExport(false)}
          addToast={addToast}
          animales={tabla.filtrados}
        />
      )}

      <ToastContainer toasts={toasts} />
    </div>
  );
}