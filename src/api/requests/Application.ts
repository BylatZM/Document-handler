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
  const applicationsRequest = async (): Promise<IApplication[] | 401 | void> => {
    try {
      const response = await getApplication();
      return response.data;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        if (e.response.status !== 400 && e.response.status !== 401)
          errorAlert(e.response.statusText);
      }
    }
  };

  const response = await applicationsRequest();
  if (!response) return;

  if (response === 401) {
    const refresh_status = await refreshRequest();
    if (refresh_status === 200) {
      const response = await applicationsRequest();
      if (!response) return;

      if (response !== 401) return response;
    }
    if (refresh_status === 403) logout();
  } else return response;
};

export const createApplicationsRequest = async (
  logout: () => void,
  application: IApplicationRequest,
): Promise<IError | 201 | void> => {
  const applicationsRequest = async (): Promise<IError | 201 | 401 | void> => {
    try {
      await createApplication(application);
      return 201;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        else {
          if (e.response.status === 400) return e.response.data;
          else errorAlert(e.response.statusText);
        }
      }
    }
  };

  const response = await applicationsRequest();
  if (!response) return;

  if (response === 401) {
    const refresh_status = await refreshRequest();
    if (refresh_status === 200) {
      const response = await applicationsRequest();
      if (!response) return;

      if (response !== 401) return response;
    }
    if (refresh_status === 403) logout();
  } else return response;
};

export const updateApplicationsRequest = async (
  id: number,
  logout: () => void,
  application: IApplicationRequest,
): Promise<IError | 200 | void> => {
  const applicationsRequest = async (): Promise<IError | 200 | 401 | void> => {
    try {
      await updateApplication(id, application);
      return 200;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        else {
          if (e.response.status === 400) return e.response.data;
          else errorAlert(e.response.statusText);
        }
      }
    }
  };

  const response = await applicationsRequest();
  if (!response) return;

  if (response === 401) {
    const refresh_status = await refreshRequest();
    if (refresh_status === 200) {
      const response = await applicationsRequest();
      if (!response) return;

      if (response !== 401) return response;
    }
    if (refresh_status === 403) logout();
  } else return response;
};

export const getEmploysRequest = async (logout: () => void): Promise<IEmployee[] | void> => {
  const employsRequest = async (): Promise<IEmployee[] | 401 | void> => {
    try {
      const response = await getEmployee();
      if (response.data) return response.data;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        if (e.response.status !== 401 && e.response.status !== 400)
          errorAlert(e.response.statusText);
      }
    }
  };

  const response = await employsRequest();
  if (!response) return;

  if (response === 401) {
    const refresh_status = await refreshRequest();
    if (refresh_status === 200) {
      const response = await employsRequest();
      if (!response) return;

      if (response !== 401) return response;
    }
    if (refresh_status === 403) logout();
  } else return response;
};

export const getGradesRequest = async (logout: () => void): Promise<IGrade[] | void> => {
  const gradesRequest = async (): Promise<IGrade[] | 401 | void> => {
    try {
      const response = await getGrade();
      if (response.data) return response.data;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        if (e.response.status !== 401 && e.response.status !== 400)
          errorAlert(e.response.statusText);
      }
    }
  };

  const response = await gradesRequest();
  if (!response) return;

  if (response === 401) {
    const refresh_status = await refreshRequest();
    if (refresh_status === 200) {
      const response = await gradesRequest();
      if (!response) return;

      if (response !== 401) return response;
    }
    if (refresh_status === 403) logout();
  } else return response;
};

export const getTypesRequest = async (logout: () => void): Promise<IType[] | void> => {
  const typesRequest = async (): Promise<IType[] | 401 | void> => {
    try {
      const response = await getType();
      if (response.data) return response.data;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        if (e.response.status !== 401 && e.response.status !== 400)
          errorAlert(e.response.statusText);
      }
    }
  };

  const response = await typesRequest();
  if (!response) return;

  if (response === 401) {
    const refresh_status = await refreshRequest();
    if (refresh_status === 200) {
      const response = await typesRequest();
      if (!response) return;

      if (response !== 401) return response;
    }
    if (refresh_status === 403) logout();
  } else return response;
};

export const getStatusesRequest = async (logout: () => void): Promise<IStatus[] | void> => {
  const statusesRequest = async (): Promise<IStatus[] | 401 | void> => {
    try {
      const response = await getStatus();
      if (response.data) return response.data;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        if (e.response.status !== 401 && e.response.status !== 400)
          errorAlert(e.response.statusText);
      }
    }
  };

  const response = await statusesRequest();
  if (!response) return;

  if (response === 401) {
    const refresh_status = await refreshRequest();
    if (refresh_status === 200) {
      const response = await statusesRequest();
      if (!response) return;

      if (response !== 401) return response;
    }
    if (refresh_status === 403) logout();
  } else return response;
};

export const getPrioritiesRequest = async (logout: () => void): Promise<IPriority[] | void> => {
  const prioritiesRequest = async (): Promise<IPriority[] | 401 | void> => {
    try {
      const response = await getPriority();
      if (response.data) return response.data;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        if (e.response.status !== 401 && e.response.status !== 400)
          errorAlert(e.response.statusText);
      }
    }
  };

  const response = await prioritiesRequest();
  if (!response) return;

  if (response === 401) {
    const refresh_status = await refreshRequest();
    if (refresh_status === 200) {
      const response = await prioritiesRequest();
      if (!response) return;

      if (response !== 401) return response;
    }
    if (refresh_status === 403) logout();
  } else return response;
};

export const getSourcesRequest = async (logout: () => void): Promise<ISource[] | void> => {
  const sourcesRequest = async (): Promise<ISource[] | 401 | void> => {
    try {
      const response = await getSource();
      if (response.data) return response.data;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        if (e.response.status !== 401 && e.response.status !== 400)
          errorAlert(e.response.statusText);
      }
    }
  };

  const response = await sourcesRequest();
  if (!response) return;

  if (response === 401) {
    const refresh_status = await refreshRequest();
    if (refresh_status === 200) {
      const response = await sourcesRequest();
      if (!response) return;

      if (response !== 401) return response;
    }
    if (refresh_status === 403) logout();
  } else return response;
};
