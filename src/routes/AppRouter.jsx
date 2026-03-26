import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layout
import PrivateLayout from "../components/layout/PrivateLayout";

// Páginas públicas
import Home  from "../pages/public/Home";
import Login from "../pages/public/Login";

// Dashboard
import DashBoard from "../pages/private/dashboard/DashBoard";

// Módulos privados
import ListadoGanado    from "../pages/private/ganado/ListadoGanado";
import ListadoAlimentacion    from "../pages/private/alimentacion/ListadoAlimentacion";
import ListadoEventos   from "../pages/private/eventos/ListadoEventos";
import ListadoInventario from "../pages/private/inventario/ListadoInventario";
import Reproduccion     from "../pages/private/reproduccion/Reproduccion";
import CockpitFinanciero from "../pages/private/finanzas/CockpitFinanciero";
import Potreros     from "../pages/private/pasturas/Potreros";
import ListadoVentas    from "../pages/private/ventas/ListadoVentas";
import Configuracion    from "../pages/private/configuracion/Configuracion";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Públicas ── */}
        <Route path="/"      element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* ── Privadas ── */}
        <Route element={<PrivateLayout />}>
          <Route path="/dashboard"    element={<DashBoard />} />
          <Route path="/ganado"       element={<ListadoGanado />} />
          <Route path="/alimentacion" element={<ListadoAlimentacion />} />
          <Route path="/eventos"      element={<ListadoEventos />} />
          <Route path="/inventario"   element={<ListadoInventario />} />
          <Route path="/reproduccion" element={<Reproduccion />} />
          <Route path="/finanzas"     element={<CockpitFinanciero />} />
          <Route path="/pasturas"     element={<Potreros />} />
          <Route path="/ventas"       element={<ListadoVentas />} />
          <Route path="/configuracion/finca"    element={<Configuracion />} />
          <Route path="/configuracion/usuarios" element={<Configuracion />} />
        </Route>

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}