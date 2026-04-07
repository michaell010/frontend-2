import api from "./api";

/* ── Íconos ───────────────────────────────────────── */
import icoCow from "../assets/icons/cow.png";
import icoDashboard from "../assets/icons/dashboard.png";
import icoReproduccion from "../assets/icons/reproduccion.png";
import icoSalud from "../assets/icons/salud.png";
import icoInventario from "../assets/icons/inventario.png";
import icoPotreros from "../assets/icons/potreros.png";
import icoFinanzas from "../assets/icons/finanzas.png";
import icoAlimentacion from "../assets/icons/alimentacion.png";
import icoVerificacion from "../assets/icons/verificacion.png";
import icoAlerta from "../assets/icons/alerta.png";

export {
  icoCow,
  icoDashboard,
  icoReproduccion,
  icoSalud,
  icoInventario,
  icoPotreros,
  icoFinanzas,
  icoAlimentacion,
  icoVerificacion,
  icoAlerta,
};

/* ── Módulos ─────────────────────────────────────── */
export const MODULOS_DATA = [
  { img: icoCow, label: "Control Ganadero", desc: "Registro y trazabilidad", href: "/ganado" },
  { img: icoReproduccion, label: "Reproducción", desc: "Gestaciones y partos", href: "/reproduccion" },
  { img: icoSalud, label: "Salud y Sanidad", desc: "Vacunaciones y tratamientos", href: "/eventos" },
  { img: icoInventario, label: "Inventario", desc: "Productos y stock", href: "/inventario" },
  { img: icoAlimentacion, label: "Alimentación", desc: "Raciones diarias", href: "/alimentacion" },
  { img: icoPotreros, label: "Potreros", desc: "Pasturas y rotación", href: "/pasturas" },
  { img: icoFinanzas, label: "Cockpit Financiero", desc: "Ventas e ingresos", href: "/finanzas" },
  { img: icoDashboard, label: "Mando Central", desc: "Vista ejecutiva", href: "/dashboard" },
];

/* ── Utilidades ─────────────────────────────────── */
export const getSaludo = () => {
  const h = new Date().getHours();
  return h < 12 ? "Buenos días" : h < 18 ? "Buenas tardes" : "Buenas noches";
};

export const getFechaFormateada = () =>
  new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

/* ── Helpers ────────────────────────────────────── */
// 🔥 este es el bueno (el que querías agregar)
const extraerData = (res) =>
  res?.mensaje?.data ?? res?.data ?? res ?? null;

/* ── API Dashboard ─────────────────────────────── */
export const obtenerResumenDashboard = async () => {
  const res = await api("/dashboard/resumen");
  return extraerData(res);
};

export const obtenerAlertasDashboard = async () => {
  const res = await api("/dashboard/alertas");
  return extraerData(res) ?? [];
};