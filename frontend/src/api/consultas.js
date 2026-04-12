import axios from './axios';


export const getConsumoPorMes = async (anio) => {
  const response = await axios.get(`/consultas/consumo-por-mes/?anio=${anio}`);
  return response.data;
};


export const getTopEntidadesConsumo = async (anio) => {
  try {
    const response = await axios.get(`/consultas/top-entidades/${anio}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener top entidades para año ${anio}:`, error);
    throw error;
  }
};