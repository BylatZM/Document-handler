import clsx from 'clsx';
import { FC, useEffect, useRef, useState } from 'react';
import { useTypedSelector } from '../../../../../hooks/useTypedSelector';
import {
  IApplication,
  IBuilding,
  ICitizenPossession,
  IEmployee,
  IError,
  IPossession,
  ISubtype,
  IType,
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
import { Subtype } from './components/Subtype';
import { CitizenFio } from './components/CitizenFio';
import { Contact } from './components/Contact';
import { defaultAppForm } from './defaultAppForm';
import { useNavigate } from 'react-router-dom';

interface IProps {
  application: IApplication | null;
  getApplications: () => Promise<void>;
  changeSelectedItem: React.Dispatch<React.SetStateAction<IApplication | null>>;
  applicationFreshnessStatus: 'fresh' | 'warning' | 'expired';
  getPossessions: (type: string, building_id: string) => Promise<void | IPossession[] | IError>;
  getAllBuildingsByComplexId: (complex_id: string) => Promise<IBuilding[] | void>;
  getTypes: (complex_id: string) => Promise<IType[] | void>;
  getSubtypes: (type_id: string, complex_id: string) => Promise<ISubtype[] | void>;
  getEmploys: (complex_id: string, subtype_id: string) => Promise<IEmployee[] | void>;
  getCitizenPossessions: () => Promise<ICitizenPossession[] | void>;
}

export const AppForm: FC<IProps> = ({
  application,
  getApplications,
  changeSelectedItem,
  applicationFreshnessStatus,
  getTypes,
  getSubtypes,
  getAllBuildingsByComplexId,
  getPossessions,
  getEmploys,
  getCitizenPossessions,
}) => {
  const defaultSubtype: ISubtype = {
    type: '',
    name: '',
    id: 0,
    normative_in_hours: 0,
  };
  const defaultType: IType = {
    id: 0,
    name: '',
  };
  const ref = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
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
  const applicationLoadingField = useTypedSelector((state) => state.ApplicationReducer.isLoading);

  const { applicationError } = useActions();

  const [FormData, changeFormData] = useState<IApplication>(defaultAppForm);

  const initializeCreateApplicationFormByCitizen = async () => {
    let possessions = citizenPossessions;
    if (possessions.some((el) => el.approving_status === 'На подтверждении')) {
      const response = await getCitizenPossessions();
      if (
        !response ||
        (response && !response.some((el) => el.approving_status === 'Подтверждена'))
      ) {
        navigate('/account/aboutMe');
        return;
      }
      if (response) {
        possessions = response;
      }
    }

    const possession = possessions.filter((el) => el.approving_status === 'Подтверждена');
    if (!possession.length) return;
    let fio = user.last_name;
    fio += !user.first_name ? '' : ` ${user.first_name}`;
    fio += !user.patronymic ? '' : ` ${user.patronymic}`;
    changeFormData((prev) => ({
      ...prev,
      complex: { ...possession[0].complex },
      building: { ...possession[0].building },
      possession: { ...possession[0].possession },
      applicant_fio: fio,
      contact: !user.phone ? '+7' : user.phone,
    }));
    await getTypes(possession[0].complex.id.toString());
  };

  const initializeCreateApplicationFormByDispatcher = async (app: IApplication) => {
    if (!priorities.length || !sources.length || !complexes.length) return;
    let complex = complexes[0];
    const value = complexes.filter((el) => el.name === 'ЖК «Дубрава 2.0»');
    if (value.length) {
      complex = value[0];
    }
    const responseTypes = await getTypes(complex.id.toString());

    if (!responseTypes) return;

    const subtypes = await getSubtypes(responseTypes[0].id.toString(), complex.id.toString());

    const source = sources.filter((el) => el.name === 'Входящий звонок');
    const priority = priorities.filter((el) => el.name === 'Обычный');

    if (subtypes && subtypes.length && source.length && priority.length) {
      await getEmploys(complex.id.toString(), subtypes[0].id.toString());
      const type = responseTypes.filter((el) => el.name === subtypes[0].type);
      if (type.length && employs) {
        changeFormData((prev) => ({
          ...prev,
          type: { ...responseTypes[0] },
          subtype: { ...subtypes[0] },
          priority: { ...priority[0] },
          source: { ...source[0] },
        }));
      }
    } else {
      changeFormData((prev) => ({
        ...prev,
        type: { ...responseTypes[0] },
        priority: { ...priority[0] },
        source: { ...source[0] },
      }));
    }

    const builds = await getAllBuildingsByComplexId(complex.id.toString());
    if (builds && builds.length) {
      changeFormData((prev) => ({
        ...prev,
        building: { ...builds[0] },
        complex: { ...complex },
      }));
      await getPossessions(app.possession_type, builds[0].id.toString());
    }
  };

  const initializeUpdateApplicationFormByDispatcher = async (app: IApplication) => {
    const isNecessaryStatus = ['Назначена', 'Возвращена', 'Новая'].some(
      (el) => el === app.status.name,
    );
    if (isNecessaryStatus) {
      const responseTypes = await getTypes(app.complex.id.toString());
      if (!responseTypes) return;
      await getSubtypes(app.type.id.toString(), app.complex.id.toString());
      await getEmploys(app.complex.id.toString(), app.subtype.id.toString());
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
    if (role === 'citizen' && application.id === 0) initializeCreateApplicationFormByCitizen();
  }, [application]);

  const exitFromForm = () => {
    changeSelectedItem(null);
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
              getTypes={getTypes}
              defaultSubtype={defaultSubtype}
              defaultType={defaultType}
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
              getTypes={getTypes}
              defaultSubtype={defaultSubtype}
              defaultType={defaultType}
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
              getTypes={getTypes}
              defaultSubtype={defaultSubtype}
              defaultType={defaultType}
            />
            {role !== 'citizen' && (
              <>
                <CitizenFio form_id={FormData.id} data={FormData} changeFormData={changeFormData} />
                <Contact form_id={FormData.id} data={FormData} changeFormData={changeFormData} />
              </>
            )}
          </div>
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
              applicationLoadingField={applicationLoadingField}
              defaultSubtype={defaultSubtype}
            />
            <Subtype
              data={FormData}
              changeData={changeFormData}
              form_id={FormData.id}
              role={role}
              subtypes={subtypes}
              error={error}
              getEmploys={getEmploys}
              applicationLoadingField={applicationLoadingField}
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
