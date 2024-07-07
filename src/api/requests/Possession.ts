import {
  IApprovePossessionRequest,
  IBuilding,
  IComplex,
  IError,
  INotApprovedLivingSpacePagination,
  IPossession,
} from '../../components/types';
import {
  getAllComplexes,
  getAllBuildingsByComplexId,
  getAllBuildings,
  getAllPossessionsWithExtra,
  createPossession,
  getAllNotApprovedPossessions,
  updatePossessionStatusWithExtra,
} from '..';
import { refreshRequest } from './Main';
import request from 'axios';
import { errorAlert } from './Main';
import { cache } from '../instance';

export const getAllComplexesRequest = async (logout: () => void): Promise<IComplex[] | void> => {
  const makeRequest = async (): Promise<IComplex[] | 401 | void> => {
    try {
      const response = await getAllComplexes();
      return response.data;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        if (e.response.status !== 400 && e.response.status !== 401) errorAlert(e.response.status);
      }
    }
  };

  const response = await makeRequest();
  if (!response) return;

  if (response === 401) {
    const refresh_status = await refreshRequest();
    if (refresh_status === 200) {
      const response = await makeRequest();
      if (response !== 401) return response;
      else return;
    }
    if (refresh_status === 403) logout();
  } else return response;
};

export const getAllBuildingsByComplexIdRequest = async (
  complex_id: string,
  logout: () => void,
): Promise<IBuilding[] | void> => {
  const makeRequest = async (): Promise<IBuilding[] | 401 | void> => {
    try {
      let cache_data = cache.building.filter((el) => el.url === `building/getAll/${complex_id}`);
      if (cache_data.length) {
        return cache_data[0].data;
      }
      const response = await getAllBuildingsByComplexId(complex_id);
      return response.data;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        if (e.response.status !== 400 && e.response.status !== 401) errorAlert(e.response.status);
      }
    }
  };

  const response = await makeRequest();
  if (!response) return;

  if (response === 401) {
    const refresh_status = await refreshRequest();
    if (refresh_status === 200) {
      const response = await makeRequest();
      if (response !== 401) return response;
      else return;
    }
    if (refresh_status === 403) logout();
  } else return response;
};

export const getAllBuildingsRequest = async (logout: () => void): Promise<IBuilding[] | void> => {
  const makeRequest = async (): Promise<IBuilding[] | 401 | void> => {
    try {
      let cache_data = cache.building.filter((el) => el.url === `building/getAll`);
      if (cache_data.length) {
        return cache_data[0].data;
      }
      const response = await getAllBuildings();
      return response.data;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        if (e.response.status !== 400 && e.response.status !== 401) errorAlert(e.response.status);
      }
    }
  };

  const response = await makeRequest();
  if (!response) return;

  if (response === 401) {
    const refresh_status = await refreshRequest();
    if (refresh_status === 200) {
      const response = await makeRequest();
      if (response !== 401) return response;
      else return;
    }
    if (refresh_status === 403) logout();
  } else return response;
};

export const getAllPossessionsByExtraRequest = async (
  type: string,
  building: string,
  logout: () => void,
): Promise<IPossession[] | IError | void> => {
  const makeRequest = async (): Promise<IPossession[] | 401 | IError | void> => {
    try {
      const response = await getAllPossessionsWithExtra(type, building);
      if (!('type' in response.data)) return response.data;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        else {
          if (e.response.status === 400) return e.response.data;
          else errorAlert(e.response.status);
        }
      }
    }
  };

  const response = await makeRequest();
  if (!response) return;

  if (response === 401) {
    const refresh_status = await refreshRequest();
    if (refresh_status === 200) {
      const response = await makeRequest();
      if (response !== 401) return response;
      else return;
    }
    if (refresh_status === 403) logout();
  } else return response;
};

export const getAllNotApprovedPossessionsRequest = async (
  logout: () => void,
  page: string,
  page_size: string,
  extra: string,
): Promise<INotApprovedLivingSpacePagination | void> => {
  const makeRequest = async (): Promise<INotApprovedLivingSpacePagination | 401 | void> => {
    try {
      const response = await getAllNotApprovedPossessions(extra, page, page_size);
      if (response.data) return response.data;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        if (e.response.status !== 400 && e.response.status !== 401) errorAlert(e.response.status);
      }
    }
  };

  const response = await makeRequest();
  if (!response) return;

  if (response === 401) {
    const refresh_status = await refreshRequest();
    if (refresh_status === 200) {
      const response = await makeRequest();
      if (response !== 401) return response;
      else return;
    }
    if (refresh_status === 403) logout();
  } else return response;
};

export const updatePossessionStatusWithExtraRequest = async (
  possession_id: string,
  status_id: '1' | '3',
  logout: () => void,
): Promise<200 | void> => {
  const makeRequest = async (): Promise<200 | 401 | void> => {
    try {
      await updatePossessionStatusWithExtra(possession_id, status_id);
      return 200;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        if (e.response.status !== 400 && e.response.status !== 401) errorAlert(e.response.status);
      }
    }
  };

  const response = await makeRequest();
  if (!response) return;

  if (response === 401) {
    const refresh_status = await refreshRequest();
    if (refresh_status === 200) {
      const response = await makeRequest();
      if (response !== 401) return response;
      else return;
    }
    if (refresh_status === 403) logout();
  } else return response;
};

export const createPossessionRequest = async (
  logout: () => void,
  possession: IApprovePossessionRequest,
): Promise<201 | IError | void> => {
  const makeRequest = async (): Promise<201 | IError | 401 | void> => {
    try {
      await createPossession(possession);
      return 201;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        else {
          if (e.response.status === 400) return e.response.data;
          else errorAlert(e.response.status);
        }
      }
    }
  };

  const response = await makeRequest();
  if (!response) return;

  if (response === 401) {
    const refresh_status = await refreshRequest();
    if (refresh_status === 200) {
      const response = await makeRequest();
      if (response !== 401) return response;
      else return;
    }
    if (refresh_status === 403) logout();
  } else return response;
};
