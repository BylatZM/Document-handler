import {
  IAppCreateByDispatcher,
  IAppCreateByCitizen,
  IEmployee,
  IPriority,
  ISource,
  IStatus,
  IType,
  IAppUpdateByDispatcher,
  IAppUpdateByEmployee,
  ISubtype,
  IApplicationPagination,
  IGisApplicationPagination,
  IUpdateGisAppByDispatcher,
  IUpdateGisAppByEmployee,
} from '../../components/types';
import {
  createSystemApplication,
  getAllSystemApplicationsByExtra,
  getAllEmploys,
  getAllPriorities,
  getAllSources,
  getAllStatuses,
  getAllTypes,
  updateSystemApplicationById,
  updateSystemApplicationStatusById,
  getAllSubtypesByTypeId,
  getAllGisApplicationsByExtra,
  updateGisApplicationById,
  // updateGisApplicationStatusById,
} from '..';
import { IError } from '../../components/types';
import request from 'axios';
import { refreshRequest } from './Main';
import { errorAlert } from './Main';
import { cache } from '../instance';

export const getAllSystemApplicationsByExtraRequest = async (
  logout: () => void,
  page: string,
  page_size: string,
  extra: string,
): Promise<IApplicationPagination | void> => {
  const makeRequest = async (): Promise<IApplicationPagination | 401 | void> => {
    try {
      const response = await getAllSystemApplicationsByExtra(page, page_size, extra);
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

export const getAllGisApplicationsByExtraRequest = async (
  logout: () => void,
  page: string,
  page_size: string,
): Promise<IGisApplicationPagination | void> => {
  const makeRequest = async (): Promise<IGisApplicationPagination | 401 | void> => {
    try {
      const response = await getAllGisApplicationsByExtra(page, page_size);
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

export const createSystemApplicationRequest = async (
  logout: () => void,
  application: IAppCreateByDispatcher | IAppCreateByCitizen,
): Promise<IError | 201 | void> => {
  const makeRequest = async (): Promise<IError | 201 | 401 | void> => {
    try {
      await createSystemApplication(application);
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

export const updateSystemApplicationByIdRequest = async (
  id: string,
  logout: () => void,
  data: IAppUpdateByDispatcher | IAppUpdateByEmployee,
): Promise<IError | 200 | void> => {
  const makeRequest = async (): Promise<IError | 200 | 401 | void> => {
    try {
      await updateSystemApplicationById(id, data);
      return 200;
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

export const updateGisApplicationByIdRequest = async (
  id: string,
  logout: () => void,
  data: IUpdateGisAppByDispatcher | IUpdateGisAppByEmployee,
): Promise<IError | 200 | void> => {
  const makeRequest = async (): Promise<IError | 200 | 401 | void> => {
    try {
      await updateGisApplicationById(id, data);
      return 200;
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

// export const updateGisApplicationStatusByIdRequest = async (
//   application_id: string,
//   data: IUpdateGisAppStatus,
//   logout: () => void,
// ): Promise<200 | void> => {
//   const makeRequest = async (): Promise<200 | 401 | void> => {
//     try {
//       await updateGisApplicationStatusById(application_id, data);
//       return 200;
//     } catch (e) {
//       if (request.isAxiosError(e) && e.response) {
//         if (e.response.status === 401) return 401;
//         else {
//           if (e.response.status === 400) return e.response.data;
//           else errorAlert(e.response.status);
//         }
//       }
//     }
//   };

//   const response = await makeRequest();
//   if (!response) return;

//   if (response === 401) {
//     const refresh_status = await refreshRequest();
//     if (refresh_status === 200) {
//       const response = await makeRequest();
//       if (response !== 401) return response;
//       else return;
//     }
//     if (refresh_status === 403) logout();
//   } else return response;
// };

export const updateSystemApplicationStatusByIdRequest = async (
  id: string,
  logout: () => void,
  status: number,
): Promise<200 | void | IError> => {
  const makeRequest = async (): Promise<200 | 401 | void | IError> => {
    try {
      await updateSystemApplicationStatusById({ status: status }, id);
      return 200;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        else {
          if (e.response.status === 400) {
            return e.response.data;
          } else if (e.response.status !== 401) errorAlert(e.response.status);
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

export const getAllEmploysRequest = async (logout: () => void): Promise<IEmployee[] | void> => {
  const makeRequest = async (): Promise<IEmployee[] | 401 | void> => {
    try {
      const response = await getAllEmploys();
      if (response.data) return response.data;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        if (e.response.status !== 401 && e.response.status !== 400) errorAlert(e.response.status);
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

export const getAllTypesRequest = async (logout: () => void): Promise<IType[] | void> => {
  const makeRequest = async (): Promise<IType[] | 401 | void> => {
    try {
      const response = await getAllTypes();
      if (response.data) return response.data;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        if (e.response.status !== 401 && e.response.status !== 400) errorAlert(e.response.status);
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

export const getAllStatusesRequest = async (logout: () => void): Promise<IStatus[] | void> => {
  const makeRequest = async (): Promise<IStatus[] | 401 | void> => {
    try {
      const response = await getAllStatuses();
      if (response.data) return response.data;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        if (e.response.status !== 401 && e.response.status !== 400) errorAlert(e.response.status);
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

export const getAllPrioritiesRequest = async (logout: () => void): Promise<IPriority[] | void> => {
  const makeRequest = async (): Promise<IPriority[] | 401 | void> => {
    try {
      const response = await getAllPriorities();
      if (response.data) return response.data;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        if (e.response.status !== 401 && e.response.status !== 400) errorAlert(e.response.status);
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

export const getAllSourcesRequest = async (logout: () => void): Promise<ISource[] | void> => {
  const makeRequest = async (): Promise<ISource[] | 401 | void> => {
    try {
      const response = await getAllSources();
      if (response.data) return response.data;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        if (e.response.status !== 401 && e.response.status !== 400) errorAlert(e.response.status);
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

export const getAllSubtypesByTypeIdRequest = async (
  logout: () => void,
  id: string,
): Promise<ISubtype[] | void> => {
  const makeRequest = async (): Promise<ISubtype[] | 401 | void> => {
    try {
      let cache_data = cache.subtype.filter((el) => el.url === `appSubtype/${id}`);
      if (cache_data.length) {
        return cache_data[0].data;
      }
      const response = await getAllSubtypesByTypeId(id);
      if (response.data) return response.data;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        if (e.response.status !== 401 && e.response.status !== 400) errorAlert(e.response.status);
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
