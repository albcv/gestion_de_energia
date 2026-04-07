import { CrudDetail } from '../../../components/CrudDetail';
import { getNAEById, deleteNAE } from '../../../api/crud_modelos/nae';

const fields = [
  { key: 'codigo', label: 'código' },
  { key: 'actividad', label: 'Actividad' },
  { key: 'created_at', label: 'Creado' },
  { key: 'updated_at', label: 'Actualizado' },
];

export function NAEDetail() {
  return (
    <CrudDetail
      title="Detalles del NAE"
      getItem={getNAEById}
      deleteItem={deleteNAE}
      fields={fields}
      basePath="/gestionar/nae"
      itemName="NAE"
    />
  );
}
