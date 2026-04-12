import { CrudForm } from '../../../components/CrudForm';
import { getOrganismoById, createOrganismo, updateOrganismo, deleteOrganismo } from '../../../api/crud_modelos/organismo';
import { useParams } from 'react-router-dom';

const fields = [
  { name: 'nombre', label: 'Nombre', type: 'text', required: true, placeholder: 'Ingrese nombre' },
  { name: 'siglas', label: 'Siglas', type: 'text', required: true, placeholder: 'Ingrese siglas' },
  { name: 'codigo', label: 'Código', type: 'text', required: true, placeholder: 'Ingrese código' },
];

export function OrganismoForm() {
  const { id } = useParams(); 
  return (
    <CrudForm
      title={id ? "Editar Organismo" : "Crear Organismo"}
      fields={fields}
      getItem={getOrganismoById}
      createItem={createOrganismo}
      updateItem={updateOrganismo}
      deleteItem={deleteOrganismo}
      basePath="/gestionar/organismo"
      itemName="Organismo"
    />
  );
}