import { useState, useCallback, useMemo, useEffect } from "react";
import toast from "react-hot-toast";
import {
  listarVentas,
  obtenerVenta,
  crearVenta,
  actualizarVenta,
  eliminarVenta,
  obtenerKpisVentas,
  exportarVentas,
  obtenerResumenHeroVentas,
} from "../../../../services/ventas.service";

export function useVentas() {
  const [ventas, setVentas] = useState([]);
  const [kpis, setKpis] = useState([]);
  const [resumenHero, setResumenHero] = useState({
    ventasEsteAnio: 0,
    clientesActivos: 0,
    ingresosMes: 0,
  });

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [loading, setLoading] = useState(false);

  const [modalDetalle, setModalDetalle] = useState(null);
  const [modalForm, setModalForm] = useState(null);

  const [ventaAEliminar, setVentaAEliminar] = useState(null);

  const [paginaActual, setPaginaActual] = useState(1);
  const POR_PAGINA = 8;

  const cargarTodo = useCallback(async () => {
    setLoading(true);
    try {
      const [ventasData, kpisData, resumenData] = await Promise.all([
        listarVentas(),
        obtenerKpisVentas(),
        obtenerResumenHeroVentas(),
      ]);

      setVentas(ventasData);
      setKpis(kpisData);
      setResumenHero(
        resumenData || {
          ventasEsteAnio: 0,
          clientesActivos: 0,
          ingresosMes: 0,
        }
      );
    } catch (error) {
      console.error("Error cargando ventas:", error);
      setVentas([]);
      setKpis([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarTodo();
  }, [cargarTodo]);

  const ventasFiltradas = useMemo(() => {
    return ventas.filter((v) => {
      const q = busqueda.toLowerCase().trim();

      const matchQ =
          !q ||
          v.id.toLowerCase().includes(q) ||
          v.cliente.toLowerCase().includes(q) ||
          (v.itemsTexto || "").toLowerCase().includes(q) ||
          v.estado.toLowerCase().includes(q);

      const matchE = filtroEstado === "todos" || v.estadoKey === filtroEstado;

      return matchQ && matchE;
    });
  }, [ventas, busqueda, filtroEstado]);

  const totalPaginas = Math.max(1, Math.ceil(ventasFiltradas.length / POR_PAGINA));

  const ventasPaginadas = useMemo(() => {
    const inicio = (paginaActual - 1) * POR_PAGINA;
    const fin = inicio + POR_PAGINA;
    return ventasFiltradas.slice(inicio, fin);
  }, [ventasFiltradas, paginaActual]);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroEstado]);

  const handleVer = useCallback(async (venta) => {
    try {
      setLoading(true);
      const detalle = await obtenerVenta(venta.venta_id);
      setModalDetalle(detalle);
    } catch (error) {
      console.error("Error cargando detalle:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleEditar = useCallback(async (venta) => {
    try {
      setLoading(true);
      const detalle = await obtenerVenta(venta.venta_id);
      setModalForm(detalle);
    } catch (error) {
      console.error("Error cargando venta para editar:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const solicitarEliminar = useCallback((venta) => {
    setVentaAEliminar(venta);
  }, []);

  const cancelarEliminar = useCallback(() => {
    setVentaAEliminar(null);
  }, []);

  const confirmarEliminar = useCallback(async () => {
  console.log("VENTA A ELIMINAR:", ventaAEliminar);

  if (!ventaAEliminar?.venta_id) {
  console.error("No hay venta_id para eliminar");
  toast.error("No se encontró el id de la venta");
  return;
}

  try {
    setLoading(true);

    console.log("Eliminando venta con id:", ventaAEliminar.venta_id);

    const resp = await eliminarVenta(ventaAEliminar.venta_id);

    console.log("RESPUESTA DELETE:", resp);

    setVentaAEliminar(null);
    await cargarTodo();

    toast.success("Venta eliminada correctamente");
  } catch (error) {
    console.error("Error eliminando venta:", error);
    toast.error(error?.mensaje || "No se pudo eliminar la venta");
  } finally {
    setLoading(false);
  }
}, [ventaAEliminar, cargarTodo]);

  const handleGuardar = useCallback(async ({ venta_id, payloadBackend }) => {
    try {
      setLoading(true);

      if (venta_id) {
        await actualizarVenta(venta_id, payloadBackend);
      } else {
        await crearVenta(payloadBackend);
      }

      setModalForm(null);
      await cargarTodo();
    } catch (error) {
      console.error("Error guardando venta:", error);
      alert(error?.mensaje || error?.message || "No se pudo guardar la venta.");
    } finally {
      setLoading(false);
    }
  }, [cargarTodo]);

  const handleExportar = useCallback(async () => {
    try {
      setLoading(true);
      await exportarVentas();
    } catch (error) {
      console.error("Error exportando ventas:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    ventas: ventasPaginadas,
    ventasTotales: ventasFiltradas.length,
    kpis,
    resumenHero,
    busqueda,
    setBusqueda,
    filtroEstado,
    setFiltroEstado,
    loading,
    paginaActual,
    setPaginaActual,
    totalPaginas,
    modalDetalle,
    setModalDetalle,
    modalForm,
    setModalForm,
    ventaAEliminar,
    handleVer,
    handleEditar,
    solicitarEliminar,
    cancelarEliminar,
    confirmarEliminar,
    handleGuardar,
    handleExportar,
  };
}

export default useVentas;