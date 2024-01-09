import {
  ICitizen,
  ICitizenError,
  ICitizenRequest,
  IError,
  INotApprovedUsers,
  IUser,
  IUserUpdate,
} from '../../components/types';
import {
  approveUser,
  getNotApprovedUsers,
  createCitizen,
  deleteCitizen,
  getCitizen,
  getUser,
  updateCitizen,
  updateUser,
  getCitizenById,
} from '..';
import { refreshRequest } from './Main';
import request from 'axios';
import { errorAlert } from './Main';

export const getUserRequest = async (logout: () => void): Promise<IUser | void> => {
  const userRequest = async (): Promise<IUser | 401 | void> => {
    try {
      const response = await getUser();
      return response.data;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        if (e.response.status !== 400 && e.response.status !== 401)
          errorAlert(e.response.statusText);
      }
    }
  };

  const response = await userRequest();
  if (!response) return;

  if (response === 401) {
    const refresh_status = await refreshRequest();
    if (refresh_status === 200) {
      const response = await userRequest();
      if (!response) return;

      if (response !== 401) return response;
    }
    if (refresh_status === 403) logout();
  } else return response;
};

export const updateUserRequest = async (
  user: IUserUpdate,
  logout: () => void,
): Promise<200 | IError | void> => {
  const userRequest = async (): Promise<200 | IError | 401 | void> => {
    try {
      await updateUser(user);
      return 200;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        else {
          if (e.response.status === 400) return e.response.data as IError;
          else errorAlert(e.response.statusText);
        }
      }
    }
  };

  const response = await userRequest();
  if (!response) return;

  if (response === 401) {
    const refresh_status = await refreshRequest();
    if (refresh_status === 200) {
      const response = await userRequest();
      if (!response) return;

      if (response !== 401) return response;
    }
    if (refresh_status === 403) logout();
  } else return response;
};

export const getCitizenRequest = async (logout: () => void): Promise<ICitizen[] | void> => {
  const citizenRequest = async (): Promise<ICitizen[] | 401 | void> => {
    try {
      const response = await getCitizen();
      return response.data;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        if (e.response.status !== 400 && e.response.status !== 401)
          errorAlert(e.response.statusText);
      }
    }
  };

  const response = await citizenRequest();
  if (!response) return;

  if (response === 401) {
    const refresh_status = await refreshRequest();
    if (refresh_status === 200) {
      const response = await citizenRequest();
      if (!response) return;

      if (response !== 401) return response;
    }
    if (refresh_status === 403) logout();
  } else return response;
};

export const getCitizenByIdRequest = async (
  logout: () => void,
  id: number,
): Promise<ICitizen[] | void> => {
  const citizenRequest = async (): Promise<ICitizen[] | 401 | void> => {
    try {
      const response = await getCitizenById(id.toString());
      return response.data;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        if (e.response.status !== 400 && e.response.status !== 401)
          errorAlert(e.response.statusText);
      }
    }
  };

  const response = await citizenRequest();
  if (!response) return;

  if (response === 401) {
    const refresh_status = await refreshRequest();
    if (refresh_status === 200) {
      const response = await citizenRequest();
      if (!response) return;

      if (response !== 401) return response;
    }
    if (refresh_status === 403) logout();
  } else return response;
};

export const createCitizenRequest = async (
  id: number,
  logout: () => void,
  citizen: ICitizenRequest,
): Promise<201 | ICitizenError | void> => {
  const citizenRequest = async (): Promise<201 | ICitizenError | 401 | void> => {
    try {
      await createCitizen(citizen);
      return 201;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        else {
          if (e.response.status === 400) return { form_id: id, error: e.response.data };
          else errorAlert(e.response.statusText);
        }
      }
    }
  };

  const response = await citizenRequest();
  if (!response) return;

  if (response === 401) {
    const refresh_status = await refreshRequest();
    if (refresh_status === 200) {
      const response = await citizenRequest();
      if (!response) return;

      if (response !== 401) return response;
    }
    if (refresh_status === 403) logout();
  } else return response;
};

export const updateCitizenRequest = async (
  id: number,
  logout: () => void,
  citizen: ICitizenRequest,
): Promise<200 | ICitizenError | void> => {
  const citizenRequest = async (): Promise<200 | ICitizenError | 401 | void> => {
    try {
      await updateCitizen(id, citizen);
      return 200;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        else {
          if (e.response.status === 400) return { form_id: id, error: e.response.data };
          else errorAlert(e.response.statusText);
        }
      }
    }
  };

  const response = await citizenRequest();
  if (!response) return;

  if (response === 401) {
    const refresh_status = await refreshRequest();
    if (refresh_status === 200) {
      const response = await citizenRequest();
      if (!response) return;

      if (response !== 401) return response;
    }
    if (refresh_status === 403) logout();
  } else return response;
};

export const deleteCitizenRequest = async (id: number, logout: () => void): Promise<204 | void> => {
  const citizenRequest = async (): Promise<204 | 401 | void> => {
    try {
      await deleteCitizen(id);
      return 204;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        if (e.response.status !== 400 && e.response.status !== 401)
          errorAlert(e.response.statusText);
      }
    }
  };

  const response = await citizenRequest();
  if (!response) return;

  if (response === 401) {
    const refresh_status = await refreshRequest();
    if (refresh_status === 200) {
      const response = await citizenRequest();
      if (!response) return;

      if (response !== 401) return response;
    }
    if (refresh_status === 403) logout();
  } else return response;
};

export const getNotApprovedUsersRequest = async (
  logout: () => void,
): Promise<INotApprovedUsers[] | void> => {
  const notApprovedUsersRequest = async (): Promise<INotApprovedUsers[] | 401 | void> => {
    try {
      const response = await getNotApprovedUsers();
      return response.data;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        if (e.response.status !== 400 && e.response.status !== 401)
          errorAlert(e.response.statusText);
      }
    }
  };

  const response = await notApprovedUsersRequest();
  if (!response) return;

  if (response === 401) {
    const refresh_status = await refreshRequest();
    if (refresh_status === 200) {
      const response = await notApprovedUsersRequest();
      if (!response) return;

      if (response !== 401) return response;
    }
    if (refresh_status === 403) logout();
  } else return response;
};

export const approveUserRequest = async (id: number, logout: () => void): Promise<200 | void> => {
  const userRequest = async (): Promise<200 | 401 | void> => {
    try {
      await approveUser(id.toString());
      return 200;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        if (e.response.status !== 400 && e.response.status !== 401)
          errorAlert(e.response.statusText);
      }
    }
  };

  const response = await userRequest();
  if (!response) return;

  if (response === 401) {
    const refresh_status = await refreshRequest();
    if (refresh_status === 200) {
      const response = await userRequest();
      if (!response) return;

      if (response !== 401) return response;
    }
    if (refresh_status === 403) logout();
  } else return response;
};
