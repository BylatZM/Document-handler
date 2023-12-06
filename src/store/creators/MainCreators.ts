import { IAuthRequest, IError, IAuthGoodResponse, IRegRequest } from './../../components/types';
import { login, refresh, registration } from '../../api';
import request from 'axios';
import { Dispatch } from '@reduxjs/toolkit';
import { userClear } from '../reducers/UserReducer';
import { helpFormClear } from '../reducers/HelpFormReducer';
import { regClear } from '../reducers/RegReducer';
import { authClear } from '../reducers/AuthReducer';
import { possessionClear } from '../reducers/PossessionReducer';
import { citizenClear } from '../reducers/CitizenReducer';
import { applicationClear } from '../reducers/ApplicationReducer';

export const loginRequest = async (data: IAuthRequest): Promise<IAuthGoodResponse | IError> => {
  let error: IError = { type: '', error: '' };
  try {
    const response = await login(data);

    if ('type' in response.data) return response.data;

    localStorage.setItem('access', response.data.access);
    document.cookie = `refresh=${response.data.refresh}; path=/; domain=localhost;`;
    return response.data;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      error = e.response?.data as IError;
    }
  }
  alert(error.error);
  return error;
};

export const registrationRequest = async (data: IRegRequest): Promise<IError | 201> => {
  try {
    await registration(data);
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      return e.response?.data as IError;
    }
  }
  return 201;
};

export const refreshRequest = async (): Promise<200 | 401> => {
  try {
    const response = await refresh().then((response) => response.data);
    localStorage.setItem('access', response.access);
    return 200;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      console.log(e.response);
    }
  }
  return 401;
};

export const logoutRequest = (dispatch: Dispatch) => {
  dispatch(possessionClear());
  dispatch(userClear());
  dispatch(helpFormClear());
  dispatch(regClear());
  dispatch(authClear());
  dispatch(citizenClear());
  dispatch(applicationClear());
  localStorage.removeItem('access');
  var cookies = document.cookie.split(';');
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf('=');
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
};
