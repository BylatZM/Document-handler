import clsx from 'clsx';
import { FC, useEffect, useState } from 'react';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { IApplication, IError } from '../../../../types';
import { useActions } from '../../../../hooks/useActions';
import { useLogout } from '../../../../hooks/useLogout';
import { getBuildingsRequest, getPossessionsRequest } from '../../../../../api/requests/Possession';
import { Grade } from './components/Grade';
import { Status } from './components/Status';
import { Type } from './components/Type';
import { CitizenComment } from './components/CitizenComment';
import { Source } from './components/Source';
import { Priority } from './components/Priority';
import { Complex } from './components/Complex';
import { PossessionType } from './components/PossessionType';
import { Building } from './components/Building';
import { Possession } from './components/Possession';
import { TimeSlot } from './components/TimeSlot';
import { Employee } from './components/Employee';
import { Buttons } from './components/Buttons';
import { getSubTypesRequest } from '../../../../../api/requests/Application';
import { Subtype } from './components/Subtype';
import { CitizenFio } from './components/CitizenFio';
import { Contact } from './components/Contact';

interface IProps {
  IsFormActive: boolean;
  changeIsFormActive: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
}

const initialApplication: IApplication = {
  building: {
    id: 0,
    building: '',
  },
  complex: {
    id: 0,
    name: '',
  },
  citizenFio: '',
  creatingDate: '',
  citizenComment: '',
  dispatcherComment: '',
  dueDate: null,
  employee: {
    id: 0,
    employee: '',
    competence: '',
    company: '',
  },
  grade: {
    id: 1,
    appClass: '',
  },
  id: 0,
  subtype: null,
  possession: {
    id: 0,
    address: '',
    type: '',
    building: '',
  },
  priority: {
    id: 0,
    appPriority: '',
  },
  source: {
    id: 0,
    appSource: '',
  },
  status: {
    id: 2,
    appStatus: '',
  },
  type: null,
  employeeComment: '',
  user: 0,
  possessionType: '1',
  contact: '+7',
};

export const AppForm: FC<IProps> = ({ IsFormActive, changeIsFormActive, id }) => {
  const logout = useLogout();
  const { role } = useTypedSelector((state) => state.UserReducer.user);
  const { citizen } = useTypedSelector((state) => state.CitizenReducer);
  const { user } = useTypedSelector((state) => state.UserReducer);
  const { employs, types, sources, statuses, priorities, userApplication, subtypes } =
    useTypedSelector((state) => state.ApplicationReducer);
  const [error, changeError] = useState<IError | null>(null);
  const [needInitializeForm, changeNeedInitializeForm] = useState(true);
  const { complexes, possessions, buildings } = useTypedSelector(
    (state) => state.PossessionReducer,
  );
  const { buildingSuccess, possessionSuccess, subTypesSuccess } = useActions();
  const formInfo = !userApplication.filter((el) => el.id === id).length
    ? []
    : userApplication.filter((el) => el.id === id);

  const [FormData, changeFormData] = useState<IApplication>(
    !formInfo.length ? initialApplication : formInfo[0],
  );

  const getBuildings = async (complex_id: string) => {
    const response = await getBuildingsRequest(complex_id, logout);
    if (response) buildingSuccess(response);
    if (error) changeError(null);
  };

  const getSubtypes = async (id: string) => {
    const response = await getSubTypesRequest(logout, id);
    if (response) {
      subTypesSuccess(response);
    }
  };

  const getPossessions = async (type: string, building_id: string) => {
    const response = await getPossessionsRequest(0, type, building_id, logout);

    if (!response) return;

    if ('form_id' in response) {
      changeError(response.error);
    } else {
      possessionSuccess(response);
      if (error) changeError(null);
    }
  };

  useEffect(() => {
    if (id !== 0 || !IsFormActive || role !== 'citizen' || !needInitializeForm || !citizen.length)
      return;
    const possession = citizen[0];
    let fio = !user.last_name ? '' : user.last_name;
    fio += !user.first_name ? '' : ' ' + user.first_name;
    fio += !user.patronymic ? '' : ' ' + user.patronymic;
    changeFormData((prev) => ({
      ...prev,
      complex: { id: possession.complex.id, name: possession.complex.name },
      building: { id: possession.building.id, building: possession.building.building },
      possession: {
        id: possession.possession.id,
        address: possession.possession.address,
        type: possession.possession.type,
        building: possession.possession.building,
      },
      citizenFio: fio,
      contact: !user.phone ? '' : user.phone,
    }));
    changeNeedInitializeForm(false);
  }, [IsFormActive]);

  useEffect(() => {
    if (
      !needInitializeForm ||
      id !== 0 ||
      !IsFormActive ||
      role !== 'dispatcher' ||
      !priorities.length ||
      !sources.length ||
      !employs.length ||
      !types.length
    )
      return;
    if (!subtypes.length) getSubtypes(types[0].id.toString());
    if (subtypes.length) {
      const type = types.filter((el) => el.appType === subtypes[0].type)[0];
      changeFormData((prev) => ({
        ...prev,
        type: {
          id: type.id,
          appType: type.appType,
        },
        subtype: {
          id: subtypes[0].id,
          subtype: subtypes[0].subtype,
          normative: subtypes[0].normative,
          type: subtypes[0].type,
        },
      }));
    }

    const source = sources.filter((el) => el.appSource === 'Входящий звонок')[0];
    const priority = priorities.filter((el) => el.appPriority === 'Обычный')[0];

    changeFormData((prev) => ({
      ...prev,
      source: {
        id: source.id,
        appSource: source.appSource,
      },
      employee: {
        id: employs[0].id,
        employee: employs[0].employee,
        competence: employs[0].competence,
        company: employs[0].company,
      },
      priority: {
        id: priority.id,
        appPriority: priority.appPriority,
      },
    }));
  }, [IsFormActive, subtypes]);

  useEffect(() => {
    if (
      !needInitializeForm ||
      id > 0 ||
      !IsFormActive ||
      !complexes.length ||
      role !== 'dispatcher' ||
      !employs.length ||
      !FormData.type
    )
      return;

    if (!buildings.length) getBuildings(complexes[0].id.toString());

    if (buildings.length) {
      const current_complex = complexes.filter((el) => el.name === buildings[0].complex)[0];
      changeNeedInitializeForm(false);
      changeFormData((prev) => ({
        ...prev,
        building: {
          id: buildings[0].id,
          building: buildings[0].building,
        },
        complex: {
          id: current_complex.id,
          name: current_complex.name,
        },
      }));
      getPossessions(FormData.possessionType, buildings[0].id.toString());
    }
  }, [buildings, IsFormActive, FormData]);

  useEffect(() => {
    if (
      subtypes.length ||
      id < 1 ||
      role !== 'dispatcher' ||
      (FormData.status.appStatus !== 'Назначена' && FormData.status.appStatus !== 'Возвращена') ||
      !FormData.type
    )
      return;

    getSubtypes(FormData.type.id.toString());
  }, [IsFormActive, FormData]);

  useEffect(() => {
    if (
      role !== 'dispatcher' ||
      id < 1 ||
      FormData.status.appStatus !== 'Новая' ||
      !types.length ||
      !needInitializeForm ||
      FormData.type ||
      FormData.subtype
    )
      return;
    if (!subtypes.length) getSubtypes(types[0].id.toString());

    if (subtypes.length) {
      changeFormData((prev) => ({
        ...prev,
        type: {
          id: types[0].id,
          appType: types[0].appType,
        },
        subtype: {
          id: subtypes[0].id,
          normative: subtypes[0].normative,
          type: subtypes[0].type,
          subtype: subtypes[0].subtype,
        },
      }));
    }
  }, [IsFormActive, subtypes, FormData]);

  const refreshFormData = () => {
    const current_application = userApplication.filter((el) => el.id === id)[0];
    changeFormData(current_application);
  };

  useEffect(() => {
    if (id > 0 && userApplication.length && IsFormActive) {
      refreshFormData();
    }
  }, [IsFormActive]);

  const exitFromForm = () => {
    changeFormData(initialApplication);
    changeIsFormActive(false);
    changeNeedInitializeForm(true);
    subTypesSuccess([]);
  };

  return (
    <div
      className={clsx(
        'transitionGeneral fixed w-full inset-0 z-20 bg-blue-500 bg-opacity-10 backdrop-blur-xl flex justify-center items-center overflow-hidden',
        IsFormActive ? 'h-full' : 'h-0',
      )}
    >
      <div className='w-full sm:min-w-[600px] sm:max-w-[600px] md:min-w-[700px] md:max-w-[700px] lg:min-w-[850px] lg:max-w-[850px] h-full z-30 bg-blue-700 bg-opacity-10 backdrop-blur-xl rounded-md p-5 overflow-y-auto'>
        <div className='flex justify-center gap-4 flex-col'>
          <span className='font-bold text-lg'>Сведения</span>
          <div className='flex flex-col md:flex-wrap md:flex-row justify-between gap-4'>
            <Grade form_id={id} />
            <Status status={FormData.status} changeFormData={changeFormData} statuses={statuses} />
            <Type
              form_id={id}
              role={role}
              data={FormData}
              types={types}
              changeFormData={changeFormData}
              getSubtypes={getSubtypes}
            />
            <Subtype
              data={FormData}
              changeData={changeFormData}
              form_id={id}
              role={role}
              subtypes={subtypes}
            />
          </div>

          <CitizenComment
            form_id={id}
            role={role}
            data={FormData}
            changeFormData={changeFormData}
          />
          <Source
            form_id={id}
            role={role}
            data={FormData}
            sources={sources}
            changeFormData={changeFormData}
          />
          <Priority
            role={role}
            form_id={id}
            data={FormData}
            priorities={priorities}
            changeFormData={changeFormData}
          />
          <span className='font-bold text-lg mt-4'>Объект исполнения</span>
          <div className='flex flex-col md:flex-wrap md:flex-row gap-2 justify-between mt-2'>
            <Complex
              form_id={id}
              role={role}
              data={FormData}
              complexes={complexes}
              changeFormData={changeFormData}
              citizenPossessions={citizen}
              getBuildings={getBuildings}
              buildings={buildings}
              possessions={possessions}
              error={error}
              changeError={changeError}
            />
            <PossessionType
              form_id={id}
              data={FormData}
              changeFormData={changeFormData}
              getPossessions={getPossessions}
              role={role}
            />
            <Building
              form_id={id}
              role={role}
              data={FormData}
              buildings={buildings}
              changeFormData={changeFormData}
              citizenPossessions={citizen}
              getPossessions={getPossessions}
              error={error}
              possessions={possessions}
              changeError={changeError}
            />
            <Possession
              form_id={id}
              role={role}
              data={FormData}
              possessions={possessions}
              changeFormData={changeFormData}
              citizenPossessions={citizen}
              error={error}
            />
            {role !== 'citizen' && (
              <>
                <CitizenFio
                  form_id={id}
                  data={FormData}
                  changeFormData={changeFormData}
                  role={role}
                />
                <Contact form_id={id} data={FormData} changeFormData={changeFormData} role={role} />
              </>
            )}
          </div>
          {((role === 'citizen' && id !== 0) || role !== 'citizen') && (
            <span className='font-bold text-lg mt-2'>Таймслот</span>
          )}
          <TimeSlot form_id={id} role={role} data={FormData} changeFormData={changeFormData} />
          {role !== 'citizen' && (
            <div className='bg-blue-300 p-5 mt-2 rounded-md backdrop-blur-md bg-opacity-50 flex flex-col gap-2'>
              <span className='font-bold text-lg'>Исполнители</span>
              <Employee
                role={role}
                form_id={id}
                data={FormData}
                workers={employs}
                changeFormData={changeFormData}
              />
            </div>
          )}
          <Buttons
            data={FormData}
            form_id={id}
            role={role}
            exitFromForm={exitFromForm}
            logout={logout}
            buildings={buildings}
            possessions={possessions}
            changeData={changeFormData}
            refreshFormData={refreshFormData}
          />
        </div>
      </div>
    </div>
  );
};
