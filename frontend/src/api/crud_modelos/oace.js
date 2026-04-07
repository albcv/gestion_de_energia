import axios from '../axios';

const URL = '/oace/';

export const getAllOACE = async (page = 1, search = '') => {
  try {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (search) params.append('search', search);
    const response = await axios.get(`${URL}?${params.toString()}`);
    return response.data; // { count, results, next, previous }
  } catch (error) {
    console.error('Error al obtener OACE:', error);
    throw error;
  }
};

// Las demás funciones (getById, create, update, delete) se mantienen igual
export const getOACEById = async (id) => {
  const response = await axios.get(`${URL}${id}/`);
  return response.data;
};

export const createOACE = async (data) => {
  const response = await axios.post(URL, data);
  return response.data;
};

export const updateOACE = async (id, data) => {
  const response = await axios.put(`${URL}${id}/`, data);
  return response.data;
};

export const deleteOACE = async (id) => {
  const response = await axios.delete(`${URL}${id}/`);
  return response.data;
};