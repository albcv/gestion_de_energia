import axios from '../axios';

const URL = '/directores/';

export const getAllDirector = async (page = 1, search = '') => {
  try {
    const params = new URLSearchParams();
    params.append('page', page);
    if (search) params.append('search', search);
    const response = await axios.get(`${URL}?${params.toString()}`);
    return response.data; // { count, results, next, previous }
  } catch (error) {
    console.error('Error al obtener Directores:', error);
    throw error;
  }
};

export const getDirectorById = async (id) => {
  try {
    const response = await axios.get(`${URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener Director con id ${id}:`, error);
    throw error;
  }
};

export const createDirector = async (data) => {
  try {
    const response = await axios.post(URL, data);
    return response.data;
  } catch (error) {
    console.error('Error al crear Director:', error);
    throw error;
  }
};

export const updateDirector = async (id, data) => {
  try {
    const response = await axios.put(`${URL}${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar Director con id ${id}:`, error);
    throw error;
  }
};

export const deleteDirector = async (id) => {
  try {
    const response = await axios.delete(`${URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar Director con id ${id}:`, error);
    throw error;
  }
};