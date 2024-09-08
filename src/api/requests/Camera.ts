import { getAllCamerasByBuildingId, getVideoFile } from '..';
import { ICamera, IError } from '../../components/types';
import request from 'axios';
import { refreshRequest } from './Main';
import { errorAlert } from './Main';

export const getAllCameraByBuildingIdRequest = async (
  building_id: string,
  logout: () => void,
): Promise<ICamera[] | IError | void> => {
  const makeRequest = async (): Promise<ICamera[] | 401 | IError | void> => {
    try {
      const response = await getAllCamerasByBuildingId(building_id);
      return response.data;
    } catch (e) {
      if (request.isAxiosError(e) && e.response) {
        if (e.response.status === 401) return 401;
        if (e.response.status === 400) return e.response.data;
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

export const getVideoFileRequest = async (url: string): Promise<200 | void> => {
  try {
    await getVideoFile(url);
    return 200;
  } catch (e) {
    return;
  }
};
