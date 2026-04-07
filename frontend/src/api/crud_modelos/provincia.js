import axios from '../axios';

const URL = '/provincias/';

export const getAllProvincia = async (page = 1, search = '') => {
  try {
    const params = new URLSearchParams();
    params.append('page', page);
    if (search) params.append('search', search);
    const response = await axios.get(`${URL}?${params.toString()}`);
    return response.data; // { count, results, next, previous }
  } catch (error) {
    console.error('Error al obtener Provincias:', error);
    throw error;
  }
};

export const getProvinciaById = async (id) => {
  try {
    const response = await axios.get(`${URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener Provincia con id ${id}:`, error);
    throw error;
  }
};

export const createProvincia = async (data) => {
  try {
    const response = await axios.post(URL, data);
    return response.data;
  } catch (error) {
    console.error('Error al crear Provincia:', error);
    throw error;
  }
};

export const updateProvincia = async (id, data) => {
  try {
    const response = await axios.put(`${URL}${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar Provincia con id ${id}:`, error);
    throw error;
  }
};

export const deleteProvincia = async (id) => {
  try {
    const response = await axios.delete(`${URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar Provincia con id ${id}:`, error);
    throw error;
  }
};