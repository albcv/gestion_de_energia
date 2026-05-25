import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CrudDetail } from '../../../components/CrudDetail';
import { getUsuarioById, deleteUsuario } from '../../../api/crud_modelos/usuario';

const fields = [
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
  { 
    key: 'is_superuser', 
    label: 'Superusuario',
    render: (value) => value ? '✅ Sí' : '❌ No'
  },
  { key: 'date_joined', label: 'Fecha de registro' },
  { key: 'last_login', label: 'Último acceso' },
];

export function UsuarioDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await getUsuarioById(id);
        setItem(data);
      } catch (error) {
        console.error('Error cargando usuario:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading) return <div className="text-center py-12">Cargando...</div>;
  if (!item) return <div className="text-center py-12">No se encontró el usuario</div>;

  return (
    <CrudDetail
      title="Detalles del Usuario"
      getItem={getUsuarioById}
      deleteItem={deleteUsuario}
      fields={fields}
      basePath="/gestionar/usuario"
      itemName="Usuario"
    />
  );
}