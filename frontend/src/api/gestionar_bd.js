import axios from './axios';

export const realizarBackup = async () => {
  const response = await axios.get('backup/', {
    responseType: 'blob',  
  });
  return response;
};