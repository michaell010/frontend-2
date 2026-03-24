import { useState } from "react";
import { ganadoService } from "../../../../services/ganado.service";

const OPCIONES = [
  { fmt: "CSV", ico: "📄", desc: "Valores separados por coma. Compatible con Excel y Sheets." },
  { fmt: "Excel", ico: "📊", desc: "Libro de Excel (.xlsx) con formato." },
  { fmt: "PDF", ico: "🗒️", desc: "Reporte imprimible en PDF." },
  { fmt: "JSON", ico: "💾", desc: "Datos estructurados para integraciones." },
];

const exportarCSV = (animales) => {
  const headers = [
    "Código",
    "Nombre",
    "Categoría",
    "Raza",
    "Sexo",
    "PesoActual",
    "FechaNacimiento",
    "PotreroID",
    "Estado",
    "Observaciones",
  ];

  const rows = animales.map((a) =>
    [
      a.codigo || "",
      a.nombre || "",
      a.categoria || "",
      a.raza || "",
      a.sexo || "",
      a.peso_actual ?? a.peso ?? "",
      a.fecha_nacimiento || "",
      a.potrero_id || "",
      a.estado || "",
      a.observaciones || a.notas || "",
    ].join(",")
  );

  const blob = new Blob([[headers.join(","), ...rows].join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "ganado.csv";
  link.click();

  URL.revokeObjectURL(url);
};

const exportarJSON = (animales) => {
  const blob = new Blob([JSON.stringify(animales, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "ganado.json";
  link.click();

  URL.revokeObjectURL(url);
};

export default function ModalExportar({ animales, onClose, addToast }) {
  const [loading, setLoading] = useState(null);

  const handleExport = async (fmt) => {
    setLoading(fmt);

    try {
      if (fmt === "CSV") {
        exportarCSV(animales);
        addToast(`CSV exportado — ${animales.length} registros`, "success");
      } else if (fmt === "JSON") {
        exportarJSON(animales);
        addToast(`JSON exportado — ${animales.length} registros`, "success");
      } else {
        await ganadoService.exportar(fmt, animales);
        addToast(`${fmt} preparado correctamente`, "success");
      }
    } catch (err) {
      addToast(err?.mensaje || `No se pudo exportar en ${fmt}`, "error");
    } finally {
      setLoading(null);
      onClose();
    }
  };

  return (
    <div className="gc-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="gc-modal gc-modal--md">
        <div className="gc-modal__header">
          <div>
            <div className="gc-modal__title">Exportar Inventario</div>
            <div className="gc-modal__subtitle">{animales.length} registros listos para exportar</div>
          </div>
          <button className="gc-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="gc-modal__body">
          <div className="gc-export-opts">
            {OPCIONES.map((o) => (
              <div key={o.fmt} className="gc-export-opt" onClick={() => handleExport(o.fmt)}>
                <div className="gc-export-opt__ico">{loading === o.fmt ? "⏳" : o.ico}</div>
                <div>
                  <div className="gc-export-opt__name">{o.fmt}</div>
                  <div className="gc-export-opt__desc">{o.desc}</div>
                </div>
                <span className="gc-export-opt__arrow">→</span>
              </div>
            ))}
          </div>
        </div>

        <div className="gc-modal__footer">
          <button className="gc-btn gc-btn--secondary" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}