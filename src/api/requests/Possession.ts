import {
  IApprovePossessionRequest,
  ICitizenError,
  IComplex,
  IError,
  IPossession,
} from '../../components/types';
import {
  getComplexes,
  getBuildings,
  getPossessions,
  createPossession,
  getPossessionsByComplexes,
} from '..';
import { refreshRequest } from './Main';
import request from 'axios';
import { errorAlert } from './Main';

export const getComplexesRequest = async (logout: () => void): Promise<IComplex[] | void> => {
  const makeComplexesRequest = async (): Promise<IComplex[] | 401 | void> => {
    try {
      const response = await getComplexes();
      return response.data;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        if (e.response.status !== 400 && e.response.status !== 401) errorAlert(e.response.status);
      }
    }
  };

  const response = await makeComplexesRequest();
  if (!response) return;

  if (response === 401) {
    const refresh_status = await refreshRequest();
    if (refresh_status === 200) {
      const response = await makeComplexesRequest();
      if (!response) return;

      if (response !== 401) return response;
    }
    if (refresh_status === 403) logout();
  } else return response;
};

export const getBuildingsRequest = async (
  id: string,
  logout: () => void,
): Promise<IPossession[] | void> => {
  const makeBuildingsRequest = async (): Promise<IPossession[] | 401 | void> => {
    try {
      const response = await getBuildings(id);
      return response.data;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        if (e.response.status !== 400 && e.response.status !== 401) errorAlert(e.response.status);
      }
    }
  };

  const response = await makeBuildingsRequest();
  if (!response) return;

  if (response === 401) {
    const refresh_status = await refreshRequest();
    if (refresh_status === 200) {
      const response = await makeBuildingsRequest();
      if (!response) return;

      if (response !== 401) return response;
    }
    if (refresh_status === 403) logout();
  } else return response;
};

export const getPossessionsRequest = async (
  id: number,
  type: string,
  building: string,
  logout: () => void,
): Promise<IPossession[] | ICitizenError | void> => {
  const makePossessionsRequest = async (): Promise<IPossession[] | 401 | ICitizenError | void> => {
    try {
      const response = await getPossessions(type, building);
      if (!('type' in response.data)) return response.data;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        else {
          if (e.response.status === 400) return { form_id: id, error: e.response.data };
          else errorAlert(e.response.status);
        }
      }
    }
  };

  const response = await makePossessionsRequest();
  if (!response) return;

  if (response === 401) {
    const refresh_status = await refreshRequest();
    if (refresh_status === 200) {
      const response = await makePossessionsRequest();
      if (response && typeof response !== 'number') return response;
    }
    if (refresh_status === 403) logout();
  } else return response;
};

export const getPossessionsByComplexesRequest = async (
  logout: () => void,
): Promise<IPossession[] | ICitizenError | void> => {
  const possessionRequest = async (): Promise<IPossession[] | 401 | ICitizenError | void> => {
    try {
      const response = await getPossessionsByComplexes();
      if (!('type' in response.data)) return response.data;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        else {
          if (e.response.status === 400) return { form_id: 0, error: e.response.data };
          else errorAlert(e.response.status);
        }
      }
    }

    const response = await possessionRequest();
    if (!response) return;

    if (response === 401) {
      const refresh_status = await refreshRequest();
      if (refresh_status === 200) {
        const response = await possessionRequest();
        if (response && typeof response !== 'number') return response;
      }
      if (refresh_status === 403) logout();
    } else return response;
  };
};

export const createPossessionRequest = async (
  logout: () => void,
  possession: IApprovePossessionRequest,
): Promise<201 | IError | void> => {
  const possessionRequest = async (): Promise<201 | IError | 401 | void> => {
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

  const response = await possessionRequest();
  if (!response) return;

  if (response === 401) {
    const refresh_status = await refreshRequest();
    if (refresh_status === 200) {
      const response = await possessionRequest();
      if (!response) return;

      if (response !== 401) return response;
    }
    if (refresh_status === 403) logout();
  } else return response;
};
