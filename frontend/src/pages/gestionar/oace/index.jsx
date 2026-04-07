import { useState, useEffect } from 'react';
import { CrudIndex } from '../../../components/CrudIndex';
import { getAllOACE, deleteOACE } from '../../../api/crud_modelos/oace';

const columns = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'siglas', label: 'Siglas' },
];

export function OACEIndex() {
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
      const result = await getAllOACE(currentPage, searchTerm);
      setData(result.results || []);
      setTotalCount(result.count || 0);
      setTotalPages(Math.ceil((result.count || 0) / 100));
    } catch (error) {
      console.error('Error cargando OACE:', error);
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
      title="Gestionar OACE"
      items={data}
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      onSearch={handleSearch}
      searchTerm={searchTerm}      
      deleteItem={deleteOACE}
      onRefresh={fetchData}
      columns={columns}
      basePath="/gestionar/oace"
      itemName="OACE"
      totalCount={totalCount}
      loading={loading}
    />
  );
}