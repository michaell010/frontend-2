import { useEffect, useMemo, useState } from "react";
import { ganadoService } from "../../../../services/ganado.service";
import "../../../../styles/modules/Salud.css";

const TIPOS = [
  { value: "Vacunacion", label: "Vacunación" },
  { value: "Tratamiento", label: "Tratamiento" },
  { value: "Cirugia", label: "Cirugía" },
  { value: "Diagnostico", label: "Diagnóstico" },
  { value: "Revision", label: "Revisión" },
  { value: "Desparasitacion", label: "Desparasitación" },
];

export default function SaludModalForm({ evento, onClose, onGuardar }) {
  const esEdicion = !!evento?.id || !!evento?.backendId;

  const [ganados, setGanados] = useState([]);
  const [loadingGanados, setLoadingGanados] = useState(false);
  const [errorGanado, setErrorGanado] = useState("");

  const [form, setForm] = useState({
    id: evento?.id ?? null,
    backendId: evento?.backendId ?? null,

    ganado_id: evento?.ganado_id ?? "",
    animalCod: evento?.animalCod ?? "",
    animalNombre: evento?.animalNombre ?? "",

    tipo: evento?.tipo ?? "Revision",
    fechaISO: evento?.fechaISO ?? new Date().toISOString().split("T")[0],

    descripcion: evento?.descripcion ?? evento?.notas ?? "",
    dosis: evento?.dosis ?? "",
    via_administracion: evento?.via_administracion ?? "",
    costo:
      evento?.costo !== null && evento?.costo !== undefined
        ? String(evento.costo)
        : "",
    proxima_fecha: evento?.proxima_fecha ?? "",
  });

  const [errores, setErrores] = useState({});

  const set = (campo, valor) =>
    setForm((prev) => ({
      ...prev,
      [campo]: valor,
    }));

  useEffect(() => {
    const cargarGanado = async () => {
      setLoadingGanados(true);
      setErrorGanado("");

      try {
        const lista = await ganadoService.listar();
        setGanados(Array.isArray(lista) ? lista : []);
      } catch (error) {
        console.error("Error cargando ganado:", error);
        setGanados([]);
        setErrorGanado(
          error?.mensaje || "No se pudo cargar el listado de ganado."
        );
      } finally {
        setLoadingGanados(false);
      }
    };

    cargarGanado();
  }, []);

  const ganadoCoincidente = useMemo(() => {
    const codigo = String(form.animalCod || "").trim().toLowerCase();
    if (!codigo) return null;

    return (
      ganados.find(
        (g) => String(g.codigo || "").trim().toLowerCase() === codigo
      ) || null
    );
  }, [form.animalCod, ganados]);

  useEffect(() => {
    if (ganadoCoincidente) {
      setForm((prev) => ({
        ...prev,
        ganado_id: ganadoCoincidente.id,
        animalNombre: ganadoCoincidente.nombre || "",
      }));
      setErrorGanado("");
    } else {
      setForm((prev) => ({
        ...prev,
        ganado_id: "",
        animalNombre: "",
      }));

      if (form.animalCod?.trim()) {
        setErrorGanado("No se encontró un ganado con ese código.");
      } else {
        setErrorGanado("");
      }
    }
  }, [ganadoCoincidente, form.animalCod]);

  const validar = () => {
    const nuevosErrores = {};

    if (!form.animalCod?.trim()) {
      nuevosErrores.animalCod = "El código del animal es obligatorio.";
    }

    if (!form.ganado_id) {
      nuevosErrores.ganado_id =
        "Debes seleccionar un ganado existente mediante un código válido.";
    }

    if (!form.tipo) {
      nuevosErrores.tipo = "El tipo de evento es obligatorio.";
    }

    if (!form.fechaISO) {
      nuevosErrores.fechaISO = "La fecha es obligatoria.";
    }

    if (form.costo !== "" && Number.isNaN(Number(form.costo))) {
      nuevosErrores.costo = "El costo debe ser un valor numérico válido.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = () => {
    if (!validar()) return;

    onGuardar({
      ...form,
      ganado_id: Number(form.ganado_id),
      costo: form.costo === "" ? "" : Number(form.costo),
    });
  };

  return (
    <div className="sl-modal-overlay" onClick={onClose}>
      <div
        className="sl-modal sl-modal--form"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sl-modal__header">
          <div>
            <p className="sl-modal__pre">
              {esEdicion ? "Editar Evento Sanitario" : "Nuevo Evento Sanitario"}
            </p>
            <h2 className="sl-modal__title">
              {esEdicion
                ? `Evento #${evento?.backendId ?? evento?.id ?? ""}`
                : "Registro Clínico"}
            </h2>
          </div>
          <button className="sl-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="sl-modal__body sl-form">
          <div className="sl-form__grid-2">
            <div className="sl-form__row">
              <label className="sl-form__label">Código Animal *</label>
              <input
                className="sl-form__input"
                placeholder="Ej: A-112"
                value={form.animalCod}
                onChange={(e) => set("animalCod", e.target.value)}
                disabled={loadingGanados}
              />
              {errores.animalCod && (
                <small className="sl-form__error">{errores.animalCod}</small>
              )}
              {errores.ganado_id && (
                <small className="sl-form__error">{errores.ganado_id}</small>
              )}
              {errorGanado && !errores.ganado_id && (
                <small className="sl-form__error">{errorGanado}</small>
              )}
              {ganadoCoincidente && (
                <small className="sl-form__success">
                  Ganado encontrado: {ganadoCoincidente.codigo}
                  {ganadoCoincidente.nombre
                    ? ` · ${ganadoCoincidente.nombre}`
                    : ""}
                </small>
              )}
            </div>

            <div className="sl-form__row">
              <label className="sl-form__label">Fecha *</label>
              <input
                className="sl-form__input"
                type="date"
                value={form.fechaISO}
                onChange={(e) => set("fechaISO", e.target.value)}
              />
              {errores.fechaISO && (
                <small className="sl-form__error">{errores.fechaISO}</small>
              )}
            </div>
          </div>

          <div className="sl-form__grid-2">
            <div className="sl-form__row">
              <label className="sl-form__label">Tipo de Evento *</label>
              <select
                className="sl-form__select"
                value={form.tipo}
                onChange={(e) => set("tipo", e.target.value)}
              >
                {TIPOS.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>
              {errores.tipo && (
                <small className="sl-form__error">{errores.tipo}</small>
              )}
            </div>

            <div className="sl-form__row">
              <label className="sl-form__label">Próxima Fecha</label>
              <input
                className="sl-form__input"
                type="date"
                value={form.proxima_fecha}
                onChange={(e) => set("proxima_fecha", e.target.value)}
              />
            </div>
          </div>

          <div className="sl-form__row">
            <label className="sl-form__label">Descripción / Observaciones</label>
            <textarea
              className="sl-form__textarea"
              rows={3}
              placeholder="Describe el procedimiento, diagnóstico o tratamiento realizado..."
              value={form.descripcion}
              onChange={(e) => set("descripcion", e.target.value)}
            />
          </div>

          <div className="sl-form__grid-2">
            <div className="sl-form__row">
              <label className="sl-form__label">Dosis</label>
              <input
                className="sl-form__input"
                placeholder="Ej: 5 ml"
                value={form.dosis}
                onChange={(e) => set("dosis", e.target.value)}
              />
            </div>

            <div className="sl-form__row">
              <label className="sl-form__label">Vía de Administración</label>
              <input
                className="sl-form__input"
                placeholder="Ej: Intramuscular"
                value={form.via_administracion}
                onChange={(e) => set("via_administracion", e.target.value)}
              />
            </div>
          </div>

          <div className="sl-form__row">
            <label className="sl-form__label">Costo</label>
            <input
              className="sl-form__input"
              type="number"
              min="0"
              step="0.01"
              placeholder="Ej: 25000"
              value={form.costo}
              onChange={(e) => set("costo", e.target.value)}
            />
            {errores.costo && (
              <small className="sl-form__error">{errores.costo}</small>
            )}
          </div>

          {loadingGanados && (
            <small className="sl-form__helper">Cargando ganado existente...</small>
          )}
        </div>

        <div className="sl-modal__footer">
          <button className="sl-btn sl-btn--ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="sl-btn sl-btn--primary" onClick={handleSubmit}>
            {esEdicion ? "Guardar Cambios" : "Crear Evento"}
          </button>
        </div>
      </div>
    </div>
  );
}