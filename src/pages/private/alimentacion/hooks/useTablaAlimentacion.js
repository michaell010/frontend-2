import { useState, useMemo, useEffect } from "react";
import { PER_PAGE } from "../alimentacion.constants";

const FILTROS_VACIOS = { tipos: [], tiposAnimal: [] };

export default function useTablaAlimentacion(registros = []) {
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState(FILTROS_VACIOS);
  const [filtroOpen, setFiltroOpen] = useState(false);
  const [sortCol, setSortCol] = useState("id");
  const [sortDir, setSortDir] = useState("asc");
  const [pagina, setPagina] = useState(1);

  const toggleFiltro = (key, val) => {
    setFiltros((f) => ({
      ...f,
      [key]: f[key].includes(val)
        ? f[key].filter((x) => x !== val)
        : [...f[key], val],
    }));
    setPagina(1);
  };

  const limpiarFiltros = () => {
    setFiltros(FILTROS_VACIOS);
    setPagina(1);
  };

  const handleSort = (col) => {
    if (sortCol === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  const filtrados = useMemo(() => {
    let arr = registros.filter((r) => {
      const q = busqueda.toLowerCase().trim();

      const coincideBusqueda =
        !q ||
        String(r?.animal?.nombre ?? "").toLowerCase().includes(q) ||
        String(r?.animal?.codigo ?? "").toLowerCase().includes(q) ||
        String(r?.tipo_animal ?? "").toLowerCase().includes(q) ||
        String(r?.tipo_alimento ?? "").toLowerCase().includes(q) ||
        String(r?.nombre_alimento ?? "").toLowerCase().includes(q) ||
        String(r?.observaciones ?? "").toLowerCase().includes(q);

      const coincideTipo =
        !filtros.tipos.length || filtros.tipos.includes(r?.tipo_alimento);

      const coincideTipoAnimal =
        !filtros.tiposAnimal.length ||
        filtros.tiposAnimal.includes(r?.tipo_animal);

      return coincideBusqueda && coincideTipo && coincideTipoAnimal;
    });

    if (sortCol) {
      arr = [...arr].sort((a, b) => {
        let va = a?.[sortCol];
        let vb = b?.[sortCol];

        if (sortCol === "animal") {
          va = a?.animal?.nombre ?? "";
          vb = b?.animal?.nombre ?? "";
        }

        const na = Number(va);
        const nb = Number(vb);

        if (!Number.isNaN(na) && !Number.isNaN(nb) && va !== "" && vb !== "") {
          return sortDir === "asc" ? na - nb : nb - na;
        }

        return sortDir === "asc"
          ? String(va ?? "").localeCompare(String(vb ?? ""))
          : String(vb ?? "").localeCompare(String(va ?? ""));
      });
    }

    return arr;
  }, [registros, busqueda, filtros, sortCol, sortDir]);

  const totalPags = Math.max(1, Math.ceil(filtrados.length / PER_PAGE));
  const paginados = filtrados.slice((pagina - 1) * PER_PAGE, pagina * PER_PAGE);
  const filtrosActivos = filtros.tipos.length + filtros.tiposAnimal.length;

  useEffect(() => {
    if (pagina > totalPags) {
      setPagina(totalPags);
    }
  }, [pagina, totalPags]);

  return {
    busqueda,
    setBusqueda,
    filtros,
    filtroOpen,
    setFiltroOpen,
    toggleFiltro,
    limpiarFiltros,
    filtrosActivos,
    sortCol,
    sortDir,
    handleSort,
    filtrados,
    paginados,
    totalPags,
    pagina,
    setPagina,
  };
}