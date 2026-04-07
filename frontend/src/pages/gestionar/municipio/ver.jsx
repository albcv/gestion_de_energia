import { CrudDetail } from '../../../components/CrudDetail';
import { getMunicipioById, deleteMunicipio } from '../../../api/crud_modelos/municipio';

const fields = [
  
  { key: 'codigo_DPA', label: 'código DPA' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'provincia_nombre', label: 'Provincia' },
  { key: 'created_at', label: 'Creado' },
  { key: 'updated_at', label: 'Actualizado' },
];

export function MunicipioDetail() {
  return (
    <CrudDetail
      title="Detalles del Municipio"
      getItem={getMunicipioById}
      deleteItem={deleteMunicipio}
      fields={fields}
      basePath="/gestionar/municipio"
      itemName="Municipio"
    />
  );
}
