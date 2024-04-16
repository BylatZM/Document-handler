import clsx from 'clsx';
import { FC, useEffect, useRef, useState } from 'react';
import { useTypedSelector } from '../../../../../hooks/useTypedSelector';
import { IGisApplication } from '../../../../../types';
import { useActions } from '../../../../../hooks/useActions';
import { useLogout } from '../../../../../hooks/useLogout';
import { Status } from './components/Status';
import { Type } from './components/Type';
import { ApplicantComment } from './components/ApplicantComment';
import { Priority } from './components/Priority';
import { Possession } from './components/Possession';
import { TimeSlot } from './components/TimeSlot';
import { Employee } from './components/Employee';
import { Buttons } from './components/Buttons';
import { ApplicantFio } from './components/ApplicantFio';
import { DefaultAppForm } from './DefaultAppForm';
import { Phone } from './components/Phone';
import { Email } from './components/Email';

interface IProps {
  gisApplication: IGisApplication | null;
  getGisApplications: () => Promise<void>;
  changeSelectedItem: React.Dispatch<React.SetStateAction<IGisApplication | null>>;
  applicationFreshnessStatus: 'fresh' | 'warning' | 'expired';
}

export const AppForm: FC<IProps> = ({
  gisApplication,
  getGisApplications,
  changeSelectedItem,
  applicationFreshnessStatus,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const logout = useLogout();
  const { role } = useTypedSelector((state) => state.UserReducer.user);
  const { employs, statuses, priorities, error } = useTypedSelector(
    (state) => state.ApplicationReducer,
  );
  const { applicationError } = useActions();

  const [FormData, changeFormData] = useState<IGisApplication>(DefaultAppForm);

  useEffect(() => {
    if (!gisApplication || !['dispatcher', 'executor'].some((el) => role === el)) return;
    changeFormData(gisApplication);
    if (ref.current) {
      ref.current.scrollTop = 0;
    }
  }, [gisApplication]);

  const exitFromForm = () => {
    changeSelectedItem(null);
    getGisApplications();
    if (error) applicationError(null);
  };

  return (
    <div
      className={clsx(
        'transitionGeneral fixed h-full inset-y-0 right-0 bg-opacity-10 bg-blue-700 backdrop-blur-xl flex justify-center items-center overflow-hidden z-50',
        gisApplication ? 'w-full' : 'w-0',
      )}
    >
      <div
        ref={ref}
        className={clsx(
          'w-full sm:min-w-[600px] sm:max-w-[600px] md:min-w-[700px] md:max-w-[700px] lg:min-w-[850px] lg:max-w-[850px] h-full bg-opacity-20 backdrop-blur-xl rounded-md p-5 overflow-y-auto',
          applicationFreshnessStatus === 'warning' && 'bg-amber-700',
          applicationFreshnessStatus === 'expired' && 'bg-red-700',
          applicationFreshnessStatus === 'fresh' && 'bg-blue-700',
        )}
      >
        <div className='flex justify-center gap-4 flex-col disable'>
          <span className='font-bold text-lg'>Сведения</span>
          <div className='flex flex-col md:flex-wrap md:flex-row justify-between gap-4'>
            <Status status={FormData.status} />
            <Type type={FormData.type} />
          </div>
          <ApplicantComment citizen_comment={FormData.applicant_сomment} />
          <Priority
            role={role}
            data={FormData}
            priorities={priorities}
            changeFormData={changeFormData}
          />
          <span className='font-bold text-lg mt-4'>Объект исполнения</span>
          <div className='flex flex-col md:flex-wrap md:flex-row gap-2 justify-between mt-2'>
            <Possession possession={FormData.possession_address} />
            <ApplicantFio applicant_fio={FormData.applicant_fio} />
            <Phone phone={FormData.phone} />
            <Email email={FormData.email} />
          </div>
          <span className='font-bold text-lg mt-2'>Таймслот</span>
          <TimeSlot role={role} data={FormData} changeData={changeFormData} error={error} />
          <div className='bg-blue-300 p-5 mt-2 rounded-md backdrop-blur-md bg-opacity-50 flex flex-col gap-2'>
            <span className='font-bold text-lg'>Исполнители</span>
            <Employee
              role={role}
              data={FormData}
              workers={employs}
              changeFormData={changeFormData}
            />
          </div>
          <Buttons
            data={FormData}
            changeData={changeFormData}
            role={role}
            exitFromForm={exitFromForm}
            logout={logout}
            getApplications={getGisApplications}
          />
        </div>
      </div>
    </div>
  );
};
