import { CrudDetail } from '../../../components/CrudDetail';
import { getUnidadMedidaById, deleteUnidadMedida } from '../../../api/crud_modelos/unidad_medida';

const fields = [
  { key: 'unidad', label: 'Unidad de medida' },
  { key: 'created_at', label: 'Creado' },
  { key: 'updated_at', label: 'Actualizado' },
];

export function UnidadMedidaDetail() {
  return (
    <CrudDetail
      title="Detalles de la Unidad de Medida"
      getItem={getUnidadMedidaById}
      deleteItem={deleteUnidadMedida}
      fields={fields}
      basePath="/gestionar/unidad_medida"
      itemName="Unidad de Medida"
    />
  );
}
