import axios from 'axios';

export const API_URL = `http://91.201.40.39:8000/api`;
export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const array = document.cookie.split(';').filter((el) => el.includes('refresh'));

  if (config.url === '/refresh')
    config.headers['Authorization'] = `Bearer ${array[0].split('=')[1]}`;
  else config.headers['Authorization'] = `Bearer ${localStorage.getItem('access')}`;

  return config;
});
