import axios from '../../axios';

const URL = '/entidades_pre/';

export const getAllEntidadPresupuestada = async () => {
  try {
    const response = await axios.get(URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener Entidades:', error);
    throw error;
  }
};

export const getEntidadPresupuestadaById = async (id) => {
  try {
    const response = await axios.get(`${URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener Entidad con id ${id}:`, error);
    throw error;
  }
};

export const createEntidadPresupuestada = async (data) => {
  try {
    const response = await axios.post(URL, data);
    return response.data;
  } catch (error) {
    console.error('Error al crear Entidad:', error);
    throw error;
  }
};

export const updateEntidadPresupuestada = async (id, data) => {
  try {
    const response = await axios.put(`${URL}${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar Entidad con id ${id}:`, error);
    throw error;
  }
};

export const deleteEntidadPresupuestada = async (id) => {
  try {
    const response = await axios.delete(`${URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar Entidad con id ${id}:`, error);
    throw error;
  }
};