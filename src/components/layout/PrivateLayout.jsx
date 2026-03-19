import { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "../../services/AuthService";
import Sidebar from "./Sidebar";
import Navbar  from "./Navbar";
import "../../styles/Sidebar.css";

const PAGE_TITLES = {
  "/dashboard":              "Dashboard",
  "/ganado":                 "Control Ganadero",
  "/reproduccion":           "Reproducción y Genética",
  "/eventos":                "Salud y Sanidad",
  "/alimentacion":           "Alimentación",
  "/inventario":             "Inventario",
  "/pasturas":               "Potreros",
  "/ventas":                 "Ventas",
  "/finanzas":               "Cockpit Financiero",
  "/configuracion/finca":    "Configuración",
  "/configuracion/usuarios": "Usuarios",
};

export default function PrivateLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const pageTitle = PAGE_TITLES[location.pathname] || "GanaControl";

  return (
    <div className="gc-private-layout">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />
      <div className={`gc-main-content${collapsed ? " sidebar-collapsed" : ""}`}>
        <Navbar collapsed={collapsed} pageTitle={pageTitle} />
        <main className="gc-page-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
