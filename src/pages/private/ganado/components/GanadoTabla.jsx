import Badge from "../ui/Badge";
import AccionesMenu from "../ui/AccionesMenu";
import defaultCow from "../../../../assets/default-cow.png";

const COLS = [
  { key: "foto", label: "Foto" },
  { key: "codigo", label: "Código" },
  { key: "nombre", label: "Nombre" },
  { key: "categoria", label: "Categoría" },
  { key: "raza", label: "Raza" },
  { key: "sexo", label: "Sexo" },
  { key: "peso_actual", label: "Peso (kg)" },
  { key: "potrero_id", label: "Potrero ID" },
  { key: "estado", label: "Estado" },
];

const getFoto = (a) => {
  if (!a?.foto_url) return defaultCow;

  if (a.foto_url.startsWith("http")) return a.foto_url;

  const base = import.meta.env.VITE_API_BASE || "http://localhost:3000";
  return `${base}${a.foto_url}`;
};

export default function GanadoTabla({
  filas,
  sortCol,
  sortDir,
  onSort,
  onVerDetalle,
  onEditar,
  onEliminar,
}) {
  return (
    <div className="gc-table-wrap">
      <table className="gc-table">
        <thead>
          <tr>
            {COLS.map((c) => (
              <th
                key={c.key}
                className={sortCol === c.key ? "sorted" : ""}
                onClick={c.key !== "foto" ? () => onSort(c.key) : undefined}
                style={c.key === "foto" ? { cursor: "default" } : {}}
              >
                {c.label}
                {c.key !== "foto" && (
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
          ) : (
            filas.map((a) => (
              <tr key={a.id} onClick={() => onVerDetalle(a)}>
                <td>
                  <img
                    src={getFoto(a)}
                    alt={a.nombre || a.codigo}
                    style={{
                      width: "46px",
                      height: "46px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      background: "#f8fafc",
                    }}
                    onError={(e) => {
                      e.currentTarget.src = defaultCow;
                    }}
                  />
                </td>

                <td className="cell-id">{a.codigo || a.id}</td>
                <td className="cell-nombre">{a.nombre || "Sin nombre"}</td>
                <td>{a.categoria || "-"}</td>
                <td>{a.raza || "-"}</td>
                <td>{a.sexo || "-"}</td>
                <td className="cell-num">{a.peso_actual ?? a.peso ?? "-"}</td>
                <td>{a.potrero_id || "-"}</td>
                <td>
                  <Badge estado={a.estado} />
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <AccionesMenu
                    animal={a}
                    onVer={onVerDetalle}
                    onEditar={onEditar}
                    onEliminar={onEliminar}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}