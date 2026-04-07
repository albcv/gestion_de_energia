import { useParams } from 'react-router-dom';
import { CrudForm } from '../../../components/CrudForm';
import { getUnidadMedidaById, createUnidadMedida, updateUnidadMedida, deleteUnidadMedida } from '../../../api/crud_modelos/unidad_medida';


export function UnidadMedidaForm() {
  const { id } = useParams();


 
  const fields = [
    { name: 'unidad', label: 'Unidad de medida', type: 'text', required: true, placeholder: 'Ingrese la unidad de medida' },
   
  ];

  return (
    <CrudForm
      title={id ? "Editar Unidad de Medida" : "Crear Unidad de Medida"}
      fields={fields}
      getItem={getUnidadMedidaById}
      createItem={createUnidadMedida}
      updateItem={updateUnidadMedida}
      deleteItem={deleteUnidadMedida}
      basePath="/gestionar/unidad_medida"
      itemName="Unidad de Medida"
    />
  );
}