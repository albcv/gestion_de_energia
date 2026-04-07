import { CrudDetail } from '../../../components/CrudDetail';
import { getSectorEconomicoById, deleteSectorEconomico } from '../../../api/crud_modelos/sector_economico';

const fields = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'created_at', label: 'Creado' },
  { key: 'updated_at', label: 'Actualizado' },
];

export function SectorEconomicoDetail() {
  return (
    <CrudDetail
      title="Detalles del Sector Económico"
      getItem={getSectorEconomicoById}
      deleteItem={deleteSectorEconomico}
      fields={fields}
      basePath="/gestionar/sector-economico"
      itemName="Sector económico"
    />
  );
}
