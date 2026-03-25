// src/pages/private/alimentacion/modals/ModalNuevaRacion.jsx

import { useEffect, useState } from "react";
import RacionForm from "../shared/RacionForm";
import { ganadoService } from "../../../../services/ganado.service";

const EMPTY = {
  tipo_animal:     "",
  animal_id:       "",
  nombre_alimento: "",
  tipo_alimento:   "",
  cantidad_kg:     "",
  frecuencia:      "",
  costo_unitario:  "",
  fecha_registro:  new Date().toISOString().split("T")[0], // hoy por defecto
  observaciones:   "",
};

const validate = (f) => {
  const e = {};
  if (!f.tipo_animal)      e.tipo_animal      = "El tipo de animal es requerido";
  if (!f.animal_id)        e.animal_id        = "El animal es requerido";
  if (!f.nombre_alimento)  e.nombre_alimento  = "El nombre del alimento es requerido";
  if (!f.tipo_alimento)    e.tipo_alimento    = "La categoría es requerida";
  if (!f.cantidad_kg)      e.cantidad_kg      = "La cantidad es requerida";
  if (!f.frecuencia)       e.frecuencia       = "La frecuencia es requerida";
  if (!f.fecha_registro)   e.fecha_registro   = "La fecha es requerida";
  return e;
};

export default function ModalNuevaRacion({ onClose, onGuardar }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors]             = useState({});
  const [loading, setLoading]           = useState(false);
  const [animales, setAnimales]         = useState([]);
  const [loadingAnimales, setLoadingAnimales] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoadingAnimales(true);
        const lista = await ganadoService.listar();
        setAnimales(lista);
      } catch (err) {
        console.error("Error cargando animales:", err);
      } finally {
        setLoadingAnimales(false);
      }
    };
    cargar();
  }, []);

  const handleChange = (k, v) => {
    setForm(prev => ({ ...prev, [k]: v }));
    setErrors(prev => ({ ...prev, [k]: "" }));
  };

  const handleGuardar = async () => {
    const e = validate(form);
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try { await onGuardar(form); }
    finally { setLoading(false); }
  };

  return (
    <div className="al-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="al-modal">
        <div className="al-modal__header">
          <div>
            <div className="al-modal__title">Nueva Ración</div>
            <div className="al-modal__subtitle">Registrar alimentación de un animal</div>
          </div>
          <button className="al-modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="al-modal__body">
          {loadingAnimales ? (
            <p>Cargando animales...</p>
          ) : (
            <RacionForm
              form={form}
              errors={errors}
              onChange={handleChange}
              animales={animales}
            />
          )}
        </div>

        <div className="al-modal__footer">
          <button className="al-btn al-btn--secondary" onClick={onClose} disabled={loading}>Cancelar</button>
          <button className="al-btn al-btn--primary" onClick={handleGuardar} disabled={loading || loadingAnimales}>
            {loading ? "⏳ Guardando…" : "✅ Guardar Ración"}
          </button>
        </div>
      </div>
    </div>
  );
}