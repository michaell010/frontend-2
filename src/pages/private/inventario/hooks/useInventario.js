import { useState, useMemo, useCallback, useEffect } from "react";
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
  exportarInventario,
} from "../../../../services/inventario.service";

export function useInventario() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [loading, setLoading] = useState(false);
  const [modalDetalle, setModalDetalle] = useState(null);
  const [modalForm, setModalForm] = useState(null);

  const cargarProductos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProductos();
      setProductos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando productos:", error);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const q = busqueda.toLowerCase();

      const matchQ =
        p.nombre?.toLowerCase().includes(q) ||
        String(p.id).toLowerCase().includes(q) ||
        (p.proveedor || "").toLowerCase().includes(q);

      const matchT = filtroTipo === "todos" || p.tipoKey === filtroTipo;
      const matchE = filtroEstado === "todos" || p.estadoKey === filtroEstado;

      return matchQ && matchT && matchE;
    });
  }, [productos, busqueda, filtroTipo, filtroEstado]);

  const handleEliminarProducto = useCallback(
    async (id) => {
      if (!window.confirm("¿Eliminar este producto?")) return;

      try {
        setLoading(true);
        await deleteProducto(id);
        await cargarProductos();
      } catch (error) {
        console.error("Error eliminando producto:", error);
      } finally {
        setLoading(false);
      }
    },
    [cargarProductos]
  );

  const handleGuardarProducto = useCallback(
    async (prod) => {
      try {
        setLoading(true);

        console.log("Producto recibido desde modal:", prod);

        if (prod.id) {
          await updateProducto(prod.id, prod);
        } else {
          await createProducto(prod);
        }

        setModalForm(null);
        await cargarProductos();
      } catch (error) {
        console.error("Error guardando producto:", error);
        console.error("Mensaje:", error?.mensaje);
        console.error("Errores backend:", error?.errores);

        alert(
          error?.errores?.[0]?.mensaje ||
            error?.mensaje ||
            "No se pudo guardar el producto"
        );
      } finally {
        setLoading(false);
      }
    },
    [cargarProductos]
  );

  const handleExportar = useCallback(async () => {
    try {
      setLoading(true);
      await exportarInventario();
    } catch (error) {
      console.error("Error exportando inventario:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const kpis = useMemo(() => {
    const total = productos.length;
    const criticos = productos.filter((p) => p.estadoKey === "critico").length;
    const bajos = productos.filter((p) => p.estadoKey === "stock_bajo").length;
    const activos = productos.filter(
      (p) => Number(p.cantidad_actual || 0) > 0
    ).length;
    const inactivos = productos.filter(
      (p) => Number(p.cantidad_actual || 0) <= 0
    ).length;

    return [
      {
        label: "Total productos",
        value: String(total),
        ico: "📦",
        sub: "Registrados",
        trend: "up",
        delta: `${activos} activos`,
      },
      {
        label: "Alertas críticas",
        value: String(criticos),
        ico: "⚠️",
        sub: "Stock crítico",
        trend: criticos > 0 ? "down" : "flat",
        delta: criticos > 0 ? "Revisar" : "OK",
      },
      {
        label: "Stock bajo",
        value: String(bajos),
        ico: "📉",
        sub: "Reabastecer",
        trend: bajos > 0 ? "down" : "flat",
        delta: bajos > 0 ? "Atención" : "Estable",
      },
      {
        label: "Activos",
        value: String(activos),
        ico: "✅",
        sub: `${inactivos} inactivos`,
        trend: activos > 0 ? "up" : "flat",
        delta: `${total} total`,
      },
    ];
  }, [productos]);

  const suministros = useMemo(() => {
    return productos.slice(0, 5).map((p) => ({
      nombre: p.nombre,
      pct: p.stock || 0,
      nivel:
        p.estadoKey === "critico"
          ? "critico"
          : p.estadoKey === "stock_bajo"
          ? "bajo"
          : "normal",
    }));
  }, [productos]);

  const silos = useMemo(() => {
    const alimentos = productos.filter((p) => p.tipo === "Alimento").slice(0, 3);

    return alimentos.map((p) => ({
      label: p.nombre || "Sin nombre",
      pct: p.stock || 0,
      nivel:
        p.estadoKey === "critico"
          ? "critico"
          : p.estadoKey === "stock_bajo"
          ? "bajo"
          : "normal",
    }));
  }, [productos]);

  const estadisticasHero = useMemo(() => {
    const totalProductos = productos.length;

    const alertasCriticas = productos.filter(
      (p) => p.estadoKey === "critico" || p.estadoKey === "agotado"
    ).length;

    const valorTotal = productos.reduce((acc, p) => {
      const cantidad = Number(p.cantidad_actual || 0);
      const precio = Number(p.precio_unitario || 0);
      return acc + cantidad * precio;
    }, 0);

    return {
      totalProductos,
      alertasCriticas,
      valorTotal,
    };
  }, [productos]);

  return {
    productos: productosFiltrados,
    productosTotal: productosFiltrados.length,
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
    recargarProductos: cargarProductos,
  };
}