import { useState, useEffect } from 'react';
import { CrudIndex } from '../../../components/CrudIndex';
import { getAllMunicipio, deleteMunicipio } from '../../../api/crud_modelos/municipio';

const columns = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'provincia_nombre', label: 'Provincia' },
];

export function MunicipioIndex() {
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
      const result = await getAllMunicipio(currentPage, searchTerm);
      setData(result.results || []);
      setTotalCount(result.count || 0);
      setTotalPages(Math.ceil((result.count || 0) / 100));
    } catch (error) {
      console.error('Error cargando municipios:', error);
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
      title="Gestionar Municipios"
      items={data}
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      onSearch={handleSearch}
      searchTerm={searchTerm}
      deleteItem={deleteMunicipio}
      onRefresh={fetchData}
      columns={columns}
      basePath="/gestionar/municipio"
      itemName="Municipio"
      totalCount={totalCount}
      loading={loading}
    />
  );
}