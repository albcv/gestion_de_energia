import { useParams } from 'react-router-dom';
import { CrudForm } from '../../../components/CrudForm';
import { getNAEById, createNAE, updateNAE, deleteNAE } from '../../../api/crud_modelos/nae';


export function NAEForm() {
  const { id } = useParams();


 
  const fields = [
    { name: 'codigo', label: 'Código', type: 'text', required: true, placeholder: 'Ingrese el código del NAE' },
    { name: 'actividad', label: 'Actividad', type: 'text', required: true, placeholder: 'Ingrese la actividad'},
  ];

  return (
    <CrudForm
      title={id ? "Editar NAE" : "Crear NAE"}
      fields={fields}
      getItem={getNAEById}
      createItem={createNAE}
      updateItem={updateNAE}
      deleteItem={deleteNAE}
      basePath="/gestionar/nae"
      itemName="NAE"
    />
  );
}