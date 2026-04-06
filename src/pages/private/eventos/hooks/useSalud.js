import { useState, useMemo, useCallback, useEffect } from "react";
import {
  listarEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
  obtenerKpisSalud,
  obtenerProximosEventos,
  obtenerEstatusSalud,
  obtenerResumenSalud,
} from "../../../../services/salud.service";

export function useSalud() {
  const [historialBase, setHistorialBase] = useState([]);

  const [kpis, setKpis] = useState([]);
  const [proximos, setProximos] = useState([]);
  const [estatus, setEstatus] = useState([]);
  const [heroStats, setHeroStats] = useState({});

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [loading, setLoading] = useState(false);
  const [modalDetalle, setModalDetalle] = useState(null);
  const [modalForm, setModalForm] = useState(null);
  const [error, setError] = useState(null);

  const cargarModulo = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [eventos, kpisData, proximosData, estatusData, resumenData] =
        await Promise.all([
          listarEventos(),
          obtenerKpisSalud(),
          obtenerProximosEventos(),
          obtenerEstatusSalud(),
          obtenerResumenSalud(),
        ]);

      setHistorialBase(Array.isArray(eventos) ? eventos : []);
      setKpis(Array.isArray(kpisData) ? kpisData : []);
      setProximos(Array.isArray(proximosData) ? proximosData : []);
      setEstatus(Array.isArray(estatusData) ? estatusData : []);
      setHeroStats(
        resumenData && typeof resumenData === "object" ? resumenData : {}
      );
    } catch (err) {
      console.error("Error cargando módulo salud:", err);
      setError(err?.mensaje || "No se pudo cargar el módulo de salud.");
      setHistorialBase([]);
      setKpis([]);
      setProximos([]);
      setEstatus([]);
      setHeroStats({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarModulo();
  }, [cargarModulo]);

  const historialFiltrado = useMemo(() => {
    return historialBase.filter((ev) => {
      const q = busqueda.trim().toLowerCase();

      const matchQ =
        !q ||
        String(ev.id ?? "").toLowerCase().includes(q) ||
        String(ev.tratamiento ?? "").toLowerCase().includes(q) ||
        String(ev.vet ?? "").toLowerCase().includes(q) ||
        String(ev.animalCod ?? "").toLowerCase().includes(q) ||
        String(ev.animalNombre ?? "").toLowerCase().includes(q) ||
        String(ev.notas ?? "").toLowerCase().includes(q);

      const matchE =
        filtroEstado === "todos" || ev.estadoKey === filtroEstado;

      return matchQ && matchE;
    });
  }, [historialBase, busqueda, filtroEstado]);

  const handleEliminar = useCallback(
    async (id) => {
      const confirmar = window.confirm("¿Eliminar este evento sanitario?");
      if (!confirmar) return;

      setLoading(true);
      try {
        await eliminarEvento(id);

        setHistorialBase((prev) => prev.filter((ev) => ev.id !== id));

        if (modalDetalle?.id === id) {
          setModalDetalle(null);
        }

        await cargarModulo();
      } catch (err) {
        console.error("Error eliminando evento:", err);
        alert(err?.mensaje || "No se pudo eliminar el evento.");
      } finally {
        setLoading(false);
      }
    },
    [modalDetalle, cargarModulo]
  );

  const handleGuardar = useCallback(async (eventoForm) => {
    setLoading(true);

    try {
      if (eventoForm.id || eventoForm.backendId) {
        const idReal = eventoForm.backendId || eventoForm.id;
        await actualizarEvento(idReal, eventoForm);
      } else {
        await crearEvento(eventoForm);
      }

      await cargarModulo();
      setModalForm(null);
    } catch (err) {
      console.error("Error guardando evento:", err);
      alert(err?.mensaje || "No se pudo guardar el evento.");
    } finally {
      setLoading(false);
    }
  }, [cargarModulo]);

  const handleExportar = useCallback(async () => {
    alert("La exportación la hacemos en la siguiente fase con endpoint real.");
  }, []);

  return {
    historial: historialFiltrado,
    historialTotal: historialFiltrado.length,
    historialBase,

    kpis,
    proximos,
    estatus,
    heroStats,

    busqueda,
    setBusqueda,

    filtroEstado,
    setFiltroEstado,

    loading,
    error,

    modalDetalle,
    setModalDetalle,

    modalForm,
    setModalForm,

    recargar: cargarModulo,
    handleEliminar,
    handleGuardar,
    handleExportar,
  };
}