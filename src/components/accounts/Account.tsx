import {
  getCitizenRequest,
  getNotApprovedUsersRequest,
  getUserRequest,
} from '../../api/requests/Person';
import { Loading } from '../Loading/Loading';
import { useActions } from '../hooks/useActions';
import { Application } from './content/application/Application';
import { AboutMe } from './content/aboutMe/AboutMe';
import { Header } from './header/Header';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { Menu } from './menu/Menu';
import { ReactNode, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import {
  getComplexesRequest,
  getNotApprovedPossessionsRequest,
} from '../../api/requests/Possession';
import {
  getApplicationsRequest,
  getEmploysRequest,
  getPrioritiesRequest,
  getSourcesRequest,
  getStatusesRequest,
  getTypesRequest,
} from '../../api/requests/Application';
import { ApproveCitizen } from './content/approveCitizen/ApproveCitizen';
import { ErrorPage } from '../ErrorPage';
import { ApprovePossession } from './content/approvePossession/ApprovePossession';

export const Account = () => {
  const logout = useLogout();
  const navigate = useNavigate();
  const [isOpened, changeIsOpened] = useState(false);
  const { user } = useTypedSelector((state) => state.UserReducer);
  const { pathname } = useLocation();
  const {
    userSuccess,
    complexSuccess,
    citizenSuccess,
    applicationSuccess,
    typesSuccess,
    sourcesSuccess,
    statusesSuccess,
    prioritySuccess,
    employsSuccess,
    notApprovedUsersSuccess,
    notApprovedPossessionSuccess,
  } = useActions();
  const [IsRequested, changeIsRequested] = useState(true);

  const get_user_data = async () => {
    const profile_response = await getUserRequest(logout);
    if (profile_response) {
      userSuccess(profile_response);
      if (!['dispatcher', 'executor', 'citizen'].some((el) => el === profile_response.role)) {
        logout();
        return;
      }
      if (profile_response.role === 'dispatcher') {
        const employs = await getEmploysRequest(logout);
        if (employs) employsSuccess(employs);
        const notApprovedUsers = await getNotApprovedUsersRequest(logout);
        if (notApprovedUsers) notApprovedUsersSuccess(notApprovedUsers);
        const notApprovedPossessions = await getNotApprovedPossessionsRequest(logout);
        if (notApprovedPossessions) notApprovedPossessionSuccess(notApprovedPossessions);
      }
      if (profile_response.role !== 'executor') {
        await get_complexes();
      }
      await get_applications();
      if (profile_response.role) await get_citizen();
      if (profile_response.account_status === 'подтвержден') {
        await get_static_select_info();
        navigate('/account/applications');
      }
    }
  };

  const get_static_select_info = async () => {
    const types = await getTypesRequest(logout);
    if (types) typesSuccess(types);
    const sources = await getSourcesRequest(logout);
    if (sources) sourcesSuccess(sources);
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
    changeIsRequested(false);
  };

  useEffect(() => {
    if (IsRequested) makeRequest();
  }, [IsRequested]);

  const GetCurrentFrame = (pathname: string): ReactNode => {
    if (pathname === '/account/aboutMe') return <AboutMe />;
    if (pathname === '/account/applications') {
      if (user.account_status !== 'подтвержден') return <ErrorPage message='Страница не найдена' />;
      if (!['dispatcher', 'executor', 'citizen'].some((el) => el === user.role))
        return <ErrorPage message='Страница не найдена' />;

      return <Application />;
    }
    if (pathname === '/account/approve/user' && user.role === 'dispatcher')
      return <ApproveCitizen />;

    if (pathname === '/account/approve/possession' && user.role === 'dispatcher')
      return <ApprovePossession />;

    if (pathname === '/account/approve/possession' && user.role === 'dispatcher')
      return <ApproveCitizen />;
  };

  if (IsRequested) return <Loading />;

  return (
    <>
      <Menu isOpened={isOpened} />
      <div className='min-h-screen bg-gray-100 relative inset-0 overflow-x-auto'>
        <Header changeIsOpened={changeIsOpened} isOpened={isOpened} />
        <div className='mt-[68px]'>{GetCurrentFrame(pathname)}</div>
      </div>
    </>
  );
};
