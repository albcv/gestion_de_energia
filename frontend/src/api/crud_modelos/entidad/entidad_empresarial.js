import axios from '../../axios';

const URL = '/entidades_emp/';

export const getAllEntidadEmpresarial = async () => {
  try {
    const response = await axios.get(URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener Entidades:', error);
    throw error;
  }
};

export const getEntidadEmpresarialById = async (id) => {
  try {
    const response = await axios.get(`${URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener Entidad con id ${id}:`, error);
    throw error;
  }
};

export const createEntidadEmpresarial = async (data) => {
  try {
    const response = await axios.post(URL, data);
    return response.data;
  } catch (error) {
    console.error('Error al crear Entidad:', error);
    throw error;
  }
};

export const updateEntidadEmpresarial = async (id, data) => {
  try {
    const response = await axios.put(`${URL}${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar Entidad con id ${id}:`, error);
    throw error;
  }
};

export const deleteEntidadEmpresarial = async (id) => {
  try {
    const response = await axios.delete(`${URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar Entidad con id ${id}:`, error);
    throw error;
  }
};