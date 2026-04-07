import { useState, useEffect } from 'react';
import { CrudIndex } from '../../../components/CrudIndex';
import {
  getPortadoresFiltrados,
  deletePortadorEnergeticoElec,
  getAniosDisponibles
} from '../../../api/crud_modelos/portador_energetico_elec';
import { getAllServicioElectrico } from '../../../api/crud_modelos/servicio_electrico';

const columns = [
  { key: 'consumo_real_con_unidad', label: 'Consumo real' },
  { key: 'mes_nombre', label: 'Mes' },
  { key: 'año', label: 'Año' },
  { key: 'servicio_codigo', label: 'Servicio' },
];

const mesesMap = {
  1: 'Enero', 2: 'Febrero', 3: 'Marzo', 4: 'Abril',
  5: 'Mayo', 6: 'Junio', 7: 'Julio', 8: 'Agosto',
  9: 'Septiembre', 10: 'Octubre', 11: 'Noviembre', 12: 'Diciembre'
};

export function PortadorEnergeticoElecIndex() {
  const [data, setData] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [anios, setAnios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    mes: '',
    anio: '',
    servicio: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Cargar opciones de filtros
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [aniosData, serviciosList] = await Promise.all([
          getAniosDisponibles(),
          getAllServicioElectrico()
        ]);
        setAnios(aniosData);
        setServicios(serviciosList.map(s => ({ value: s.codigo_servicio, label: s.codigo_servicio })));
      } catch (error) {
        console.error('Error cargando opciones de filtros:', error);
      }
    };
    fetchOptions();
  }, []);

  // Función para cargar datos según filtros y página actual
  const fetchData = async () => {
    setLoading(true);
    try {
      const filtrosAplicados = {};
      if (filters.mes) filtrosAplicados.mes = filters.mes;
      if (filters.anio) filtrosAplicados.anio = filters.anio;
      if (filters.servicio) filtrosAplicados.servicio = filters.servicio;
      if (filters.search) filtrosAplicados.search = filters.search;

      const result = await getPortadoresFiltrados(filtrosAplicados, currentPage);
      setData(result.results);
      setTotalCount(result.count);
      setTotalPages(Math.ceil(result.count / 100));
    } catch (error) {
      console.error('Error cargando portadores:', error);
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar fetchData cuando cambien los filtros o la página (y cuando los años estén listos)
  useEffect(() => {
    if (anios.length === 0) return;
    fetchData();
  }, [filters, currentPage, anios]);

  // Al cambiar cualquier filtro (excepto página), resetear a página 1
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.mes, filters.anio, filters.servicio, filters.search]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (term) => {
    setFilters(prev => ({ ...prev, search: term }));
  };

  const clearFilters = () => {
    setFilters({ mes: '', anio: '', servicio: '', search: '' });
  };

  const mesesOptions = Object.entries(mesesMap).map(([value, label]) => ({ value, label }));

  return (
    <div className="bg-yellow-200 min-h-screen">
      {/* Panel de filtros */}
      <div className="bg-white p-4 rounded-xl shadow-xl mb-6 mx-auto max-w-7xl">
        <h2 className="text-xl font-bold mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            name="mes"
            value={filters.mes}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded"
          >
            <option value="">Todos los meses</option>
            {mesesOptions.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          <select
            name="anio"
            value={filters.anio}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded"
          >
            <option value="">Todos los años</option>
            {anios.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <select
            name="servicio"
            value={filters.servicio}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded"
          >
            <option value="">Todos los servicios</option>
            {servicios.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      <CrudIndex
        title="Gestionar Portadores Energéticos"
        items={data}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onSearch={handleSearch}
        searchTerm={filters.search}
        deleteItem={deletePortadorEnergeticoElec}
        onRefresh={fetchData}  
        columns={columns}
        basePath="/gestionar/portador_energetico_elec"
        itemName="Portador energético"
        totalCount={totalCount}
        loading={loading}
      />
    </div>
  );
}