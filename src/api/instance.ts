import axios from 'axios';
import { ICache } from '../components/types';

export const API_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000/api/'
    : 'https://uslugi.dltex.ru:8000/api/';
export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export let cache: ICache = {
  subtype: [],
  type: [],
  status: [],
  priority: [],
  source: [],
  building: [],
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
  if (config.url?.includes('help')) {
    delete config.headers['Content-Type'];
  }
  return config;
});

axiosInstance.interceptors.response.use((response) => {
  if (response.config.url?.includes('application/type/getAll/')) {
    if (!cache.type.some((el) => el.url === response.config.url))
      cache.type.push({
        url: response.config.url,
        data: response.data,
      });
  }
  if (response.config.url?.includes('application/subtype/getAll')) {
    if (!cache.subtype.some((el) => el.url === response.config.url))
      cache.subtype.push({
        url: response.config.url,
        data: response.data,
      });
  }
  if (response.config.url?.includes('application/source/getAll')) {
    if (!cache.source.some((el) => el.url === response.config.url))
      cache.source.push({
        url: response.config.url,
        data: response.data,
      });
  }
  if (response.config.url?.includes('application/priority/getAll')) {
    if (!cache.priority.some((el) => el.url === response.config.url))
      cache.priority.push({
        url: response.config.url,
        data: response.data,
      });
  }
  if (response.config.url?.includes('application/status/getAll')) {
    if (!cache.status.some((el) => el.url === response.config.url))
      cache.status.push({
        url: response.config.url,
        data: response.data,
      });
  }
  if (response.config.url?.includes('building/getAll')) {
    if (!cache.building.some((el) => el.url === response.config.url))
      cache.building.push({
        url: response.config.url,
        data: response.data,
      });
  }
  return response;
});
