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
  IHelpFormRequest,
  IApprovePossessionRequest,
  IAppUpdateByDispatcher,
  IAppUpdateByEmployee,
  INotApprovedPossession,
  ISubtype,
  IBuilding,
  IPossession,
  INotApprovedCitizenPossession,
  IUpdateCitizenPossessionStatusByEmail,
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

export const help = (params: IHelpFormRequest): AxiosPromise<void> =>
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

export const getAllPossessionsWithExtra = (
  type: string,
  building: string,
): AxiosPromise<IPossession[] | IError> =>
  axiosInstance.get(endpoints.possession.getAllWithExtra + `?type=${type}&building=${building}`);

export const getAllNotApprovedPossessions = (): AxiosPromise<INotApprovedPossession[] | void> =>
  axiosInstance.get(endpoints.possession.getAllNotApproved);

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
  axiosInstance.get(endpoints.citizenPossession.getAll);

export const getAllNotApprovedCitizenPossessions = (): AxiosPromise<
  INotApprovedCitizenPossession[] | void
> => axiosInstance.get(endpoints.citizenPossession.getAllNotApproved);

export const updateCitizenPossessionStatusWithExtraBySystem = (
  citizenPossessionId: string,
  newStatusId: '1' | '3',
): AxiosPromise<void> =>
  axiosInstance.put(
    endpoints.citizenPossession.updateStatusWithExtraBySystem +
      `?citizen_possession_id=${citizenPossessionId}&status_id=${newStatusId}`,
  );

export const updateCitizenPossessionStatusByEmail = (
  data: IUpdateCitizenPossessionStatusByEmail,
): AxiosPromise<IError | void> =>
  axiosInstance.put(endpoints.citizenPossession.updateStatusByEmail, data);

export const createCitizenPossession = (citizen: ICitizenRequest): AxiosPromise<IError | void> =>
  axiosInstance.post(endpoints.citizenPossession.create, citizen);

export const updateCitizenPossessionById = (
  id: number,
  citizen: ICitizenRequest,
): AxiosPromise<IError | void> =>
  axiosInstance.put(endpoints.citizenPossession.updateByCitizenPossessionId + id, citizen);

export const deleteCitizenPossessionById = (id: number): AxiosPromise<void> =>
  axiosInstance.delete(endpoints.citizenPossession.deleteByCitizenPossessionId + id);

export const createSystemApplication = (
  application: IAppCreateByCitizen | IAppCreateByDispatcher,
): AxiosPromise<IError | void> =>
  axiosInstance.post(endpoints.application.createSystem, application);

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
): AxiosPromise<IGisApplicationPagination> =>
  axiosInstance.get(
    endpoints.application.getAllGisWithExtra + `?page=${page}&page_size=${page_size}`,
  );

export const getAllEmploysWithExtra = (
  subtype_id: string,
  complex_id: string,
): AxiosPromise<IEmployee[] | void | IError> =>
  axiosInstance.get(
    endpoints.employee.getEmploysWithExtra + `?complex_id=${complex_id}&subtype_id=${subtype_id}`,
  );

export const getAllEmploysForGis = (): AxiosPromise<IEmployee[] | void> =>
  axiosInstance.get(endpoints.employee.getEmploysForGis);

export const getAllTypesByComplexId = (complex_id: string): AxiosPromise<IType[] | void> =>
  axiosInstance.get(endpoints.application.getAllTypesByComplexId + complex_id);

export const getAllSubtypesWithExtra = (
  type_id: string,
  complex_id: string,
): AxiosPromise<ISubtype[] | void> =>
  axiosInstance.get(
    endpoints.application.getAllSubtypesWithExtra + `?type_id=${type_id}&complex_id=${complex_id}`,
  );

export const getAllPriorities = (): AxiosPromise<IPriority[] | void> =>
  axiosInstance.get(endpoints.application.getAllPriorities);

export const getAllSources = (): AxiosPromise<ISource[] | void> =>
  axiosInstance.get(endpoints.application.getAllSources);

export const getAllStatuses = (): AxiosPromise<IStatus[] | void> =>
  axiosInstance.get(endpoints.application.getAllStatuses);
