import axios from '../axios';

const URL = '/portadores-energeticos/';

export const getPortadoresFiltrados = async (filters = {}, page = 1) => {
  try {
    const params = { ...filters, page };
    if (filters.search) params.search = filters.search; 
    const query = new URLSearchParams(params).toString();
    const response = await axios.get(`${URL}?${query}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener portadores filtrados:', error);
    throw error;
  }
};

export const getAniosDisponibles = async () => {
  try {
    const response = await axios.get(`${URL}anios_disponibles/`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener años disponibles:', error);
    throw error;
  }
};

export const getAllPortadorEnergeticoElec = async () => {
  const response = await axios.get(URL);
  return response.data;
};

export const getPortadorEnergeticoElecById = async (id) => {
  const response = await axios.get(`${URL}${id}/`);
  return response.data;
};

export const createPortadorEnergeticoElec = async (data) => {
  const response = await axios.post(URL, data);
  return response.data;
};

export const updatePortadorEnergeticoElec = async (id, data) => {
  const response = await axios.put(`${URL}${id}/`, data);
  return response.data;
};

export const deletePortadorEnergeticoElec = async (id) => {
  const response = await axios.delete(`${URL}${id}/`);
  return response.data;
};


