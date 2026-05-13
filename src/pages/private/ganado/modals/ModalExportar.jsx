import { useState } from "react";
import { ganadoService } from "../../../../services/ganado.service";
import { notify } from "../../../../services/notify.service";
import { getErrorMessage } from "../../../../utils/handleRequest";

const OPCIONES = [
  { fmt: "csv", label: "CSV", ico: "📄", desc: "Valores separados por coma. Compatible con Excel y Sheets." },
  { fmt: "excel", label: "Excel", ico: "📊", desc: "Libro de Excel (.xlsx) con formato." },
  { fmt: "pdf", label: "PDF", ico: "🗒️", desc: "Reporte imprimible en PDF." },
  { fmt: "json", label: "JSON", ico: "💾", desc: "Datos estructurados para integraciones." },
];

const escaparCSV = (valor) => {
  const texto = String(valor ?? "");
  if (texto.includes(",") || texto.includes('"') || texto.includes("\n")) {
    return `"${texto.replace(/"/g, '""')}"`;
  }
  return texto;
};

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
      a.codigo,
      a.nombre,
      a.categoria,
      a.raza,
      a.sexo,
      a.peso_actual ?? a.peso ?? "",
      a.fecha_nacimiento,
      a.potrero_id,
      a.estado,
      a.observaciones ?? a.notas ?? "",
    ]
      .map(escaparCSV)
      .join(",")
  );

  const contenido = [headers.map(escaparCSV).join(","), ...rows].join("\n");
  const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "ganado.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

const exportarJSON = (animales) => {
  const blob = new Blob([JSON.stringify(animales, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "ganado.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

export default function ModalExportar({ animales = [], onClose }) {
  const [loading, setLoading] = useState(null);

  const handleExport = async (fmt) => {
    try {
      setLoading(fmt);

      if (!animales.length) {
        notify.error("No hay registros para exportar");
        return;
      }

      if (fmt === "CSV") {
        exportarCSV(animales);
        notify.success(`CSV exportado — ${animales.length} registros`);
        return;
      }

      if (fmt === "JSON") {
        exportarJSON(animales);
        notify.success(`JSON exportado — ${animales.length} registros`);
        return;
      }

      await ganadoService.exportar(fmt, animales);
      notify.success(`${fmt} preparado correctamente`);
    } catch (err) {
      notify.error(getErrorMessage(err) || `No se pudo exportar en ${fmt}`);
    } finally {
      setLoading(null);
      onClose();
    }
  };

  return (
    <div
      className="gc-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="gc-modal gc-modal--md">
        <div className="gc-modal__header">
          <div>
            <div className="gc-modal__title">Exportar Inventario</div>
            <div className="gc-modal__subtitle">
              {animales.length} registros listos para exportar
            </div>
          </div>

          <button className="gc-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="gc-modal__body">
          <div className="gc-export-opts">
            {OPCIONES.map((o) => (
              <button
                key={o.fmt}
                type="button"
                className="gc-export-opt"
                onClick={() => handleExport(o.fmt)}
                disabled={Boolean(loading)}
              >
                <div className="gc-export-opt__ico">
                  {loading === o.fmt ? "⏳" : o.ico}
                </div>

                <div>
                  <div className="gc-export-opt__name">{o.fmt}</div>
                  <div className="gc-export-opt__desc">{o.desc}</div>
                </div>

                <span className="gc-export-opt__arrow">→</span>
              </button>
            ))}
          </div>
        </div>

        <div className="gc-modal__footer">
          <button
            className="gc-btn gc-btn--secondary"
            onClick={onClose}
            disabled={Boolean(loading)}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}