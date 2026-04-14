import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CrudForm } from '../../../components/CrudForm';
import { getPortadorEnergeticoElecById, createPortadorEnergeticoElec, updatePortadorEnergeticoElec, deletePortadorEnergeticoElec } from '../../../api/crud_modelos/portador_energetico_elec';
import { searchServicioElectrico } from '../../../api/crud_modelos/servicio_electrico';
import { getAllUnidadMedida } from '../../../api/crud_modelos/unidad_medida';

// Opciones para el select de meses
const mesesOptions = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' }
];

export function PortadorEnergeticoElecForm() {
  const { id } = useParams();
  const [unidadMedidaOptions, setUnidadMedidaOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUnidades = async () => {
      try {
        const unidades = await getAllUnidadMedida();
        setUnidadMedidaOptions(unidades.results.map(u => ({ value: u.id, label: u.unidad })));
      } catch (error) {
        console.error('Error cargando opciones de unidad de medida', error);
      } finally {
        setLoading(false);
      }
    };
    loadUnidades();
  }, []);

  // Transforma el campo servicio a objeto para el autoselect en modo edición
  const getItemWithLabel = async (id) => {
    const data = await getPortadorEnergeticoElecById(id);
    if (data.servicio && data.servicio_codigo) {
      data.servicio = {
        value: data.servicio,
        label: data.servicio_codigo
      };
    }
    return data;
  };

  const fields = [
    { name: 'consumo_planificado', label: 'Consumo planificado', type: 'number', required: false, placeholder: 'Opcional', step: 'any' },
    { name: 'consumo_real', label: 'Consumo real', type: 'number', required: true, placeholder: 'Ej: 145.2', step: 'any' },
    { 
      name: 'mes', 
      label: 'Mes', 
      type: 'select', 
      required: true, 
      options: mesesOptions 
    },
    { name: 'año', label: 'Año', type: 'number', required: true, placeholder: 'Ej: 2026' },
    { 
      name: 'servicio', 
      label: 'Servicio eléctrico', 
      type: 'autoselect', 
      required: true, 
      loadOptions: searchServicioElectrico,
      placeholder: 'Buscar servicio por código...' 
    },
  
  ];

  if (loading) {
    return <div className="text-center py-12">Cargando opciones...</div>;
  }

  return (
    <CrudForm
      title={id ? "Editar Portador energético" : "Crear Portador energético"}
      fields={fields}
      getItem={id ? getItemWithLabel : undefined}
      createItem={createPortadorEnergeticoElec}
      updateItem={updatePortadorEnergeticoElec}
      deleteItem={deletePortadorEnergeticoElec}
      basePath="/gestionar/portador_energetico_elec"
      itemName="Portador energético de electricidad"
    />
  );
}