import { ICitizenError, IComplex, IPossession } from '../../components/types';
import { getComplexes, getBuildings, getPossessions } from '..';
import { refreshRequest } from './Main';
import request from 'axios';
import { errorAlert } from './Main';

export const getComplexesRequest = async (logout: () => void): Promise<IComplex[] | void> => {
  try {
    const response = await getComplexes();
    if (response.status === 200) return response.data;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status !== 401 && e.response.status !== 400) errorAlert(e.response.statusText);
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) getComplexesRequest(logout);
        if (refresh_status === 403) logout();
      }
    }
  }
};

export const getBuildingsRequest = async (
  id: string,
  logout: () => void,
): Promise<IPossession[] | void> => {
  try {
    const response = await getBuildings(id);
    if (response.status === 200) return response.data;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status !== 401 && e.response.status !== 400) errorAlert(e.response.statusText);
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) getBuildingsRequest(id, logout);
        if (refresh_status === 403) logout();
      }
    }
  }
};

export const getPossessionsRequest = async (
  id: number,
  type: string,
  building: string,
  logout: () => void,
): Promise<IPossession[] | ICitizenError | void> => {
  try {
    const response = await getPossessions(type, building);
    if (!('type' in response.data)) {
      return response.data;
    }
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status !== 401 && e.response.status !== 400) errorAlert(e.response.statusText);
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) getPossessionsRequest(id, type, building, logout);
        if (refresh_status === 403) logout();
      }
      if (e.response.status === 400) return { form_id: id, error: e.response.data };
    }
  }
};
