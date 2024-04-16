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
  ICitizen,
  IUserUpdate,
  ICitizenRequest,
  IEmployee,
  IGrade,
  IType,
  IPriority,
  ISource,
  IStatus,
  IAppCreateByDispatcher,
  IAppCreateByCitizen,
  IHelpFormRequest,
  IApprovePossessionRequest,
  IAppUpdateByDispatcher,
  IAppUpdateByEmployee,
  INotApprovedPossessions,
  ISubtype,
  IBuildingWithComplex,
  IPossession,
  INotApprovedCitizens,
  INotApprovedUsers,
  IUserDetailsInfo,
  IApproveUserByLink,
  IApplicationPagination,
  IGisApplicationPagination,
  IUpdateGisAppByEmployee,
  IUpdateGisAppByDispatcher,
} from '../components/types';

export const login = (params: IAuthRequest): AxiosPromise<IAuthGoodResponse | IError> =>
  axiosInstance.post(endpoints.login, params);

export const registration = (params: IRegRequest): AxiosPromise<IAuthGoodResponse | IError> =>
  axiosInstance.post(endpoints.user.create, params);

export const refresh = (): AxiosPromise<IRefreshGoodResponse> =>
  axiosInstance.get(endpoints.refresh);

export const helpForm = (params: IHelpFormRequest): AxiosPromise<void> =>
  axiosInstance.post(endpoints.helpForm, params);

export const updatePassword = (params: {
  email: string;
  phone: string;
}): AxiosPromise<void | IError> => axiosInstance.put(endpoints.passwordUpdate, params);

export const getUser = (): AxiosPromise<IUser> => axiosInstance.get(endpoints.user.get);

export const approveUser = (id: string): AxiosPromise<void> =>
  axiosInstance.put(endpoints.user.approve + `/${id}`);

export const approveUserByLink = (data: IApproveUserByLink): AxiosPromise<IError | void> =>
  axiosInstance.put(endpoints.user.approve, data);

export const rejectUser = (id: string): AxiosPromise<void> =>
  axiosInstance.put(endpoints.user.reject + `${id}`);

export const getNotApprovedUsers = (): AxiosPromise<INotApprovedUsers[]> =>
  axiosInstance.get(endpoints.user.getNotApproved);

export const getUserDetailsInfo = (id: string): AxiosPromise<IUserDetailsInfo> =>
  axiosInstance.get(endpoints.user.detailsInfo + `${id}`);

export const updateUser = (user: IUserUpdate): AxiosPromise<IError | void> =>
  axiosInstance.put(endpoints.user.update, user);

export const getComplexes = (): AxiosPromise<IComplex[]> =>
  axiosInstance.get(endpoints.complex.getAll);

export const getBuildings = (id: string): AxiosPromise<IBuildingWithComplex[]> =>
  axiosInstance.get(endpoints.building.getBy + `/${id}`);

export const getPossessions = (
  type: string,
  building: string,
): AxiosPromise<IPossession[] | IError> =>
  axiosInstance.get(endpoints.possession.getBy + `?type=${type}&building=${building}`);

export const getNotApprovedPossessions = (): AxiosPromise<INotApprovedPossessions[] | void> =>
  axiosInstance.get(endpoints.possession.getNotApproved);

export const approvePossession = (id: string): AxiosPromise<void> =>
  axiosInstance.put(endpoints.possession.approve + `${id}`);

export const rejectPossession = (id: string): AxiosPromise<void> =>
  axiosInstance.put(endpoints.possession.reject + `${id}`);

export const createPossession = (possession: IApprovePossessionRequest): AxiosPromise<void> =>
  axiosInstance.post(endpoints.possession.create, possession);

export const getCitizen = (): AxiosPromise<ICitizen[]> => axiosInstance.get(endpoints.citizen.get);

export const getNotApprovedCitizen = (): AxiosPromise<INotApprovedCitizens[] | void> =>
  axiosInstance.get(endpoints.citizen.getNotApproved);

export const rejectCitizen = (id: string): AxiosPromise<void> =>
  axiosInstance.put(endpoints.citizen.reject + `${id}`);

export const approveCitizen = (id: string): AxiosPromise<void> =>
  axiosInstance.put(endpoints.citizen.approve + `${id}`);

export const createCitizen = (citizen: ICitizenRequest): AxiosPromise<IError | void> =>
  axiosInstance.post(endpoints.citizen.create, citizen);

export const updateCitizen = (id: number, citizen: ICitizenRequest): AxiosPromise<IError | void> =>
  axiosInstance.put(endpoints.citizen.update + `/${id}`, citizen);

export const deleteCitizen = (id: number): AxiosPromise<void> =>
  axiosInstance.delete(endpoints.citizen.delete + `/${id}`);

export const createApplication = (
  application: IAppCreateByCitizen | IAppCreateByDispatcher,
): AxiosPromise<IError | void> => axiosInstance.post(endpoints.application.create, application);

export const updateApplicationStatus = (
  data: { status: number },
  application_id: string,
): AxiosPromise<void> =>
  axiosInstance.put(endpoints.application.updateStatus + `/${application_id}`, data);

export const updateApplication = (
  application_id: string,
  data: IAppUpdateByDispatcher | IAppUpdateByEmployee,
): AxiosPromise<void | IError> =>
  axiosInstance.put(endpoints.application.updateComment + `/${application_id}`, data);

export const updateGisApplication = (
  application_id: string,
  data: IUpdateGisAppByDispatcher | IUpdateGisAppByEmployee,
): AxiosPromise<void | IError> =>
  axiosInstance.put(endpoints.gisApplication.update + `/${application_id}`, data);

export const updateGisAppStatusOnClose = (application_id: string): AxiosPromise<void | IError> =>
  axiosInstance.put(endpoints.gisApplication.updateStatusOnClose + `/${application_id}`);

export const getApplication = (
  page: string,
  page_size: string,
  extra: string,
): AxiosPromise<IApplicationPagination> =>
  axiosInstance.get(endpoints.application.get + `?page=${page}&page_size=${page_size}${extra}`);

export const getGisApplication = (
  page: string,
  page_size: string,
): AxiosPromise<IGisApplicationPagination> =>
  axiosInstance.get(endpoints.gisApplication.get + `?page=${page}&page_size=${page_size}`);

export const getEmployee = (): AxiosPromise<IEmployee[] | void> =>
  axiosInstance.get(endpoints.employee);

export const getGrade = (): AxiosPromise<IGrade[] | void> => axiosInstance.get(endpoints.grade);

export const getType = (): AxiosPromise<IType[] | void> => axiosInstance.get(endpoints.type);

export const getSubTypes = (id: string): AxiosPromise<ISubtype[] | void> =>
  axiosInstance.get(endpoints.subType + `${id}`);

export const getPriority = (): AxiosPromise<IPriority[] | void> =>
  axiosInstance.get(endpoints.priority);

export const getSource = (): AxiosPromise<ISource[] | void> => axiosInstance.get(endpoints.source);

export const getStatus = (): AxiosPromise<IStatus[] | void> => axiosInstance.get(endpoints.status);
