import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Login } from './pages/login';
import { Registro } from './pages/registro';
import { Inicio } from './pages/inicio';
import { Perfil } from './pages/perfil';
import { Navegación } from './components/Navegación';
import { PrivateRoute } from './components/PrivateRoute';
import { Toaster } from 'react-hot-toast';

// Importar páginas de gestión
import { OACEIndex } from './pages/gestionar/oace';
import { OACEForm } from './pages/gestionar/oace/formulario';
import { OACEDetail } from './pages/gestionar/oace/ver';

import { OSDEIndex } from './pages/gestionar/osde';
import { OSDEForm } from './pages/gestionar/osde/formulario';
import { OSDEDetail } from './pages/gestionar/osde/ver';

import { SectorEconomicoIndex } from './pages/gestionar/sector_economico';
import { SectorEconomicoForm } from './pages/gestionar/sector_economico/formulario';
import { SectorEconomicoDetail } from './pages/gestionar/sector_economico/ver';

import { ProvinciaIndex } from './pages/gestionar/provincia';
import { ProvinciaForm } from './pages/gestionar/provincia/formulario';
import { ProvinciaDetail } from './pages/gestionar/provincia/ver';

import { MunicipioIndex } from './pages/gestionar/municipio';
import { MunicipioForm } from './pages/gestionar/municipio/formulario';
import { MunicipioDetail } from './pages/gestionar/municipio/ver';

import { EntidadIndex } from './pages/gestionar/entidad';
import { EntidadForm } from './pages/gestionar/entidad/formulario';
import { EntidadDetail } from './pages/gestionar/entidad/ver';

import { DirectorIndex } from './pages/gestionar/director';
import { DirectorForm } from './pages/gestionar/director/formulario';
import { DirectorDetail } from './pages/gestionar/director/ver';

import { EstablecimientoIndex } from './pages/gestionar/establecimiento';
import { EstablecimientoForm } from './pages/gestionar/establecimiento/formulario';
import { EstablecimientoDetail } from './pages/gestionar/establecimiento/ver';

import { ServicioElectricoIndex } from './pages/gestionar/servicio_electrico';
import { ServicioElectricoForm } from './pages/gestionar/servicio_electrico/formulario';
import { ServicioElectricoDetail } from './pages/gestionar/servicio_electrico/ver';

import { PortadorEnergeticoElecIndex } from './pages/gestionar/portador_energetico_elec';
import { PortadorEnergeticoElecForm } from './pages/gestionar/portador_energetico_elec/formulario';
import { PortadorEnergeticoElecDetail } from './pages/gestionar/portador_energetico_elec/ver';

import { UnidadMedidaIndex } from './pages/gestionar/unidad_medida';
import { UnidadMedidaForm } from './pages/gestionar/unidad_medida/formulario';
import { UnidadMedidaDetail } from './pages/gestionar/unidad_medida/ver';

import { NAEIndex } from './pages/gestionar/nae';
import { NAEForm } from './pages/gestionar/nae/formulario';
import { NAEDetail } from './pages/gestionar/nae/ver';

function AppContent() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, [location]);

  const hideNavigationRoutes = ['/', '/login', '/registro'];
  const shouldHideByPath = hideNavigationRoutes.includes(location.pathname);
  const shouldShowNavigation = !shouldHideByPath && isAuthenticated;

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
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/registro' element={<Registro />} />

        {/* Rutas protegidas */}
        <Route path='/inicio' element={<PrivateRoute><Inicio /></PrivateRoute>} />
        <Route path='/perfil' element={<PrivateRoute><Perfil /></PrivateRoute>} />

        {/* Gestión de OACE */}
        <Route path='/gestionar/oace' element={<PrivateRoute><OACEIndex /></PrivateRoute>} />
        <Route path='/gestionar/oace/crear' element={<PrivateRoute><OACEForm /></PrivateRoute>} />
        <Route path='/gestionar/oace/editar/:id' element={<PrivateRoute><OACEForm /></PrivateRoute>} />
        <Route path='/gestionar/oace/ver/:id' element={<PrivateRoute><OACEDetail /></PrivateRoute>} />

        {/* Gestión de OSDE */}
        <Route path='/gestionar/osde' element={<PrivateRoute><OSDEIndex /></PrivateRoute>} />
        <Route path='/gestionar/osde/crear' element={<PrivateRoute><OSDEForm /></PrivateRoute>} />
        <Route path='/gestionar/osde/editar/:id' element={<PrivateRoute><OSDEForm /></PrivateRoute>} />
        <Route path='/gestionar/osde/ver/:id' element={<PrivateRoute><OSDEDetail /></PrivateRoute>} />

        {/* Gestión de Sectores Económicos */}
        <Route path='/gestionar/sector-economico' element={<PrivateRoute><SectorEconomicoIndex /></PrivateRoute>} />
        <Route path='/gestionar/sector-economico/crear' element={<PrivateRoute><SectorEconomicoForm /></PrivateRoute>} />
        <Route path='/gestionar/sector-economico/editar/:id' element={<PrivateRoute><SectorEconomicoForm /></PrivateRoute>} />
        <Route path='/gestionar/sector-economico/ver/:id' element={<PrivateRoute><SectorEconomicoDetail /></PrivateRoute>} />

        {/* Gestión de Provincias */}
        <Route path='/gestionar/provincia' element={<PrivateRoute><ProvinciaIndex /></PrivateRoute>} />
        <Route path='/gestionar/provincia/crear' element={<PrivateRoute><ProvinciaForm /></PrivateRoute>} />
        <Route path='/gestionar/provincia/editar/:id' element={<PrivateRoute><ProvinciaForm /></PrivateRoute>} />
        <Route path='/gestionar/provincia/ver/:id' element={<PrivateRoute><ProvinciaDetail /></PrivateRoute>} />

        {/* Gestión de Municipios */}
        <Route path='/gestionar/municipio' element={<PrivateRoute><MunicipioIndex /></PrivateRoute>} />
        <Route path='/gestionar/municipio/crear' element={<PrivateRoute><MunicipioForm /></PrivateRoute>} />
        <Route path='/gestionar/municipio/editar/:id' element={<PrivateRoute><MunicipioForm /></PrivateRoute>} />
        <Route path='/gestionar/municipio/ver/:id' element={<PrivateRoute><MunicipioDetail /></PrivateRoute>} />

        {/* Gestión de Entidades */}
        <Route path='/gestionar/entidad' element={<PrivateRoute><EntidadIndex /></PrivateRoute>} />
        <Route path='/gestionar/entidad/crear' element={<PrivateRoute><EntidadForm /></PrivateRoute>} />
        <Route path='/gestionar/entidad/editar/:id' element={<PrivateRoute><EntidadForm /></PrivateRoute>} />
        <Route path='/gestionar/entidad/ver/:id' element={<PrivateRoute><EntidadDetail /></PrivateRoute>} />

        {/* Gestión de Directores */}
        <Route path='/gestionar/director' element={<PrivateRoute><DirectorIndex /></PrivateRoute>} />
        <Route path='/gestionar/director/crear' element={<PrivateRoute><DirectorForm /></PrivateRoute>} />
        <Route path='/gestionar/director/editar/:id' element={<PrivateRoute><DirectorForm /></PrivateRoute>} />
        <Route path='/gestionar/director/ver/:id' element={<PrivateRoute><DirectorDetail /></PrivateRoute>} />

        {/* Gestión de Establecimientos */}
        <Route path='/gestionar/establecimiento' element={<PrivateRoute><EstablecimientoIndex /></PrivateRoute>} />
        <Route path='/gestionar/establecimiento/crear' element={<PrivateRoute><EstablecimientoForm /></PrivateRoute>} />
        <Route path='/gestionar/establecimiento/editar/:id' element={<PrivateRoute><EstablecimientoForm /></PrivateRoute>} />
        <Route path='/gestionar/establecimiento/ver/:id' element={<PrivateRoute><EstablecimientoDetail /></PrivateRoute>} />

        {/* Gestión de Servicios Eléctricos */}
        <Route path='/gestionar/servicio-electrico' element={<PrivateRoute><ServicioElectricoIndex /></PrivateRoute>} />
        <Route path='/gestionar/servicio-electrico/crear' element={<PrivateRoute><ServicioElectricoForm /></PrivateRoute>} />
        <Route path='/gestionar/servicio-electrico/editar/:id' element={<PrivateRoute><ServicioElectricoForm /></PrivateRoute>} />
        <Route path='/gestionar/servicio-electrico/ver/:id' element={<PrivateRoute><ServicioElectricoDetail /></PrivateRoute>} />

        {/* Gestión de Portadores energéticos */}
        <Route path='/gestionar/portador_energetico_elec' element={<PrivateRoute><PortadorEnergeticoElecIndex /></PrivateRoute>} />
        <Route path='/gestionar/portador_energetico_elec/crear' element={<PrivateRoute><PortadorEnergeticoElecForm /></PrivateRoute>} />
        <Route path='/gestionar/portador_energetico_elec/editar/:id' element={<PrivateRoute><PortadorEnergeticoElecForm /></PrivateRoute>} />
        <Route path='/gestionar/portador_energetico_elec/ver/:id' element={<PrivateRoute><PortadorEnergeticoElecDetail /></PrivateRoute>} />

        {/* Gestión de Unidades de Medida */}
        <Route path='/gestionar/unidad_medida' element={<PrivateRoute><UnidadMedidaIndex /></PrivateRoute>} />
        <Route path='/gestionar/unidad_medida/crear' element={<PrivateRoute><UnidadMedidaForm /></PrivateRoute>} />
        <Route path='/gestionar/unidad_medida/editar/:id' element={<PrivateRoute><UnidadMedidaForm /></PrivateRoute>} />
        <Route path='/gestionar/unidad_medida/ver/:id' element={<PrivateRoute><UnidadMedidaDetail /></PrivateRoute>} />

        {/* Gestión de NAE */}
        <Route path='/gestionar/nae' element={<PrivateRoute><NAEIndex /></PrivateRoute>} />
        <Route path='/gestionar/nae/crear' element={<PrivateRoute><NAEForm /></PrivateRoute>} />
        <Route path='/gestionar/nae/editar/:id' element={<PrivateRoute><NAEForm /></PrivateRoute>} />
        <Route path='/gestionar/nae/ver/:id' element={<PrivateRoute><NAEDetail /></PrivateRoute>} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;