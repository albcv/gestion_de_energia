import { useParams } from 'react-router-dom';
import { CrudForm } from '../../../components/CrudForm';
import { getProvinciaById, createProvincia, updateProvincia, deleteProvincia } from '../../../api/crud_modelos/provincia';

const fields = [
  { name: 'nombre', label: 'Nombre', type: 'text', required: true, placeholder: 'Ingrese nombre' },
  { name: 'codigo_DPA', label: 'Código DPA', type: 'text', required: true, placeholder: 'Ingrese nombre' },
];

export function ProvinciaForm() {
  const { id } = useParams();
  return (
    <CrudForm
      title={id ? "Editar Provincia" : "Crear Provincia"}
      fields={fields}
      getItem={getProvinciaById}
      createItem={createProvincia}
      updateItem={updateProvincia}
      deleteItem={deleteProvincia}
      basePath="/gestionar/provincia"
      itemName="Provincia"
    />
  );
}