import axios from '../axios';

const URL = '/organismo/';

export const getAllOrganismo = async (page = 1, search = '') => {
  try {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (search) params.append('search', search);
    const response = await axios.get(`${URL}?${params.toString()}`);
    return response.data; // { count, results, next, previous }
  } catch (error) {
    console.error('Error al obtener Organismo:', error);
    throw error;
  }
};


export const getOrganismoById = async (id) => {
  const response = await axios.get(`${URL}${id}/`);
  return response.data;
};

export const createOrganismo = async (data) => {
  const response = await axios.post(URL, data);
  return response.data;
};

export const updateOrganismo = async (id, data) => {
  const response = await axios.put(`${URL}${id}/`, data);
  return response.data;
};

export const deleteOrganismo = async (id) => {
  const response = await axios.delete(`${URL}${id}/`);
  return response.data;
};


// Función para búsqueda asíncrona (usada en AsyncSelect)
export const searchOrganismo = async (searchTerm) => {
  try {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    const response = await axios.get(`${URL}?${params.toString()}`);
    const data = response.data.results || response.data;
    return data.map(o => ({ value: o.codigo, label: `${o.codigo} - ${o.nombre}` }));
  } catch (error) {
    console.error('Error al buscar organismos:', error);
    return [];
  }
};