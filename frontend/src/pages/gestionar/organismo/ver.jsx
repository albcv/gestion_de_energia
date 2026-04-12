import { CrudDetail } from '../../../components/CrudDetail';
import { getOrganismoById, deleteOrganismo } from '../../../api/crud_modelos/organismo';

const fields = [

  { key: 'nombre', label: 'Nombre' },
  { key: 'siglas', label: 'Siglas' },
  { key: 'codigo', label: 'Código' },
  { key: 'created_at', label: 'Creado' },
  { key: 'updated_at', label: 'Actualizado' },
];

export function OrganismoDetail() {
  return (
    <CrudDetail
      title="Detalles del Organismo"
      getItem={getOrganismoById}
      deleteItem={deleteOrganismo}
      fields={fields}
      basePath="/gestionar/organismo"
      itemName="Organismo"
    />
  );
}
