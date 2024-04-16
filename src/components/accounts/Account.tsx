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
import {
  getBuildingsRequest,
  getComplexesRequest,
  getPossessionsRequest,
} from '../../api/requests/Possession';
import {
  getEmploysRequest,
  getPrioritiesRequest,
  getSourcesRequest,
  getStatusesRequest,
  getSubTypesRequest,
  getTypesRequest,
} from '../../api/requests/Application';
import { ApprovingUser } from './content/approving/approvingUser/ApprovingUser';
import { ApprovingUserPossession } from './content/approving/approvingUserPossession/ApprovingUserPossession';
import { ErrorPage } from '../ErrorPage';
import { ApprovingLivingSpace } from './content/approving/approvingLivingSpace/ApprovingLivingSpace';
import { GisApplication } from './content/application/gis/GisApplication';
import { CreatePossession } from './content/createPossession/CreatePossession';
import { HelpForm } from './content/helpForm/HelpForm';
import { IBuildingWithComplex, IPossession, ISubtype } from '../types';

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
    prioritiesSuccess,
    employsSuccess,
    possessionLoading,
    subTypesSuccess,
    buildingSuccess,
    possessionSuccess,
    applicationError,
    applicationLoading,
    userLoading,
  } = useActions();
  const [IsRequested, changeIsRequested] = useState(true);

  const get_user_data = async () => {
    const user = await getUser();

    if (!user) return;

    if (!['dispatcher', 'executor', 'citizen'].some((el) => el === user.role)) {
      logout();
      return;
    }
    // if (user.role === 'dispatcher') {
    //   const employs = await getEmploysRequest(logout);
    //   if (employs) employsSuccess(employs);
    // }
    if (user.role !== 'executor') {
      await getComplexes();
    }
    if (user.account_status === 'Подтвержден') {
      navigate('/account/applications');
      if (user.role === 'citizen') await getCitizenPossessions();
    }
  };

  const getUser = async () => {
    userLoading(true);
    const user = await getUserRequest(logout);

    if (!user) {
      userLoading(false);
      return;
    }

    userSuccess(user);
    return user;
  };

  const getCitizenPossessions = async () => {
    const citizenPossessions = await getCitizenRequest(logout);

    if (!citizenPossessions) return;

    citizenSuccess(citizenPossessions);
  };

  const getTypes = async () => {
    applicationLoading('types');
    const types = await getTypesRequest(logout);

    if (!types) {
      applicationLoading(null);
      return;
    }
    typesSuccess(types);
  };

  const getPriorities = async () => {
    applicationLoading('priorities');
    const priorities = await getPrioritiesRequest(logout);

    if (!priorities) {
      applicationLoading(null);
      return;
    }
    prioritiesSuccess(priorities);
  };

  const getSources = async () => {
    applicationLoading('sources');
    const sources = await getSourcesRequest(logout);

    if (!sources) {
      applicationLoading(null);
      return;
    }

    sourcesSuccess(sources);
  };

  const getStatuses = async () => {
    applicationLoading('statuses');
    const statuses = await getStatusesRequest(logout);

    if (!statuses) {
      applicationLoading(null);
      return;
    }

    statusesSuccess(statuses);
  };

  const getEmploys = async () => {
    applicationLoading('employs');
    const employs = await getEmploysRequest(logout);

    if (!employs) {
      applicationLoading(null);
      return;
    }

    employsSuccess(employs);
  };

  const getComplexes = async () => {
    possessionLoading('complexes');
    const complexes = await getComplexesRequest(logout);

    if (!complexes) {
      possessionLoading(null);
      return;
    }

    complexSuccess(complexes);
  };

  const getBuildings = async (complex_id: string): Promise<IBuildingWithComplex[] | void> => {
    buildingSuccess([]);
    possessionSuccess([]);
    possessionLoading('buildings');
    const builds = await getBuildingsRequest(complex_id, logout);

    if (!builds) {
      possessionLoading(null);
      return;
    } else {
      buildingSuccess(builds);
      return builds;
    }
  };

  const getSubtypes = async (id: string): Promise<ISubtype[] | void> => {
    applicationLoading('subtypes');
    const subtypes = await getSubTypesRequest(logout, id);

    if (!subtypes) {
      applicationLoading(null);
      return;
    }

    subTypesSuccess(subtypes);
    return subtypes;
  };

  const getPossessions = async (
    type: string,
    building_id: string,
  ): Promise<void | IPossession[]> => {
    possessionSuccess([]);
    possessionLoading('possessions');
    const possessions = await getPossessionsRequest(type, building_id, logout);

    if (!possessions) {
      possessionLoading(null);
      return;
    }

    if ('type' in possessions) {
      applicationError(possessions);
      possessionLoading(null);
    } else {
      possessionSuccess(possessions);
      return possessions;
    }
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
      return (
        <AboutMe
          changeNeedShowCreatePossessionForm={changeNeedShowCreatePossessionForm}
          getBuildings={getBuildings}
          getCitizenPossessions={getCitizenPossessions}
          getPossessions={getPossessions}
          getUser={getUser}
        />
      );
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

      return (
        <Application
          getPossessions={getPossessions}
          getBuildings={getBuildings}
          getPriorities={getPriorities}
          getSources={getSources}
          getStatuses={getStatuses}
          getSubtypes={getSubtypes}
          getTypes={getTypes}
          getEmploys={getEmploys}
        />
      );
    }
    if (pathname === '/account/applications/gis') {
      if (!['dispatcher', 'executor'].some((el) => el === user.role))
        return <ErrorPage message='Страница не найдена' />;
      return (
        <GisApplication
          getEmploys={getEmploys}
          getPriorities={getPriorities}
          getStatuses={getStatuses}
        />
      );
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
          getBuildings={getBuildings}
        />
        {GetCurrentFrame(pathname)}
      </div>
    </>
  );
};
