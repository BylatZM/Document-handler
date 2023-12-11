import { getCitizenRequest, getUserRequest } from '../../store/creators/PersonCreators';
import { Loading } from '../Loading/Loading';
import { useActions } from '../hooks/useActions';
import { Applications } from './content/applications/Applications';
import { PersonalAccount } from './content/personalAccount/PersonalAccount';
import { Header } from './header/Header';
import { Menu } from './menu/Menu';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutRequest } from '../../store/creators/MainCreators';
import { getComplexesRequest } from '../../store/creators/PossessionCreators';
import {
  getApplicationsRequest,
  getEmploysRequest,
  getGradesRequest,
  getPrioritiesRequest,
  getSourcesRequest,
  getStatusesRequest,
  getTypesRequest,
} from '../../store/creators/ApplicationCreators';
import { CreateUser } from './content/personalAccount/dispetcher/CreateUser';

export const Account = () => {
  const dispatch = useDispatch();
  const [isOpened, changeIsOpened] = useState(false);
  const { pathname } = useLocation();
  const {
    userStart,
    userSuccess,
    complexSuccess,
    citizenSuccess,
    applicationSuccess,
    typesSuccess,
    gradesSuccess,
    sourcesSuccess,
    statusesSuccess,
    prioritySuccess,
    employsSuccess,
  } = useActions();
  const [IsRequested, changeIsRequested] = useState(true);

  const get_user_data = async () => {
    userStart();
    const profile_response = await getUserRequest();
    if (profile_response === 403) logoutRequest(dispatch);
    else {
      if (profile_response && 'first_name' in profile_response) {
        userSuccess(profile_response);
        if (['житель', 'диспетчер'].some((el) => el === profile_response.role.role)) {
          await get_citizen();
        }
        if (profile_response.role.role === 'диспетчер') {
          const employs = await getEmploysRequest();
          if (employs !== 403) employsSuccess(employs);
        }

        await get_citizen_select_info();
        await get_dispatcher_select_info();
      }
    }
  };

  const get_citizen_select_info = async () => {
    const types = await getTypesRequest();
    if (types !== 403) typesSuccess(types);
    const sources = await getSourcesRequest();
    if (sources !== 403) sourcesSuccess(sources);
  };

  const get_dispatcher_select_info = async () => {
    const grades = await getGradesRequest();
    if (grades !== 403) gradesSuccess(grades);
    const statuses = await getStatusesRequest();
    if (statuses !== 403) statusesSuccess(statuses);
    const priorities = await getPrioritiesRequest();
    if (priorities !== 403) prioritySuccess(priorities);
  };

  const get_citizen = async () => {
    const response = await getCitizenRequest();
    if (response !== 403) citizenSuccess(response);
  };

  const get_applications = async () => {
    const response = await getApplicationsRequest();
    if (response !== 403 && response.length > 0) {
      applicationSuccess(response);
    }
  };

  const get_complexes = async () => {
    const complexes = await getComplexesRequest();
    if (complexes !== 403) complexSuccess(complexes);
  };

  const makeRequest = async () => {
    await get_user_data();
    await get_applications();
    await get_complexes();
    changeIsRequested(false);
  };

  useEffect(() => {
    if (IsRequested) makeRequest();
  }, [IsRequested]);

  if (IsRequested) return <Loading />;

  return (
    <>
      <Menu isOpened={isOpened} />
      <div className='min-h-screen bg-gray-100 relative inset-0'>
        <Header changeIsOpened={changeIsOpened} isOpened={isOpened} />
        <div className='mt-[68px] '>
          {pathname.includes('/account/aboutMe') && <PersonalAccount />}
          {pathname.includes('/account/applications') && <Applications />}
          {pathname.includes('/account/create/possession') && <CreateUser />}
        </div>
      </div>
    </>
  );
};
