import { CrudDetail } from '../../../components/CrudDetail';
import { getPortadorEnergeticoElecById, deletePortadorEnergeticoElec } from '../../../api/crud_modelos/portador_energetico_elec';

const fields = [
  { key: 'consumo_planificado', label: 'Consumo planificado' },
  { key: 'consumo_real_con_unidad', label: 'Consumo real' },  
  { key: 'mes_nombre', label: 'Mes' },
  { key: 'año', label: 'Año' },
  { key: 'servicio_codigo', label: 'Servicio eléctrico' },
  { key: 'created_at', label: 'Creado' },
  { key: 'updated_at', label: 'Actualizado' },
];

export function PortadorEnergeticoElecDetail() {
  return (
    <CrudDetail
      title="Detalles del Portador Energético"
      getItem={getPortadorEnergeticoElecById}
      deleteItem={deletePortadorEnergeticoElec}
      fields={fields}
      basePath="/gestionar/portador_energetico_elec"
      itemName="Portador energético de electricidad"
    />
  );
}