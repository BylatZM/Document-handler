import {
  ICitizen,
  ICitizenError,
  ICitizenRequest,
  IError,
  IUser,
  IUserUpdate,
} from './../../components/types';
import {
  createCitizen,
  deleteCitizen,
  getCitizen,
  getUser,
  updateCitizen,
  updateUser,
} from '../../api';
import { refreshRequest } from './MainCreators';
import request from 'axios';

export const getUserRequest = async (): Promise<IUser | 403> => {
  try {
    return await getUser().then((response) => response.data);
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) {
          return await getUser().then((response) => response.data);
        }
      }
    }
  }
  return 403;
};

export const updateUserRequest = async (user: IUserUpdate): Promise<200 | IError | 403> => {
  try {
    await updateUser(user);
    return 200;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) {
          const response = await updateUser(user);
          if (response.status === 400 && response.data) return response.data;
          else return 200;
        }
      }
    }
  }
  return 403;
};

export const getCitizenRequest = async (): Promise<ICitizen[] | 403> => {
  try {
    return await getCitizen().then((response) => response.data);
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) {
          return await getCitizen().then((response) => response.data);
        }
      }
    }
  }
  return 403;
};

export const createCitizenRequest = async (
  id: number,
  citizen: ICitizenRequest,
): Promise<201 | ICitizenError | 403> => {
  try {
    await createCitizen(citizen);
    return 201;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) {
          try {
            await createCitizen(citizen);
            return 201;
          } catch (e) {
            if (request.isAxiosError(e) && e.response) {
              return { form_id: id, error: e.response.data };
            }
          }
        }
      }
      if (e.response.status === 400 && e.response.data) {
        return { form_id: id, error: e.response.data };
      }
    }
  }
  return 403;
};

export const updateCitizenRequest = async (
  id: number,
  citizen: ICitizenRequest,
): Promise<200 | ICitizenError | 403> => {
  try {
    await updateCitizen(id, citizen);
    return 200;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) {
          try {
            await updateCitizen(id, citizen);
            return 200;
          } catch (e) {
            if (request.isAxiosError(e) && e.response) {
              return { error: e.response.data, form_id: id };
            }
          }
        }
      } else return { form_id: id, error: e.response.data };
    }
  }
  return 403;
};

export const deleteCitizenRequest = async (id: number): Promise<204 | 403> => {
  try {
    await deleteCitizen(id);
    return 204;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) {
          await deleteCitizen(id);
          return 204;
        }
      }
      if (e.response.status === 400 && e.response.data) {
        return e.response.data;
      }
    }
  }
  return 403;
};
