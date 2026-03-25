// src/pages/private/alimentacion/alimentacion.constants.js

export const TIPOS_ALIMENTO = [
  "Pasto",
  "Concentrado",
  "Suplemento_Mineral",
  "Ensilaje",
  "Heno",
  "Sal",
  "Melaza",
  "Otro",
];

export const FRECUENCIAS = [
  "Diaria",
  "Dos_veces_al_dia",
  "Semanal",
  "Quincenal",
  "Mensual",
];

export const TIPOS_ANIMAL = ["Vaca", "Toro", "Ternero", "Novillo"];

export const PER_PAGE = 8;

// ── Estilos por tipo de alimento ─────────────────────────────────────────
export const TIPO_ALIMENTO_STYLES = {
  Pasto:               { bg: "#dcfce7", color: "#166534", icono: "🌿" },
  Concentrado:         { bg: "#fef9c3", color: "#854d0e", icono: "🌾" },
  Suplemento_Mineral:  { bg: "#dbeafe", color: "#1e40af", icono: "💊" },
  Ensilaje:            { bg: "#f3e8ff", color: "#6b21a8", icono: "🫙" },
  Heno:                { bg: "#fef3c7", color: "#92400e", icono: "🪹" },
  Sal:                 { bg: "#f1f5f9", color: "#475569", icono: "🧂" },
  Melaza:              { bg: "#fce7f3", color: "#9d174d", icono: "🍯" },
  Otro:                { bg: "#f3f4f6", color: "#374151", icono: "📦" },
};

// ── KPI helpers ───────────────────────────────────────────────────────────
export function calcularKPIsAlimentacion(registros) {
  const total = registros.length;

  const animalesUnicos = new Set(registros.map(r => r.animal_id)).size;

  const costoTotal = registros.reduce((acc, r) => {
    const costo = parseFloat(r.costo_unitario) || 0;
    const cantidad = parseFloat(r.cantidad_kg) || 0;
    return acc + costo * cantidad;
  }, 0);

  // Alimento más registrado
  const conteo = {};
  registros.forEach(r => {
    const t = r.tipo_alimento || "Otro";
    conteo[t] = (conteo[t] || 0) + 1;
  });
  const alimentoTop = Object.entries(conteo).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  return { total, animalesUnicos, costoTotal, alimentoTop };
}

// ── Últimos registros (N días) ─────────────────────────────────────────────
export function registrosRecientes(registros, dias = 7) {
  const corte = new Date();
  corte.setDate(corte.getDate() - dias);
  return registros.filter(r => {
    if (!r.fecha_registro) return false;
    return new Date(r.fecha_registro + "T00:00:00") >= corte;
  });
}

// ── Formato de fecha legible ──────────────────────────────────────────────
export function formatFecha(fecha) {
  if (!fecha) return "—";
  const d = new Date(fecha + "T00:00:00");
  if (isNaN(d)) return "—";
  return d.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ── Días desde una fecha ──────────────────────────────────────────────────
export function diasDesde(fecha) {
  if (!fecha) return null;
  const diff = new Date() - new Date(fecha + "T00:00:00");
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// ── Formato de peso ───────────────────────────────────────────────────────
export function formatCantidad(kg) {
  if (!kg && kg !== 0) return "—";
  const n = parseFloat(kg);
  if (isNaN(n)) return "—";
  return n >= 1 ? `${n} kg` : `${n * 1000} g`;
}

// ── Formato de moneda COP ─────────────────────────────────────────────────
export function formatCOP(valor) {
  if (!valor && valor !== 0) return "—";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor);
}