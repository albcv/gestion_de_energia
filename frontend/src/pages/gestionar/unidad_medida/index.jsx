import { useState, useEffect } from 'react';
import { CrudIndex } from '../../../components/CrudIndex';
import { getAllUnidadMedida, deleteUnidadMedida } from '../../../api/crud_modelos/unidad_medida';

const columns = [
  { key: 'unidad', label: 'Unidad' },
];

export function UnidadMedidaIndex() {
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
      const result = await getAllUnidadMedida(currentPage, searchTerm);
      setData(result.results || []);
      setTotalCount(result.count || 0);
      setTotalPages(Math.ceil((result.count || 0) / 100));
    } catch (error) {
      console.error('Error cargando unidades de medida:', error);
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
      title="Gestionar Unidades de Medida"
      items={data}
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      onSearch={handleSearch}
      searchTerm={searchTerm}
      deleteItem={deleteUnidadMedida}
      onRefresh={fetchData}
      columns={columns}
      basePath="/gestionar/unidad_medida"
      itemName="Unidad de Medida"
      totalCount={totalCount}
      loading={loading}
    />
  );
}