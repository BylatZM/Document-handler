import {
  getCitizenRequest,
  getNotApprovedUsersRequest,
  getUserRequest,
} from '../../api/requests/Person';
import { Loading } from '../Loading/Loading';
import { useActions } from '../hooks/useActions';
import { Applications } from './content/applications/Applications';
import { PersonalAccount } from './content/personalAccount/PersonalAccount';
import { Header } from './header/Header';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { Menu } from './menu/Menu';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { getComplexesRequest } from '../../api/requests/Possession';
import {
  getApplicationsRequest,
  getEmploysRequest,
  getGradesRequest,
  getPrioritiesRequest,
  getSourcesRequest,
  getStatusesRequest,
  getTypesRequest,
} from '../../api/requests/Application';
import { ApproveCitizen } from './content/personalAccount/dispatcher/ApproveCitizen';
import { ErrorPage } from '../ErrorPage';

export const Account = () => {
  const logout = useLogout();
  const [isOpened, changeIsOpened] = useState(false);
  const { user } = useTypedSelector((state) => state.UserReducer);
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
    notApprovedUsersSuccess,
  } = useActions();
  const [IsRequested, changeIsRequested] = useState(true);

  const get_user_data = async () => {
    userStart();
    const profile_response = await getUserRequest(logout);
    if (profile_response) {
      userSuccess(profile_response);
      if (profile_response.role.role === 'dispatcher') {
        const employs = await getEmploysRequest(logout);
        if (employs) employsSuccess(employs);

        const notApprovedUsers = await getNotApprovedUsersRequest(logout);
        if (notApprovedUsers) notApprovedUsersSuccess(notApprovedUsers);
      }
      if (profile_response.role.role in ['citizen', 'executor']) await get_applications();
      if (profile_response.role.role) await get_citizen();

      await get_citizen_select_info();
      await get_dispatcher_select_info();
    }
  };

  const get_citizen_select_info = async () => {
    const types = await getTypesRequest(logout);
    if (types) typesSuccess(types);
    const sources = await getSourcesRequest(logout);
    if (sources) sourcesSuccess(sources);
  };

  const get_dispatcher_select_info = async () => {
    const grades = await getGradesRequest(logout);
    if (grades) gradesSuccess(grades);
    const statuses = await getStatusesRequest(logout);
    if (statuses) statusesSuccess(statuses);
    const priorities = await getPrioritiesRequest(logout);
    if (priorities) prioritySuccess(priorities);
  };

  const get_citizen = async () => {
    const response = await getCitizenRequest(logout);
    if (response) citizenSuccess(response);
  };

  const get_applications = async () => {
    const response = await getApplicationsRequest(logout);
    if (response && response.length > 0) {
      applicationSuccess(response);
    }
  };

  const get_complexes = async () => {
    const complexes = await getComplexesRequest(logout);
    if (complexes) complexSuccess(complexes);
  };

  const makeRequest = async () => {
    await get_user_data();
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
        <div className='mt-[68px]'>
          {pathname.includes('/account/aboutMe') && <PersonalAccount />}
          {((user.isApproved && user.role.role === 'citizen') ||
            user.role.role === 'dispatcher' ||
            user.role.role === 'executor') &&
            pathname.includes('/account/applications') && <Applications />}
          {user.role.role === 'dispatcher' && pathname.includes('/account/citizen/approve') && (
            <ApproveCitizen />
          )}
        </div>
      </div>
    </>
  );
};
