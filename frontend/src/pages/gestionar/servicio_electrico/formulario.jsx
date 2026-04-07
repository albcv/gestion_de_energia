import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CrudForm } from '../../../components/CrudForm';
import { getServicioElectricoById, createServicioElectrico, updateServicioElectrico, deleteServicioElectrico } from '../../../api/crud_modelos/servicio_electrico';
import { searchEntidad, getEntidadById } from '../../../api/crud_modelos/entidad/entidad.js';

export function ServicioElectricoForm() {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(!!id);

  // Si estamos en edición, obtener la entidad para preselección (aunque getItemWithLabel lo hará, pero necesitamos el nombre)
  // Realmente no es necesario, porque getItemWithLabel transformará el campo entidad usando entidad_nombre.
  // Así que podemos dejar que CrudForm cargue el item mediante getItemWithLabel.

  const getItemWithLabel = async (id) => {
    const data = await getServicioElectricoById(id);
    if (data.entidad && data.entidad_nombre) {
      data.entidad = {
        value: data.entidad,
        label: data.entidad_nombre
      };
    }
    return data;
  };

  const fields = [
    { name: 'codigo_servicio', label: 'Código de servicio', type: 'number', required: true, placeholder: 'Ej: 101' },
    { name: 'tarifa_contratada', label: 'Tarifa contratada', type: 'text', required: true, placeholder: 'Ej: M1A' },
    { name: 'demanda_contratada', label: 'Demanda contratada', type: 'number', required: true, placeholder: 'Ej: 100.5', step: 'any' },
    { name: 'regimen_trabajo', label: 'Régimen de trabajo', type: 'number', required: true, placeholder: 'Ej: 1' },
    { 
      name: 'entidad', 
      label: 'Entidad', 
      type: 'autoselect', 
      required: true, 
      loadOptions: searchEntidad,
      placeholder: 'Buscar entidad por nombre o código REEUP...' 
    },
  ];

  // No hay estado de carga porque no precargamos opciones; CrudForm maneja la carga del item en edición.

  return (
    <CrudForm
      title={id ? "Editar Servicio Eléctrico" : "Crear Servicio Eléctrico"}
      fields={fields}
      getItem={id ? getItemWithLabel : undefined}
      createItem={createServicioElectrico}
      updateItem={updateServicioElectrico}
      deleteItem={deleteServicioElectrico}
      basePath="/gestionar/servicio-electrico"
      itemName="Servicio eléctrico"
      initialData={initialData}
    />
  );
}