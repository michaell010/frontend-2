import { useMemo, useState } from "react";
import "../../../../styles/modules/Ventas.css";

const ESTADOS = ["Pendiente", "Completado"];
const TIPOS_ITEM = ["ganado", "producto", "produccion"];

const crearItemVacio = () => ({
  tempId: crypto.randomUUID(),
  tipo: "ganado",
  codigo: "",
  ref_id: "",
  cantidad: "",
  precio: "",
  precio_unitario: "",
});

export default function VentasModalForm({ venta, onClose, onGuardar }) {
  const esEdicion = !!venta?.venta_id;

  const itemsIniciales = Array.isArray(venta?.items)
    ? venta.items.map((item) => ({
        tempId: item?.tempId || crypto.randomUUID(),
        tipo: item?.tipo || "ganado",
        codigo: item?.codigo || "",
        ref_id: item?.ref_id ?? "",
        cantidad: item?.cantidad ?? "",
        precio: item?.precio ?? "",
        precio_unitario: item?.precio_unitario ?? "",
      }))
    : [];

  const [form, setForm] = useState({
    cliente: venta?.cliente ?? "",
    fecha: venta?.fechaISO ?? new Date().toISOString().split("T")[0],
    estado: venta?.estado ?? "Pendiente",
    notas: venta?.notas ?? "",
    items: itemsIniciales,
  });

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const agregarItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...(Array.isArray(prev.items) ? prev.items : []), crearItemVacio()],
    }));
  };

  const actualizarItem = (tempId, campo, valor) => {
    setForm((prev) => ({
      ...prev,
      items: (Array.isArray(prev.items) ? prev.items : []).map((it) =>
        it.tempId === tempId ? { ...it, [campo]: valor } : it
      ),
    }));
  };

  const cambiarTipoItem = (tempId, nuevoTipo) => {
    setForm((prev) => ({
      ...prev,
      items: (Array.isArray(prev.items) ? prev.items : []).map((it) =>
        it.tempId === tempId
          ? {
              ...it,
              tipo: nuevoTipo,
              codigo: "",
              ref_id: "",
              cantidad: "",
              precio: "",
              precio_unitario: "",
            }
          : it
      ),
    }));
  };

  const eliminarItem = (tempId) => {
    setForm((prev) => ({
      ...prev,
      items: (Array.isArray(prev.items) ? prev.items : []).filter(
        (it) => it.tempId !== tempId
      ),
    }));
  };

  const totalVisual = useMemo(() => {
    const items = Array.isArray(form.items) ? form.items : [];

    return items.reduce((acc, item) => {
      if (item.tipo === "ganado") {
        return acc + Number(item.precio || 0);
      }

      return (
        acc +
        Number(item.cantidad || 0) * Number(item.precio_unitario || 0)
      );
    }, 0);
  }, [form.items]);

  const construirPayloadBackend = () => {
    const ganadoItems = [];
    const productoItems = [];
    const produccionItems = [];

    const items = Array.isArray(form.items) ? form.items : [];

    for (const item of items) {
      if (item.tipo === "ganado") {
        if (
          !item.codigo?.trim() ||
          item.precio === "" ||
          Number(item.precio) <= 0
        ) {
          continue;
        }

        ganadoItems.push({
          codigo: item.codigo.trim(),
          precio: Number(item.precio),
        });
      }

      if (item.tipo === "producto") {
        if (
          !item.ref_id ||
          item.cantidad === "" ||
          item.precio_unitario === "" ||
          Number(item.cantidad) <= 0 ||
          Number(item.precio_unitario) <= 0
        ) {
          continue;
        }

        productoItems.push({
          producto_id: Number(item.ref_id),
          cantidad: Number(item.cantidad),
          precio_unitario: Number(item.precio_unitario),
        });
      }

      if (item.tipo === "produccion") {
        if (
          !item.ref_id ||
          item.cantidad === "" ||
          item.precio_unitario === "" ||
          Number(item.cantidad) <= 0 ||
          Number(item.precio_unitario) <= 0
        ) {
          continue;
        }

        produccionItems.push({
          produccion_id: Number(item.ref_id),
          cantidad: Number(item.cantidad),
          precio_unitario: Number(item.precio_unitario),
        });
      }
    }

    return {
      cliente: form.cliente.trim(),
      fecha: form.fecha,
      estado: form.estado,
      notas: form.notas?.trim() || "",
      ganadoItems,
      productoItems,
      produccionItems,
    };
  };

  const handleSubmit = async () => {
    if (!form.cliente.trim()) {
      alert("El cliente es obligatorio.");
      return;
    }

    if (!form.fecha) {
      alert("La fecha es obligatoria.");
      return;
    }

    if (!form.estado) {
      alert("El estado es obligatorio.");
      return;
    }

    const items = Array.isArray(form.items) ? form.items : [];

    if (items.length === 0) {
      alert("Debes agregar al menos un ítem.");
      return;
    }

    const payloadBackend = construirPayloadBackend();

    const totalItems =
      payloadBackend.ganadoItems.length +
      payloadBackend.productoItems.length +
      payloadBackend.produccionItems.length;

    if (totalItems === 0) {
      alert("Todos los ítems están incompletos o inválidos.");
      return;
    }

    await onGuardar({
      venta_id: venta?.venta_id ?? null,
      payloadBackend,
    });
  };

  const itemsRender = Array.isArray(form.items) ? form.items : [];

  return (
    <div className="vt-modal-overlay" onClick={onClose}>
      <div
        className="vt-modal vt-modal--form"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="vt-modal__header">
          <div>
            <p className="vt-modal__pre">
              {esEdicion ? "Editar Venta" : "Nueva Venta"}
            </p>
            <h2 className="vt-modal__title">
              {esEdicion ? venta?.id : "Registro de venta"}
            </h2>
          </div>
          <button className="vt-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="vt-modal__body vt-form">
          <div className="vt-form__grid-2">
            <div className="vt-form__row">
              <label className="vt-form__label">Cliente *</label>
              <input
                className="vt-form__input"
                value={form.cliente}
                onChange={(e) => set("cliente", e.target.value)}
                placeholder="Nombre del cliente"
              />
            </div>

            <div className="vt-form__row">
              <label className="vt-form__label">Fecha *</label>
              <input
                className="vt-form__input"
                type="date"
                value={form.fecha}
                onChange={(e) => set("fecha", e.target.value)}
              />
            </div>
          </div>

          <div className="vt-form__grid-2">
            <div className="vt-form__row">
              <label className="vt-form__label">Estado *</label>
              <select
                className="vt-form__select"
                value={form.estado}
                onChange={(e) => set("estado", e.target.value)}
              >
                {ESTADOS.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </div>

            <div className="vt-form__row">
              <label className="vt-form__label">Total estimado</label>
              <input
                className="vt-form__input"
                value={`$${totalVisual.toLocaleString("es-CO")}`}
                readOnly
              />
            </div>
          </div>

          <div className="vt-form__row">
            <label className="vt-form__label">Ítems de la venta</label>
            <button
              type="button"
              className="vt-btn vt-btn--outline"
              onClick={agregarItem}
            >
              + Agregar ítem
            </button>
          </div>

          {itemsRender.map((item, index) => (
            <div key={item.tempId} className="vt-form__item-box">
              <div className="vt-form__row" style={{ marginBottom: "10px" }}>
                <strong>Ítem #{index + 1}</strong>
              </div>

              <div className="vt-form__grid-2">
                <div className="vt-form__row">
                  <label className="vt-form__label">Tipo</label>
                  <select
                    className="vt-form__select"
                    value={item.tipo}
                    onChange={(e) => cambiarTipoItem(item.tempId, e.target.value)}
                  >
                    {TIPOS_ITEM.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {item.tipo !== "ganado" && (
                  <div className="vt-form__row">
                    <label className="vt-form__label">
                      {item.tipo === "producto"
                        ? "ID del producto"
                        : "ID de producción"}
                    </label>
                    <input
                      className="vt-form__input"
                      value={item.ref_id}
                      onChange={(e) =>
                        actualizarItem(item.tempId, "ref_id", e.target.value)
                      }
                      placeholder={item.tipo === "producto" ? "Ej: 1" : "Ej: 3"}
                    />
                  </div>
                )}
              </div>

              {item.tipo === "ganado" ? (
                <div className="vt-form__grid-2">
                  <div className="vt-form__row">
                    <label className="vt-form__label">Código del ganado *</label>
                    <input
                      className="vt-form__input"
                      value={item.codigo || ""}
                      onChange={(e) =>
                        actualizarItem(item.tempId, "codigo", e.target.value)
                      }
                      placeholder="Ej: GAN-001"
                    />
                  </div>

                  <div className="vt-form__row">
                    <label className="vt-form__label">Precio *</label>
                    <input
                      className="vt-form__input"
                      type="number"
                      min="0"
                      value={item.precio}
                      onChange={(e) =>
                        actualizarItem(item.tempId, "precio", e.target.value)
                      }
                      placeholder="Precio del animal"
                    />
                  </div>
                </div>
              ) : (
                <div className="vt-form__grid-2">
                  <div className="vt-form__row">
                    <label className="vt-form__label">Cantidad *</label>
                    <input
                      className="vt-form__input"
                      type="number"
                      min="0"
                      value={item.cantidad}
                      onChange={(e) =>
                        actualizarItem(item.tempId, "cantidad", e.target.value)
                      }
                      placeholder="Cantidad"
                    />
                  </div>

                  <div className="vt-form__row">
                    <label className="vt-form__label">Precio unitario *</label>
                    <input
                      className="vt-form__input"
                      type="number"
                      min="0"
                      value={item.precio_unitario}
                      onChange={(e) =>
                        actualizarItem(
                          item.tempId,
                          "precio_unitario",
                          e.target.value
                        )
                      }
                      placeholder="Precio unitario"
                    />
                  </div>
                </div>
              )}

              <div className="vt-form__row">
                <button
                  type="button"
                  className="vt-btn vt-btn--ghost"
                  onClick={() => eliminarItem(item.tempId)}
                >
                  Eliminar ítem
                </button>
              </div>
            </div>
          ))}

          <div className="vt-form__row">
            <label className="vt-form__label">Notas</label>
            <textarea
              className="vt-form__textarea"
              rows={3}
              value={form.notas}
              onChange={(e) => set("notas", e.target.value)}
              placeholder="Observaciones"
            />
          </div>
        </div>

        <div className="vt-modal__footer">
          <button className="vt-btn vt-btn--ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="vt-btn vt-btn--primary" onClick={handleSubmit}>
            {esEdicion ? "Guardar cambios" : "Crear venta"}
          </button>
        </div>
      </div>
    </div>
  );
}