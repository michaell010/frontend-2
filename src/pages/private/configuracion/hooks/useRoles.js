import { useEffect, useState } from "react";
import { getRoles, updateRol } from "../../../../services/ConfiguracionService";

export function useRoles(showToast) {
  const [roles, setRoles] = useState([]);
  const [modalRol, setModalRol] = useState(null);
  const [draft, setDraft] = useState(null);
  const [nuevoPermiso, setNuevoPermiso] = useState("");

  const cargarRoles = async () => {
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (e) {
      showToast("❌ No se pudieron cargar los roles");
    }
  };

  useEffect(() => {
    cargarRoles();
  }, []);

  const abrirEditar = (r) => {
    setDraft({ ...r, permisos: [...r.permisos] });
    setModalRol(r);
  };

  const cerrarModal = () => setModalRol(null);

  const guardar = async () => {
    try {
      if (!draft.nombre.trim()) {
        showToast("⚠️ El nombre del rol es obligatorio");
        return;
      }

      await updateRol(draft.id, draft);
      await cargarRoles();
      showToast("✅ Rol actualizado correctamente");
      cerrarModal();
    } catch (e) {
      showToast("❌ No se pudo actualizar el rol");
    }
  };

  const agregarPermiso = () => {
    if (!nuevoPermiso.trim()) return;
    if (draft.permisos.includes(nuevoPermiso.trim())) {
      showToast("⚠️ Permiso ya existe");
      return;
    }
    setDraft((p) => ({ ...p, permisos: [...p.permisos, nuevoPermiso.trim()] }));
    setNuevoPermiso("");
  };

  const quitarPermiso = (p) => {
    setDraft((prev) => ({
      ...prev,
      permisos: prev.permisos.filter((x) => x !== p),
    }));
  };

  return {
    roles, modalRol, draft, setDraft,
    nuevoPermiso, setNuevoPermiso,
    abrirEditar, cerrarModal, guardar, agregarPermiso, quitarPermiso,
  };
}