import { useState, useEffect } from 'react';
import { CrudIndex } from '../../../components/CrudIndex';
import { getAllDirector, deleteDirector } from '../../../api/crud_modelos/director';

const columns = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'apellido1', label: 'Primer apellido' },
  { key: 'apellido2', label: 'Segundo apellido' },
  { key: 'correo', label: 'Correo' },
  { key: 'entidad_nombre', label: 'Entidad' },
];

export function DirectorIndex() {
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
      const result = await getAllDirector(currentPage, searchTerm);
      setData(result.results || []);
      setTotalCount(result.count || 0);
      setTotalPages(Math.ceil((result.count || 0) / 100));
    } catch (error) {
      console.error('Error cargando directores:', error);
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
      title="Gestionar Directores"
      items={data}
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      onSearch={handleSearch}
      searchTerm={searchTerm}
      deleteItem={deleteDirector}
      onRefresh={fetchData}
      columns={columns}
      basePath="/gestionar/director"
      itemName="Director"
      totalCount={totalCount}
      loading={loading}
    />
  );
}