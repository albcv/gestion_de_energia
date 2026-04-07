import { useState, useEffect } from 'react';
import { CrudIndex } from '../../../components/CrudIndex';
import { getAllEstablecimiento, deleteEstablecimiento } from '../../../api/crud_modelos/establecimiento';

const columns = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'direccion', label: 'Dirección' },
  { key: 'servicio_codigo', label: 'Servicio' },
  { key: 'municipio_nombre', label: 'Municipio' },
];

export function EstablecimientoIndex() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Reiniciar página al cambiar búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAllEstablecimiento(currentPage, searchTerm);
      setData(result.results || []);
      setTotalCount(result.count || 0);
      setTotalPages(Math.ceil((result.count || 0) / 100));
    } catch (error) {
      console.error('Error cargando establecimientos:', error);
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
      title="Gestionar Establecimientos"
      items={data}
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      onSearch={handleSearch}
      searchTerm={searchTerm}
      deleteItem={deleteEstablecimiento}
      onRefresh={fetchData}
      columns={columns}
      basePath="/gestionar/establecimiento"
      itemName="Establecimiento"
      totalCount={totalCount}
      loading={loading}
    />
  );
}