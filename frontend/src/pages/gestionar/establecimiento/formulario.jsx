import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CrudForm } from '../../../components/CrudForm';
import { getEstablecimientoById, createEstablecimiento, updateEstablecimiento, deleteEstablecimiento } from '../../../api/crud_modelos/establecimiento';
import { searchServicioElectrico } from '../../../api/crud_modelos/servicio_electrico';
import { getAllMunicipio } from '../../../api/crud_modelos/municipio';

export function EstablecimientoForm() {
  const { id } = useParams();
  const [municipioOptions, setMunicipioOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const municipios = await getAllMunicipio();
        const municipiosList = municipios.results || municipios;
        setMunicipioOptions(municipiosList.map(m => ({ value: m.id, label: `${m.nombre} (${m.provincia_nombre})` })));
      } catch (error) {
        console.error('Error cargando opciones', error);
      } finally {
        setLoadingOptions(false);
      }
    };
    loadOptions();
  }, []);

  // Función para obtener el item y transformar el campo servicio_electrico a objeto
  const getItemWithLabel = async (id) => {
    const data = await getEstablecimientoById(id);
    if (data.servicio_electrico && data.servicio_codigo) {
      data.servicio_electrico = {
        value: data.servicio_electrico,
        label: data.servicio_codigo
      };
    }
    return data;
  };

  const fields = [
    { name: 'nombre', label: 'Nombre', type: 'text', required: true, placeholder: 'Ingrese nombre' },
    { name: 'direccion', label: 'Dirección', type: 'text', required: true, placeholder: 'Dirección completa' },
    { name: 'geolocalizacion', label: 'Geolocalización', type: 'text', required: false, placeholder: 'lat,lon (opcional)' },
    { 
      name: 'servicio_electrico', 
      label: 'Servicio eléctrico', 
      type: 'autoselect', 
      required: true, 
      loadOptions: searchServicioElectrico,
      placeholder: 'Buscar servicio por código...' 
    },
    { name: 'municipio', label: 'Municipio', type: 'select', required: true, options: municipioOptions },
  ];

  if (loadingOptions) {
    return <div className="text-center py-12">Cargando opciones...</div>;
  }

  return (
    <CrudForm
      title={id ? "Editar Establecimiento" : "Crear Establecimiento"}
      fields={fields}
      getItem={getItemWithLabel}
      createItem={createEstablecimiento}
      updateItem={updateEstablecimiento}
      deleteItem={deleteEstablecimiento}
      basePath="/gestionar/establecimiento"
      itemName="Establecimiento"
    />
  );
}