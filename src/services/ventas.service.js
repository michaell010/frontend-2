// src/services/ventas.service.js
import api from "./api";

export const ESTADO_META = {
  completado: { label: "Completado", color: "#15803d" },
  pendiente: { label: "Pendiente", color: "#b45309" },
  verificando: { label: "Verificando", color: "#1d4ed8" },
  en_ruta: { label: "En Ruta", color: "#7c3aed" },
  cancelado: { label: "Cancelado", color: "#b91c1c" },
};

const extraerLista = (res) => res?.mensaje?.data ?? res?.data ?? [];
const extraerData = (res) => res?.mensaje?.data ?? res?.data ?? null;

const formatearMoneda = (valor) =>
  `$${Number(valor || 0).toLocaleString("es-CO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const formatearFecha = (fecha) => {
  if (!fecha) return "";
  try {
    return new Date(fecha).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return fecha;
  }
};

const construirDescripcion = (venta) => {
  const ganado = venta?.detalle_ganado ?? [];
  const productos = venta?.detalle_productos ?? [];

  const partes = [];

  if (ganado.length > 0) {
    partes.push(`${ganado.length} bovino(s)`);
  }

  if (productos.length > 0) {
    const totalProductos = productos.reduce(
      (acc, item) => acc + Number(item.cantidad || 0),
      0
    );
    partes.push(`${totalProductos} producto(s)`);
  }

  return partes.length > 0 ? partes.join(" · ") : "Venta registrada";
};

const detectarCategoria = (venta) => {
  const tieneGanado = (venta?.detalle_ganado ?? []).length > 0;
  const tieneProductos = (venta?.detalle_productos ?? []).length > 0;

  if (tieneGanado && tieneProductos) return "Mixta";
  if (tieneGanado) return "Ganado";
  if (tieneProductos) return "Productos";
  return "General";
};

const adaptarVentaLista = (item) => ({
  id: item.numero_factura || `FV-${String(item.id).padStart(5, "0")}`,
  venta_id: item.id,
  cliente: item.cliente || "Sin cliente",
  clienteKey: (item.cliente || "CL").slice(0, 2).toUpperCase(),
  categoria: "General",
  fecha: formatearFecha(item.fecha),
  fechaISO: item.fecha,
  itemsTexto: "Venta registrada",
  estado: item.estado || "Pendiente",
  estadoKey: (item.estado || "Pendiente").toLowerCase(),
  total: formatearMoneda(item.total),
  totalNumber: Number(item.total || 0),
  notas: item.notas || "",
});

const adaptarVentaDetalle = (item) => {
  if (!item) return null;

  const descripcionGanado = (item.detalle_ganado ?? []).map((g) => ({
    id: g.id,
    ganado_id: g.ganado_id,
    nombre:
      g.ganado?.nombre ||
      g.ganado?.codigo ||
      `Ganado #${g.ganado_id}`,
    codigo: g.ganado?.codigo || "",
    precio: Number(g.precio || 0),
    precioTexto: formatearMoneda(g.precio),
    tipo: "ganado",
  }));

  const descripcionProductos = (item.detalle_productos ?? []).map((p) => ({
    id: p.id,
    producto_id: p.producto_id,
    produccion_id: p.produccion_id,
    nombre:
      p.producto?.nombre ||
      (p.produccion ? `Producción #${p.produccion_id}` : "Ítem"),
    tipoRef: p.producto_id ? "producto" : "produccion",
    cantidad: Number(p.cantidad || 0),
    precio_unitario: Number(p.precio_unitario || 0),
    subtotal: Number(p.subtotal || 0),
    subtotalTexto: formatearMoneda(p.subtotal),
    tipo: "producto",
  }));

  return {
    ...adaptarVentaLista(item),
    detalleGanado: descripcionGanado,
    detalleProductos: descripcionProductos,
  };
};

export async function obtenerResumenHeroVentas() {
  const res = await api("/ventas/resumen-hero");
  return extraerData(res);
}

export async function listarVentas() {
  const res = await api("/ventas");
  const data = extraerLista(res);

  return data.map(adaptarVentaLista);
}

export async function obtenerVenta(id) {
  const res = await api(`/ventas/${id}`);
  const item = extraerData(res);

  if (!item) return null;

  const itemsGanado = (item.detalle_ganado || []).map((g) => ({
    tempId: crypto.randomUUID(),
    tipo: "ganado",
    codigo: g.ganado?.codigo || "",
    precio: Number(g.precio || 0),
  }));

  const itemsProductos = (item.detalle_productos || []).map((p) => {
    if (p.producto_id) {
      return {
        tempId: crypto.randomUUID(),
        tipo: "producto",
        ref_id: p.producto_id,
        cantidad: Number(p.cantidad || 0),
        precio_unitario: Number(p.precio_unitario || 0),
      };
    }

    return {
      tempId: crypto.randomUUID(),
      tipo: "produccion",
      ref_id: p.produccion_id,
      cantidad: Number(p.cantidad || 0),
      precio_unitario: Number(p.precio_unitario || 0),
    };
  });

  const items = [...itemsGanado, ...itemsProductos];
  const total = Number(item.total || 0);

  return {
    venta_id: item.id,
    id: item.numero_factura || `FV-${String(item.id).padStart(5, "0")}`,
    cliente: item.cliente || "",
    fechaISO: item.fecha || "",
    fecha: item.fecha
      ? new Date(item.fecha).toLocaleDateString("es-CO", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "",
    estado: item.estado || "Pendiente",
    items,
    total,
  };
}

export async function crearVenta(payload) {
  const res = await api("/ventas", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return extraerData(res);
}

export async function actualizarVenta(id, payload) {
  const res = await api(`/ventas/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  return extraerData(res);
}

export async function eliminarVenta(id) {
  console.log("SERVICE eliminarVenta ID:", id);

  const res = await api(`/ventas/${id}`, {
    method: "DELETE",
  });

  console.log("SERVICE eliminarVenta RESP:", res);

  return extraerData(res);
}

export async function obtenerKpisVentas() {
  try {
    const res = await api("/ventas/kpis");
    return extraerLista(res);
  } catch {
    const ventas = await listarVentas();

    const totalHistorico = ventas.reduce((acc, v) => acc + Number(v.totalNumber || 0), 0);
    const cantidadVentas = ventas.length;
    const ticketPromedio = cantidadVentas > 0 ? totalHistorico / cantidadVentas : 0;

    return [
      {
        label: "Ventas Totales",
        value: formatearMoneda(totalHistorico),
        delta: `${cantidadVentas} registro(s)`,
        trend: "up",
        ico: "💰",
        sub: "Acumulado histórico",
      },
      {
        label: "Cantidad de Ventas",
        value: `${cantidadVentas}`,
        delta: "Registros cargados",
        trend: "flat",
        ico: "🧾",
        sub: "Ventas registradas",
      },
      {
        label: "Ticket Promedio",
        value: formatearMoneda(ticketPromedio),
        delta: "Promedio por venta",
        trend: "flat",
        ico: "📊",
        sub: "Total / cantidad",
      },
    ];
  }
}

export async function exportarVentas() {
  const ventas = await listarVentas();
  const contenido = JSON.stringify(ventas, null, 2);
  const blob = new Blob([contenido], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `ventas-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();

  URL.revokeObjectURL(url);
}