import { useEffect, useState } from "react";
import { useToasts } from "./hooks/useToasts";
import { ConfiguracionTabs } from "./ui/ConfiguracionTabs";
import { ToastContainer } from "./ui/ToastContainer";
import { ConfigFinca } from "./components/ConfigFinca";
import { ConfigUsuarios } from "./components/ConfigUsuarios";
import { ConfigRoles } from "./components/ConfigRoles";
import { ConfigSistema } from "./components/ConfigSistema";
import { getRolActual } from "../../../services/ConfiguracionService";
import "../../../styles/modules/Modulos.css";

export default function Configuracion() {
  const [tab, setTab] = useState("Finca");
  const [esAdmin, setEsAdmin] = useState(false);
  const { toast, showToast, hideToast } = useToasts();

  useEffect(() => {
    const cargarRol = async () => {
      try {
        const rol = await getRolActual();
        setEsAdmin(rol === "Administrador");
      } catch (e) {
        setEsAdmin(false);
      }
    };

    cargarRol();
  }, []);

  const VIEWS = {
    Finca: <ConfigFinca esAdmin={esAdmin} showToast={showToast} />,
    Usuarios: <ConfigUsuarios esAdmin={esAdmin} showToast={showToast} />,
    Roles: <ConfigRoles esAdmin={esAdmin} showToast={showToast} />,
    Sistema: <ConfigSistema />,
  };

  return (
    <div className="gc-animate-in">
      <div className="cfg-page-header">
        <div>
          <h1 className="gc-page-title">⚙️ Configuración</h1>
          <p className="gc-page-sub">
            Administre la información de la finca, usuarios y roles del sistema.
          </p>
        </div>

        {esAdmin && (
          <div className="cfg-header-badge">
            <span className="cfg-header-badge__dot" />
            🛡️ Modo Administrador
          </div>
        )}
      </div>

      <ConfiguracionTabs tab={tab} setTab={setTab} />

      <div className="cfg-tab-content">{VIEWS[tab]}</div>

      <ToastContainer msg={toast} onHide={hideToast} />
    </div>
  );
}