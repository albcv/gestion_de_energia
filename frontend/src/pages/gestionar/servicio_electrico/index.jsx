import { useState, useEffect } from 'react';
import { CrudIndex } from '../../../components/CrudIndex';
import { getAllServicioElectrico, deleteServicioElectrico } from '../../../api/crud_modelos/servicio_electrico';
import { getAñosDisponibles } from '../../../api/crud_modelos/servicio_electrico';

const columns = [
  { key: 'codigo_servicio', label: 'Código' },
  { key: 'mes_nombre', label: 'Mes' },
  { key: 'año', label: 'Año' },
  { key: 'consumo_real', label: 'Consumo real (kWh)' },
  { key: 'entidad_nombre', label: 'Entidad' },
];

const mesesOptions = [
  { value: '', label: 'Todos los meses' },
  { value: '1', label: 'Enero' },
  { value: '2', label: 'Febrero' },
  { value: '3', label: 'Marzo' },
  { value: '4', label: 'Abril' },
  { value: '5', label: 'Mayo' },
  { value: '6', label: 'Junio' },
  { value: '7', label: 'Julio' },
  { value: '8', label: 'Agosto' },
  { value: '9', label: 'Septiembre' },
  { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' },
  { value: '12', label: 'Diciembre' },
];

export function ServicioElectricoIndex() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [añosDisponibles, setAñosDisponibles] = useState([]);
  const [loadingAños, setLoadingAños] = useState(true);
  const [filters, setFilters] = useState({
    codigo_servicio: '',
    mes: '',
    año: '',
    codigo_REEUP: '',
    search: ''
  });

  // Cargar años disponibles desde el backend
  useEffect(() => {
    const loadAños = async () => {
      try {
        const años = await getAñosDisponibles();
        setAñosDisponibles(años);
      } catch (error) {
        console.error('Error cargando años disponibles:', error);
      } finally {
        setLoadingAños(false);
      }
    };
    loadAños();
  }, []);

  // Resetear página al cambiar filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.codigo_servicio, filters.mes, filters.año, filters.codigo_REEUP, filters.search]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAllServicioElectrico(currentPage, filters);
      // Transformar datos: si entidad_nombre es null o vacío, mostrar 'Desconocido'
      const transformedResults = (result.results || []).map(item => ({
        ...item,
        entidad_nombre: item.entidad_nombre && item.entidad_nombre.trim() !== '' 
          ? item.entidad_nombre 
          : 'Desconocido'
      }));
      setData(transformedResults);
      setTotalCount(result.count || 0);
      setTotalPages(Math.ceil((result.count || 0) / 100));
    } catch (error) {
      console.error('Error cargando servicios eléctricos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (term) => {
    setFilters(prev => ({ ...prev, search: term }));
  };

  const clearFilters = () => {
    setFilters({
      codigo_servicio: '',
      mes: '',
      año: '',
      codigo_REEUP: '',
      search: ''
    });
  };

  return (
    <div className="bg-yellow-200 min-h-screen">
      <div className="bg-white p-4 rounded-xl shadow-xl mb-6 mx-auto max-w-7xl">
        <h2 className="text-xl font-bold mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            name="codigo_servicio"
            placeholder="Código de servicio"
            value={filters.codigo_servicio}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded placeholder-slate-700"
          />
          <select
            name="mes"
            value={filters.mes}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded"
          >
            {mesesOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select
            name="año"
            value={filters.año}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded"
            disabled={loadingAños}
          >
            <option value="">Todos los años</option>
            {añosDisponibles.map(año => (
              <option key={año} value={año}>{año}</option>
            ))}
          </select>
          <input
            type="text"
            name="codigo_REEUP"
            placeholder="Código REEUP"
            value={filters.codigo_REEUP}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded placeholder-slate-700"
          />
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      <CrudIndex
        title="Gestionar Servicios Eléctricos"
        items={data}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onSearch={handleSearch}
        searchTerm={filters.search}
        deleteItem={deleteServicioElectrico}
        onRefresh={fetchData}
        columns={columns}
        basePath="/gestionar/servicio-electrico"
        itemName="Servicio eléctrico"
        totalCount={totalCount}
        loading={loading}
      />
    </div>
  );
}