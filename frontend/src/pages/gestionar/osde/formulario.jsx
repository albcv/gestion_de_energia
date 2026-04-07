import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CrudForm } from '../../../components/CrudForm';
import { getOSDEById, createOSDE, updateOSDE, deleteOSDE } from '../../../api/crud_modelos/osde';
import { getAllOACE } from '../../../api/crud_modelos/oace';

export function OSDEForm() {
  const { id } = useParams();
  const [oaceOptions, setOaceOptions] = useState([]);

  useEffect(() => {
    const loadOACE = async () => {
      try {
        const data = await getAllOACE();
        setOaceOptions(data.results.map(o => ({ value: o.id, label: o.nombre })));
      } catch (error) {
        console.error('Error cargando OACE', error);
      }
    };
    loadOACE();
  }, []);

  const fields = [
    { name: 'nombre', label: 'Nombre', type: 'text', required: true, placeholder: 'Ingrese nombre' },
    { name: 'siglas', label: 'Siglas', type: 'text', required: true, placeholder: 'Ingrese siglas' },
    { 
      name: 'oace', 
      label: 'OACE', 
      type: 'select', 
      required: false, 
      options: oaceOptions 
    },
  { name: 'descripcion', label: 'Descripción', type: 'text', required: false, placeholder: 'Ingrese descripción del OSDE (opcional)' },
  { name: 'direccion_sede_principal', label: 'Dirección', type: 'text', required: false, placeholder: 'Ingrese teléfono de la sede principal (opcional)' },
  { name: 'telefono_sede_principal', label: 'Teléfono', type: 'text', required: false, placeholder: 'Ingrese dirección de la sede principal (opcional)' },
  ];

  return (
    <CrudForm
      title={id ? "Editar OSDE" : "Crear OSDE"}
      fields={fields}
      getItem={getOSDEById}
      createItem={createOSDE}
      updateItem={updateOSDE}
      deleteItem={deleteOSDE}
      basePath="/gestionar/osde"
      itemName="OSDE"
    />
  );
}