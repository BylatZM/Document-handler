import { getCitizenRequest, getUserRequest } from '../../api/requests/Person';
import { Loading } from '../Loading/Loading';
import { useActions } from '../hooks/useActions';
import { Application } from './content/application/system/Application';
import { AboutMe } from './content/aboutMe/AboutMe';
import { Header } from './header/Header';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { Menu } from './menu/Menu';
import { ReactNode, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { getComplexesRequest } from '../../api/requests/Possession';
import {
  getEmploysRequest,
  getPrioritiesRequest,
  getSourcesRequest,
  getStatusesRequest,
  getTypesRequest,
} from '../../api/requests/Application';
import { ApprovingUser } from './content/approving/approvingUser/ApprovingUser';
import { ApprovingUserPossession } from './content/approving/approvingUserPossession/ApprovingUserPossession';
import { ErrorPage } from '../ErrorPage';
import { ApprovingLivingSpace } from './content/approving/approvingLivingSpace/ApprovingLivingSpace';
import { GisApplication } from './content/application/gis/GisApplication';
import { CreatePossession } from './content/createPossession/CreatePossession';
import { HelpForm } from './content/helpForm/HelpForm';

export const Account = () => {
  const logout = useLogout();
  const navigate = useNavigate();
  const [isOpened, changeIsOpened] = useState(false);
  const { user } = useTypedSelector((state) => state.UserReducer);
  const { citizen } = useTypedSelector((state) => state.CitizenReducer);
  const { pathname } = useLocation();
  const [needShowHelpForm, changeNeedShowHelpForm] = useState(false);
  const [needShowCreatePossessionForm, changeNeedShowCreatePossessionForm] = useState(false);
  const {
    userSuccess,
    complexSuccess,
    citizenSuccess,
    typesSuccess,
    sourcesSuccess,
    statusesSuccess,
    prioritySuccess,
    employsSuccess,
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
      }
      if (profile_response.role !== 'executor') {
        await get_complexes();
      }
      if (profile_response.account_status === 'Подтвержден') {
        await get_static_select_info();
        navigate('/account/applications');
        if (profile_response.role === 'citizen') await get_citizen();
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
    if (pathname === '/account/aboutMe')
      return <AboutMe changeNeedShowCreatePossessionForm={changeNeedShowCreatePossessionForm} />;
    if (pathname === '/account/applications') {
      if (!['dispatcher', 'executor', 'citizen'].some((el) => el === user.role))
        return <ErrorPage message='Страница не найдена' />;
      if (user.role !== 'citizen' && user.account_status !== 'Подтвержден')
        return <ErrorPage message='Ваш аккаунт не подтвержден' />;
      if (user.role === 'citizen' && user.account_status !== 'Подтвержден')
        return (
          <ErrorPage
            message={`Ваш аккаунт еще не подтвержден. Для того чтобы иметь возможность подавать заявки Вам нужно в разделе "Обо мне" указать фамилию, имя, отчество (при наличии), номер телефона, а также собственность, после чего дождаться уведомления (на почту ${user.email}) о подтверждении аккаунта диспетчером`}
          />
        );
      if (user.role === 'citizen' && !citizen.some((el) => el.approving_status === 'Подтверждена'))
        return (
          <ErrorPage message='У Вас нет ни одной собственности со статусом "Подтверждена", возможно вам стоит дождаться их подтверждения со стороны диспетчера или обратиться в техподдержку' />
        );

      return <Application />;
    }
    if (pathname === '/account/applications/gis') {
      if (!['dispatcher', 'executor'].some((el) => el === user.role))
        return <ErrorPage message='Страница не найдена' />;
      return <GisApplication />;
    }
    if (pathname === '/account/approve/user' && user.role === 'dispatcher')
      return <ApprovingUser />;

    if (pathname === '/account/approve/living_space' && user.role === 'dispatcher')
      return <ApprovingLivingSpace />;

    if (pathname === '/account/approve/citizen_possession' && user.role === 'dispatcher')
      return <ApprovingUserPossession />;
  };

  if (IsRequested) return <Loading />;

  return (
    <>
      <div className='flex w-full h-full bg-gray-100'>
        <Header changeIsOpened={changeIsOpened} isOpened={isOpened} />
        <Menu
          isOpened={isOpened}
          changeNeedShowHelpForm={changeNeedShowHelpForm}
          changeNeedShowCreatePossessionForm={changeNeedShowCreatePossessionForm}
        />
        <HelpForm needShowForm={needShowHelpForm} changeNeedShowForm={changeNeedShowHelpForm} />
        <CreatePossession
          needShowForm={needShowCreatePossessionForm}
          changeNeedShowForm={changeNeedShowCreatePossessionForm}
        />
        {GetCurrentFrame(pathname)}
      </div>
    </>
  );
};
