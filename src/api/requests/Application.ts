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
  IEmailApplicationPagination,
  IUpdateEmailAppByDispatcher,
  IUpdateEmailAppByEmployee,
  ICreateApplicationByCitizenSuccessResponse,
  IOpenKazanApplicationPagination,
} from '../../components/types';
import {
  createSystemApplication,
  getAllSystemApplicationsByExtra,
  getAllEmploysWithExtra,
  getAllPriorities,
  getAllSources,
  getAllStatuses,
  getAllTypes,
  getAllTypesByComplexId,
  updateSystemApplicationById,
  updateSystemApplicationStatusById,
  getAllSubtypesWithExtra,
  getAllGisApplicationsByExtra,
  updateGisApplicationById,
  getAllEmailApplicationsByExtra,
  updateEmailApplicationById,
  loadSystemApplicationFiles,
  loadEmailApplicationFiles,
  getAllOpenKazanApplicationByExtra,
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

export const getAllOpenKazanApplicationsByExtraRequest = async (
  logout: () => void,
  page: string,
  page_size: string,
  extra: string,
): Promise<IOpenKazanApplicationPagination | void> => {
  const makeRequest = async (): Promise<IOpenKazanApplicationPagination | 401 | void> => {
    try {
      const response = await getAllOpenKazanApplicationByExtra(page, page_size, extra);
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
  extra: string,
): Promise<IGisApplicationPagination | void> => {
  const makeRequest = async (): Promise<IGisApplicationPagination | 401 | void> => {
    try {
      const response = await getAllGisApplicationsByExtra(page, page_size, extra);
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

export const getAllEmailApplicationsByExtraRequest = async (
  logout: () => void,
  page: string,
  page_size: string,
  extra: string,
): Promise<IEmailApplicationPagination | void> => {
  const makeRequest = async (): Promise<IEmailApplicationPagination | 401 | void> => {
    try {
      const response = await getAllEmailApplicationsByExtra(page, page_size, extra);
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
): Promise<IError | 201 | ICreateApplicationByCitizenSuccessResponse | void> => {
  const makeRequest = async (): Promise<
    IError | 201 | ICreateApplicationByCitizenSuccessResponse | 401 | void
  > => {
    try {
      const response = await createSystemApplication(application);
      if (response.data) return response.data;
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

export const loadSystemApplicationFilesRequest = async (
  logout: () => void,
  files: FormData,
): Promise<IError | 201 | void> => {
  const makeRequest = async (): Promise<IError | 201 | 401 | void> => {
    try {
      await loadSystemApplicationFiles(files);
      return 201;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        else if (e.response.status !== 400) errorAlert(e.response.status);
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

export const loadEmailApplicationFilesRequest = async (
  logout: () => void,
  files: FormData,
): Promise<IError | 201 | void> => {
  const makeRequest = async (): Promise<IError | 201 | 401 | void> => {
    try {
      await loadEmailApplicationFiles(files);
      return 201;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        else if (e.response.status !== 400) errorAlert(e.response.status);
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

export const updateEmailApplicationByIdRequest = async (
  id: string,
  logout: () => void,
  data: IUpdateEmailAppByDispatcher | IUpdateEmailAppByEmployee,
): Promise<IError | 200 | void> => {
  const makeRequest = async (): Promise<IError | 200 | 401 | void> => {
    try {
      await updateEmailApplicationById(id, data);
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

export const getAllEmploysWithExtraRequest = async (
  complex_id: string,
  subtype_id: string,
  logout: () => void,
): Promise<IEmployee[] | void | IError> => {
  const makeRequest = async (): Promise<IEmployee[] | 401 | void | IError> => {
    try {
      const response = await getAllEmploysWithExtra(subtype_id, complex_id);
      if (response.data) return response.data;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        if (e.response.status === 400) return e.response.data;
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

export const getAllTypesByComplexIdRequest = async (
  complex_id: string,
  logout: () => void,
): Promise<IType[] | void> => {
  const makeRequest = async (): Promise<IType[] | 401 | void> => {
    try {
      let cache_data = cache.type.filter(
        (el) => el.url === `application/type/getAll/${complex_id}`,
      );
      if (cache_data.length) {
        return cache_data[0].data;
      }
      const response = await getAllTypesByComplexId(complex_id);
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
      let cache_data = cache.type.filter((el) => el.url === `application/type/getAll`);
      if (cache_data.length) {
        return cache_data[0].data;
      }
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
      let cache_data = cache.status.filter((el) => el.url === 'application/status/getAll');
      if (cache_data.length) {
        return cache_data[0].data;
      }
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
      let cache_data = cache.priority.filter((el) => el.url === 'application/priority/getAll');
      if (cache_data.length) {
        return cache_data[0].data;
      }
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
      let cache_data = cache.source.filter((el) => el.url === 'application/source/getAll');
      if (cache_data.length) {
        return cache_data[0].data;
      }
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

export const getAllSubtypesWithExtraRequest = async (
  logout: () => void,
  type_id?: string,
  complex_id?: string,
): Promise<ISubtype[] | void> => {
  const makeRequest = async (): Promise<ISubtype[] | 401 | void> => {
    let extra = '';
    if (type_id) extra = `?type_id=${type_id}`;
    if (complex_id) {
      if (extra) extra += `&complex_id=${complex_id}`;
      else extra = `?complex_id=${complex_id}`;
    }
    try {
      let cache_data = cache.subtype.filter(
        (el) => el.url === `application/subtype/getAll${extra}`,
      );
      if (cache_data.length) {
        return cache_data[0].data;
      }
      const response = await getAllSubtypesWithExtra(extra);
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
