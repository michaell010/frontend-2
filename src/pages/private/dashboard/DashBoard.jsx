import { useDashboard } from "./hooks/useDashboard";
import DashboardHeader from "./components/DashboardHeader";
import DashboardKPIs from "./components/DashboardKPIs";
import DashboardAlertas from "./components/DashboardAlertas";
import DashboardModulos from "./components/DashboardModulos";
import "../../../styles/modules/Dashboard.css";

export default function DashBoard() {
  const {
    nombre,
    rol,
    finca,
    inicial,
    saludo,
    fecha,
    kpis,
    alertas,
    modulos,
    alertasActivas,
    loading,
    error,
  } = useDashboard();

  if (loading) {
    return <div className="db-animate-in">Cargando dashboard...</div>;
  }

  if (error) {
    return <div className="db-animate-in">No se pudo cargar el dashboard.</div>;
  }

  return (
    <div className="db-animate-in">
      <DashboardHeader
        saludo={saludo}
        nombre={nombre}
        fecha={fecha}
        finca={finca}
        inicial={inicial}
        rol={rol}
      />

      <DashboardKPIs kpis={kpis} />
      <DashboardAlertas alertas={alertas} alertasActivas={alertasActivas} />
      <DashboardModulos modulos={modulos} />
    </div>
  );
}