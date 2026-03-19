import api from "./api";

export const login = async (correo, contrasena) => {
  try {
    const res = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ correo, contrasena }),
    });

    const token =
      res?.mensaje?.data?.token ||
      res?.data?.accessToken ||
      res?.data?.token;

    const refreshToken =
      res?.mensaje?.data?.refreshToken ||
      res?.data?.refreshToken ||
      "";

    const usuario =
      res?.mensaje?.data?.usuario ||
      res?.data?.usuario ||
      null;

    if (res?.ok && token) {
      localStorage.setItem("token", token);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      localStorage.setItem("usuario", JSON.stringify(usuario || {}));
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      mensaje:
        error?.mensaje ||
        error?.errores?.[0]?.mensaje ||
        "Error al iniciar sesión.",
    };
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("usuario");
};

export const getUsuarioActual = () => {
  try {
    const u = localStorage.getItem("usuario");
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const me = async () => {
  try {
    const res = await api("/auth/me", {
      method: "GET",
    });

    const usuario = res?.data || res?.mensaje?.data || null;

    if (res?.ok && usuario) {
      localStorage.setItem("usuario", JSON.stringify(usuario));
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      mensaje:
        error?.mensaje ||
        error?.errores?.[0]?.mensaje ||
        "No se pudo obtener el usuario autenticado.",
    };
  }
};
