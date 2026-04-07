import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CrudDetail } from '../../../components/CrudDetail';
import { getDirectorById, deleteDirector } from '../../../api/crud_modelos/director';

const fields = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'apellido1', label: 'Primer apellido' },
  { key: 'apellido2', label: 'Segundo apellido' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'correo', label: 'Correo' },
  { key: 'entidad_nombre', label: 'Entidad' },
  { key: 'created_at', label: 'Creado' },
  { key: 'updated_at', label: 'Actualizado' },
];

export function DirectorDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [entidadId, setEntidadId] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await getDirectorById(id);
        setItem(data);
        setEntidadId(data.entidad);
      } catch (error) {
        console.error('Error cargando director:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading) return <div className="text-center py-12">Cargando...</div>;
  if (!item) return <div className="text-center py-12">No se encontró el director</div>;

  const basePath = entidadId ? `/gestionar/entidad/ver/${entidadId}` : "/gestionar/director";

  return (
    <CrudDetail
      title="Detalles del Director"
      getItem={getDirectorById}
      deleteItem={deleteDirector}
      fields={fields}
      basePath={basePath}
      itemName="Director"
    >
      {({ item }) => item && item.entidad && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Entidad asociada</h3>
          <Link
            to={`/gestionar/entidad/ver/${item.entidad}`}
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Ver detalles de la entidad
          </Link>
        </div>
      )}
    </CrudDetail>
  );
}