import { useParams } from 'react-router-dom';
import { CrudForm } from '../../../components/CrudForm';
import { getSectorEconomicoById, createSectorEconomico, updateSectorEconomico, deleteSectorEconomico } from '../../../api/crud_modelos/sector_economico';

const fields = [
  { name: 'nombre', label: 'Nombre', type: 'text', required: true, placeholder: 'Ingrese nombre' },
];

export function SectorEconomicoForm() {
  const { id } = useParams();
  return (
    <CrudForm
      title={id ? "Editar Sector Económico" : "Crear Sector Económico"}
      fields={fields}
      getItem={getSectorEconomicoById}
      createItem={createSectorEconomico}
      updateItem={updateSectorEconomico}
      deleteItem={deleteSectorEconomico}
      basePath="/gestionar/sector-economico"
      itemName="Sector económico"
    />
  );
}