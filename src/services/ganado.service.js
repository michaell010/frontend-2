import api from "./api";

const API_URL = import.meta.env.VITE_API_URL || "";

const getUploadsBase = () => {
  return API_URL.replace(/\/api\/?$/, "").replace(/\/$/, "");
};

const construirUrlImagen = (fotoUrl) => {
  if (!fotoUrl) return "";
  if (fotoUrl === "null" || fotoUrl === "undefined") return "";

  const ruta = String(fotoUrl).trim();

  if (!ruta || ruta === "null" || ruta === "undefined") return "";
  if (ruta.startsWith("http://") || ruta.startsWith("https://")) return ruta;

  const path = ruta.startsWith("/") ? ruta : `/${ruta}`;
  return `${getUploadsBase()}${path}`;
};

const extraerData = (res) => res?.mensaje?.data ?? res?.data ?? null;
const extraerLista = (res) => res?.mensaje?.data ?? res?.data ?? [];

const estadoDesdeBackend = (item) => {
  if (item?.estado_biologico === "Muerto") return "Muerto";
  if (item?.estado_comercial === "Vendido") return "Vendido";
  if (item?.estado_comercial === "Descartado") return "Descartado";
  return item?.estado_general || "Activo";
};

const numeroONull = (valor) => {
  if (valor === "" || valor === null || valor === undefined) return null;
  const n = Number(valor);
  return Number.isNaN(n) ? null : n;
};

const adaptarDesdeBackend = (item) => ({
  id: item.id,
  codigo: item.codigo || "",
  nombre: item.nombre || "",
  raza: item.raza || "",
  sexo: item.sexo || "",
  categoria: item.categoria || "",
  fecha_nacimiento: item.fecha_nacimiento || "",

  peso:
    item.peso_actual !== null && item.peso_actual !== undefined
      ? Number(item.peso_actual)
      : "",

  peso_actual:
    item.peso_actual !== null && item.peso_actual !== undefined
      ? Number(item.peso_actual)
      : "",

  estado: estadoDesdeBackend(item),
  estado_general: item.estado_general || "Activo",
  estado_biologico: item.estado_biologico || "Vivo",
  estado_comercial: item.estado_comercial || "Disponible",
  estado_salud: item.estado_salud || "Sano",
  estado_reproductivo: item.estado_reproductivo || "No aplica",

  fecha_ultimo_parto: item.fecha_ultimo_parto || "",
  fecha_probable_parto: item.fecha_probable_parto || "",
  numero_partos: item.numero_partos ?? "",
  estado_productivo: item.estado_productivo || "",
  es_reproductor: Boolean(item.es_reproductor),

  potrero: item.potrero?.nombre || "",
  potrero_id: item.potrero_id ? String(item.potrero_id) : "",
  madre_id: item.madre_id ? String(item.madre_id) : "",
  padre_id: item.padre_id ? String(item.padre_id) : "",
  origen: item.origen || "Nacimiento en finca",
  fecha_ingreso: item.fecha_ingreso || "",

  notas: item.observaciones || "",
  observaciones: item.observaciones || "",
  creado_en: item.creado_en || null,

  foto_url: item.foto_url || "",
  foto: construirUrlImagen(item.foto_url),
});

const adaptarHaciaBackend = (data) => ({
  codigo: data.codigo || "",
  nombre: data.nombre || null,
  sexo: data.sexo || null,
  categoria: data.categoria || null,
  raza: data.raza || null,
  fecha_nacimiento: data.fecha_nacimiento || null,
  peso_actual: numeroONull(data.peso_actual ?? data.peso),

  estado_general: data.estado_general || "Activo",
  estado_biologico: data.estado_biologico || "Vivo",
  estado_comercial: data.estado_comercial || "Disponible",
  estado_salud: data.estado_salud || "Sano",
  estado_reproductivo: data.estado_reproductivo || "No aplica",

  fecha_ultimo_parto: data.fecha_ultimo_parto || null,
  fecha_probable_parto: data.fecha_probable_parto || null,
  numero_partos: numeroONull(data.numero_partos),
  estado_productivo: data.estado_productivo || null,
  es_reproductor:
    data.es_reproductor === true || data.es_reproductor === "true",

  potrero_id: numeroONull(data.potrero_id),
  madre_id: numeroONull(data.madre_id),
  padre_id: numeroONull(data.padre_id),
  origen: data.origen || "Nacimiento en finca",
  fecha_ingreso: data.fecha_ingreso || null,

  observaciones: data.observaciones || data.notas || null,
});

const crearFormDataGanado = (data) => {
  const payload = adaptarHaciaBackend(data);
  const fd = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      fd.append(key, value);
    }
  });

  if (data.foto instanceof File) {
    fd.append("foto", data.foto);
  }

  return fd;
};

export const ganadoService = {
  listar: async () => {
    const res = await api("/ganado", { method: "GET" });
    const rows = extraerLista(res);
    return Array.isArray(rows) ? rows.map(adaptarDesdeBackend) : [];
  },

  obtenerPorId: async (id) => {
    const res = await api(`/ganado/${id}`, { method: "GET" });
    const row = extraerData(res);
    return row ? adaptarDesdeBackend(row) : null;
  },

  crear: async (data) => {
    const body = crearFormDataGanado(data);

    const res = await api("/ganado", {
      method: "POST",
      body,
    });

    const row = extraerData(res);
    return row ? adaptarDesdeBackend(row) : null;
  },

  actualizar: async (data) => {
    const body = crearFormDataGanado(data);

    const res = await api(`/ganado/${data.id}`, {
      method: "PUT",
      body,
    });

    const row = extraerData(res);
    return row ? adaptarDesdeBackend(row) : null;
  },

  eliminar: async (id) => {
    const res = await api(`/ganado/${id}`, {
      method: "DELETE",
    });

    return {
      ok: res?.ok ?? true,
      id,
    };
  },

  exportar: async (formato, rows) => {
    return { ok: true, formato, total: rows.length };
  },
};