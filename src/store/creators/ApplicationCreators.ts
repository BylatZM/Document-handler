import {
  IApplicationRequest,
  IEmployee,
  IGrade,
  IPriority,
  ISource,
  IStatus,
  IType,
} from './../../components/types';
import {
  createApplication,
  getApplication,
  getEmployee,
  getGrade,
  getPriority,
  getSource,
  getStatus,
  getType,
  updateApplication,
} from '../../api';
import { IApplication, IError } from '../../components/types';
import request from 'axios';
import { refreshRequest } from './MainCreators';

export const getApplicationsRequest = async (): Promise<IApplication[] | 403> => {
  try {
    const response = await getApplication();
    return response.data;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) {
          try {
            const response = await getApplication();
            return response.data;
          } catch (e) {
            if (request.isAxiosError(e) && e.response) {
              console.log(e.response);
            }
          }
        }
      } else console.log(e.response);
    }
  }
  return 403;
};

export const createApplicationsRequest = async (
  application: IApplicationRequest,
): Promise<IError | 201 | 403> => {
  try {
    await createApplication(application);
    return 201;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) {
          try {
            await createApplication(application);
            return 201;
          } catch (e) {
            if (request.isAxiosError(e) && e.response) {
              return e.response.data;
            }
          }
        }
      } else return e.response.data;
    }
  }
  return 403;
};

export const updateApplicationsRequest = async (
  id: number,
  application: IApplicationRequest,
): Promise<IError | 200 | 403> => {
  try {
    await updateApplication(id, application);
    return 200;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) {
          try {
            await updateApplication(id, application);
            return 200;
          } catch (e) {
            if (request.isAxiosError(e) && e.response) {
              return e.response.data;
            }
          }
        }
      } else return e.response.data;
    }
  }
  return 403;
};

export const getEmploysRequest = async (): Promise<IEmployee[] | 403> => {
  try {
    const response = await getEmployee();
    if (response.data) return response.data;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) {
          try {
            const response = await getEmployee();
            if (response.data) return response.data;
          } catch (e) {
            if (request.isAxiosError(e) && e.response) {
              console.log(e.response.status);
            }
          }
        }
      } else console.log(e.response.status);
    }
  }
  return 403;
};

export const getGradesRequest = async (): Promise<IGrade[] | 403> => {
  try {
    const response = await getGrade();
    if (response.data) return response.data;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) {
          try {
            const response = await getGrade();
            if (response.data) return response.data;
          } catch (e) {
            if (request.isAxiosError(e) && e.response) {
              console.log(e.response.status);
            }
          }
        }
      } else console.log(e.response.status);
    }
  }
  return 403;
};

export const getTypesRequest = async (): Promise<IType[] | 403> => {
  try {
    const response = await getType();
    if (response.data) return response.data;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) {
          try {
            const response = await getType();
            if (response.data) return response.data;
          } catch (e) {
            if (request.isAxiosError(e) && e.response) {
              console.log(e.response.status);
            }
          }
        }
      } else console.log(e.response.status);
    }
  }
  return 403;
};

export const getStatusesRequest = async (): Promise<IStatus[] | 403> => {
  try {
    const response = await getStatus();
    if (response.data) return response.data;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) {
          try {
            const response = await getStatus();
            if (response.data) return response.data;
          } catch (e) {
            if (request.isAxiosError(e) && e.response) {
              console.log(e.response.status);
            }
          }
        }
      } else console.log(e.response.status);
    }
  }
  return 403;
};

export const getPrioritiesRequest = async (): Promise<IPriority[] | 403> => {
  try {
    const response = await getPriority();
    if (response.data) return response.data;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) {
          try {
            const response = await getPriority();
            if (response.data) return response.data;
          } catch (e) {
            if (request.isAxiosError(e) && e.response) {
              console.log(e.response.status);
            }
          }
        }
      } else console.log(e.response.status);
    }
  }
  return 403;
};

export const getSourcesRequest = async (): Promise<ISource[] | 403> => {
  try {
    const response = await getSource();
    if (response.data) return response.data;
  } catch (e) {
    if (request.isAxiosError(e) && e.response) {
      if (e.response.status === 401) {
        const refresh_status = await refreshRequest();
        if (refresh_status === 200) {
          try {
            const response = await getSource();
            if (response.data) return response.data;
          } catch (e) {
            if (request.isAxiosError(e) && e.response) {
              console.log(e.response.status);
            }
          }
        }
      } else console.log(e.response.status);
    }
  }
  return 403;
};
