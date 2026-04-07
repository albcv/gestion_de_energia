import { CrudForm } from '../../../components/CrudForm';
import { getOACEById, createOACE, updateOACE, deleteOACE } from '../../../api/crud_modelos/oace';
import { useParams } from 'react-router-dom';

const fields = [
  { name: 'nombre', label: 'Nombre', type: 'text', required: true, placeholder: 'Ingrese nombre' },
  { name: 'siglas', label: 'Siglas', type: 'text', required: true, placeholder: 'Ingrese siglas' },
  { name: 'descripcion', label: 'Descripción', type: 'text', required: false, placeholder: 'Ingrese descripción del OACE (opcional)' },
  { name: 'direccion_sede_principal', label: 'Dirección', type: 'text', required: false, placeholder: 'Ingrese teléfono de la sede principal (opcional)' },
  { name: 'telefono_sede_principal', label: 'Teléfono', type: 'text', required: false, placeholder: 'Ingrese dirección de la sede principal (opcional)' },
];

export function OACEForm() {
  const { id } = useParams(); 
  return (
    <CrudForm
      title={id ? "Editar OACE" : "Crear OACE"}
      fields={fields}
      getItem={getOACEById}
      createItem={createOACE}
      updateItem={updateOACE}
      deleteItem={deleteOACE}
      basePath="/gestionar/oace"
      itemName="OACE"
    />
  );
}