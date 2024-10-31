import { getAllCamerasByBuildingId, getSliceInfo } from '..';
import { ICamera, IError } from '../../components/types';
import request from 'axios';
import { refreshRequest } from './Main';
import { errorAlert } from './Main';
import axios from 'axios';

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
export const getSlicesInfoRequest = async (url: string): Promise<string[] | void> => {
  try {
    const response = await getSliceInfo(`${url}/index.txt`);
    if (response.status === 200 && Array.isArray(response.data)) {
      let blobArray: string[] = [];
      response.data.forEach((el) => {
        blobArray.push(`${url}/${el}.mp4`);
      });
      return blobArray;
    }
    return;
  } catch (e) {
    return;
  }
};

// export const getVideoStreamRequest = async (url: string): Promise<string | 404 | void> => {
//   try {
//     const response = await axios.get(url, { responseType: 'blob' });
//     return URL.createObjectURL(response.data);
//   } catch (e) {
//     if (request.isAxiosError(e) && e.response?.status === 404) {
//       return 404;
//     }
//     return;
//   }
// };
