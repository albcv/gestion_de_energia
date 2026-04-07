import axios from '../../axios';

const URL = '/entidades/';

export const getAllEntidad = async (page = 1, filters = {}) => {
  try {
    const params = new URLSearchParams({ page });
    if (filters.municipio) params.append('municipio', filters.municipio);
    if (filters.tipo) params.append('tipo', filters.tipo);
    if (filters.sector) params.append('sector', filters.sector);
    if (filters.codigoREEUP) params.append('codigo_REEUP', filters.codigoREEUP);
    if (filters.search) params.append('search', filters.search);
    const response = await axios.get(`${URL}?${params.toString()}`);
    return response.data; // { count, results, next, previous }
  } catch (error) {
    console.error('Error al obtener Entidades:', error);
    throw error;
  }
};

export const getEntidadById = async (id) => {
  try {
    const response = await axios.get(`${URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener Entidad con id ${id}:`, error);
    throw error;
  }
};

export const createEntidad = async (data) => {
  try {
    const response = await axios.post(URL, data);
    return response.data;
  } catch (error) {
    console.error('Error al crear Entidad:', error);
    throw error;
  }
};

export const updateEntidad = async (id, data) => {
  try {
    const response = await axios.put(`${URL}${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar Entidad con id ${id}:`, error);
    throw error;
  }
};

export const deleteEntidad = async (id) => {
  try {
    const response = await axios.delete(`${URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar Entidad con id ${id}:`, error);
    throw error;
  }
};

export const searchEntidad = async (searchTerm) => {
  try {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    const response = await axios.get(`${URL}?${params.toString()}`);
    const data = response.data.results || response.data;
    return data.map(e => ({ value: e.id, label: e.nombre }));
  } catch (error) {
    console.error('Error al buscar entidades:', error);
    return [];
  }
};