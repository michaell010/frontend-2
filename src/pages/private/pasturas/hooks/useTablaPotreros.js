import { useMemo, useState } from "react";

export default function useTablaPotreros(lista = []) {
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [pagina, setPagina] = useState(1);
  const [porPagina] = useState(6);
  const [sortBy, setSortBy] = useState("nombre");
  const [sortDir, setSortDir] = useState("asc");

  const toggleSort = (campo) => {
    if (sortBy === campo) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }

    setSortBy(campo);
    setSortDir("asc");
  };

  const filtrados = useMemo(() => {
    let arr = [...lista];

    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      arr = arr.filter(
        (p) =>
          p.nombre?.toLowerCase().includes(q) ||
          p.tipo_pasto?.toLowerCase().includes(q) ||
          String(p.id).includes(q)
      );
    }

    if (estadoFiltro !== "Todos") {
      arr = arr.filter((p) => p.estado === estadoFiltro);
    }

    arr.sort((a, b) => {
      const aVal = a?.[sortBy] ?? "";
      const bVal = b?.[sortBy] ?? "";

      if (typeof aVal === "number" || typeof bVal === "number") {
        return sortDir === "asc" ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
      }

      return sortDir === "asc"
        ? String(aVal).localeCompare(String(bVal), "es")
        : String(bVal).localeCompare(String(aVal), "es");
    });

    return arr;
  }, [lista, busqueda, estadoFiltro, sortBy, sortDir]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / porPagina));

  const paginados = useMemo(() => {
    const inicio = (pagina - 1) * porPagina;
    const fin = inicio + porPagina;
    return filtrados.slice(inicio, fin);
  }, [filtrados, pagina, porPagina]);

  const limpiarFiltros = () => {
    setBusqueda("");
    setEstadoFiltro("Todos");
    setPagina(1);
    setSortBy("nombre");
    setSortDir("asc");
  };

  return {
    busqueda,
    setBusqueda,
    estadoFiltro,
    setEstadoFiltro,
    pagina,
    setPagina,
    porPagina,
    sortBy,
    sortDir,
    toggleSort,
    filtrados,
    paginados,
    totalPaginas,
    limpiarFiltros,
  };
}