import axios from './axios';

export const fetchCsrfCookie = async () => {
  await axios.get('/csrf/');
};

export const loginUser = async (username, password) => {
  const response = await axios.post('/login/', { username, password });
  return response.data; // { user: {...} }
};

export const logoutUser = async () => {
  await axios.post('/logout/');
};

export const getPerfil = async () => {
  const response = await axios.get('/perfil/');
  return response.data;
};

export const cambiarPassword = async (current_password, new_password) => {
  const response = await axios.post('/cambiar-password/', { current_password, new_password });
  return response.data;
};