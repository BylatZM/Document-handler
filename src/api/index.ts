import { AxiosPromise } from 'axios';

import endpoints from './endpoints';
import { axiosInstance } from './instance';
import {
  IAuthRequest,
  IError,
  IAuthGoodResponse,
  IRefreshGoodResponse,
  IRegRequest,
  IUser,
  IComplex,
  IPossession,
  ICitizen,
  IUserUpdate,
  ICitizenRequest,
  IApplication,
  IEmployee,
  IGrade,
  IType,
  IPriority,
  ISource,
  IStatus,
  IApplicationRequest,
} from '../components/types';

export const login = (params: IAuthRequest): AxiosPromise<IAuthGoodResponse | IError> =>
  axiosInstance.post(endpoints.login, params);

export const registration = (params: IRegRequest): AxiosPromise<IAuthGoodResponse | IError> =>
  axiosInstance.post(endpoints.user.create, params);

export const refresh = (): AxiosPromise<IRefreshGoodResponse> =>
  axiosInstance.get(endpoints.refresh);

export const getUser = (): AxiosPromise<IUser> => axiosInstance.get(endpoints.user.get);

export const updateUser = (user: IUserUpdate): AxiosPromise<IError | void> =>
  axiosInstance.put(endpoints.user.update, user);

export const getComplexes = (): AxiosPromise<IComplex[]> =>
  axiosInstance.get(endpoints.complex.getAll);

export const getBuildings = (id: string): AxiosPromise<IPossession[]> =>
  axiosInstance.get(endpoints.building.getBy + `/${id}`);

export const getPossessions = (
  type: string,
  building: string,
): AxiosPromise<IPossession[] | IError> =>
  axiosInstance.get(endpoints.possession.getBy + `?type=${type}&building=${building}`);

export const getCitizen = (): AxiosPromise<ICitizen[]> => axiosInstance.get(endpoints.citizen.get);

export const getCitizenByUserId = (id: string): AxiosPromise<ICitizen[]> =>
  axiosInstance.get(endpoints.citizen.get + `/${id}`);

export const createCitizen = (citizen: ICitizenRequest): AxiosPromise<IError | void> =>
  axiosInstance.post(endpoints.citizen.create, citizen);

export const updateCitizen = (id: number, citizen: ICitizenRequest): AxiosPromise<IError | void> =>
  axiosInstance.put(endpoints.citizen.update + `/${id}`, citizen);

export const deleteCitizen = (id: number): AxiosPromise<void> =>
  axiosInstance.delete(endpoints.citizen.delete + `/${id}`);

export const createApplication = (application: IApplicationRequest): AxiosPromise<IError | void> =>
  axiosInstance.post(endpoints.application.create, application);

export const updateApplication = (
  id: number,
  application: IApplicationRequest,
): AxiosPromise<IError | void> =>
  axiosInstance.put(endpoints.application.update + `/${id}`, application);

export const getApplication = (): AxiosPromise<IApplication[]> =>
  axiosInstance.get(endpoints.application.get);

export const getEmployee = (): AxiosPromise<IEmployee[] | void> =>
  axiosInstance.get(endpoints.employee);

export const getGrade = (): AxiosPromise<IGrade[] | void> => axiosInstance.get(endpoints.grade);

export const getType = (): AxiosPromise<IType[] | void> => axiosInstance.get(endpoints.type);

export const getPriority = (): AxiosPromise<IPriority[] | void> =>
  axiosInstance.get(endpoints.priority);

export const getSource = (): AxiosPromise<ISource[] | void> => axiosInstance.get(endpoints.source);

export const getStatus = (): AxiosPromise<IStatus[] | void> => axiosInstance.get(endpoints.status);
