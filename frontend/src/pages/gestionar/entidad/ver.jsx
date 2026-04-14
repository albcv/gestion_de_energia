import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { CrudDetail } from '../../../components/CrudDetail';
import { getEntidadById, deleteEntidad } from '../../../api/crud_modelos/entidad/entidad.js';

const fields = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'tipo', label: 'Tipo de entidad' },
  { key: 'codigo_REEUP', label: 'Código REEUP' },
  { key: 'municipio_nombre', label: 'Municipio' },
  { key: 'organismo', label: 'Organismo' },
  { key: 'nae_nombre', label: 'NAE' },
  { key: 'cuenta_bancaria_formateada', label: 'Cuenta bancaria' },
  { key: 'siglas', label: 'Siglas' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'NIT', label: 'NIT' },
  { key: 'direccion', label: 'Dirección' },
  { key: 'geolocalizacion', label: 'Geolocalización' },
  { key: 'created_at', label: 'Creado' },
  { key: 'updated_at', label: 'Actualizado' },
];

export function EntidadDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await getEntidadById(id);
        setItem(data);
      } catch (error) {
        toast.error('Error al cargar detalles');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading) return <div className="text-center py-12">Cargando...</div>;
  if (!item) return <div className="text-center py-12">No se encontró la entidad</div>;

  const getNivel = () => {
    if (!item.codigo_REEUP) return 'No disponible';
    const partes = item.codigo_REEUP.split('.');
    if (partes.length >= 2) {
      const digito = partes[1];
      if (digito === '0') return 'Nacional';
      if (digito === '1') return 'Provincial';
      if (digito === '2') return 'Municipal';
    }
    return 'Desconocido';
  };

  return (
    <CrudDetail
      title="Detalles de la Entidad"
      getItem={getEntidadById}
      deleteItem={deleteEntidad}
      fields={fields}
      basePath="/gestionar/entidad"
      itemName="Entidad"
    >
      <>
        <div className="mt-8 pt-4 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Nivel de la entidad</h2>
          <p className="text-lg text-gray-900">{getNivel()}</p>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Director</h2>
          {item.director ? (
            <div className="bg-gray-50 rounded-lg p-4">
              <p><span className="font-medium">Nombre:</span> {item.director.nombre} {item.director.apellido1} {item.director.apellido2}</p>
              <p><span className="font-medium">Correo:</span> {item.director.correo}</p>
              <p><span className="font-medium">Teléfono:</span> {item.director.telefono}</p>
              <div className="mt-2 space-x-2">
                <Link to={`/gestionar/director/ver/${item.director.id}`} className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Ver detalles</Link>
                <Link to={`/gestionar/director/editar/${item.director.id}`} className="inline-block px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">Editar</Link>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-600">No hay director asignado.</p>
              <Link to={`/gestionar/director/crear?entidad_id=${id}`} className="inline-block mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Asignar director
              </Link>
            </div>
          )}
        </div>
      </>
    </CrudDetail>
  );
}