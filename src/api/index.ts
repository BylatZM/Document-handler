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
  ICitizenPossession,
  IUserUpdate,
  ICitizenRequest,
  IEmployee,
  IType,
  IPriority,
  ISource,
  IStatus,
  IAppCreateByDispatcher,
  IAppCreateByCitizen,
  IApprovePossessionRequest,
  IAppUpdateByDispatcher,
  IAppUpdateByEmployee,
  INotApprovedLivingSpacePagination,
  ISubtype,
  IBuilding,
  IPossession,
  IUpdateCitizenPossessionStatusByEmail,
  IApplicationPagination,
  IGisApplicationPagination,
  IUpdateGisAppByEmployee,
  IUpdateGisAppByDispatcher,
  IUpdateEmailAppByDispatcher,
  IUpdateEmailAppByEmployee,
  IEmailApplicationPagination,
  INotApprovedCitizenPossessionPagination,
  ICreateApplicationByCitizenSuccessResponse,
  ICitizenRatingRequest,
  ICitizenFio,
} from '../components/types';

export const login = (params: IAuthRequest): AxiosPromise<IAuthGoodResponse | IError> =>
  axiosInstance.post(endpoints.login, params);

export const registration = (params: IRegRequest): AxiosPromise<IAuthGoodResponse | IError> =>
  axiosInstance.post(endpoints.user.create, params);

export const refresh = (): AxiosPromise<IRefreshGoodResponse> =>
  axiosInstance.get(endpoints.refresh);

export const help = (params: FormData): AxiosPromise<void | IError> =>
  axiosInstance.post(endpoints.help, params);

export const getUser = (): AxiosPromise<IUser> => axiosInstance.get(endpoints.user.get);

export const updateUser = (user: IUserUpdate): AxiosPromise<IError | void> =>
  axiosInstance.put(endpoints.user.update, user);

export const updateUserPassword = (params: {
  email: string;
  phone: string;
}): AxiosPromise<void | IError> => axiosInstance.put(endpoints.user.updatePassword, params);

export const getAllComplexes = (): AxiosPromise<IComplex[]> =>
  axiosInstance.get(endpoints.complex.getAll);

export const getAllBuildingsByComplexId = (complex_id: string): AxiosPromise<IBuilding[]> =>
  axiosInstance.get(endpoints.building.getAllByComplexId + complex_id);

export const getAllBuildings = (): AxiosPromise<IBuilding[]> =>
  axiosInstance.get(endpoints.building.getAll);

export const getAllPossessionsWithExtra = (
  type: string,
  building: string,
): AxiosPromise<IPossession[] | IError> =>
  axiosInstance.get(endpoints.possession.getAllWithExtra + `?type=${type}&building=${building}`);

export const getAllNotApprovedPossessions = (
  extra: string,
  page: string,
  page_size: string,
): AxiosPromise<INotApprovedLivingSpacePagination | void> =>
  axiosInstance.get(
    endpoints.possession.getAllNotApproved + `?page=${page}&page_size=${page_size}${extra}`,
  );

export const updatePossessionStatusWithExtra = (
  possession_id: string,
  status_id: '1' | '3',
): AxiosPromise<void> =>
  axiosInstance.put(
    endpoints.possession.updateStatusWithExtra +
      `?possession_id=${possession_id}&status_id=${status_id}`,
  );

export const createPossession = (possession: IApprovePossessionRequest): AxiosPromise<void> =>
  axiosInstance.post(endpoints.possession.create, possession);

export const getAllCitizenPossessions = (): AxiosPromise<ICitizenPossession[]> =>
  axiosInstance.get(endpoints.citizen.possession.getAll);

export const getAllNotApprovedCitizenPossessions = (
  page: string,
  page_size: string,
  extra: string,
): AxiosPromise<INotApprovedCitizenPossessionPagination | void> =>
  axiosInstance.get(
    endpoints.citizen.possession.getAllNotApproved + `?page=${page}&page_size=${page_size}${extra}`,
  );

export const updateCitizenPossessionStatusWithExtraBySystem = (
  citizenPossessionId: string,
  newStatusId: '1' | '3',
): AxiosPromise<void> =>
  axiosInstance.put(
    endpoints.citizen.possession.updateStatusWithExtraBySystem +
      `?citizen_possession_id=${citizenPossessionId}&status_id=${newStatusId}`,
  );

export const updateCitizenPossessionStatusByEmail = (
  data: IUpdateCitizenPossessionStatusByEmail,
): AxiosPromise<IError | void> =>
  axiosInstance.put(endpoints.citizen.possession.updateStatusByEmail, data);

export const createCitizenPossession = (citizen: ICitizenRequest): AxiosPromise<IError | void> =>
  axiosInstance.post(endpoints.citizen.possession.create, citizen);

export const updateCitizenPossessionById = (
  id: number,
  citizen: ICitizenRequest,
): AxiosPromise<IError | void> =>
  axiosInstance.put(endpoints.citizen.possession.updateByCitizenPossessionId + id, citizen);

export const deleteCitizenPossessionById = (id: number): AxiosPromise<void> =>
  axiosInstance.delete(endpoints.citizen.possession.deleteByCitizenPossessionId + id);

export const addCitizenMark = (data: ICitizenRatingRequest): AxiosPromise<void> =>
  axiosInstance.post(endpoints.citizen.mark, data);

export const getCitizensFio = (extra: string): AxiosPromise<void | IError | ICitizenFio[]> =>
  axiosInstance.get(endpoints.citizen.fioWithExtra + extra);

export const createSystemApplication = (
  application: IAppCreateByCitizen | IAppCreateByDispatcher,
): AxiosPromise<IError | ICreateApplicationByCitizenSuccessResponse | void> =>
  axiosInstance.post(endpoints.application.createSystem, application);

export const loadSystemApplicationFiles = (files: FormData): AxiosPromise<IError | void> =>
  axiosInstance.post(endpoints.application.loadSysFiles, files);

export const updateSystemApplicationStatusById = (
  data: { status: number },
  application_id: string,
): AxiosPromise<void | IError> =>
  axiosInstance.put(endpoints.application.updateSystemStatusById + application_id, data);

export const updateSystemApplicationById = (
  application_id: string,
  data: IAppUpdateByDispatcher | IAppUpdateByEmployee,
): AxiosPromise<void | IError> =>
  axiosInstance.put(endpoints.application.updateSystemById + application_id, data);

export const updateGisApplicationById = (
  application_id: string,
  data: IUpdateGisAppByDispatcher | IUpdateGisAppByEmployee,
): AxiosPromise<void | IError> =>
  axiosInstance.put(endpoints.application.updateGisById + application_id, data);

export const getAllSystemApplicationsByExtra = (
  page: string,
  page_size: string,
  extra: string,
): AxiosPromise<IApplicationPagination> =>
  axiosInstance.get(
    endpoints.application.getAllSystemWithExtra + `?page=${page}&page_size=${page_size}${extra}`,
  );

export const getAllGisApplicationsByExtra = (
  page: string,
  page_size: string,
  extra: string,
): AxiosPromise<IGisApplicationPagination> =>
  axiosInstance.get(
    endpoints.application.getAllGisWithExtra + `?page=${page}&page_size=${page_size}${extra}`,
  );

export const loadEmailApplicationFiles = (files: FormData): AxiosPromise<IError | void> =>
  axiosInstance.post(endpoints.application.loadEmailFiles, files);

export const updateEmailApplicationById = (
  application_id: string,
  data: IUpdateEmailAppByDispatcher | IUpdateEmailAppByEmployee,
): AxiosPromise<void | IError> =>
  axiosInstance.put(endpoints.application.updateEmailAppById + application_id, data);

export const getAllEmailApplicationsByExtra = (
  page: string,
  page_size: string,
  extra: string,
): AxiosPromise<IEmailApplicationPagination> =>
  axiosInstance.get(
    endpoints.application.getAllEmailAppWithExtra + `?page=${page}&page_size=${page_size}${extra}`,
  );

export const getAllEmploysWithExtra = (
  subtype_id: string,
  complex_id: string,
): AxiosPromise<IEmployee[] | void | IError> =>
  axiosInstance.get(
    endpoints.employee.getEmploysWithExtra + `?complex_id=${complex_id}&subtype_id=${subtype_id}`,
  );

export const getAllTypesByComplexId = (complex_id: string): AxiosPromise<IType[] | void> =>
  axiosInstance.get(endpoints.application.getAllTypesByComplexId + complex_id);

export const getAllTypes = (): AxiosPromise<IType[] | void> =>
  axiosInstance.get(endpoints.application.getAllTypes);

export const getAllSubtypesWithExtra = (extra: string): AxiosPromise<ISubtype[] | void> =>
  axiosInstance.get(endpoints.application.getAllSubtypesWithExtra + extra);

export const getAllPriorities = (): AxiosPromise<IPriority[] | void> =>
  axiosInstance.get(endpoints.application.getAllPriorities);

export const getAllSources = (): AxiosPromise<ISource[] | void> =>
  axiosInstance.get(endpoints.application.getAllSources);

export const getAllStatuses = (): AxiosPromise<IStatus[] | void> =>
  axiosInstance.get(endpoints.application.getAllStatuses);
