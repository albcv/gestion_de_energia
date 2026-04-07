import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { CrudForm } from '../../../components/CrudForm';
import { getDirectorById, createDirector, updateDirector, deleteDirector } from '../../../api/crud_modelos/director';
import { searchEntidad, getEntidadById } from '../../../api/crud_modelos/entidad/entidad.js';

export function DirectorForm() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const entidadIdParam = searchParams.get('entidad_id');

  const [initialData, setInitialData] = useState(null);
  const [entidadIdForReturn, setEntidadIdForReturn] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(!!entidadIdParam && !id);
  const [loadingItem, setLoadingItem] = useState(!!id);

  // Cargar datos para edición y obtener entidadId para el botón volver
  useEffect(() => {
    if (id) {
      const fetchDirector = async () => {
        try {
          const data = await getDirectorById(id);
          setEntidadIdForReturn(data.entidad);
        } catch (error) {
          console.error('Error cargando director:', error);
        } finally {
          setLoadingItem(false);
        }
      };
      fetchDirector();
    } else {
      setLoadingItem(false);
    }
  }, [id]);

  // Precargar datos iniciales si venimos de entidad_id (solo creación)
  useEffect(() => {
    if (entidadIdParam && !id) {
      const fetchEntidad = async () => {
        try {
          const entidad = await getEntidadById(entidadIdParam);
          setInitialData({
            entidad: {
              value: entidad.id,
              label: entidad.nombre
            }
          });
        } catch (error) {
          console.error('Error cargando entidad para preselección:', error);
        } finally {
          setLoadingInitial(false);
        }
      };
      fetchEntidad();
    } else {
      setLoadingInitial(false);
    }
  }, [entidadIdParam, id]);

  // Función para obtener el item y transformar el campo entidad a objeto (para edición)
  const getItemWithLabel = async (id) => {
    const data = await getDirectorById(id);
    if (data.entidad && data.entidad_nombre) {
      data.entidad = {
        value: data.entidad,
        label: data.entidad_nombre
      };
    }
    return data;
  };

  // Determinar basePath para el botón Volver
  let basePath = "/gestionar/director"; // fallback
  if (id && entidadIdForReturn) {
    basePath = `/gestionar/entidad/ver/${entidadIdForReturn}`;
  } else if (entidadIdParam) {
    basePath = `/gestionar/entidad/ver/${entidadIdParam}`;
  }

  const fields = [
    { name: 'nombre', label: 'Nombre', type: 'text', required: true, placeholder: 'Ingrese nombre' },
    { name: 'apellido1', label: 'Primer apellido', type: 'text', required: true, placeholder: 'Primer apellido' },
    { name: 'apellido2', label: 'Segundo apellido', type: 'text', required: false, placeholder: 'Segundo apellido (opcional)' },
    { name: 'telefono', label: 'Teléfono', type: 'text', required: true, placeholder: 'Ej: 72251234' },
    { name: 'correo', label: 'Correo electrónico', type: 'email', required: true, placeholder: 'correo@ejemplo.com' },
    { 
      name: 'entidad', 
      label: 'Entidad', 
      type: 'autoselect', 
      required: true, 
      loadOptions: searchEntidad,
      placeholder: 'Buscar entidad por nombre o código REEUP...'
    },
  ];

  if (loadingItem || loadingInitial) {
    return <div className="text-center py-12">Cargando datos...</div>;
  }

  return (
    <CrudForm
      title={id ? "Editar Director" : "Crear Director"}
      fields={fields}
      getItem={id ? getItemWithLabel : undefined}
      createItem={createDirector}
      updateItem={updateDirector}
      deleteItem={deleteDirector}
      basePath={basePath}
      itemName="Director"
      initialData={initialData}
    />
  );
}