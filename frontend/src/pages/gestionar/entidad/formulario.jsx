import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CrudForm } from '../../../components/CrudForm';
import { getEntidadById, deleteEntidad } from '../../../api/crud_modelos/entidad/entidad.js';
import { createEntidadPresupuestada, updateEntidadPresupuestada } from '../../../api/crud_modelos/entidad/entidad_presupuestada';
import { createEntidadEmpresarial, updateEntidadEmpresarial } from '../../../api/crud_modelos/entidad/entidad_empresarial';
import { searchNAE } from '../../../api/crud_modelos/nae';
import { getAllMunicipio } from '../../../api/crud_modelos/municipio';
import { toast } from 'react-hot-toast';

export function EntidadForm() {
  const { id } = useParams();
 
  const [municipioOptions, setMunicipioOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [tipoOptions] = useState([
    { value: 'presupuestada', label: 'Presupuestada' },
    { value: 'empresarial', label: 'Empresarial' }
  ]);

  const [director, setDirector] = useState(null);
  const [loadingDirector, setLoadingDirector] = useState(false);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [municipioData] = await Promise.all([
       
          getAllMunicipio()
        ]);
      
        setMunicipioOptions(municipioData.results.map(m => ({ value: m.id, label: `${m.nombre} (${m.provincia_nombre})` })));
      } catch (error) {
        console.error('Error cargando opciones', error);
        toast.error('Error al cargar opciones');
      } finally {
        setLoadingOptions(false);
      }
    };
    loadOptions();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchEntidad = async () => {
        setLoadingDirector(true);
        try {
          const data = await getEntidadById(id);
          setDirector(data.director || null);
        } catch (error) {
          console.error('Error cargando entidad para director:', error);
        } finally {
          setLoadingDirector(false);
        }
      };
      fetchEntidad();
    }
  }, [id]);

  const getItemWithLabel = async (id) => {
    const data = await getEntidadById(id);
    if (data.nae && data.nae_codigo && data.nae_nombre) {
      data.nae = {
        value: data.nae,
        label: `${data.nae_codigo} - ${data.nae_nombre}`
      };
    } else if (data.nae && data.nae_nombre) {
      data.nae = {
        value: data.nae,
        label: data.nae_nombre
      };
    }
    return data;
  };

  const allFields = [
    { name: 'nombre', label: 'Nombre', type: 'text', required: true, placeholder: 'Ingrese nombre' },
    { name: 'tipo', label: 'Tipo de entidad', type: 'select', required: true, options: tipoOptions },
    { name: 'codigo_REEUP', label: 'Código REEUP', type: 'text', required: true, placeholder: '211.0.06761' },
    { name: 'municipio', label: 'Municipio', type: 'select', required: true, options: municipioOptions },
  
    { 
      name: 'nae', 
      label: 'NAE', 
      type: 'autoselect', 
      required: false, 
      loadOptions: searchNAE,
      placeholder: 'Buscar NAE por código o actividad...' 
    },
   
    { name: 'siglas', label: 'Siglas', type: 'text', required: false, placeholder: 'Siglas (opcional)' },
    { name: 'cuenta_bancaria', label: 'Cuenta bancaria', type: 'text', required: false, placeholder: '16 dígitos' },
    { name: 'telefono', label: 'Teléfono', type: 'text', required: false, placeholder: 'Teléfono (opcional)' },
    { name: 'NIT', label: 'NIT', type: 'text', required: false, placeholder: 'NIT (opcional)' },
    { name: 'direccion', label: 'Dirección', type: 'text', required: false, placeholder: 'Dirección (opcional)' },
    { name: 'geolocalizacion', label: 'Geolocalización', type: 'text', required: false, placeholder: 'lat,lon (opcional)' },
   
  ];

  const getCreateFunction = (tipo) => {
    return tipo === 'presupuestada' ? createEntidadPresupuestada : createEntidadEmpresarial;
  };
  const getUpdateFunction = (tipo) => {
    return tipo === 'presupuestada' ? updateEntidadPresupuestada : updateEntidadEmpresarial;
  };

  const createItem = async (data) => {
    await getCreateFunction(data.tipo)(data);
  };

  const updateItem = async (id, data) => {
    await getUpdateFunction(data.tipo)(id, data);
  };

  if (loadingOptions) {
    return <div className="text-center py-12">Cargando opciones...</div>;
  }

  return (
    <div className="bg-yellow-200 min-h-screen p-6">
      <div className="container mx-auto max-w-2xl">
        <CrudForm
          title={id ? "Editar Entidad" : "Crear Entidad"}
          fields={allFields}
          getItem={getItemWithLabel}
          createItem={createItem}
          updateItem={updateItem}
          deleteItem={deleteEntidad}  
          basePath="/gestionar/entidad"
          itemName="Entidad"
        >
          {/* Sección de director */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Director</h2>
            {id ? (
              loadingDirector ? (
                <p className="text-gray-600">Cargando información del director...</p>
              ) : director ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="mb-2">
                    <span className="font-medium">Director asignado:</span> {director.nombre} {director.apellido1} {director.apellido2}
                  </p>
                  <Link
                    to={`/gestionar/director/editar/${director.id}`}
                    className="inline-block px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Editar director
                  </Link>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">No hay director asignado.</p>
                  <Link
                    to={`/gestionar/director/crear?entidad_id=${id}`}
                    className="inline-block px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Asignar director
                  </Link>
                </div>
              )
            ) : (
              <div>
                <Link
                  to="/gestionar/director/crear"
                  className="inline-block px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Asignar director
                </Link>
              </div>
            )}
          </div>
        </CrudForm>
      </div>
    </div>
  );
}