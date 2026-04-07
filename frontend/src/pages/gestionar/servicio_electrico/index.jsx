import { useState, useEffect } from 'react';
import { CrudIndex } from '../../../components/CrudIndex';
import { getAllServicioElectrico, deleteServicioElectrico } from '../../../api/crud_modelos/servicio_electrico';

const columns = [
  { key: 'codigo_servicio', label: 'Código' },
  { key: 'tarifa_contratada', label: 'Tarifa' },
  { key: 'demanda_contratada', label: 'Demanda' },
  { key: 'entidad_nombre', label: 'Entidad' },
];

export function ServicioElectricoIndex() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Reiniciar página cuando cambie la búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAllServicioElectrico(currentPage, searchTerm);
      setData(result.results || []);
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
  }, [currentPage, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <CrudIndex
      title="Gestionar Servicios Eléctricos"
      items={data}
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      onSearch={handleSearch}
      searchTerm={searchTerm}
      deleteItem={deleteServicioElectrico}
      onRefresh={fetchData}
      columns={columns}
      basePath="/gestionar/servicio-electrico"
      itemName="Servicio eléctrico"
      totalCount={totalCount}
      loading={loading}
    />
  );
}