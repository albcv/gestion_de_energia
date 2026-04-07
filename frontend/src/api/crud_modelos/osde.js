import axios from '../axios';

const URL = '/osde/';

export const getAllOSDE = async (page = 1, search = '') => {
  try {
    const params = new URLSearchParams();
    params.append('page', page);
    if (search) params.append('search', search);
    const response = await axios.get(`${URL}?${params.toString()}`);
    return response.data; // Debe contener { count, results, next, previous }
  } catch (error) {
    console.error('Error al obtener OSDE:', error);
    throw error;
  }
};

export const getOSDEById = async (id) => {
  try {
    const response = await axios.get(`${URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener OSDE con id ${id}:`, error);
    throw error;
  }
};

export const createOSDE = async (data) => {
  try {
    const response = await axios.post(URL, data);
    return response.data;
  } catch (error) {
    console.error('Error al crear OSDE:', error);
    throw error;
  }
};

export const updateOSDE = async (id, data) => {
  try {
    const response = await axios.put(`${URL}${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar OSDE con id ${id}:`, error);
    throw error;
  }
};

export const deleteOSDE = async (id) => {
  try {
    const response = await axios.delete(`${URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar OSDE con id ${id}:`, error);
    throw error;
  }
};