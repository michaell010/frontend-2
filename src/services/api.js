const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  console.error("VITE_API_URL no está definida. Revisa el archivo .env");
}

const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const config = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  };

  try {
    console.log("API URL:", BASE_URL);
    console.log("Request:", `${BASE_URL}${endpoint}`);

    const res = await fetch(`${BASE_URL}${endpoint}`, config);

    let data = null;
    const contentType = res.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = {
        ok: false,
        mensaje: "La respuesta del servidor no vino en formato JSON.",
      };
    }

    if (res.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("usuario");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    if (!res.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    console.error("Error en API:", error);

    throw {
      ok: false,
      mensaje:
        error?.mensaje ||
        error?.errores?.[0]?.mensaje ||
        "Error al conectar con el servidor.",
      errores: error?.errores || null,
    };
  }
};

export default api;