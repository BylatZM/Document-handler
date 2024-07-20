import {
  ICitizenPossession,
  ICitizenError,
  ICitizenRequest,
  IError,
  IUser,
  IUserUpdate,
  IUpdateCitizenPossessionStatusByEmail,
  INotApprovedCitizenPossessionPagination,
  ICitizenRatingRequest,
  ICitizenFio,
} from '../../components/types';
import {
  createCitizenPossession,
  deleteCitizenPossessionById,
  addCitizenMark,
  getAllCitizenPossessions,
  getUser,
  updateCitizenPossessionById,
  updateUser,
  updateCitizenPossessionStatusByEmail,
  updateCitizenPossessionStatusWithExtraBySystem,
  getAllNotApprovedCitizenPossessions,
  updateUserPassword,
  getCitizensFio,
} from '..';
import { refreshRequest } from './Main';
import request from 'axios';
import { errorAlert } from './Main';

export const getUserRequest = async (logout: () => void): Promise<IUser | void> => {
  const makeRequest = async (): Promise<IUser | 401 | void> => {
    try {
      const response = await getUser();
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

export const updateUserRequest = async (
  user: IUserUpdate,
  logout: () => void,
): Promise<200 | IError | void> => {
  const makeRequest = async (): Promise<200 | IError | 401 | void> => {
    try {
      await updateUser(user);
      return 200;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        else {
          if (e.response.status === 400) return e.response.data as IError;
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

export const getAllCitizenPossessionsRequest = async (
  logout: () => void,
): Promise<ICitizenPossession[] | void> => {
  const makeRequest = async (): Promise<ICitizenPossession[] | 401 | void> => {
    try {
      const response = await getAllCitizenPossessions();
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

export const createCitizenPossessionRequest = async (
  logout: () => void,
  citizen: ICitizenRequest,
): Promise<201 | IError | void> => {
  const makeRequest = async (): Promise<201 | IError | 401 | void> => {
    try {
      await createCitizenPossession(citizen);
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

export const updateCitizenPossessionByIdRequest = async (
  id: number,
  logout: () => void,
  citizen: ICitizenRequest,
): Promise<200 | ICitizenError | void> => {
  const makeRequest = async (): Promise<200 | ICitizenError | 401 | void> => {
    try {
      await updateCitizenPossessionById(id, citizen);
      return 200;
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

export const deleteCitizenPossessionByIdRequest = async (
  id: number,
  logout: () => void,
): Promise<204 | void> => {
  const makeRequest = async (): Promise<204 | 401 | void> => {
    try {
      await deleteCitizenPossessionById(id);
      return 204;
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

export const AddCitizenMarkRequest = async (
  data: ICitizenRatingRequest,
  logout: () => void,
): Promise<201 | void> => {
  const makeRequest = async (): Promise<201 | 401 | void> => {
    try {
      await addCitizenMark(data);
      return 201;
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

export const getCitizensFioRequest = async (
  logout: () => void,
  possession_id?: number,
  building_id?: number,
): Promise<ICitizenFio[] | void | IError> => {
  const makeRequest = async (): Promise<ICitizenFio[] | 401 | void | IError> => {
    try {
      let extra = '';
      if (building_id && !possession_id) {
        extra = `?building_id=${building_id.toString()}`;
      }
      if (possession_id && !building_id) {
        extra = `?possession_id=${possession_id.toString()}`;
      }
      if (building_id && possession_id) {
        extra = `?building_id=${building_id.toString()}&possession_id=${possession_id.toString()}`;
      }
      const response = await getCitizensFio(extra);
      return response.data;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        if (e.response.status === 400) return e.response.data;
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

export const UpdateCitizenPossessionStatusByEmailRequest = async (
  data: IUpdateCitizenPossessionStatusByEmail,
): Promise<IError | 200 | void> => {
  const makeRequest = async (): Promise<200 | IError | void> => {
    try {
      await updateCitizenPossessionStatusByEmail(data);
      return 200;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 400) return e.response.data;
        else errorAlert(e.response.status);
      }
    }
  };

  const response = await makeRequest();
  if (!response) return;

  return response;
};

export const updateCitizenPossessionStatusWithExtraBySystemRequest = async (
  logout: () => void,
  citizenPossessionId: string,
  newStatusId: '1' | '3',
): Promise<200 | void> => {
  const makeRequest = async (): Promise<200 | 401 | void> => {
    try {
      await updateCitizenPossessionStatusWithExtraBySystem(citizenPossessionId, newStatusId);
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

export const getNotApprovedCitizenPossessionsRequest = async (
  page: string,
  page_size: string,
  extra: string,
  logout: () => void,
): Promise<INotApprovedCitizenPossessionPagination | void> => {
  const makeRequest = async (): Promise<INotApprovedCitizenPossessionPagination | 401 | void> => {
    try {
      const response = await getAllNotApprovedCitizenPossessions(page, page_size, extra);
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

export const updateUserPasswordRequest = async (params: {
  email: string;
  phone: string;
}): Promise<201 | IError | void> => {
  try {
    await updateUserPassword(params).then((response) => response.data);
    return 201;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status === 400) return e.response?.data as IError;
      else errorAlert(e.response.status);
    }
  }
};
