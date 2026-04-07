import { CrudDetail } from '../../../components/CrudDetail';
import { getOACEById, deleteOACE } from '../../../api/crud_modelos/oace';

const fields = [

  { key: 'nombre', label: 'Nombre' },
  { key: 'siglas', label: 'Siglas' },
  { key: 'descripcion', label: 'Descripción' },
  { key: 'direccion_sede_principal', label: 'Dirección de la sede principal' },
  { key: 'telefono_sede_principal', label: 'Teléfono de la sede principal' },
  { key: 'created_at', label: 'Creado' },
  { key: 'updated_at', label: 'Actualizado' },
];

export function OACEDetail() {
  return (
    <CrudDetail
      title="Detalles del OACE"
      getItem={getOACEById}
      deleteItem={deleteOACE}
      fields={fields}
      basePath="/gestionar/oace"
      itemName="OACE"
    />
  );
}
