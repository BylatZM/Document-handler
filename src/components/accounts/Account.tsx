import { getAllCitizenPossessionsRequest, getUserRequest } from '../../api/requests/User';
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
  getAllBuildingsByComplexIdRequest,
  getAllComplexesRequest,
  getAllPossessionsByExtraRequest,
} from '../../api/requests/Possession';
import {
  getAllEmploysRequest,
  getAllPrioritiesRequest,
  getAllSourcesRequest,
  getAllStatusesRequest,
  getAllSubtypesByTypeIdRequest,
  getAllTypesRequest,
} from '../../api/requests/Application';
import { ApprovingUserPossession } from './content/approving/approvingUserPossession/ApprovingUserPossession';
import { ErrorPage } from '../ErrorPage';
import { ApprovingLivingSpace } from './content/approving/approvingLivingSpace/ApprovingLivingSpace';
import { GisApplication } from './content/application/gis/GisApplication';
import { CreatePossession } from './content/createPossession/CreatePossession';
import { HelpForm } from './content/helpForm/HelpForm';
import { IBuildingWithComplex, ICitizenPossession, IError, IPossession, ISubtype } from '../types';

export const Account = () => {
  const logout = useLogout();
  const navigate = useNavigate();
  const [isOpened, changeIsOpened] = useState(false);
  const { user } = useTypedSelector((state) => state.UserReducer);
  const { citizenPossessions } = useTypedSelector((state) => state.CitizenReducer);
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
    possessionError,
    applicationLoading,
    userLoading,
  } = useActions();
  const [IsRequested, changeIsRequested] = useState(true);

  const getUserBaseInfo = async () => {
    const user = await getUser();

    if (!user) return;

    if (!['dispatcher', 'executor', 'citizen'].some((el) => el === user.role)) {
      logout();
      return;
    }
    if (user.role !== 'executor') {
      await getAllComplexes();
    }
    if (user.role === 'citizen') {
      const response = await getCitizenPossessions();
      if (response && response.some((el) => el.approving_status === 'Подтверждена')) {
        navigate('/account/applications');
      }
    }
    if (['dispatcher', 'executor'].some((el) => el === user.role))
      navigate('/account/applications');
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

  const getCitizenPossessions = async (): Promise<ICitizenPossession[] | void> => {
    const citizenPossessions = await getAllCitizenPossessionsRequest(logout);

    if (!citizenPossessions) return;

    citizenSuccess(citizenPossessions);
    return citizenPossessions;
  };

  const getTypes = async () => {
    applicationLoading('types');
    const types = await getAllTypesRequest(logout);

    if (!types) {
      applicationLoading(null);
      return;
    }
    typesSuccess(types);
  };

  const getPriorities = async () => {
    applicationLoading('priorities');
    const priorities = await getAllPrioritiesRequest(logout);

    if (!priorities) {
      applicationLoading(null);
      return;
    }
    prioritiesSuccess(priorities);
  };

  const getSources = async () => {
    applicationLoading('sources');
    const sources = await getAllSourcesRequest(logout);

    if (!sources) {
      applicationLoading(null);
      return;
    }

    sourcesSuccess(sources);
  };

  const getStatuses = async () => {
    applicationLoading('statuses');
    const statuses = await getAllStatusesRequest(logout);

    if (!statuses) {
      applicationLoading(null);
      return;
    }

    statusesSuccess(statuses);
  };

  const getEmploys = async () => {
    applicationLoading('employs');
    const employs = await getAllEmploysRequest(logout);

    if (!employs) {
      applicationLoading(null);
      return;
    }

    employsSuccess(employs);
  };

  const getAllComplexes = async () => {
    possessionLoading('complexes');
    const complexes = await getAllComplexesRequest(logout);

    if (!complexes) {
      possessionLoading(null);
      return;
    }

    complexSuccess(complexes);
  };

  const getAllBuildingsByComplexId = async (
    complex_id: string,
  ): Promise<IBuildingWithComplex[] | void> => {
    buildingSuccess([]);
    possessionSuccess([]);
    possessionLoading('buildings');
    const builds = await getAllBuildingsByComplexIdRequest(complex_id, logout);

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
    const subtypes = await getAllSubtypesByTypeIdRequest(logout, id);

    if (!subtypes) {
      applicationLoading(null);
      return;
    }

    subTypesSuccess(subtypes);
    return subtypes;
  };

  const getAllPossessionsByExtra = async (
    type: string,
    building_id: string,
  ): Promise<void | IPossession[] | IError> => {
    possessionSuccess([]);
    possessionLoading('possessions');
    const possessions = await getAllPossessionsByExtraRequest(type, building_id, logout);

    if (!possessions) {
      possessionLoading(null);
      return;
    }
    if ('type' in possessions) {
      possessionLoading(null);
      return possessions;
    } else {
      possessionSuccess(possessions);
      return possessions;
    }
  };

  const makeRequest = async () => {
    await getUserBaseInfo();
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
          getAllBuildingsByComplexId={getAllBuildingsByComplexId}
          getCitizenPossessions={getCitizenPossessions}
          getPossessions={getAllPossessionsByExtra}
        />
      );
    if (pathname === '/account/applications') {
      if (!['dispatcher', 'executor', 'citizen'].some((el) => el === user.role))
        return <ErrorPage message='Страница не найдена' />;
      if (user.role === 'citizen') {
        if (citizenPossessions.length === 1 && citizenPossessions[0].id < 1) {
          return (
            <ErrorPage
              message={`Для того чтобы иметь возможность подавать заявки Вам нужно в разделе "Обо мне" указать фамилию, имя, отчество (при наличии), номер телефона, а также собственность, после чего дождаться уведомления (на почту ${user.email}) о подтверждении Вашего имущества диспетчером`}
            />
          );
        }
        if (
          (citizenPossessions.length === 1 &&
            citizenPossessions[0].approving_status !== 'Подтверждена') ||
          (citizenPossessions.length > 1 &&
            !citizenPossessions.some((el) => el.approving_status === 'Подтверждена'))
        ) {
          return (
            <ErrorPage
              message={`У ни одной заданной Вами собственности на данный момент нет статуса "Подтверждена". Вам следует дождаться подтверждения хотя бы одной из них, для того чтобы иметь возможност подавать заявки. Уведомление об одобрении или отказе имущества придет на почту ${user.email}`}
            />
          );
        }
      }
      return (
        <Application
          getPossessions={getAllPossessionsByExtra}
          getAllBuildingsByComplexId={getAllBuildingsByComplexId}
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
          getAllBuildingsByComplexId={getAllBuildingsByComplexId}
        />
        {GetCurrentFrame(pathname)}
      </div>
    </>
  );
};
