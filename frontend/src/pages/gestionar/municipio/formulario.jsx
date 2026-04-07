import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CrudForm } from '../../../components/CrudForm';
import { getMunicipioById, createMunicipio, updateMunicipio, deleteMunicipio } from '../../../api/crud_modelos/municipio';
import { getAllProvincia } from '../../../api/crud_modelos/provincia';

export function MunicipioForm() {
  const { id } = useParams();
  const [provinciaOptions, setProvinciaOptions] = useState([]);

  useEffect(() => {
    const loadProvincias = async () => {
      try {
        const data = await getAllProvincia();
        setProvinciaOptions(data.results.map(p => ({ value: p.id, label: p.nombre })));
      } catch (error) {
        console.error('Error cargando provincias', error);
      }
    };
    loadProvincias();
  }, []);

  const fields = [
    { name: 'nombre', label: 'Nombre', type: 'text', required: true, placeholder: 'Ingrese nombre' },
    { 
      name: 'provincia', 
      label: 'Provincia', 
      type: 'select', 
      required: true, 
      options: provinciaOptions 
    },
    { name: 'codigo_DPA', label: 'Código_DPA', type: 'text', required: true, placeholder: 'Ingrese código DPA' },
  ];

  return (
    <CrudForm
      title={id ? "Editar Municipio" : "Crear Municipio"}
      fields={fields}
      getItem={getMunicipioById}
      createItem={createMunicipio}
      updateItem={updateMunicipio}
      deleteItem={deleteMunicipio}
      basePath="/gestionar/municipio"
      itemName="Municipio"
    />
  );
}