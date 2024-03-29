import {
  IApprovePossessionRequest,
  IBuildingWithComplex,
  ICitizenError,
  IComplex,
  IError,
  INotApprovedPossessions,
  IPossession,
} from '../../components/types';
import {
  getComplexes,
  getBuildings,
  getPossessions,
  createPossession,
  getNotApprovedPossessions,
  rejectPossession,
  approvePossession,
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
): Promise<IBuildingWithComplex[] | void> => {
  const makeBuildingsRequest = async (): Promise<IBuildingWithComplex[] | 401 | void> => {
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

export const getNotApprovedPossessionsRequest = async (
  logout: () => void,
): Promise<INotApprovedPossessions[] | void> => {
  const makeRequest = async (): Promise<INotApprovedPossessions[] | 401 | void> => {
    try {
      const response = await getNotApprovedPossessions();
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
      if (response && typeof response !== 'number') return response;
    }
    if (refresh_status === 403) logout();
  } else return response;
};

export const approvePossessionRequest = async (
  logout: () => void,
  id: string,
): Promise<200 | void> => {
  const possessionRequest = async (): Promise<200 | 401 | void> => {
    try {
      await approvePossession(id);
      return 200;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        if (e.response.status !== 400 && e.response.status !== 401) errorAlert(e.response.status);
      }
    }
  };

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

export const rejectPossessionRequest = async (
  logout: () => void,
  id: string,
): Promise<200 | void> => {
  const possessionRequest = async (): Promise<200 | 401 | void> => {
    try {
      await rejectPossession(id);
      return 200;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        if (e.response.status !== 400 && e.response.status !== 401) errorAlert(e.response.status);
      }
    }
  };

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
