import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { getUsuarioActual } from "../services/AuthService";

// Layout
import PrivateLayout from "../components/layout/PrivateLayout";

// Páginas públicas
import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import ForgotPassword from "../pages/public/ForgotPassword";
import ResetPassword from "../pages/public/ResetPassword";

// Dashboard
import DashBoard from "../pages/private/dashboard/DashBoard";

// Módulos privados
import ListadoGanado from "../pages/private/ganado/ListadoGanado";
import ListadoAlimentacion from "../pages/private/alimentacion/ListadoAlimentacion";
import ListadoEventos from "../pages/private/eventos/ListadoEventos";
import ListadoInventario from "../pages/private/inventario/ListadoInventario";
import Reproduccion from "../pages/private/reproduccion/Reproduccion";
import CockpitFinanciero from "../pages/private/finanzas/CockpitFinanciero";
import Potreros from "../pages/private/pasturas/Potreros";
import ListadoVentas from "../pages/private/ventas/ListadoVentas";
import Configuracion from "../pages/private/configuracion/Configuracion";

function ProtectedPermission({ permiso, children }) {
  const usuario = getUsuarioActual();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (usuario?.rol === "Administrador") {
    return children;
  }

  const permisos = usuario?.permisos || [];

  if (!permiso || permisos.includes(permiso)) {
    return children;
  }

  return <Navigate to="/dashboard" replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Públicas ── */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ── Privadas ── */}
        <Route element={<PrivateLayout />}>
          <Route path="/dashboard" element={<DashBoard />} />

          <Route
            path="/ganado"
            element={
              <ProtectedPermission permiso="ganado.ver">
                <ListadoGanado />
              </ProtectedPermission>
            }
          />

          <Route
            path="/alimentacion"
            element={
              <ProtectedPermission permiso="alimentacion.ver">
                <ListadoAlimentacion />
              </ProtectedPermission>
            }
          />

          <Route
            path="/eventos"
            element={
              <ProtectedPermission permiso="salud.ver">
                <ListadoEventos />
              </ProtectedPermission>
            }
          />

          <Route
            path="/inventario"
            element={
              <ProtectedPermission permiso="productos.ver">
                <ListadoInventario />
              </ProtectedPermission>
            }
          />

          <Route
            path="/reproduccion"
            element={
              <ProtectedPermission permiso="reproduccion.ver">
                <Reproduccion />
              </ProtectedPermission>
            }
          />

          <Route
            path="/finanzas"
            element={
              <ProtectedPermission permiso="dashboard.ver">
                <CockpitFinanciero />
              </ProtectedPermission>
            }
          />

          <Route
            path="/pasturas"
            element={
              <ProtectedPermission permiso="potreros.ver">
                <Potreros />
              </ProtectedPermission>
            }
          />

          <Route
            path="/ventas"
            element={
              <ProtectedPermission permiso="ventas.ver">
                <ListadoVentas />
              </ProtectedPermission>
            }
          />

          <Route
            path="/configuracion/finca"
            element={
              <ProtectedPermission permiso="configuracion.ver">
                <Configuracion />
              </ProtectedPermission>
            }
          />

          <Route
            path="/configuracion/usuarios"
            element={
              <ProtectedPermission permiso="usuarios.ver">
                <Configuracion />
              </ProtectedPermission>
            }
          />
        </Route>

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}