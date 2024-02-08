import axios from 'axios';

export const API_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000/api'
    : 'http://uslugi.dltex.ru:8000/api';
export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  let refresh = '';
  let access = '';
  const cookie_array = document.cookie.split(';').filter((el) => el.includes('refresh'));

  const store = localStorage.getItem('access');
  if (store) access = store;

  if (cookie_array.length) refresh = cookie_array[0].split('=')[1];

  if (config.url === '/refresh') config.headers['Authorization'] = `Bearer ${refresh}`;
  else config.headers['Authorization'] = `Bearer ${access}`;

  return config;
});
