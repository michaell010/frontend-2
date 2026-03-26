import { useEffect, useState } from "react";
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  toggleUsuarioActivo,
  deleteUsuario,
} from "../../../../services/ConfiguracionService";
import { USUARIO_VACIO } from "../configuracion.constants";

export function useUsuarios(showToast) {
  const [usuarios, setUsuarios] = useState([]);
  const [modalUsuario, setModalUsuario] = useState(null);
  const [draft, setDraft] = useState(USUARIO_VACIO);
  const [confirmElim, setConfirmElim] = useState(null);

  const cargarUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (e) {
      showToast("❌ No se pudieron cargar los usuarios");
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const abrirNuevo = () => {
    setDraft({ ...USUARIO_VACIO });
    setModalUsuario("nuevo");
  };

  const abrirEditar = (u) => {
    setDraft({
      ...u,
      contrasena: "",
    });
    setModalUsuario(u);
  };

  const cerrarModal = () => setModalUsuario(null);

  const guardar = async () => {
    try {
      if (!draft.nombre?.trim() || !draft.correo?.trim()) {
        showToast("⚠️ Nombre y correo son obligatorios");
        return;
      }

      if (!draft.rol_id) {
        showToast("⚠️ Debe seleccionar un rol");
        return;
      }

      if (!draft.finca_id) {
        showToast("⚠️ Debe indicar la finca");
        return;
      }

      if (modalUsuario === "nuevo" && !draft.contrasena?.trim()) {
        showToast("⚠️ La contraseña es obligatoria al crear");
        return;
      }

      if (modalUsuario === "nuevo") {
        await createUsuario(draft);
        showToast("✅ Usuario creado correctamente");
      } else {
        await updateUsuario(draft.id, draft);
        showToast("✅ Usuario actualizado correctamente");
      }

      await cargarUsuarios();
      cerrarModal();
    } catch (e) {
      showToast(e?.response?.data?.mensaje || "❌ Error al guardar usuario");
    }
  };

  const toggle = async (id) => {
    try {
      const actual = usuarios.find((u) => u.id === id);
      if (!actual) return;

      await toggleUsuarioActivo(id, !actual.activo);
      await cargarUsuarios();
      showToast("✅ Estado actualizado");
    } catch (e) {
      showToast("❌ No se pudo cambiar el estado");
    }
  };

  const eliminar = async (id) => {
    try {
      await deleteUsuario(id);
      await cargarUsuarios();
      showToast("🗑️ Usuario eliminado");
    } catch (e) {
      showToast("❌ No se pudo eliminar el usuario");
    }
  };

  return {
    usuarios,
    modalUsuario,
    draft,
    setDraft,
    confirmElim,
    setConfirmElim,
    abrirNuevo,
    abrirEditar,
    cerrarModal,
    guardar,
    toggle,
    eliminar,
  };
}