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

interface IProps {
  IsFormActive: boolean;
  changeIsFormActive: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
}

const initialApplication: IApplication = {
  building: {
    id: 0,
    address: '',
  },
  complex: {
    id: 0,
    name: '',
  },
  creatingDate: '',
  citizenComment: '',
  dispatcherComment: null,
  dueDate: null,
  employee: null,
  grade: {
    id: 1,
    appClass: '',
  },
  id: 0,
  isAppeal: false,
  possession: {
    id: 0,
    address: '',
    car: null,
  },
  priority: null,
  source: {
    id: 0,
    appSource: '',
  },
  status: {
    id: 1,
    appStatus: '',
  },
  type: {
    id: 0,
    appType: '',
  },
  employeeComment: '',
  user: 0,
  possessionType: '1',
};

export const AppForm: FC<IProps> = ({ IsFormActive, changeIsFormActive, id }) => {
  const logout = useLogout();
  const role = useTypedSelector((state) => state.UserReducer.user.role);
  const { citizen } = useTypedSelector((state) => state.CitizenReducer);
  const { employs, types, sources, statuses, priorities, userApplication } = useTypedSelector(
    (state) => state.ApplicationReducer,
  );
  const [error, changeError] = useState<IError | null>(null);
  const [needInitializeForm, changeNeedInitializeForm] = useState(true);
  const { complex, possession, building } = useTypedSelector((state) => state.PossessionReducer);
  const { buildingSuccess, possessionSuccess } = useActions();
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
    if (id !== 0 || !IsFormActive || role.role !== 'citizen' || !needInitializeForm) return;
    const possession = citizen[0];
    changeFormData((prev) => ({
      ...prev,
      complex: { id: possession.complex.id, name: possession.complex.name },
      building: { id: possession.building.id, address: possession.building.address },
      possession: {
        ...prev.possession,
        id: possession.possession.id,
        address: possession.possession.address,
      },
    }));
    changeNeedInitializeForm(false);
  }, [IsFormActive]);

  useEffect(() => {
    if (!needInitializeForm || !sources || id !== 0 || !IsFormActive) return;
    let source = sources.filter((el) => el.appSource === 'Личный визит')[0];

    if (role.role === 'citizen')
      source = sources.filter((el) => el.appSource === 'Личный кабинет')[0];

    changeFormData((prev) => ({
      ...prev,
      source: {
        id: source.id,
        appSource: source.appSource,
      },
    }));
  }, [IsFormActive]);

  useEffect(() => {
    if (
      !needInitializeForm ||
      id !== 0 ||
      !IsFormActive ||
      !complex ||
      role.role !== 'dispatcher' ||
      !priorities ||
      !employs
    )
      return;

    if (!building) {
      const priority = priorities.filter((el) => el.appPriority === 'Обычный')[0];
      changeFormData((prev) => ({
        ...prev,
        complex: { id: complex[0].id, name: complex[0].name },
        employee: {
          id: employs[0].id,
          user: employs[0].user,
          competence: employs[0].competence,
        },
        priority: {
          id: priority.id,
          appPriority: priority.appPriority,
        },
      }));
      getBuildings(complex[0].id.toString());
    } else {
      changeNeedInitializeForm(false);
      changeFormData((prev) => ({
        ...prev,
        building: { ...building[0] },
      }));
      getPossessions(FormData.possessionType, building[0].id.toString());
    }
  }, [building, IsFormActive]);

  useEffect(() => {
    if (userApplication.filter((el) => el.id === id).length && IsFormActive) {
      let application = userApplication.filter((el) => el.id === id)[0];

      if (
        role.role === 'dispatcher' &&
        employs &&
        priorities &&
        !application.employee &&
        !application.priority
      ) {
        const priority = priorities.filter((el) => el.appPriority === 'Обычный')[0];
        application = {
          ...application,
          employee: {
            id: employs[0].id,
            user: employs[0].user,
            competence: employs[0].competence,
          },
          priority: {
            id: priority.id,
            appPriority: priority.appPriority,
          },
        };
      }

      changeFormData(application);
    }
  }, [IsFormActive]);

  const exitFromForm = () => {
    changeFormData(initialApplication);
    changeIsFormActive(false);
    changeNeedInitializeForm(true);
  };

  return (
    <div
      className={clsx(
        'transitionGeneral fixed w-full inset-0 z-20 bg-blue-500 bg-opacity-10 backdrop-blur-xl overflow-hidden flex justify-center items-center',
        IsFormActive ? 'h-full' : 'h-0',
      )}
    >
      <div className='min-w-[700px] max-w-[700px] h-full z-30 bg-blue-700 bg-opacity-10 backdrop-blur-xl rounded-md p-5 overflow-y-auto'>
        <div className='flex justify-center gap-4 flex-col'>
          <span className='font-bold text-lg'>Сведения</span>
          <div className='flex flex-wrap justify-between gap-4'>
            <Grade />
            <Status status={FormData.status} changeFormData={changeFormData} statuses={statuses} />
            <Type
              form_id={id}
              role={role}
              data={FormData}
              types={types}
              changeFormData={changeFormData}
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
          <div className='flex flex-wrap gap-2 justify-between mt-2'>
            <Complex
              form_id={id}
              role={role}
              data={FormData}
              complexes={complex}
              changeFormData={changeFormData}
              citizenPossessions={citizen}
              getBuildings={getBuildings}
              buildings={building}
              possessions={possession}
              error={error}
              changeError={changeError}
            />
            {role.role === 'dispatcher' && id === 0 && (
              <PossessionType
                form_id={id}
                data={FormData}
                changeFormData={changeFormData}
                getPossessions={getPossessions}
              />
            )}
            <Building
              form_id={id}
              role={role}
              data={FormData}
              buildings={building}
              changeFormData={changeFormData}
              citizenPossessions={citizen}
              getPossessions={getPossessions}
              error={error}
              possessions={possession}
              changeError={changeError}
            />
            <Possession
              form_id={id}
              role={role}
              data={FormData}
              possessions={possession}
              changeFormData={changeFormData}
              citizenPossessions={citizen}
              error={error}
            />
          </div>
          {((role.role === 'citizen' && id !== 0) || role.role !== 'citizen') && (
            <span className='font-bold text-lg mt-2'>Таймслот</span>
          )}
          <TimeSlot form_id={id} role={role} data={FormData} changeFormData={changeFormData} />
          {role.role !== 'citizen' && (
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
            buildings={building}
            possessions={possession}
          />
        </div>
      </div>
    </div>
  );
};
