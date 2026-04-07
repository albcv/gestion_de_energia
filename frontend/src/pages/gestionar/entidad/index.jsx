import { useState, useEffect } from 'react';
import { CrudIndex } from '../../../components/CrudIndex';
import { getAllEntidad, deleteEntidad } from '../../../api/crud_modelos/entidad/entidad';
import { getAllMunicipio } from '../../../api/crud_modelos/municipio';
import { getAllSectorEconomico } from '../../../api/crud_modelos/sector_economico';

const columns = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'sector_economico_nombre', label: 'Sector' },
  { key: 'nae_nombre', label: 'NAE' },
  { key: 'municipio_nombre', label: 'Municipio' },
];

const tipoOptions = [
  { value: '', label: 'Todos los tipos' },
  { value: 'empresarial', label: 'Empresarial' },
  { value: 'presupuestada', label: 'Presupuestada' }
];

export function EntidadIndex() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({
    municipio: '',
    tipo: '',
    sector: '',
    codigoREEUP: '',
    search: ''
  });

  const [municipios, setMunicipios] = useState([]);
  const [sectores, setSectores] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Cargar opciones para los selects
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [municipiosRes, sectoresRes] = await Promise.all([
          getAllMunicipio(),
          getAllSectorEconomico()
        ]);
        setMunicipios((municipiosRes.results || []).map(m => m.nombre).sort());
        setSectores((sectoresRes.results || []).map(s => s.nombre).sort());
      } catch (error) {
        console.error('Error cargando opciones de filtros:', error);
      } finally {
        setLoadingOptions(false);
      }
    };
    loadOptions();
  }, []);

  // Reiniciar página al cambiar filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.municipio, filters.tipo, filters.sector, filters.codigoREEUP, filters.search]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAllEntidad(currentPage, filters);
      setData(result.results || []);
      setTotalCount(result.count || 0);
      setTotalPages(Math.ceil((result.count || 0) / 100));
    } catch (error) {
      console.error('Error cargando entidades:', error);
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
    setFilters({ municipio: '', tipo: '', sector: '', codigoREEUP: '', search: '' });
  };

  if (loadingOptions) {
    return <div className="text-center py-12">Cargando filtros...</div>;
  }

  return (
    <div className="bg-yellow-200 min-h-screen">
      <div className="bg-white p-4 rounded-xl shadow-xl mb-6 mx-auto max-w-7xl">
        <h2 className="text-xl font-bold mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <select
            name="municipio"
            value={filters.municipio}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded"
          >
            <option value="">Todos los municipios</option>
            {municipios.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select
            name="tipo"
            value={filters.tipo}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded"
          >
            {tipoOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select
            name="sector"
            value={filters.sector}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded"
          >
            <option value="">Todos los sectores</option>
            {sectores.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <input
            type="text"
            name="codigoREEUP"
            placeholder="Código REEUP"
            value={filters.codigoREEUP}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded"
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
        title="Gestionar Entidades"
        items={data}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onSearch={handleSearch}
        searchTerm={filters.search}
        deleteItem={deleteEntidad}
        onRefresh={fetchData}
        columns={columns}
        basePath="/gestionar/entidad"
        itemName="Entidad"
        totalCount={totalCount}
        loading={loading}
      />
    </div>
  );
}