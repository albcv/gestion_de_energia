import { CrudDetail } from '../../../components/CrudDetail';
import { getServicioElectricoById, deleteServicioElectrico } from '../../../api/crud_modelos/servicio_electrico';

const fields = [
  { key: 'codigo_servicio', label: 'Código' },
  { key: 'tarifa_contratada', label: 'Tarifa contratada' },
  { key: 'demanda_contratada', label: 'Demanda contratada' },
  { key: 'regimen_trabajo', label: 'Régimen de trabajo' },
  { key: 'entidad_nombre', label: 'Entidad' },
  { key: 'created_at', label: 'Creado' },
  { key: 'updated_at', label: 'Actualizado' },
];

export function ServicioElectricoDetail() {
  return (
    <CrudDetail
      title="Detalles del Servicio Eléctrico"
      getItem={getServicioElectricoById}
      deleteItem={deleteServicioElectrico}
      fields={fields}
      basePath="/gestionar/servicio-electrico"
      itemName="Servicio eléctrico"
    />
  );
}