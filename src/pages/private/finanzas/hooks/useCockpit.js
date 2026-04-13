import { useState, useEffect, useCallback } from "react";
import {
  getKPIs,
  getGrowthData,
  getLiquidacion,
  getTransacciones,
  getTransaccionById,
  deleteTransaccion as deleteTransaccionService,
  exportarReporte,
} from "../../../../services/cockpit.service";

import { notify } from "../../../../services/notify.service";
import {
  executeRequest,
  getErrorMessage,
} from "../../../../utils/handleRequest";

export function useCockpit() {
  const [kpis, setKpis] = useState([]);
  const [barras, setBarras] = useState([]);
  const [liquidacion, setLiquidacion] = useState([]);
  const [transacciones, setTransacciones] = useState([]);
  const [periodoActivo, setPeriodoActivo] = useState("Semana");

  const [loading, setLoading] = useState(false);
  const [loadingBusqueda, setLoadingBusqueda] = useState(false);
  const [errorCarga, setErrorCarga] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [busquedaDebounce, setBusquedaDebounce] = useState("");
  const [modalDetalle, setModalDetalle] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBusquedaDebounce(busqueda);
    }, 400);

    return () => clearTimeout(timer);
  }, [busqueda]);

  const cargarKPIs = useCallback(async () => {
    try {
      const data = await getKPIs();
      setKpis(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando KPIs:", error);
      setKpis([]);
      throw error;
    }
  }, []);

  const cargarBarras = useCallback(async (periodo) => {
    try {
      const data = await getGrowthData(periodo);
      setBarras(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando gráfico:", error);
      setBarras([]);
      throw error;
    }
  }, []);

  const cargarLiquidacion = useCallback(async () => {
    try {
      const data = await getLiquidacion();
      setLiquidacion(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando liquidación:", error);
      setLiquidacion([]);
      throw error;
    }
  }, []);

  const cargarTransacciones = useCallback(async (textoBusqueda = "") => {
    try {
      const filtros = textoBusqueda?.trim()
        ? { busqueda: textoBusqueda.trim() }
        : {};

      const data = await getTransacciones(filtros);
      setTransacciones(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando transacciones:", error);
      setTransacciones([]);
      throw error;
    }
  }, []);

  const cargarInicial = useCallback(async () => {
    setLoading(true);
    setErrorCarga("");

    try {
      await Promise.all([
        cargarKPIs(),
        cargarLiquidacion(),
        cargarBarras(periodoActivo),
      ]);
    } catch (error) {
      console.error("Error general cargando cockpit:", error);
      const mensaje = getErrorMessage(error);
      setErrorCarga(mensaje);
      notify.error(mensaje);
    } finally {
      setLoading(false);
    }
  }, [cargarKPIs, cargarLiquidacion, cargarBarras, periodoActivo]);

  useEffect(() => {
    cargarInicial();
  }, [cargarInicial]);

  useEffect(() => {
    const cargar = async () => {
      setLoadingBusqueda(true);

      try {
        await cargarTransacciones(busquedaDebounce);
      } catch (error) {
        console.error("Error en búsqueda de transacciones:", error);
        notify.error(getErrorMessage(error));
      } finally {
        setLoadingBusqueda(false);
      }
    };

    cargar();
  }, [busquedaDebounce, cargarTransacciones]);

  const cambiarPeriodo = useCallback(
    async (nuevoPeriodo) => {
      if (nuevoPeriodo === periodoActivo) return;

      setPeriodoActivo(nuevoPeriodo);
      setLoading(true);

      try {
        await cargarBarras(nuevoPeriodo);
      } catch (error) {
        console.error("Error cambiando periodo:", error);
        notify.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    },
    [periodoActivo, cargarBarras]
  );

  const handleExportar = useCallback(async () => {
    try {
      setLoading(true);
      await exportarReporte("pdf");
      notify.success("Reporte exportado correctamente");
    } catch (error) {
      console.warn("No se pudo exportar el reporte:", error);
      notify.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  const eliminarTransaccion = useCallback(async (transaccion) => {
    const idVisual = typeof transaccion === "object" ? transaccion?.id : transaccion;

    const idReal = String(idVisual || "")
      .replace(/^#V-/, "")
      .replace(/^#LT-/, "");

    if (!idReal) {
      notify.error("No se encontró el id de la transacción");
      return;
    }

    await executeRequest({
      confirm: {
        title: "Eliminar transacción",
        text: "Esta acción no se puede deshacer.",
        confirmText: "Sí, eliminar",
        cancelText: "Cancelar",
        icon: "warning",
      },
      request: () => deleteTransaccionService(idReal),
      loadingMessage: "Eliminando transacción...",
      successMessage: "Transacción eliminada correctamente",
      errorMessage: "No se pudo eliminar la transacción",
      onSuccess: async () => {
        setTransacciones((prev) =>
          prev.filter(
            (t) =>
              String(t?.venta_id) !== String(idReal) &&
              String(t?.id) !== String(idVisual)
          )
        );

        setModalDetalle((prev) => {
          if (!prev) return null;

          const mismaVenta = String(prev?.venta_id) === String(idReal);
          const mismoIdVisual = String(prev?.id) === String(idVisual);

          return mismaVenta || mismoIdVisual ? null : prev;
        });
      },
    });
  }, []);

  const verDetalleTransaccion = useCallback(async (transaccion) => {
    try {
      const idReal =
        transaccion?.venta_id ||
        String(transaccion?.id || "")
          .replace(/^#V-/, "")
          .replace(/^#LT-/, "");

      if (!idReal) {
        setModalDetalle(transaccion);
        return;
      }

      const detalle = await getTransaccionById(idReal);

      if (!detalle) {
        setModalDetalle(transaccion);
        return;
      }

      setModalDetalle({
        ...transaccion,
        ...detalle,
        venta_id: detalle.id ?? transaccion?.venta_id ?? idReal,
        id: transaccion?.id ?? `#V-${idReal}`,
      });
    } catch (error) {
      console.error("Error cargando detalle de transacción:", error);
      notify.error(getErrorMessage(error));
      setModalDetalle(transaccion);
    }
  }, []);

  return {
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
    recargarCockpit: cargarInicial,
  };
}

export default useCockpit;