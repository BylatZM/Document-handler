import {
  IAuthRequest,
  IError,
  IAuthGoodResponse,
  IRegRequest,
  IHelpFormRequest,
} from '../../components/types';
import { login, refresh, registration, helpForm, updatePassword } from '..';
import request from 'axios';

export const errorAlert = (errorText: string) => {
  alert(
    'Внутренняя ошибка приложения, статус ошибки: ' +
      errorText +
      '.\nПожалуйста, обратитесь в тех.поддержку, указав статус ошибки,' +
      '\nа также коротко опишите действия, которые привели к данной ошибке',
  );
};

export const loginRequest = async (
  data: IAuthRequest,
): Promise<IAuthGoodResponse | IError | void> => {
  try {
    const response = await login(data);
    if ('type' in response.data) return response.data;
    localStorage.setItem('access', response.data.access);
    document.cookie = `refresh=${response.data.refresh}; path=/; domain=${
      process.env.NODE_ENV === 'development' ? 'localhost' : 'http://91.201.40.39'
    };`;
    return response.data;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status === 400) return e.response?.data as IError;
      else errorAlert(e.response.statusText);
    }
  }
};

export const registrationRequest = async (data: IRegRequest): Promise<IError | 201 | void> => {
  try {
    await registration(data);
    return 201;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status === 400) return e.response.data as IError;
      else errorAlert(e.response.statusText);
    }
  }
};

export const refreshRequest = async (): Promise<200 | 403 | void> => {
  try {
    const response = await refresh().then((response) => response.data);
    localStorage.setItem('access', response.access);
    return 200;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status === 403) return 403;
      else errorAlert(e.response.statusText);
    }
  }
};

export const helpFormRequest = async (params: IHelpFormRequest): Promise<void> => {
  try {
    await helpForm(params).then((response) => response.data);
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      errorAlert(e.response.statusText);
    }
  }
};

export const updatePasswordRequest = async (params: {
  email: string;
  phone: string;
}): Promise<201 | IError | void> => {
  try {
    await updatePassword(params).then((response) => response.data);
    return 201;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status === 400) return e.response?.data as IError;
      else errorAlert(e.response.statusText);
    }
  }
};
