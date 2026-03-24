// src/pages/private/ganado/components/GanadoTabla.jsx

import Badge        from "../ui/Badge";
import AccionesMenu from "../ui/AccionesMenu";

const COLS = [
  { key: "foto",       label: "Foto",       sortable: false },
  { key: "codigo",     label: "Código",     sortable: true  },
  { key: "nombre",     label: "Nombre",     sortable: true  },
  { key: "categoria",  label: "Categoría",  sortable: true  },
  { key: "raza",       label: "Raza",       sortable: true  },
  { key: "sexo",       label: "Sexo",       sortable: true  },
  { key: "peso_actual",label: "Peso (kg)",  sortable: true  },
  { key: "potrero_id", label: "Potrero ID", sortable: true  },
  { key: "estado",     label: "Estado",     sortable: false },
];

const FALLBACK = "/images/ganado-fallback.png";

function FotoCell({ src, alt }) {
  return (
    <img
      src={src && src !== "null" && src !== "undefined" && src.trim() !== "" ? src : FALLBACK}
      alt={alt}
      className="gc-table__thumb"
      onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK; }}
    />
  );
}

export default function GanadoTabla({ filas, sortCol, sortDir, onSort, onVerDetalle, onEditar, onEliminar }) {
  return (
    <div className="gc-table-wrap">
      <table className="gc-table">
        <thead>
          <tr>
            {COLS.map(c => (
              <th
                key={c.key}
                className={sortCol === c.key ? "sorted" : ""}
                onClick={() => c.sortable && onSort(c.key)}
                style={!c.sortable ? { cursor: "default" } : {}}
              >
                {c.label}
                {c.sortable && (
                  <span className="sort-ico">
                    {sortCol === c.key ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
                  </span>
                )}
              </th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {filas.length === 0 ? (
            <tr>
              <td colSpan={10} className="gc-table__empty">
                😔 No se encontraron animales con los filtros actuales
              </td>
            </tr>
          ) : filas.map(a => (
            <tr key={a.id} onClick={() => onVerDetalle(a)}>

              {/* Foto */}
              <td><FotoCell src={a.foto} alt={a.nombre || a.codigo || "Animal"} /></td>

              {/* Datos */}
              <td className="cell-id">{a.codigo || a.id}</td>
              <td className="cell-nombre">{a.nombre || "Sin nombre"}</td>
              <td>{a.categoria || "-"}</td>
              <td>{a.raza     || "-"}</td>
              <td>{a.sexo     || "-"}</td>
              <td className="cell-num">{a.peso_actual ?? a.peso ?? "-"}</td>
              <td>{a.potrero_id || "-"}</td>

              {/* Estado → Badge recibe el animal completo para resolver prioridad */}
              <td>
                <Badge animal={a} />
              </td>

              {/* Acciones */}
              <td onClick={e => e.stopPropagation()}>
                <AccionesMenu
                  animal={a}
                  onVer={onVerDetalle}
                  onEditar={onEditar}
                  onEliminar={onEliminar}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}