import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./modules/landing/pages/LandingPage";
import Empleos from "./modules/trabajos/pages/EmpleosPage";
import EmpleoDetalle from "./modules/trabajos/pages/EmpleoDetallePage";

import Login from "./modules/auth/pages/LoginPage";
import Registro from "./modules/auth/pages/RegistroPage";
import NotFound from "./pages/NotFound";
import DashboardEmpleado from "./modules/dashboard/empleado/pages/DashboardEmpleadoPage";
import DashboardEmpleador from "./modules/dashboard/empleador/pages/DashboardEmpleadorPage";
import PostulacionesEmpleado from "./modules/postulaciones/pages/MisPostulacionesPage";
import PerfilEmpleado from "./modules/perfiles/pages/PerfilEmpleadoPage";
import ConfiguracionEmpleado from "./modules/perfiles/pages/ConfiguracionEmpleadoPage";
import TrabajosEmpleador from "./modules/trabajos/pages/MisTrabajosPage";
import CrearTrabajo from "./modules/trabajos/pages/CrearTrabajoPage";
import EditarTrabajo from "./modules/trabajos/pages/EditarTrabajoPage";
import PerfilEmpleador from "./modules/perfiles/pages/PerfilEmpleadorPage";
import ConfiguracionEmpleador from "./modules/perfiles/pages/ConfiguracionEmpleadorPage";
import PostulacionesEmpleador from "./modules/postulaciones/pages/PostulacionesRecibidasPage";

import PerfilEmpresaPublico from "./modules/perfiles/pages/PerfilEmpresaPublicoPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Index />} />
          <Route path="/empleos" element={<Empleos />} />
          <Route path="/empleo/:id" element={<EmpleoDetalle />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route
            path="/empresa/:empleadorId"
            element={<PerfilEmpresaPublico />}
          />

          {/* Rutas protegidas - Requieren autenticación */}

          {/* Dashboard Empleado */}
          <Route
            path="/dashboard/empleado"
            element={
              <ProtectedRoute allowedRoles={["EMPLEADO"]}>
                <DashboardEmpleado />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/empleado/postulaciones"
            element={
              <ProtectedRoute allowedRoles={["EMPLEADO"]}>
                <PostulacionesEmpleado />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/empleado/perfil"
            element={
              <ProtectedRoute allowedRoles={["EMPLEADO"]}>
                <PerfilEmpleado />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/empleado/configuracion"
            element={
              <ProtectedRoute allowedRoles={["EMPLEADO"]}>
                <ConfiguracionEmpleado />
              </ProtectedRoute>
            }
          />

          {/* Dashboard Empleador */}
          <Route
            path="/dashboard/empleador"
            element={
              <ProtectedRoute allowedRoles={["EMPLEADOR"]}>
                <DashboardEmpleador />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/empleador/trabajos"
            element={
              <ProtectedRoute allowedRoles={["EMPLEADOR"]}>
                <TrabajosEmpleador />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/empleador/crear-trabajo"
            element={
              <ProtectedRoute allowedRoles={["EMPLEADOR"]}>
                <CrearTrabajo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/empleador/editar-trabajo/:id"
            element={
              <ProtectedRoute allowedRoles={["EMPLEADOR"]}>
                <EditarTrabajo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/empleador/perfil"
            element={
              <ProtectedRoute allowedRoles={["EMPLEADOR"]}>
                <PerfilEmpleador />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/empleador/configuracion"
            element={
              <ProtectedRoute allowedRoles={["EMPLEADOR"]}>
                <ConfiguracionEmpleador />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/empleador/postulaciones"
            element={
              <ProtectedRoute allowedRoles={["EMPLEADOR"]}>
                <PostulacionesEmpleador />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
