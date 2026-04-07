import axios from '../axios';

const URL = '/establecimientos/';

export const getAllEstablecimiento = async (page = 1, search = '') => {
  try {
    const params = new URLSearchParams();
    params.append('page', page);
    if (search) params.append('search', search);
    const response = await axios.get(`${URL}?${params.toString()}`);
    return response.data; // { count, results, next, previous }
  } catch (error) {
    console.error('Error al obtener Establecimientos:', error);
    throw error;
  }
};

export const getEstablecimientoById = async (id) => {
  try {
    const response = await axios.get(`${URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener Establecimiento con id ${id}:`, error);
    throw error;
  }
};

export const createEstablecimiento = async (data) => {
  try {
    const response = await axios.post(URL, data);
    return response.data;
  } catch (error) {
    console.error('Error al crear Establecimiento:', error);
    throw error;
  }
};

export const updateEstablecimiento = async (id, data) => {
  try {
    const response = await axios.put(`${URL}${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar Establecimiento con id ${id}:`, error);
    throw error;
  }
};

export const deleteEstablecimiento = async (id) => {
  try {
    const response = await axios.delete(`${URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar Establecimiento con id ${id}:`, error);
    throw error;
  }
};