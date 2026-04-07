import axios from '../axios';

const URL = '/sectores-economicos/';

export const getAllSectorEconomico = async (page = 1, search = '') => {
  try {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (search) params.append('search', search);
    const response = await axios.get(`${URL}?${params.toString()}`);
    // La respuesta paginada contiene { count, results, next, previous }
    return response.data;
  } catch (error) {
    console.error('Error al obtener Sectores Económicos:', error);
    throw error;
  }
};

export const getSectorEconomicoById = async (id) => {
  try {
    const response = await axios.get(`${URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener Sector Económico con id ${id}:`, error);
    throw error;
  }
};

export const createSectorEconomico = async (data) => {
  try {
    const response = await axios.post(URL, data);
    return response.data;
  } catch (error) {
    console.error('Error al crear Sector Económico:', error);
    throw error;
  }
};

export const updateSectorEconomico = async (id, data) => {
  try {
    const response = await axios.put(`${URL}${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar Sector Económico con id ${id}:`, error);
    throw error;
  }
};

export const deleteSectorEconomico = async (id) => {
  try {
    const response = await axios.delete(`${URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar Sector Económico con id ${id}:`, error);
    throw error;
  }
};