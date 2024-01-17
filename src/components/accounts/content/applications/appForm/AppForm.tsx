import { Checkbox } from 'antd';
import clsx from 'clsx';
import { FC, useEffect, useState } from 'react';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { IApplication, ICar } from '../../../../types';
import { useActions } from '../../../../hooks/useActions';
import { useLogout } from '../../../../hooks/useLogout';
import { getBuildingsRequest, getPossessionsRequest } from '../../../../../api/requests/Possession';
import { Grade } from './components/Grade';
import { Status } from './components/Status';
import { Type } from './components/Type';
import { SubType } from './SubType';
import { CitizenComment } from './components/CitizenComment';
import { Source } from './components/Source';
import { Priority } from './components/Priority';
import { Complex } from './components/Complex';
import { PossessionType } from './components/PossessionType';
import { Building } from './components/Building';
import { Possession } from './components/Possession';
import { Car } from './components/Car';
import { TimeSlot } from './components/TimeSlot';
import { Employee } from './components/Employee';
import { Buttons } from './components/Buttons';

interface IProps {
  IsFormActive: boolean;
  changeIsFormActive: (IsFormActive: boolean) => void;
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
  const citizen = useTypedSelector((state) => state.CitizenReducer.citizen);
  const { employs, types, sources, statuses, priorities, userApplication } = useTypedSelector(
    (state) => state.ApplicationReducer,
  );
  const { complex, possession, building } = useTypedSelector((state) => state.PossessionReducer);
  const [carInfo, changeCarInfo] = useState<ICar | null>(null);
  const { buildingSuccess, possessionSuccess, citizenErrors } = useActions();
  const formInfo = !userApplication.filter((el) => el.id === id).length
    ? []
    : userApplication.filter((el) => el.id === id);

  const [FormData, changeFormData] = useState<IApplication>(
    !formInfo.length ? initialApplication : formInfo[0],
  );

  const getBuildings = async (complex_id: string) => {
    const response = await getBuildingsRequest(complex_id, logout);
    if (response) buildingSuccess(response);
    citizenErrors(null);
  };

  const getPossessions = async (type: string, building_id: string) => {
    const response = await getPossessionsRequest(0, type, building_id, logout);

    if (!response) return;

    if ('form_id' in response) {
      citizenErrors(response);
    } else {
      possessionSuccess(response);
      citizenErrors(null);
    }
  };

  useEffect(() => {
    if (userApplication.filter((el) => el.id === id).length && IsFormActive) {
      const application = userApplication.filter((el) => el.id === id)[0];
      changeFormData(application);
      if (application.possession.car) {
        changeCarInfo(application.possession.car);
      }
    }
  }, [IsFormActive]);

  const exitFromForm = () => {
    changeFormData(initialApplication);
    changeIsFormActive(false);
  };

  return (
    <div
      className={clsx(
        'transitionGeneral w-[700px] h-full fixed inset-0 m-auto z-[21] bg-blue-700 bg-opacity-10 backdrop-blur-xl border-solid border-2 border-blue-500 rounded-md p-5 overflow-y-auto',
        IsFormActive ? 'translate-x-0' : 'translate-x-[-100vw]',
      )}
    >
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
          <SubType />
        </div>

        <Checkbox
          className='mt-2'
          checked={!FormData.isAppeal ? false : true}
          disabled={
            role.role === 'executor' ||
            (role.role === 'citizen' && id > 0) ||
            (FormData.status &&
              id > 0 &&
              FormData.status.appStatus !== 'Новая' &&
              FormData.status.appStatus !== 'Назначена' &&
              FormData.status.appStatus !== 'Возвращена')
              ? true
              : false
          }
          onChange={(e) => changeFormData((prev) => ({ ...prev, isAppeal: e.target.checked }))}
        >
          Обращение
        </Checkbox>
        <CitizenComment form_id={id} role={role} data={FormData} changeFormData={changeFormData} />
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
            changeCarInfo={changeCarInfo}
            citizenPossessions={citizen}
            getBuildings={getBuildings}
          />
          {role.role === 'dispatcher' && id === 0 && (
            <PossessionType
              form_id={id}
              data={FormData}
              changeFormData={changeFormData}
              changeCarInfo={changeCarInfo}
              getPossessions={getPossessions}
            />
          )}
          <Building
            form_id={id}
            role={role}
            data={FormData}
            buildings={building}
            changeFormData={changeFormData}
            changeCarInfo={changeCarInfo}
            citizenPossessions={citizen}
            getPossessions={getPossessions}
          />
          <Possession
            form_id={id}
            role={role}
            data={FormData}
            possessions={possession}
            changeFormData={changeFormData}
            changeCarInfo={changeCarInfo}
            citizenPossessions={citizen}
            getPossessions={getPossessions}
          />
          {carInfo && <Car car={carInfo} />}
        </div>
        <span className='font-bold text-lg mt-2'>Таймслот</span>
        <TimeSlot role={role} data={FormData} changeFormData={changeFormData} />
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
        <Buttons
          data={FormData}
          form_id={id}
          role={role}
          exitFromForm={exitFromForm}
          carInfo={carInfo}
          changeCarInfo={changeCarInfo}
          logout={logout}
        />
      </div>
    </div>
  );
};
