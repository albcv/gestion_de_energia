import { CrudDetail } from '../../../components/CrudDetail';
import { getOSDEById, deleteOSDE } from '../../../api/crud_modelos/osde';

const fields = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'siglas', label: 'Siglas' },
  { key: 'oace_nombre', label: 'OACE' },
  { key: 'descripcion', label: 'Descripción' },
  { key: 'direccion_sede_principal', label: 'Dirección de la sede principal' },
  { key: 'telefono_sede_principal', label: 'Teléfono de la sede principal' },
  { key: 'created_at', label: 'Creado' },
  { key: 'updated_at', label: 'Actualizado' },
];

export function OSDEDetail() {
  return (
    <CrudDetail
      title="Detalles del OSDE"
      getItem={getOSDEById}
      deleteItem={deleteOSDE}
      fields={fields}
      basePath="/gestionar/osde"
      itemName="OSDE"
    />
  );
}
