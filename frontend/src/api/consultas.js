import axios from './axios';


export const getConsumoPorMes = async (anio, unidad = 'kWh') => {
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

export const getTopEntidadesConsumo = async (anio, unidad = 'kWh') => {
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

export const getPdfReportUrl = (consulta, anio = '', entidadId = '', unidad = 'MWh') => {
  const params = new URLSearchParams();
  params.append('consulta', consulta);
  if (anio) params.append('anio', anio);
  if (entidadId) params.append('entidadId', entidadId);
  if (unidad) params.append('unidad', unidad);
  
  const baseURL = axios.defaults.baseURL || '';
  return `${baseURL}/generar-pdf/?${params.toString()}`;
};