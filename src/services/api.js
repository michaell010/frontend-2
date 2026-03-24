const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  console.error("VITE_API_URL no está definida. Revisa el archivo .env");
}

const limpiarSesion = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("usuario");
};

const redirigirLoginSiCorresponde = () => {
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

const construirErrorDesdeJson = (data, status) => ({
  status,
  ok: false,
  mensaje:
    data?.mensaje?.mensaje ||
    data?.mensaje ||
    data?.message ||
    "Ocurrió un error en la solicitud.",
  errores: data?.mensaje?.errores || data?.errores || [],
  data: data?.mensaje?.data || data?.data || null,
  raw: data,
});

const construirErrorDesdeTexto = (text, status) => ({
  status,
  ok: false,
  mensaje: text || "Ocurrió un error en la solicitud.",
  errores: [],
  data: null,
  raw: text,
});

const extraerError = async (res) => {
  const contentType = res.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    const data = await res.json();
    throw construirErrorDesdeJson(data, res.status);
  }

  const text = await res.text();
  throw construirErrorDesdeTexto(text, res.status);
};

const api = async (endpoint, options = {}) => {
  if (!BASE_URL) {
    throw {
      status: 500,
      ok: false,
      mensaje: "La URL base de la API no está configurada.",
      errores: [],
      data: null,
    };
  }

  const token = localStorage.getItem("token");
  const isFormData = options.body instanceof FormData;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const config = {
    method: options.method || "GET",
    ...options,
    headers,
    signal: options.signal || controller.signal,
  };

  try {
    console.log("API URL:", BASE_URL);
    console.log("Request:", `${BASE_URL}${endpoint}`);
    console.log("Method:", config.method);

    const res = await fetch(`${BASE_URL}${endpoint}`, config);

    if (res.status === 401) {
      limpiarSesion();
      redirigirLoginSiCorresponde();
    }

    if (!res.ok) {
      await extraerError(res);
    }

    const contentType = res.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    }

    return null;
  } catch (error) {
    console.error("Error en API:", error);

    if (error?.name === "AbortError") {
      throw {
        status: 408,
        ok: false,
        mensaje: "La solicitud tardó demasiado tiempo.",
        errores: [],
        data: null,
      };
    }

    throw {
      status: error?.status || 500,
      ok: false,
      mensaje:
        error?.mensaje ||
        error?.errores?.[0]?.mensaje ||
        error?.message ||
        "Error al conectar con el servidor.",
      errores: error?.errores || [],
      data: error?.data || null,
      raw: error?.raw || error || null,
    };
  } finally {
    clearTimeout(timeout);
  }
};

export default api;