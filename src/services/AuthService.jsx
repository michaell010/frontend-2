import api from "./api";

export const login = async (correo, contrasena) => {
  const res = await api("/auth/login", {
    method: "POST",
    body: JSON.stringify({ correo, contrasena }),
  });

  // Este backend devuelve res.mensaje.data.token
  const token   = res?.mensaje?.data?.token;
  const usuario = res?.mensaje?.data?.usuario;

  if (res.ok && token) {
    localStorage.setItem("token",   token);
    localStorage.setItem("usuario", JSON.stringify(usuario || {}));
  }

  return res;
};

export const logout = () => {
  localStorage.removeItem("token");
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
