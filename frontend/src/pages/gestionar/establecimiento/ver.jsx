import { CrudDetail } from '../../../components/CrudDetail';
import { getEstablecimientoById, deleteEstablecimiento } from '../../../api/crud_modelos/establecimiento';

const fields = [
 
  { key: 'nombre', label: 'Nombre' },
  { key: 'direccion', label: 'Dirección' },
  { key: 'geolocalizacion', label: 'Geolocalización' },
  { key: 'servicio_codigo', label: 'Servicio eléctrico' },
  { key: 'municipio_nombre', label: 'Municipio' },
  { key: 'created_at', label: 'Creado' },
  { key: 'updated_at', label: 'Actualizado' },
];

export function EstablecimientoDetail() {
  return (
    <CrudDetail
      title="Detalles del Establecimiento"
      getItem={getEstablecimientoById}
      deleteItem={deleteEstablecimiento}
      fields={fields}
      basePath="/gestionar/establecimiento"
      itemName="Establecimiento"
    />
  );
}