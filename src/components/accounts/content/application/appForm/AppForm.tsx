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
import { SubType } from './components/SubType';
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
    address: '',
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
    user: {
      first_name: '',
      last_name: '',
      patronymic: null,
    },
    competence: {
      id: 0,
      competence: '',
    },
  },
  grade: {
    id: 1,
    appClass: '',
  },
  id: 0,
  subType: null,
  possession: {
    id: 0,
    address: '',
    type: 'квартира',
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
  const { employs, types, sources, statuses, priorities, userApplication, subTypes } =
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

  const getSubTypes = async (id: string) => {
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
      building: { id: possession.building.id, address: possession.building.address },
      possession: {
        ...prev.possession,
        id: possession.possession.id,
        address: possession.possession.address,
      },
      citizenFio: fio,
      contact: !user.phone ? '' : user.phone,
    }));
    changeNeedInitializeForm(false);
  }, [IsFormActive]);

  useEffect(() => {
    if (
      !needInitializeForm ||
      id ||
      !IsFormActive ||
      role !== 'dispatcher' ||
      !priorities.length ||
      !sources.length ||
      !employs.length ||
      !types.length
    )
      return;

    if (!FormData.type) {
      const source = sources.filter((el) => el.appSource === 'Входящий звонок')[0];
      const priority = priorities.filter((el) => el.appPriority === 'Обычный')[0];
      getSubTypes(types[0].id.toString());

      changeFormData((prev) => ({
        ...prev,
        source: {
          id: source.id,
          appSource: source.appSource,
        },
        employee: {
          id: employs[0].id,
          user: employs[0].user,
          competence: employs[0].competence,
        },
        priority: {
          id: priority.id,
          appPriority: priority.appPriority,
        },
        type: {
          id: types[0].id,
          appType: types[0].appType,
        },
      }));
    } else if (subTypes.length) {
      changeFormData((prev) => ({
        ...prev,
        subType: {
          id: subTypes[0].id,
          subType: subTypes[0].subType,
          normative: subTypes[0].normative,
        },
      }));
    }
  }, [IsFormActive, subTypes]);

  useEffect(() => {
    if (
      !needInitializeForm ||
      id !== 0 ||
      !IsFormActive ||
      !complexes.length ||
      role !== 'dispatcher' ||
      !employs.length
    )
      return;

    if (!buildings.length) {
      changeFormData((prev) => ({
        ...prev,
        complex: { id: complexes[0].id, name: complexes[0].name },
      }));
      getBuildings(complexes[0].id.toString());
    } else {
      changeNeedInitializeForm(false);
      changeFormData((prev) => ({
        ...prev,
        building: { ...buildings[0] },
      }));
      getPossessions(FormData.possessionType, buildings[0].id.toString());
    }
  }, [buildings, IsFormActive]);

  const refreshFormData = () => {
    changeFormData(userApplication.filter((el) => el.id === id)[0]);
  };

  useEffect(() => {
    if (userApplication.filter((el) => el.id === id).length && IsFormActive) {
      refreshFormData();
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
            <Grade form_id={id} />
            <Status status={FormData.status} changeFormData={changeFormData} statuses={statuses} />
            <Type
              form_id={id}
              role={role}
              data={FormData}
              types={types}
              changeFormData={changeFormData}
              getSubTypes={getSubTypes}
            />
            <SubType
              data={FormData}
              changeData={changeFormData}
              form_id={id}
              role={role}
              subTypes={subTypes}
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
              complexes={complexes}
              changeFormData={changeFormData}
              citizenPossessions={citizen}
              getBuildings={getBuildings}
              buildings={buildings}
              possessions={possessions}
              error={error}
              changeError={changeError}
            />
            {((role === 'citizen' && id > 0) || role !== 'citizen') && (
              <PossessionType
                form_id={id}
                data={FormData}
                changeFormData={changeFormData}
                getPossessions={getPossessions}
                role={role}
              />
            )}
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
