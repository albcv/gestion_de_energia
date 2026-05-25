import { useState, useEffect } from 'react';
import { CrudIndex } from '../../../components/CrudIndex';
import { getAllUsuario, deleteUsuario } from '../../../api/crud_modelos/usuario';

const columns = [
  { key: 'username', label: 'Nombre de usuario' },
  { key: 'email', label: 'Correo' },
  { key: 'first_name', label: 'Nombre' },
  { key: 'last_name', label: 'Apellidos' },
  { 
    key: 'is_active', 
    label: 'Activo',
    render: (value) => value ? '✅ Sí' : '❌ No'
  },
  { 
    key: 'is_staff', 
    label: 'Staff',
    render: (value) => value ? '✅ Sí' : '❌ No'
  },

];

export function UsuarioIndex() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAllUsuario(currentPage, searchTerm);
      setData(result.results || []);
      setTotalCount(result.count || 0);
      setTotalPages(Math.ceil((result.count || 0) / 100));
    } catch (error) {
      console.error('Error cargando usuarios:', error);
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
      title="Gestionar Usuarios"
      items={data}
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      onSearch={handleSearch}
      searchTerm={searchTerm}
      deleteItem={deleteUsuario}
      onRefresh={fetchData}
      columns={columns}
      basePath="/gestionar/usuario"
      itemName="Usuario"
      itemNamePlural="Usuarios"
      totalCount={totalCount}
      loading={loading}
    />
  );
}