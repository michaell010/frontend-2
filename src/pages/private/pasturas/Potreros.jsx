import { useEffect, useMemo, useState } from "react";
import "../../../styles/modules/Potreros.css";

import {
  listarPotreros,
  crearPotrero,
  actualizarPotrero,
  eliminarPotrero,
} from "../../../services/potrero.service";

import PotreroHero from "./components/PotreroHero";
import PotreroKPIs from "./components/PotreroKPIs";
import PotreroTabla from "./components/PotreroTabla";
import PotreroFormModal from "./modals/PotreroFormModal";
import PotreroDeleteModal from "./modals/PotreroDeleteModal";
import PotreroToast from "./ui/PotreroToast";
import usePotreroToasts from "./hooks/usePotreroToasts";
import useTablaPotreros from "./hooks/useTablaPotreros";

export default function Potreros() {
  const [potreros, setPotreros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState("");

  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [potreroActivo, setPotreroActivo] = useState(null);
  const [modoForm, setModoForm] = useState("crear");

  const { toasts, pushToast, removeToast } = usePotreroToasts();
  const tabla = useTablaPotreros(potreros);

  const cargarPotreros = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await listarPotreros();
      setPotreros(data);
    } catch (err) {
      setError(err?.mensaje || "No se pudo cargar la información.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPotreros();
  }, []);

  const abrirCrear = () => {
    setModoForm("crear");
    setPotreroActivo(null);
    setModalFormOpen(true);
  };

  const abrirEditar = (potrero) => {
    setModoForm("editar");
    setPotreroActivo(potrero);
    setModalFormOpen(true);
  };

  const abrirEliminar = (potrero) => {
    setPotreroActivo(potrero);
    setModalDeleteOpen(true);
  };

  const cerrarForm = () => {
    if (guardando) return;
    setModalFormOpen(false);
    setPotreroActivo(null);
  };

  const cerrarDelete = () => {
    if (eliminando) return;
    setModalDeleteOpen(false);
    setPotreroActivo(null);
  };

  const handleGuardar = async (form) => {
    try {
      setGuardando(true);

      if (modoForm === "editar" && potreroActivo?.id) {
        const actualizado = await actualizarPotrero(potreroActivo.id, form);

        setPotreros((prev) =>
          prev.map((item) => (item.id === potreroActivo.id ? actualizado : item))
        );

        pushToast("Potrero actualizado correctamente.");
      } else {
        const creado = await crearPotrero(form);
        setPotreros((prev) => [creado, ...prev]);
        pushToast("Potrero creado correctamente.");
      }

      setModalFormOpen(false);
      setPotreroActivo(null);
    } catch (err) {
      pushToast(err?.mensaje || "No se pudo guardar el potrero.", "error");
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async () => {
    try {
      if (!potreroActivo?.id) return;

      setEliminando(true);
      await eliminarPotrero(potreroActivo.id);

      setPotreros((prev) => prev.filter((p) => p.id !== potreroActivo.id));
      pushToast("Potrero eliminado correctamente.");

      setModalDeleteOpen(false);
      setPotreroActivo(null);
    } catch (err) {
      pushToast(err?.mensaje || "No se pudo eliminar el potrero.", "error");
    } finally {
      setEliminando(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-root">
        <div className="pt-loading">
          <div className="pt-spinner" />
          <p>Cargando potreros...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-root">
        <div className="pt-error-card">
          <div className="pt-error-card__icon">⚠️</div>
          <h3>No se pudo cargar el módulo</h3>
          <p>{error}</p>
          <button className="pt-btn pt-btn--primary" onClick={cargarPotreros}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const totalFiltrosActivos =
    (tabla.busqueda?.trim() ? 1 : 0) +
    (tabla.estadoFiltro !== "Todos" ? 1 : 0);

  return (
    <div className="pt-root pt-animate-in">
      <PotreroHero onNuevo={abrirCrear} />

      <PotreroKPIs potreros={potreros} />

      <div className="pt-tabla-section">
<div className="pt-toolbar">

  {/* IZQUIERDA → TÍTULO */}
  <div className="pt-toolbar__left">
    <h3 className="pt-toolbar__title">Registro de Potreros</h3>
  </div>

  {/* DERECHA → CONTROLES */}
  <div className="pt-toolbar__right">

    <div className="pt-search">
      <span className="pt-search__icon">🔎</span>
      <input
        value={tabla.busqueda}
        onChange={(e) => {
          tabla.setBusqueda(e.target.value);
          tabla.setPagina(1);
        }}
        placeholder="Buscar por nombre, id o tipo..."
      />
      {tabla.busqueda && (
        <button
          className="pt-search__clear"
          onClick={() => {
            tabla.setBusqueda("");
            tabla.setPagina(1);
          }}
        >
          ✕
        </button>
      )}
    </div>

    <select
      className="pt-select"
      value={tabla.estadoFiltro}
      onChange={(e) => {
        tabla.setEstadoFiltro(e.target.value);
        tabla.setPagina(1);
      }}
    >
      <option value="Todos">Todos</option>
      <option value="Disponible">Disponible</option>
      <option value="Ocupado">Ocupado</option>
      <option value="Mantenimiento">Mantenimiento</option>
      <option value="Descanso">Descanso</option>
    </select>

    <button
      className="pt-btn pt-btn--primary"
      onClick={abrirCrear}
    >
      ➕ Agregar
    </button>

  </div>

</div>

        <PotreroTabla
          vista="tabla"
          rows={tabla.paginados}
          total={tabla.filtrados.length}
          pagina={tabla.pagina}
          totalPaginas={tabla.totalPaginas}
          setPagina={tabla.setPagina}
          sortBy={tabla.sortBy}
          sortDir={tabla.sortDir}
          onSort={tabla.toggleSort}
          onEditar={abrirEditar}
          onEliminar={abrirEliminar}
        />
      </div>

      <PotreroFormModal
        open={modalFormOpen}
        modo={modoForm}
        initialData={potreroActivo}
        onClose={cerrarForm}
        onSubmit={handleGuardar}
        loading={guardando}
      />

      <PotreroDeleteModal
        open={modalDeleteOpen}
        potrero={potreroActivo}
        onClose={cerrarDelete}
        onConfirm={handleEliminar}
        loading={eliminando}
      />

      <PotreroToast toasts={toasts} onClose={removeToast} />
    </div>
  );
}