// src/pages/private/alimentacion/shared/RacionForm.jsx

import { TIPOS_ALIMENTO, FRECUENCIAS, TIPOS_ANIMAL } from "../alimentacion.constants";

function Field({ label, required, error, children }) {
  return (
    <div className="al-form-group">
      <label className="al-form-label">
        {label}
        {required && <span>*</span>}
      </label>
      {children}
      {error && <span className="al-form-error">{error}</span>}
    </div>
  );
}

export default function RacionForm({
  form,
  errors = {},
  onChange,
  esEdicion = false,
  animales = [],
}) {
  const s = (k, v) => onChange(k, v);

  // Filtra animales según tipo_animal seleccionado
  const animalesFiltrados = form.tipo_animal
    ? animales.filter(a => a.tipo === form.tipo_animal || a.tipo_animal === form.tipo_animal)
    : animales;

  return (
    <div className="al-form-grid">
      <div className="al-form-section-divider">Animal</div>

      <Field label="Tipo de Animal" required error={errors.tipo_animal}>
        <select
          className={`al-form-select${errors.tipo_animal ? " error" : ""}`}
          value={form.tipo_animal || ""}
          onChange={e => {
            s("tipo_animal", e.target.value);
            s("animal_id", ""); // reset al cambiar tipo
          }}
          disabled={esEdicion}
        >
          <option value="">Seleccionar tipo…</option>
          {TIPOS_ANIMAL.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </Field>

      <Field label="Animal" required error={errors.animal_id}>
        <select
          className={`al-form-select${errors.animal_id ? " error" : ""}`}
          value={form.animal_id || ""}
          onChange={e => s("animal_id", e.target.value)}
          disabled={esEdicion || !form.tipo_animal}
        >
          <option value="">
            {!form.tipo_animal ? "Primero selecciona el tipo…" : "Seleccionar animal…"}
          </option>
          {animalesFiltrados.map(a => (
            <option key={a.id} value={a.id}>
              {a.codigo} - {a.nombre || "Sin nombre"} - {a.raza || "Sin raza"}
            </option>
          ))}
        </select>
      </Field>

      <div className="al-form-section-divider">Alimento</div>

      <Field label="Nombre del Alimento" required error={errors.nombre_alimento}>
        <input
          className={`al-form-input${errors.nombre_alimento ? " error" : ""}`}
          placeholder="Ej: Pasto kikuyo, Concentrado lactación…"
          value={form.nombre_alimento || ""}
          onChange={e => s("nombre_alimento", e.target.value)}
        />
      </Field>

      <Field label="Tipo / Categoría" required error={errors.tipo_alimento}>
        <select
          className={`al-form-select${errors.tipo_alimento ? " error" : ""}`}
          value={form.tipo_alimento || ""}
          onChange={e => s("tipo_alimento", e.target.value)}
        >
          <option value="">Seleccionar categoría…</option>
          {TIPOS_ALIMENTO.map(t => (
            <option key={t} value={t}>{t.replace("_", " ")}</option>
          ))}
        </select>
      </Field>

      <Field label="Cantidad (kg)" required error={errors.cantidad_kg}>
        <input
          className={`al-form-input${errors.cantidad_kg ? " error" : ""}`}
          type="number"
          min="0"
          step="0.1"
          placeholder="Ej: 5.5"
          value={form.cantidad_kg || ""}
          onChange={e => s("cantidad_kg", e.target.value)}
        />
      </Field>

      <Field label="Frecuencia" required error={errors.frecuencia}>
        <select
          className={`al-form-select${errors.frecuencia ? " error" : ""}`}
          value={form.frecuencia || ""}
          onChange={e => s("frecuencia", e.target.value)}
        >
          <option value="">Seleccionar frecuencia…</option>
          {FRECUENCIAS.map(f => (
            <option key={f} value={f}>{f.replace("_", " ")}</option>
          ))}
        </select>
      </Field>

      <div className="al-form-section-divider">Costos y Fechas</div>

      <Field label="Costo Unitario (COP/kg)">
        <input
          className="al-form-input"
          type="number"
          min="0"
          step="1"
          placeholder="Ej: 1200"
          value={form.costo_unitario || ""}
          onChange={e => s("costo_unitario", e.target.value)}
        />
      </Field>

      <Field label="Fecha de Registro" required error={errors.fecha_registro}>
        <input
          className={`al-form-input${errors.fecha_registro ? " error" : ""}`}
          type="date"
          value={form.fecha_registro || ""}
          onChange={e => s("fecha_registro", e.target.value)}
        />
      </Field>

      <Field label="Observaciones">
        <textarea
          className="al-form-textarea"
          placeholder="Notas adicionales sobre la ración, condición del animal, etc."
          value={form.observaciones || ""}
          onChange={e => s("observaciones", e.target.value)}
          rows={3}
        />
      </Field>
    </div>
  );
}