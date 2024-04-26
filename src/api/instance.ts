import axios from 'axios';
import { ICache } from '../components/types';

export const API_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000/api/'
    : 'https://uslugi.dltex.ru/api/';
export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export let cache: ICache = {
  subtype: [],
};

axiosInstance.interceptors.request.use((config) => {
  let refresh = '';
  let access = '';
  const cookie_array = document.cookie.split(';').filter((el) => el.includes('refresh'));

  const store = localStorage.getItem('access');
  if (store) access = store;

  if (cookie_array.length) refresh = cookie_array[0].split('=')[1];

  if (config.url === 'refresh') config.headers['Authorization'] = `Bearer ${refresh}`;
  else config.headers['Authorization'] = `Bearer ${access}`;

  return config;
});

axiosInstance.interceptors.response.use((response) => {
  if (response.config.url?.includes('appSubtype/')) {
    if (!cache.subtype.some((el) => el.url === response.config.url))
      cache.subtype.push({
        url: response.config.url,
        data: response.data,
      });
  }
  return response;
});
