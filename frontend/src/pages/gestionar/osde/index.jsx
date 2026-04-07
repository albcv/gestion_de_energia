import { useState, useEffect } from 'react';
import { CrudIndex } from '../../../components/CrudIndex';
import { getAllOSDE, deleteOSDE } from '../../../api/crud_modelos/osde';

const columns = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'siglas', label: 'Siglas' },
  { key: 'oace_nombre', label: 'OACE' },
];

export function OSDEIndex() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Reiniciar a página 1 cuando cambie el término de búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAllOSDE(currentPage, searchTerm);
      setData(result.results || []);
      setTotalCount(result.count || 0);
      setTotalPages(Math.ceil((result.count || 0) / 100));
    } catch (error) {
      console.error('Error cargando OSDE:', error);
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
      title="Gestionar OSDE"
      items={data}
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      onSearch={handleSearch}
      searchTerm={searchTerm}
      deleteItem={deleteOSDE}
      onRefresh={fetchData}
      columns={columns}
      basePath="/gestionar/osde"
      itemName="OSDE"
      totalCount={totalCount}
      loading={loading}
    />
  );
}