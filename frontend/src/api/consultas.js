import axios from './axios';


export const getConsumoPorMes = async (anio, unidad = 'kW') => {
  try {
    const response = await axios.get(`/consultas/consumo-por-mes/`, {
      params: { anio, unidad }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener consumo por mes:', error);
    throw error;
  }
};

export const getTopEntidadesConsumo = async (anio, unidad = 'kW') => {
  try {
    const response = await axios.get(`/consultas/top-entidades/${anio}/`, {
      params: { unidad }
    });
    return response.data;
  } catch (error) {
    console.error(`Error al obtener top entidades para año ${anio}:`, error);
    throw error;
  }
};