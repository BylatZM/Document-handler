import clsx from 'clsx';
import { FC, useEffect, useRef, useState } from 'react';
import { useTypedSelector } from '../../../../../hooks/useTypedSelector';
import {
  IApplication,
  IBuildingWithComplex,
  IError,
  IPossession,
  ISubtype,
} from '../../../../../types';
import { useActions } from '../../../../../hooks/useActions';
import { useLogout } from '../../../../../hooks/useLogout';
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
import { SubType } from './components/SubType';
import { CitizenFio } from './components/CitizenFio';
import { Contact } from './components/Contact';
import { defaultAppForm } from './defaultAppForm';

interface IProps {
  application: IApplication | null;
  getApplications: () => Promise<void>;
  changeSelectedItem: React.Dispatch<React.SetStateAction<IApplication | null>>;
  applicationFreshnessStatus: 'fresh' | 'warning' | 'expired';
  getPossessions: (type: string, building_id: string) => Promise<void | IPossession[] | IError>;
  getAllBuildingsByComplexId: (complex_id: string) => Promise<IBuildingWithComplex[] | void>;
  getSubtypes: (id: string) => Promise<ISubtype[] | void>;
}

export const AppForm: FC<IProps> = ({
  application,
  getApplications,
  changeSelectedItem,
  applicationFreshnessStatus,
  getSubtypes,
  getAllBuildingsByComplexId,
  getPossessions,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const logout = useLogout();
  const { role } = useTypedSelector((state) => state.UserReducer.user);
  const { citizenPossessions } = useTypedSelector((state) => state.CitizenReducer);
  const { user } = useTypedSelector((state) => state.UserReducer);
  const { employs, types, sources, priorities, subtypes, error } = useTypedSelector(
    (state) => state.ApplicationReducer,
  );
  const { complexes, possessions, buildings } = useTypedSelector(
    (state) => state.PossessionReducer,
  );
  const possessionLoadingField = useTypedSelector((state) => state.PossessionReducer.isLoading);
  const { subTypesSuccess, applicationError } = useActions();

  const [FormData, changeFormData] = useState<IApplication>(defaultAppForm);

  const initialize_create_app_by_citizen = () => {
    if (!citizenPossessions.length) return;
    const possession = citizenPossessions.filter((el) => el.approving_status === 'Подтверждена');
    if (!possession.length) return;
    let fio = user.last_name;
    fio += !user.first_name ? '' : ` ${user.first_name}`;
    fio += !user.patronymic ? '' : ` ${user.patronymic}`;
    changeFormData((prev) => ({
      ...prev,
      complex: { id: possession[0].complex.id, name: possession[0].complex.name },
      building: { id: possession[0].building.id, building: possession[0].building.building },
      possession: {
        id: possession[0].possession.id,
        address: possession[0].possession.address,
        type: possession[0].possession.type,
        building: possession[0].possession.building,
      },
      citizenFio: fio,
      contact: !user.phone ? '+7' : user.phone,
    }));
  };

  const initializeCreateApplicationFormByDispatcher = async (app: IApplication) => {
    if (
      !priorities.length ||
      !sources.length ||
      !employs.length ||
      !types.length ||
      !complexes.length
    )
      return;

    const subtypes = await getSubtypes(types[0].id.toString());

    if (subtypes && subtypes.length) {
      const type = types.filter((el) => el.appType === subtypes[0].type);
      if (type.length) {
        changeFormData((prev) => ({
          ...prev,
          type: {
            id: type[0].id,
            appType: type[0].appType,
          },
          subtype: {
            id: subtypes[0].id,
            subtype: subtypes[0].subtype,
            normative: subtypes[0].normative,
            type: subtypes[0].type,
          },
        }));
      }
    }

    const builds = await getAllBuildingsByComplexId(complexes[0].id.toString());
    if (builds && builds.length) {
      changeFormData((prev) => ({
        ...prev,
        building: {
          id: builds[0].id,
          building: builds[0].building,
        },
        complex: {
          id: complexes[0].id,
          name: complexes[0].name,
        },
      }));
      await getPossessions(app.possessionType, builds[0].id.toString());
    }

    const source = sources.filter((el) => el.appSource === 'Входящий звонок');
    const priority = priorities.filter((el) => el.appPriority === 'Обычный');

    if (source.length && priority.length) {
      changeFormData((prev) => ({
        ...prev,
        source: {
          id: source[0].id,
          appSource: source[0].appSource,
        },
        employee: {
          id: employs[0].id,
          employee: employs[0].employee,
          competence: employs[0].competence,
          company: employs[0].company,
        },
        priority: {
          id: priority[0].id,
          appPriority: priority[0].appPriority,
        },
      }));
    }
  };

  const initializeUpdateApplicationFormByDispatcher = async (app: IApplication) => {
    const isNecessaryStatus = ['Назначена', 'Возвращена'].some((el) => el === app.status.appStatus);
    if (!subtypes.length && isNecessaryStatus) {
      await getSubtypes(app.type.id.toString());
    }
    if (app.status.appStatus === 'Новая' && types.length && !app.type.id && !app.subtype.id) {
      const subtypes = await getSubtypes(types[0].id.toString());

      if (subtypes && subtypes.length) {
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
    }
  };

  useEffect(() => {
    if (!application) return;
    changeFormData(application);
    if (ref.current) {
      ref.current.scrollTop = 0;
    }
    if (role === 'dispatcher') {
      if (application.id === 0) initializeCreateApplicationFormByDispatcher(application);
      else initializeUpdateApplicationFormByDispatcher(application);
    }
    if (role === 'citizen' && application.id === 0) initialize_create_app_by_citizen();
  }, [application]);

  const exitFromForm = () => {
    changeSelectedItem(null);
    subTypesSuccess([]);
    if (error) applicationError(null);
  };

  const checkPossessionRequestOnError = async (
    possessionType: string,
    buildingId: string,
  ): Promise<void> => {
    const response = await getPossessions(possessionType, buildingId);
    if (!response) return;
    if ('type' in response) applicationError(response);
  };
  return (
    <div
      className={clsx(
        'transitionGeneral fixed h-full inset-0 z-50 bg-opacity-10 bg-blue-700 backdrop-blur-xl flex justify-center items-center overflow-hidden',
        application ? 'w-full' : 'w-0',
      )}
    >
      <div
        ref={ref}
        className={clsx(
          'w-full sm:min-w-[600px] sm:max-w-[600px] md:min-w-[700px] md:max-w-[700px] lg:min-w-[850px] lg:max-w-[850px] h-full backdrop-blur-xl rounded-md p-5 overflow-y-auto',
          applicationFreshnessStatus === 'warning' && 'bg-amber-700 bg-opacity-50',
          applicationFreshnessStatus === 'expired' && 'bg-red-700 bg-opacity-40',
          applicationFreshnessStatus === 'fresh' && 'bg-blue-700 bg-opacity-30',
        )}
      >
        <div className='flex justify-center gap-4 flex-col disable'>
          <span className='font-bold text-lg'>Сведения</span>
          <div className='flex flex-col md:flex-wrap md:flex-row justify-between gap-4'>
            <Grade />
            <Status status={FormData.status} />
            <Type
              form_id={FormData.id}
              role={role}
              data={FormData}
              types={types}
              changeFormData={changeFormData}
              getSubtypes={getSubtypes}
              error={error}
            />
            <SubType
              data={FormData}
              changeData={changeFormData}
              form_id={FormData.id}
              role={role}
              subtypes={subtypes}
              error={error}
            />
          </div>
          <CitizenComment form_id={FormData.id} data={FormData} changeFormData={changeFormData} />
          <Source
            form_id={FormData.id}
            role={role}
            data={FormData}
            sources={sources}
            changeFormData={changeFormData}
          />
          <Priority
            role={role}
            form_id={FormData.id}
            data={FormData}
            priorities={priorities}
            changeFormData={changeFormData}
          />
          <span className='font-bold text-lg mt-4'>Объект исполнения</span>
          <div className='flex flex-col md:flex-wrap md:flex-row gap-2 justify-between mt-2'>
            <Complex
              form_id={FormData.id}
              role={role}
              data={FormData}
              complexes={complexes}
              changeFormData={changeFormData}
              citizenPossessions={citizenPossessions}
              getBuildings={getAllBuildingsByComplexId}
              error={error}
            />
            <PossessionType
              form_id={FormData.id}
              data={FormData}
              changeFormData={changeFormData}
              role={role}
              error={error}
              checkPossessionRequestOnError={checkPossessionRequestOnError}
            />
            <Building
              form_id={FormData.id}
              role={role}
              data={FormData}
              buildings={buildings}
              changeFormData={changeFormData}
              citizenPossessions={citizenPossessions}
              error={error}
              possessionLoadingField={possessionLoadingField}
              checkPossessionRequestOnError={checkPossessionRequestOnError}
            />
            <Possession
              form_id={FormData.id}
              role={role}
              data={FormData}
              possessions={possessions}
              changeFormData={changeFormData}
              citizenPossessions={citizenPossessions}
              error={error}
              possessionLoadingField={possessionLoadingField}
            />
            {role !== 'citizen' && (
              <>
                <CitizenFio form_id={FormData.id} data={FormData} changeFormData={changeFormData} />
                <Contact form_id={FormData.id} data={FormData} changeFormData={changeFormData} />
              </>
            )}
          </div>
          {((role === 'citizen' && FormData.id !== 0) || role !== 'citizen') && (
            <span className='font-bold text-lg mt-2'>Таймслот</span>
          )}
          <TimeSlot
            form_id={FormData.id}
            role={role}
            data={FormData}
            changeFormData={changeFormData}
            error={error}
          />
          {role !== 'citizen' && (
            <div
              className={clsx(
                'p-5 mt-2 rounded-md backdrop-blur-md bg-opacity-50 flex flex-col gap-2',
                applicationFreshnessStatus === 'warning' && 'bg-amber-300',
                applicationFreshnessStatus === 'expired' && 'bg-red-300',
                applicationFreshnessStatus === 'fresh' && 'bg-blue-300',
              )}
            >
              <span className='font-bold text-lg'>Исполнители</span>
              <Employee
                role={role}
                form_id={FormData.id}
                data={FormData}
                workers={employs}
                changeFormData={changeFormData}
                error={error}
              />
            </div>
          )}
          <Buttons
            data={FormData}
            form_id={FormData.id}
            role={role}
            exitFromForm={exitFromForm}
            logout={logout}
            getApplications={getApplications}
          />
        </div>
      </div>
    </div>
  );
};
