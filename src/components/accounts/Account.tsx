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
  getAllEmploysForGisRequest,
  getAllEmploysWithExtraRequest,
  getAllPrioritiesRequest,
  getAllSourcesRequest,
  getAllStatusesRequest,
  getAllSubtypesWithExtraRequest,
  getAllTypesByComplexIdRequest,
} from '../../api/requests/Application';
import { ApprovingUserPossession } from './content/approving/approvingUserPossession/ApprovingUserPossession';
import { ErrorPage } from '../ErrorPage';
import { ApprovingLivingSpace } from './content/approving/approvingLivingSpace/ApprovingLivingSpace';
import { GisApplication } from './content/application/gis/GisApplication';
import { CreatePossession } from './content/createPossession/CreatePossession';
import { HelpForm } from './content/helpForm/HelpForm';
import {
  IBuilding,
  ICitizenPossession,
  IEmployee,
  IError,
  IPossession,
  ISubtype,
  IType,
  IUser,
} from '../types';

export const Account = () => {
  const logout = useLogout();
  const navigate = useNavigate();
  const [isOpened, changeIsOpened] = useState(false);
  const { user } = useTypedSelector((state) => state.UserReducer);
  const citizenError = useTypedSelector((state) => state.CitizenReducer.error);
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
    subtypesSuccess,
    buildingSuccess,
    possessionSuccess,
    applicationError,
    applicationLoading,
    userLoading,
    citizenErrors,
  } = useActions();
  const [IsRequested, changeIsRequested] = useState(true);

  const baseChecker = async (operationType: 'init' | 'is_approved_citizen_check') => {
    const user = await getUser();

    if (!user) {
      logout();
      return;
    }

    if (!['dispatcher', 'executor', 'citizen'].some((el) => el === user.role)) {
      logout();
      return;
    }
    if (user.role !== 'executor' && operationType === 'init') {
      await getAllComplexes();
    }
    if (user.is_approved && operationType === 'init') {
      navigate('/account/applications');
    }
  };

  const getUser = async (): Promise<IUser | void> => {
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
    if (citizenError) citizenErrors(null);
    const citizenPossessions = await getAllCitizenPossessionsRequest(logout);

    if (!citizenPossessions) return;

    citizenSuccess(citizenPossessions);
    return citizenPossessions;
  };

  const getTypes = async (complex_id: string): Promise<IType[] | void> => {
    typesSuccess([]);
    subtypesSuccess([]);
    applicationLoading('types');
    const types = await getAllTypesByComplexIdRequest(complex_id, logout);

    if (!types) {
      applicationLoading(null);
      return;
    }
    typesSuccess(types);

    return types;
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

  const getEmploys = async (
    complex_id: string,
    subtype_id: string,
  ): Promise<IEmployee[] | void> => {
    employsSuccess([]);
    applicationLoading('employs');
    const response = await getAllEmploysWithExtraRequest(complex_id, subtype_id, logout);
    if (!response) {
      applicationLoading(null);
      return;
    }

    if ('type' in response) {
      applicationLoading(null);
      applicationError(response);
    } else {
      employsSuccess(response);
    }
  };

  const getGisEmploys = async () => {
    employsSuccess([]);
    applicationLoading('employs');
    const response = await getAllEmploysForGisRequest(logout);
    if (!response) {
      applicationLoading(null);
      return;
    }

    employsSuccess(response);
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

  const getAllBuildingsByComplexId = async (complex_id: string): Promise<IBuilding[] | void> => {
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

  const getSubtypes = async (type_id: string, complex_id: string): Promise<ISubtype[] | void> => {
    subtypesSuccess([]);
    applicationLoading('subtypes');
    const subtypes = await getAllSubtypesWithExtraRequest(logout, type_id, complex_id);

    if (!subtypes) {
      applicationLoading(null);
      return;
    }

    subtypesSuccess(subtypes);
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
    await baseChecker('init');
    changeIsRequested(false);
  };

  useEffect(() => {
    if (!IsRequested && user.role === 'citizen') {
      baseChecker('is_approved_citizen_check');
    }
  }, [pathname, IsRequested]);

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
      if (user.role === 'citizen' && !user.is_approved) {
        return (
          <ErrorPage
            message={`У Вас нет заданной собственности со статусом "Подтверждена". Вам нужно в разделе "Обо мне" указать фамилию, имя, отчество (при наличии), номер телефона, а также собственность, после чего дождаться уведомления (на почту ${user.email}) о подтверждении Вашего имущества диспетчером`}
          />
        );
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
          getCitizenPossessions={getCitizenPossessions}
        />
      );
    }
    if (pathname === '/account/applications/gis') {
      if (!['dispatcher', 'executor'].some((el) => el === user.role))
        return <ErrorPage message='Страница не найдена' />;
      return (
        <GisApplication
          getPriorities={getPriorities}
          getStatuses={getStatuses}
          getGisEmploys={getGisEmploys}
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
