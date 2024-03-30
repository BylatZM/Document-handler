import clsx from 'clsx';
import { FC, useEffect, useRef, useState } from 'react';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { IApplication, IBuildingWithComplex, IPossession, ISubtype } from '../../../../types';
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
import { defaultAppForm } from './defaultAppForm';

interface IProps {
  application: IApplication | null;
  getApplications: () => Promise<void>;
  changeSelectedItem: React.Dispatch<React.SetStateAction<IApplication | null>>;
  isExpired: boolean;
}

export const AppForm: FC<IProps> = ({
  application,
  getApplications,
  changeSelectedItem,
  isExpired,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const logout = useLogout();
  const { role } = useTypedSelector((state) => state.UserReducer.user);
  const { citizen } = useTypedSelector((state) => state.CitizenReducer);
  const { user } = useTypedSelector((state) => state.UserReducer);
  const { employs, types, sources, statuses, priorities, subtypes, error } = useTypedSelector(
    (state) => state.ApplicationReducer,
  );
  const { complexes, possessions, buildings } = useTypedSelector(
    (state) => state.PossessionReducer,
  );
  const { buildingSuccess, possessionSuccess, subTypesSuccess, applicationError } = useActions();

  const [FormData, changeFormData] = useState<IApplication>(defaultAppForm);

  const getBuildings = async (complex_id: string): Promise<IBuildingWithComplex[] | void> => {
    const builds = await getBuildingsRequest(complex_id, logout);

    if (!builds) return;
    else {
      buildingSuccess(builds);
      return builds;
    }
  };

  const getSubtypes = async (id: string): Promise<ISubtype[] | void> => {
    const subtypes = await getSubTypesRequest(logout, id);

    if (!subtypes || (subtypes && !subtypes.length)) return;
    else {
      subTypesSuccess(subtypes);
      return subtypes;
    }
  };

  const getPossessions = async (
    type: string,
    building_id: string,
  ): Promise<void | IPossession[]> => {
    const possessions = await getPossessionsRequest(type, building_id, logout);

    if (!possessions) return;

    if ('type' in possessions) applicationError(possessions);
    else {
      possessionSuccess(possessions);
      return possessions;
    }
  };

  const initialize_create_app_by_citizen = () => {
    if (!citizen.length) return;
    const possession = citizen.filter((el) => el.approving_status === 'Подтверждена')[0];
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
      contact: !user.phone ? '+7' : user.phone,
    }));
  };

  const initialize_create_app_by_dispatcher = async (app: IApplication) => {
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

    const builds = await getBuildings(complexes[0].id.toString());
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
  };

  const initialize_update_app_by_dispatcher = async (app: IApplication) => {
    const isNecessaryStatus = ['Назначена', 'Возвращена'].some((el) => el === app.status.appStatus);
    if (!subtypes.length && isNecessaryStatus && app.type) {
      await getSubtypes(app.type.id.toString());
    }
    if (app.status.appStatus === 'Новая' && types.length && !app.type && !app.subtype) {
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
      if (application.id === 0) initialize_create_app_by_dispatcher(application);
      else initialize_update_app_by_dispatcher(application);
    }
    if (role === 'citizen' && application.id === 0) initialize_create_app_by_citizen();
  }, [application]);

  const exitFromForm = () => {
    changeSelectedItem(null);
    subTypesSuccess([]);
    if (error) applicationError(null);
  };

  return (
    <div
      className={clsx(
        'transitionGeneral fixed w-full inset-0 z-20 bg-opacity-10 bg-blue-700 backdrop-blur-xl flex justify-center items-center overflow-hidden',
        application ? 'h-full' : 'h-0',
      )}
    >
      <div
        ref={ref}
        className={clsx(
          'w-full sm:min-w-[600px] sm:max-w-[600px] md:min-w-[700px] md:max-w-[700px] lg:min-w-[850px] lg:max-w-[850px] h-full z-30 bg-opacity-20 backdrop-blur-xl rounded-md p-5 overflow-y-auto',
          isExpired ? 'bg-red-700' : 'bg-blue-700',
        )}
      >
        <div className='flex justify-center gap-4 flex-col'>
          <span className='font-bold text-lg'>Сведения</span>
          <div className='flex flex-col md:flex-wrap md:flex-row justify-between gap-4'>
            <Grade form_id={FormData.id} />
            <Status status={FormData.status} changeFormData={changeFormData} statuses={statuses} />
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

          <CitizenComment
            form_id={FormData.id}
            role={role}
            data={FormData}
            changeFormData={changeFormData}
          />
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
              citizenPossessions={citizen}
              getBuildings={getBuildings}
              buildings={buildings}
              possessions={possessions}
              error={error}
            />
            <PossessionType
              form_id={FormData.id}
              data={FormData}
              changeFormData={changeFormData}
              getPossessions={getPossessions}
              role={role}
            />
            <Building
              form_id={FormData.id}
              role={role}
              data={FormData}
              buildings={buildings}
              changeFormData={changeFormData}
              citizenPossessions={citizen}
              getPossessions={getPossessions}
              error={error}
              possessions={possessions}
            />
            <Possession
              form_id={FormData.id}
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
                  form_id={FormData.id}
                  data={FormData}
                  changeFormData={changeFormData}
                  role={role}
                />
                <Contact
                  form_id={FormData.id}
                  data={FormData}
                  changeFormData={changeFormData}
                  role={role}
                />
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
          />
          {role !== 'citizen' && (
            <div className='bg-blue-300 p-5 mt-2 rounded-md backdrop-blur-md bg-opacity-50 flex flex-col gap-2'>
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
