import api from "./api";

/* =========================
   Helpers para respuestas
   ========================= */
const extraerLista = (res) =>
  res?.mensaje?.data ??
  res?.data?.data ??
  res?.data ??
  [];

const extraerData = (res) =>
  res?.mensaje?.data ??
  res?.data?.data ??
  res?.data ??
  null;

const construirError = (error, fallback = "Ocurrió un error en el módulo de potreros.") => {
  const data = error?.response?.data;

  return {
    status: error?.response?.status || 500,
    ok: false,
    mensaje:
      data?.mensaje?.mensaje ||
      data?.mensaje ||
      error?.message ||
      fallback,
    errores: data?.errores || data?.mensaje?.errores || [],
    data: null,
  };
};

const adaptarDesdeBackend = (item = {}) => ({
  id: item.id,
  finca_id: item.finca_id ?? "",
  nombre: item.nombre ?? "",
  hectareas: item.hectareas ?? "",
  tipo_pasto: item.tipo_pasto ?? "",
  capacidad_animales: item.capacidad_animales ?? "",
  estado: item.estado ?? "Disponible",
  ganado: Array.isArray(item.ganado) ? item.ganado : [],
});

const adaptarHaciaBackend = (payload = {}) => ({
  finca_id: Number(payload.finca_id),
  nombre: payload.nombre?.trim(),
  hectareas:
    payload.hectareas === "" || payload.hectareas === null || payload.hectareas === undefined
      ? null
      : Number(payload.hectareas),
  tipo_pasto: payload.tipo_pasto?.trim() || null,
  capacidad_animales:
    payload.capacidad_animales === "" ||
    payload.capacidad_animales === null ||
    payload.capacidad_animales === undefined
      ? null
      : Number(payload.capacidad_animales),
  estado: payload.estado || "Disponible",
});

const validarPayload = (payload, esEdicion = false) => {
  const errores = [];

  if (!payload.finca_id) {
    errores.push({ campo: "finca_id", mensaje: "La finca es obligatoria." });
  }

  if (!payload.nombre?.trim()) {
    errores.push({ campo: "nombre", mensaje: "El nombre del potrero es obligatorio." });
  }

  if (
    payload.hectareas !== "" &&
    payload.hectareas !== null &&
    payload.hectareas !== undefined &&
    Number(payload.hectareas) < 0
  ) {
    errores.push({ campo: "hectareas", mensaje: "Las hectáreas no pueden ser negativas." });
  }

  if (
    payload.capacidad_animales !== "" &&
    payload.capacidad_animales !== null &&
    payload.capacidad_animales !== undefined &&
    Number(payload.capacidad_animales) < 0
  ) {
    errores.push({
      campo: "capacidad_animales",
      mensaje: "La capacidad de animales no puede ser negativa.",
    });
  }

  if (errores.length) {
    throw {
      status: 400,
      ok: false,
      mensaje: esEdicion
        ? "No se pudo actualizar el potrero."
        : "No se pudo crear el potrero.",
      errores,
      data: null,
    };
  }
};

export const listarPotreros = async () => {
  try {
    const res = await api("/potreros");
    const lista = extraerLista(res);
    return Array.isArray(lista) ? lista.map(adaptarDesdeBackend) : [];
  } catch (error) {
    throw construirError(error, "No se pudieron listar los potreros.");
  }
};

export const crearPotrero = async (payload) => {
  try {
    validarPayload(payload, false);
    const body = adaptarHaciaBackend(payload);
    const res = await api("/potreros", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return adaptarDesdeBackend(extraerData(res));
  } catch (error) {
    throw error?.mensaje ? error : construirError(error, "No se pudo crear el potrero.");
  }
};

export const actualizarPotrero = async (id, payload) => {
  try {
    if (!id) {
      throw {
        status: 400,
        ok: false,
        mensaje: "El id del potrero es obligatorio.",
        errores: [{ campo: "id", mensaje: "Debe enviar el id del potrero." }],
        data: null,
      };
    }

    validarPayload(payload, true);
    const body = adaptarHaciaBackend(payload);

    const res = await api(`/potreros/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });

    return adaptarDesdeBackend(extraerData(res));
  } catch (error) {
    throw error?.mensaje ? error : construirError(error, "No se pudo actualizar el potrero.");
  }
};

export const eliminarPotrero = async (id) => {
  try {
    if (!id) {
      throw {
        status: 400,
        ok: false,
        mensaje: "El id del potrero es obligatorio.",
        errores: [{ campo: "id", mensaje: "Debe enviar el id del potrero." }],
        data: null,
      };
    }

    const res = await api(`/potreros/${id}`, {
      method: "DELETE",
    });

    return extraerData(res);
  } catch (error) {
    throw construirError(error, "No se pudo eliminar el potrero.");
  }
};