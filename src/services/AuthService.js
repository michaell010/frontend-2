import api from "./api";

export const login = async (correo, contrasena) => {
  const data = await api("/auth/login", {
    method: "POST",
    body: JSON.stringify({ correo, contrasena }),
  });
  if (data.ok && data.data?.accessToken) {
    localStorage.setItem("token",        data.data.accessToken);
    localStorage.setItem("refreshToken", data.data.refreshToken);
    localStorage.setItem("usuario",      JSON.stringify(data.data.usuario || {}));
  }
  return data;
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

export const isAuthenticated = () => !!localStorage.getItem("token");
