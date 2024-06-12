import {
  IAuthRequest,
  IError,
  IAuthGoodResponse,
  IRegRequest,
  IHelpFormRequest,
} from '../../components/types';
import { login, refresh, registration, help } from '..';
import request from 'axios';

export const errorAlert = (errorText: number) => {
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
    const currentDate = new Date();
    const nextYear = currentDate.getFullYear() + 1;
    currentDate.setFullYear(nextYear);
    document.cookie = `refresh=${
      response.data.refresh
    }; path=/; expires=${currentDate.toUTCString()}; domain=${
      process.env.NODE_ENV === 'development' ? 'localhost' : 'uslugi.dltex.ru'
    };`;
    return response.data;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status === 400) return e.response?.data as IError;
      else errorAlert(e.response.status);
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
      else errorAlert(e.response.status);
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
      if (e.response.status === 403) {
        alert('Срок жизни сессии истек, пожалуйста, авторизуйтесь снова');
        return 403;
      } else errorAlert(e.response.status);
    }
  }
};

export const requestFromHelpForm = async (params: IHelpFormRequest): Promise<200 | void> => {
  try {
    await help(params).then((response) => response.data);
    return 200;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      errorAlert(e.response.status);
    }
  }
};
