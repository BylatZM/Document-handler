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
  getCitizenByUserId,
  getUser,
  updateCitizen,
  updateUser,
} from '..';
import { refreshRequest } from './Main';
import request from 'axios';
import { errorAlert } from './Main';

export const getUserRequest = async (logout: () => void): Promise<IUser | void> => {
  try {
    return await getUser().then((response) => response.data);
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status !== 401 && e.response.status !== 400) errorAlert(e.response.statusText);
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) getUserRequest(logout);
        if (refresh_status === 403) logout();
      }
    }
  }
};

export const updateUserRequest = async (
  user: IUserUpdate,
  logout: () => void,
): Promise<200 | IError | void> => {
  try {
    await updateUser(user);
    return 200;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status !== 401 && e.response.status !== 400) errorAlert(e.response.statusText);
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) updateUserRequest(user, logout);
      }
      if (e.response.status === 400) return e.response.data as IError;
    }
  }
};

export const getCitizenRequest = async (logout: () => void): Promise<ICitizen[] | void> => {
  try {
    return await getCitizen().then((response) => response.data);
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status !== 401 && e.response.status !== 400) errorAlert(e.response.statusText);
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) getCitizenRequest(logout);
        if (refresh_status === 403) logout();
      }
    }
  }
};

export const getCitizenByUserIdRequest = async (
  id: number,
  logout: () => void,
): Promise<ICitizen[] | void> => {
  try {
    return await getCitizenByUserId(id.toString()).then((response) => response.data);
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status !== 401 && e.response.status !== 400) errorAlert(e.response.statusText);
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) getCitizenByUserIdRequest(id, logout);
        if (refresh_status === 403) logout();
      }
    }
  }
};

export const createCitizenRequest = async (
  id: number,
  logout: () => void,
  citizen: ICitizenRequest,
): Promise<201 | ICitizenError | void> => {
  try {
    await createCitizen(citizen);
    return 201;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status !== 401 && e.response.status !== 400) errorAlert(e.response.statusText);
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) createCitizenRequest(id, logout, citizen);
        if (refresh_status === 403) logout();
      }
      if (e.response.status === 400) {
        return { form_id: id, error: e.response.data };
      }
    }
  }
};

export const updateCitizenRequest = async (
  id: number,
  logout: () => void,
  citizen: ICitizenRequest,
): Promise<200 | ICitizenError | void> => {
  try {
    await updateCitizen(id, citizen);
    return 200;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status !== 401 && e.response.status !== 400) errorAlert(e.response.statusText);
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) updateCitizenRequest(id, logout, citizen);
        if (refresh_status === 403) logout();
      }
      if (e.response.status === 400) return { form_id: id, error: e.response.data };
    }
  }
};

export const deleteCitizenRequest = async (id: number, logout: () => void): Promise<204 | void> => {
  try {
    await deleteCitizen(id);
    return 204;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status !== 401 && e.response.status !== 400) errorAlert(e.response.statusText);
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) deleteCitizenRequest(id, logout);
        if (refresh_status === 403) logout();
      }
      if (e.response.status === 400) {
        return e.response.data;
      }
    }
  }
};

export const getNotApprovedUsersRequest = async (
  logout: () => void,
): Promise<INotApprovedUsers[] | void> => {
  try {
    const response = await getNotApprovedUsers();
    return response.data;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status !== 401 && e.response.status !== 400) errorAlert(e.response.statusText);
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) getNotApprovedUsersRequest(logout);
        if (refresh_status === 403) logout();
      }
    }
  }
};

export const approveUserRequest = async (id: number, logout: () => void): Promise<200 | void> => {
  try {
    await approveUser(id.toString());
    return 200;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status !== 401 && e.response.status !== 400) errorAlert(e.response.statusText);
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) approveUserRequest(id, logout);
        if (refresh_status === 403) logout();
      }
    }
  }
};
