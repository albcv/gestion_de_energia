import { CrudDetail } from '../../../components/CrudDetail';
import { getProvinciaById, deleteProvincia } from '../../../api/crud_modelos/provincia';

const fields = [
  { key: 'codigo_DPA', label: 'Código DPA' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'created_at', label: 'Creado' },
  { key: 'updated_at', label: 'Actualizado' },
];

export function ProvinciaDetail() {
  return (
    <CrudDetail
      title="Detalles de la Provincia"
      getItem={getProvinciaById}
      deleteItem={deleteProvincia}
      fields={fields}
      basePath="/gestionar/provincia"
      itemName="Provincia"
    />
  );
}
