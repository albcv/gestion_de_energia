import axios from '../axios';

const URL = '/nae/';

// Para el índice: obtiene una página con filtro de búsqueda
export const getAllNAE = async (page = 1, search = '') => {
  try {
    const params = new URLSearchParams();
    params.append('page', page);
    if (search) params.append('search', search);
    const response = await axios.get(`${URL}?${params.toString()}`);
    return response.data; // { count, results, next, previous }
  } catch (error) {
    console.error('Error al obtener NAEs:', error);
    throw error;
  }
};

// Para el autoselect en formularios: busca y devuelve array de opciones
export const searchNAE = async (searchTerm) => {
  try {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    const response = await axios.get(`${URL}?${params.toString()}`);
    const data = response.data.results || response.data;
    return data.map(n => ({ value: n.id, label: `${n.codigo} - ${n.actividad}` }));
  } catch (error) {
    console.error('Error al buscar NAEs:', error);
    return [];
  }
};

// Las demás funciones se mantienen igual
export const getNAEById = async (id) => {
  try {
    const response = await axios.get(`${URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener NAE con id ${id}:`, error);
    throw error;
  }
};

export const createNAE = async (data) => {
  try {
    const response = await axios.post(URL, data);
    return response.data;
  } catch (error) {
    console.error('Error al crear NAE:', error);
    throw error;
  }
};

export const updateNAE = async (id, data) => {
  try {
    const response = await axios.put(`${URL}${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar NAE con id ${id}:`, error);
    throw error;
  }
};

export const deleteNAE = async (id) => {
  try {
    const response = await axios.delete(`${URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar NAE con id ${id}:`, error);
    throw error;
  }
};