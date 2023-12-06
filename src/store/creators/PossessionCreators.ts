import { ICitizenError, IComplex, IPossession } from './../../components/types';
import { getComplexes, getBuildings, getPossessions } from '../../api';
import { refreshRequest } from './MainCreators';
import request from 'axios';

export const getComplexesRequest = async (): Promise<IComplex[] | 403> => {
  try {
    const response = await getComplexes();
    if (response.status === 200) return response.data;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) {
          const response = await getComplexes();
          if (response.status === 200) return response.data;
        }
      }
    }
  }
  return 403;
};

export const getBuildingsRequest = async (id: string): Promise<IPossession[] | 403> => {
  try {
    const response = await getBuildings(id);
    if (response.status === 200) return response.data;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) {
          const response = await getBuildings(id);
          if (response.status === 200) return response.data;
        }
      }
    }
  }
  return 403;
};

export const getPossessionsRequest = async (
  id: number,
  type: string,
  building: string,
): Promise<IPossession[] | 403 | ICitizenError> => {
  try {
    const response = await getPossessions(type, building);
    if (!('type' in response.data)) {
      return response.data;
    }
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) {
          try {
            const response = await getPossessions(type, building);
            if (!('type' in response.data)) {
              return response.data;
            }
          } catch (e) {
            if (request.isAxiosError(e) && e.response) {
              return { form_id: id, error: e.response.data };
            }
          }
        }
      } else return { form_id: id, error: e.response.data };
    }
  }
  return 403;
};
