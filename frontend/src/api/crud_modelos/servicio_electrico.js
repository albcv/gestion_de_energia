import axios from '../axios';

const URL = '/servicios-electricos/';

export const getAllServicioElectrico = async (page = 1, search = '') => {
  try {
    const params = new URLSearchParams();
    params.append('page', page);
    if (search) params.append('search', search);
    const response = await axios.get(`${URL}?${params.toString()}`);
    return response.data; // { count, results, next, previous }
  } catch (error) {
    console.error('Error al obtener Servicios Eléctricos:', error);
    throw error;
  }
};

export const getServicioElectricoById = async (id) => {
  try {
    const response = await axios.get(`${URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener Servicio Eléctrico con id ${id}:`, error);
    throw error;
  }
};

export const createServicioElectrico = async (data) => {
  try {
    const response = await axios.post(URL, data);
    return response.data;
  } catch (error) {
    console.error('Error al crear Servicio Eléctrico:', error);
    throw error;
  }
};

export const updateServicioElectrico = async (id, data) => {
  try {
    const response = await axios.put(`${URL}${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar Servicio Eléctrico con id ${id}:`, error);
    throw error;
  }
};

export const deleteServicioElectrico = async (id) => {
  try {
    const response = await axios.delete(`${URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar Servicio Eléctrico con id ${id}:`, error);
    throw error;
  }
};

// Función para búsqueda asíncrona (usada en formularios)
export const searchServicioElectrico = async (searchTerm) => {
  try {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    const response = await axios.get(`${URL}?${params.toString()}`);
    const data = response.data.results || response.data;
    return data.map(s => ({ value: s.id, label: s.codigo_servicio }));
  } catch (error) {
    console.error('Error al buscar servicios eléctricos:', error);
    return [];
  }
};