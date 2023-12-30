import {
  IApplicationRequest,
  IEmployee,
  IGrade,
  IPriority,
  ISource,
  IStatus,
  IType,
} from '../../components/types';
import {
  createApplication,
  getApplication,
  getEmployee,
  getGrade,
  getPriority,
  getSource,
  getStatus,
  getType,
  updateApplication,
} from '..';
import { IApplication, IError } from '../../components/types';
import request from 'axios';
import { refreshRequest } from './Main';
import { errorAlert } from './Main';

export const getApplicationsRequest = async (
  logout: () => void,
): Promise<IApplication[] | void> => {
  try {
    const response = await getApplication();
    return response.data;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) getApplicationsRequest(logout);
        if (refresh_status === 403) logout();
      } else errorAlert(e.response.statusText);
    }
  }
};

export const createApplicationsRequest = async (
  logout: () => void,
  application: IApplicationRequest,
): Promise<IError | 201 | void> => {
  try {
    await createApplication(application);
    return 201;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.data !== 401 && e.response.data !== 400) errorAlert(e.response.statusText);
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) createApplicationsRequest(logout, application);
        if (refresh_status === 403) logout();
      }
      if (e.response.status === 400) return e.response.data;
    }
  }
};

export const updateApplicationsRequest = async (
  id: number,
  logout: () => void,
  application: IApplicationRequest,
): Promise<IError | 200 | void> => {
  try {
    await updateApplication(id, application);
    return 200;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status !== 401 && e.response.status !== 400) errorAlert(e.response.statusText);

      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) updateApplicationsRequest(id, logout, application);
        if (refresh_status === 403) logout();
      }
      if (e.response.status === 400) return e.response.data;
    }
  }
};

export const getEmploysRequest = async (logout: () => void): Promise<IEmployee[] | void> => {
  try {
    const response = await getEmployee();
    if (response.data) return response.data;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status !== 401 && e.response.status !== 400) errorAlert(e.response.statusText);
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) getEmploysRequest(logout);
        if (refresh_status === 403) logout();
      }
    }
  }
};

export const getGradesRequest = async (logout: () => void): Promise<IGrade[] | void> => {
  try {
    const response = await getGrade();
    if (response.data) return response.data;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status !== 401 && e.response.status !== 400) errorAlert(e.response.statusText);
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) getGradesRequest(logout);
        if (refresh_status === 403) logout();
      }
    }
  }
};

export const getTypesRequest = async (logout: () => void): Promise<IType[] | void> => {
  try {
    const response = await getType();
    if (response.data) return response.data;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status !== 401 && e.response.status !== 400) errorAlert(e.response.statusText);
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) getTypesRequest(logout);
        if (refresh_status === 403) logout();
      }
    }
  }
};

export const getStatusesRequest = async (logout: () => void): Promise<IStatus[] | void> => {
  try {
    const response = await getStatus();
    if (response.data) return response.data;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status !== 401 && e.response.status !== 400) errorAlert(e.response.statusText);
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) getStatusesRequest(logout);
        if (refresh_status === 403) logout();
      }
    }
  }
};

export const getPrioritiesRequest = async (logout: () => void): Promise<IPriority[] | void> => {
  try {
    const response = await getPriority();
    if (response.data) return response.data;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status !== 401 && e.response.status !== 400) errorAlert(e.response.statusText);
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) getPrioritiesRequest(logout);
        if (refresh_status === 403) logout();
      }
    }
  }
};

export const getSourcesRequest = async (logout: () => void): Promise<ISource[] | void> => {
  try {
    const response = await getSource();
    if (response.data) return response.data;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status !== 401 && e.response.status !== 400) errorAlert(e.response.statusText);
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) getSourcesRequest(logout);
        if (refresh_status === 403) logout();
      }
    }
  }
};
