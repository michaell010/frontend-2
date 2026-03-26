import { useEffect, useState } from "react";
import {
  getFinca,
  updateFinca,
  getPerfilActual,
  updatePerfil,
} from "../../../../services/ConfiguracionService";
import { FINCA_FIELDS } from "../configuracion.constants";

export function ConfigFinca({ esAdmin, showToast }) {
  const [fincaDraft, setFincaDraft] = useState({
    nombre: "",
    municipio: "",
    departamento: "",
    propietario: "",
    prefijo: "",
  });

  const [perfilDraft, setPerfilDraft] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
    rol: "",
    finca: "",
    contrasena: "",
  });

  const [perfil, setPerfil] = useState({
    nombres: "",
    apellidos: "",
    nombreCompleto: "",
    correo: "",
    rol: "",
    finca: "",
  });

  useEffect(() => {
    const cargar = async () => {
      try {
        const [fincaData, perfilData] = await Promise.all([
          getFinca(),
          getPerfilActual(),
        ]);

        setFincaDraft(fincaData);
        setPerfilDraft({ ...perfilData, contrasena: "" });
        setPerfil(perfilData);
      } catch (e) {
        showToast("❌ No se pudo cargar la configuración");
      }
    };

    cargar();
  }, []);

  const setF = (key) => (e) =>
    setFincaDraft((prev) => ({ ...prev, [key]: e.target.value }));

  const setP = (key) => (e) =>
    setPerfilDraft((prev) => ({ ...prev, [key]: e.target.value }));

  const guardarFinca = async () => {
    try {
      const actualizada = await updateFinca(fincaDraft);
      setFincaDraft(actualizada);
      showToast("✅ Datos de la finca actualizados");
    } catch (e) {
      showToast(e?.response?.data?.mensaje || "❌ No se pudo actualizar la finca");
    }
  };

  const guardarPerfil = async () => {
    try {
      const actualizado = await updatePerfil(perfilDraft);
      setPerfil(actualizado);
      setPerfilDraft({ ...actualizado, contrasena: "" });
      showToast("✅ Perfil actualizado correctamente");
    } catch (e) {
      showToast(e?.response?.data?.mensaje || "❌ No se pudo actualizar el perfil");
    }
  };

  return (
    <div className="cfg-grid-2">
      <div className="gc-card cfg-card-section">
        <div className="cfg-card-section__head">
          <span className="cfg-section-icon">🏡</span>
          <h3 className="cfg-section-title">Información de la Finca</h3>
        </div>

        <div className="cfg-fields-stack">
          {FINCA_FIELDS.map(({ label, key }) => (
            <div key={key} className="cfg-field">
              <label className="gc-label">{label}</label>
              <input
                className="gc-input"
                value={fincaDraft[key] || ""}
                readOnly={!esAdmin}
                disabled={!esAdmin}
                onChange={esAdmin ? setF(key) : undefined}
              />
            </div>
          ))}
        </div>

        {esAdmin && (
          <div className="cfg-card-section__foot">
            <button className="gc-btn gc-btn--primary" onClick={guardarFinca}>
              Guardar cambios
            </button>
          </div>
        )}
      </div>

      <div className="gc-card cfg-card-section">
        <div className="cfg-card-section__head">
          <span className="cfg-section-icon">👤</span>
          <h3 className="cfg-section-title">Perfil del Usuario</h3>
        </div>

        <div className="cfg-perfil-hero">
          <div
            className="cfg-avatar"
            style={{ width: 56, height: 56, fontSize: 22, borderRadius: 16 }}
          >
            {(perfil.nombres || "U").charAt(0)}
          </div>
          <div>
            <div className="cfg-perfil-name">
              {perfil.nombreCompleto || `${perfil.nombres} ${perfil.apellidos}`.trim()}
            </div>
            <span className="gc-badge gc-badge--success">{perfil.rol}</span>
          </div>
        </div>

        <div className="cfg-fields-stack">
          <div className="cfg-field">
            <label className="gc-label">Nombres</label>
            <input
              className="gc-input"
              value={perfilDraft.nombres || ""}
              onChange={setP("nombres")}
            />
          </div>

          <div className="cfg-field">
            <label className="gc-label">Apellidos</label>
            <input
              className="gc-input"
              value={perfilDraft.apellidos || ""}
              onChange={setP("apellidos")}
            />
          </div>

          <div className="cfg-field">
            <label className="gc-label">Correo</label>
            <input
              className="gc-input"
              value={perfilDraft.correo || ""}
              onChange={setP("correo")}
            />
          </div>

          <div className="cfg-field">
            <label className="gc-label">Finca</label>
            <input className="gc-input" value={perfilDraft.finca || ""} readOnly />
          </div>

          <div className="cfg-field">
            <label className="gc-label">Nueva Contraseña</label>
            <input
              className="gc-input"
              type="password"
              placeholder="••••••••"
              value={perfilDraft.contrasena || ""}
              onChange={setP("contrasena")}
            />
          </div>
        </div>

        <div className="cfg-card-section__foot">
          <button className="gc-btn gc-btn--primary" onClick={guardarPerfil}>
            Actualizar perfil
          </button>
        </div>
      </div>
    </div>
  );
}