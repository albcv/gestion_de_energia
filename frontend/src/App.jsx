//App.jsx

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Login } from './pages/login';
import { Inicio } from './pages/inicio';
import { Perfil } from './pages/perfil';
import { Navegación } from './components/Navegación';
import { PrivateRoute } from './components/PrivateRoute';
import { AdminRoute } from './components/AdminRoute';
import { AuthProvider, useAuth } from './components/Auth';
import { Consultas } from './pages/consultas';

// Gestión de Organismo
import { OrganismoIndex } from './pages/gestionar/organismo';
import { OrganismoForm } from './pages/gestionar/organismo/formulario';
import { OrganismoDetail } from './pages/gestionar/organismo/ver';

// Gestión de Provincias
import { ProvinciaIndex } from './pages/gestionar/provincia';
import { ProvinciaForm } from './pages/gestionar/provincia/formulario';
import { ProvinciaDetail } from './pages/gestionar/provincia/ver';

// Gestión de Municipios
import { MunicipioIndex } from './pages/gestionar/municipio';
import { MunicipioForm } from './pages/gestionar/municipio/formulario';
import { MunicipioDetail } from './pages/gestionar/municipio/ver';

// Gestión de Entidades
import { EntidadIndex } from './pages/gestionar/entidad';
import { EntidadForm } from './pages/gestionar/entidad/formulario';
import { EntidadDetail } from './pages/gestionar/entidad/ver';

// Gestión de Directores
import { DirectorIndex } from './pages/gestionar/director';
import { DirectorForm } from './pages/gestionar/director/formulario';
import { DirectorDetail } from './pages/gestionar/director/ver';

// Gestión de Servicios Eléctricos
import { ServicioElectricoIndex } from './pages/gestionar/servicio_electrico';
import { ServicioElectricoForm } from './pages/gestionar/servicio_electrico/formulario';
import { ServicioElectricoDetail } from './pages/gestionar/servicio_electrico/ver';

// Gestión de NAE
import { NAEIndex } from './pages/gestionar/nae';
import { NAEForm } from './pages/gestionar/nae/formulario';
import { NAEDetail } from './pages/gestionar/nae/ver';

// Gestión de Usuario
import { UsuarioIndex } from './pages/gestionar/usuario/index';
import { UsuarioForm } from './pages/gestionar/usuario/formulario';
import { UsuarioDetail } from './pages/gestionar/usuario/ver';

function AppContent() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const hideNavigationRoutes = ['/', '/login'];
  const shouldShowNavigation = !hideNavigationRoutes.includes(location.pathname) && isAuthenticated;

  return (
    <div className="min-h-screen">
      {shouldShowNavigation && <Navegación />}

      <Toaster 
        toastOptions={{
          success: { duration: 3000 },
          error: { duration: 4000 },
        }}
      />

      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route path="/inicio" element={<PrivateRoute><Inicio /></PrivateRoute>} />
        <Route path="/consultas" element={<PrivateRoute><Consultas /></PrivateRoute>} />
        <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />

        {/* Gestión de Organismo */}
        <Route path="/gestionar/organismo" element={<PrivateRoute><OrganismoIndex /></PrivateRoute>} />
        <Route path="/gestionar/organismo/crear" element={<PrivateRoute><OrganismoForm /></PrivateRoute>} />
        <Route path="/gestionar/organismo/editar/:id" element={<PrivateRoute><OrganismoForm /></PrivateRoute>} />
        <Route path="/gestionar/organismo/ver/:id" element={<PrivateRoute><OrganismoDetail /></PrivateRoute>} />

        {/* Gestión de Provincias */}
        <Route path="/gestionar/provincia" element={<PrivateRoute><ProvinciaIndex /></PrivateRoute>} />
        <Route path="/gestionar/provincia/crear" element={<PrivateRoute><ProvinciaForm /></PrivateRoute>} />
        <Route path="/gestionar/provincia/editar/:id" element={<PrivateRoute><ProvinciaForm /></PrivateRoute>} />
        <Route path="/gestionar/provincia/ver/:id" element={<PrivateRoute><ProvinciaDetail /></PrivateRoute>} />

        {/* Gestión de Municipios */}
        <Route path="/gestionar/municipio" element={<PrivateRoute><MunicipioIndex /></PrivateRoute>} />
        <Route path="/gestionar/municipio/crear" element={<PrivateRoute><MunicipioForm /></PrivateRoute>} />
        <Route path="/gestionar/municipio/editar/:id" element={<PrivateRoute><MunicipioForm /></PrivateRoute>} />
        <Route path="/gestionar/municipio/ver/:id" element={<PrivateRoute><MunicipioDetail /></PrivateRoute>} />

        {/* Gestión de Entidades */}
        <Route path="/gestionar/entidad" element={<PrivateRoute><EntidadIndex /></PrivateRoute>} />
        <Route path="/gestionar/entidad/crear" element={<PrivateRoute><EntidadForm /></PrivateRoute>} />
        <Route path="/gestionar/entidad/editar/:id" element={<PrivateRoute><EntidadForm /></PrivateRoute>} />
        <Route path="/gestionar/entidad/ver/:id" element={<PrivateRoute><EntidadDetail /></PrivateRoute>} />

        {/* Gestión de Directores */}
        <Route path="/gestionar/director" element={<PrivateRoute><DirectorIndex /></PrivateRoute>} />
        <Route path="/gestionar/director/crear" element={<PrivateRoute><DirectorForm /></PrivateRoute>} />
        <Route path="/gestionar/director/editar/:id" element={<PrivateRoute><DirectorForm /></PrivateRoute>} />
        <Route path="/gestionar/director/ver/:id" element={<PrivateRoute><DirectorDetail /></PrivateRoute>} />

        {/* Gestión de Servicios Eléctricos */}
        <Route path="/gestionar/servicio-electrico" element={<PrivateRoute><ServicioElectricoIndex /></PrivateRoute>} />
        <Route path="/gestionar/servicio-electrico/crear" element={<PrivateRoute><ServicioElectricoForm /></PrivateRoute>} />
        <Route path="/gestionar/servicio-electrico/editar/:id" element={<PrivateRoute><ServicioElectricoForm /></PrivateRoute>} />
        <Route path="/gestionar/servicio-electrico/ver/:id" element={<PrivateRoute><ServicioElectricoDetail /></PrivateRoute>} />

        {/* Gestión de NAE */}
        <Route path="/gestionar/nae" element={<PrivateRoute><NAEIndex /></PrivateRoute>} />
        <Route path="/gestionar/nae/crear" element={<PrivateRoute><NAEForm /></PrivateRoute>} />
        <Route path="/gestionar/nae/editar/:id" element={<PrivateRoute><NAEForm /></PrivateRoute>} />
        <Route path="/gestionar/nae/ver/:id" element={<PrivateRoute><NAEDetail /></PrivateRoute>} />

        {/* Gestión de Usuario (solo admin) */}
        <Route path="/gestionar/usuario" element={<AdminRoute><UsuarioIndex /></AdminRoute>} />
        <Route path="/gestionar/usuario/crear" element={<AdminRoute><UsuarioForm /></AdminRoute>} />
        <Route path="/gestionar/usuario/editar/:id" element={<AdminRoute><UsuarioForm /></AdminRoute>} />
        <Route path="/gestionar/usuario/ver/:id" element={<AdminRoute><UsuarioDetail /></AdminRoute>} />


      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;